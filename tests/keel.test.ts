import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { wordingText } from "../lib/glossary";
import { calendarIcs } from "../lib/calendar";
import { projectFiles, servicePlan, zipStore } from "../lib/runpack";
import { reviewDocument } from "../lib/review";
import { termComplete, termGate, topCorrect, weeks } from "../lib/term";
import { briefDecisions, sections } from "../lib/course/meta";
import { en } from "../lib/course/en";
import { locales } from "../lib/locale";
import { getOps } from "../lib/ops";
import { opsBriefDecisions, opsSections } from "../lib/ops/meta";
import { opsGateOpen } from "../lib/ops/gates";
import { previewFlags } from "../lib/ops/preview";
import { benchAnswers, briefAnswers, checkAnswers, decisionAnswers } from "../lib/server/answers";
import { gradeAttempt } from "../lib/server/grade";
import { gradeOps } from "../lib/server/ops-grade";
import { opsBriefAnswers, opsCheckAnswers, opsDecisionAnswers, opsLabAnswers } from "../lib/server/ops-answers";
import { marksOf, streakOf } from "../lib/progress";
import { takeToken } from "../lib/rate";
import { bindPlaceholders } from "../lib/sql";
import { matchAccept } from "../lib/locale";
import { cacheControlFor, cleanName, cleanRole, clientDay, isStaffOrAdmin, leaderboardSql, mayCacheStatic, noteOk, roleFor, sameOrigin, utcWeekStart } from "../lib/security";
import { insertProfile, wipeUser } from "../lib/db";
import { saveProgress, getCohortSubmissions, updateTeacherEvaluation } from "../lib/store";
import { localReply } from "../lib/tutor";
import { ephemeralToken, responseText, takeVoiceEvent } from "../lib/voice-events";
import { aiReply, hasTts, hasVoiceSession, liveEnabled, openrouterReply } from "../lib/server/live";

describe("grade", () => {
  it("accepts the history check and rejects a theme", () => {
    const yes = gradeAttempt({ kind: "check", sectionId: "tools", payload: { choice: "history" }, locale: "en", hint: "x", casesDone: 0 });
    const no = gradeAttempt({ kind: "check", sectionId: "tools", payload: { choice: "theme" }, locale: "en", hint: "x", casesDone: 0 });
    expect(yes.correct).toBe(true);
    expect(yes.xp).toBe(40);
    expect(no.correct).toBe(false);
    expect(no.xp).toBe(0);
  });

  it("requires the full bench order", () => {
    const order = ["name", "open", "change", "save", "show"];
    expect(gradeAttempt({ kind: "bench", sectionId: "tools", payload: { order }, locale: "en", hint: "x", casesDone: 0 }).correct).toBe(true);
    expect(gradeAttempt({ kind: "bench", sectionId: "tools", payload: { order: [...order].reverse() }, locale: "en", hint: "x", casesDone: 0 }).correct).toBe(false);
  });

  it("locks the brief until every case is accepted", () => {
    const locked = gradeAttempt({ kind: "brief", payload: {}, locale: "en", hint: "x", casesDone: 10 });
    expect(locked.locked).toBe(true);
    expect(locked.correct).toBe(false);
  });

  it("accepts a complete Harbor brief", () => {
    const note = "Harbor Market must keep its own record, tell the truth on a Saturday night, and leave itself a way back if a tool fails the people.";
    const result = gradeAttempt({
      kind: "brief",
      payload: { choices: briefAnswers, note },
      locale: "en",
      hint: "different hint",
      casesDone: 11,
    });
    expect(result.correct).toBe(true);
    expect(result.xp).toBe(200);
  });
});

describe("operations programme", () => {
  const note = "The desk should see Northline payments open, the key stays off the page, and the unread model spend stops this month.";

  it("accepts the status lab and rejects a leaked key", () => {
    const yes = gradeOps({
      kind: "lab",
      sectionId: "web",
      payload: { fields: opsLabAnswers.web },
      locale: "en",
      hint: "x",
      open: true,
    });
    const leaked = gradeOps({
      kind: "lab",
      sectionId: "web",
      payload: { fields: { ...opsLabAnswers.web, body: "secret" } },
      locale: "en",
      hint: "x",
      open: true,
    });
    expect(yes.correct).toBe(true);
    expect(yes.xp).toBe(80);
    expect(leaked.correct).toBe(false);
    expect(previewFlags("web", { body: "secret" }).warn).toBe(true);
  });

  it("rejects a commit that includes the env file", () => {
    const bad = gradeOps({
      kind: "lab",
      sectionId: "git",
      payload: { fields: { ...opsLabAnswers.git, files: ["readme", "source", "env"] } },
      locale: "en",
      hint: "x",
      open: true,
    });
    expect(bad.correct).toBe(false);
    expect(previewFlags("git", { files: ["env"], branch: "feature" }).warn).toBe(true);
    expect(gradeOps({ kind: "lab", sectionId: "devops", payload: { fields: opsLabAnswers.devops }, locale: "en", hint: "x", open: true }).correct).toBe(true);
    expect(gradeOps({ kind: "lab", sectionId: "finops", payload: { fields: opsLabAnswers.finops }, locale: "en", hint: "x", open: true }).correct).toBe(true);
  });

  it("locks a lab until the check is recorded for a signed-in learner", () => {
    expect(opsGateOpen({ kind: "lab", sectionId: "web", signedIn: true, rows: [] })).toBe(false);
    expect(opsGateOpen({ kind: "lab", sectionId: "web", signedIn: false, rows: [] })).toBe(true);
    const locked = gradeOps({ kind: "lab", sectionId: "web", payload: { fields: opsLabAnswers.web }, locale: "en", hint: "x", open: false });
    expect(locked.locked).toBe(true);
    expect(locked.correct).toBe(false);
    expect(locked.explain).toEqual([]);
  });

  it("locks the release brief until four capstones are accepted", () => {
    const rows = [
      { itemId: "web", kind: "ops-case", score: 1 },
      { itemId: "git", kind: "ops-case", score: 1 },
      { itemId: "devops", kind: "ops-case", score: 1 },
    ];
    expect(opsGateOpen({ kind: "ops-brief", signedIn: true, rows })).toBe(false);
    rows.push({ itemId: "finops", kind: "ops-case", score: 1 });
    expect(opsGateOpen({ kind: "ops-brief", signedIn: true, rows })).toBe(true);
    const accepted = gradeOps({
      kind: "ops-brief",
      payload: { choices: opsBriefAnswers, note },
      locale: "en",
      hint: "different",
      open: true,
    });
    expect(accepted.correct).toBe(true);
    expect(accepted.xp).toBe(200);
  });

  it("keeps every published operations choice inside its list", () => {
    for (const locale of locales) {
      const pack = getOps(locale);
      for (const section of opsSections) {
        const copy = pack.sections[section.id];
        expect(section.checkIds).toContain(opsCheckAnswers[section.id]);
        expect(copy.checkOptions).toHaveLength(4);
        expect(copy.decisions).toHaveLength(3);
        expect(copy.caseSteps).toHaveLength(4);
        for (const field of section.lab) {
          expect(copy.fields[field.id]?.options).toHaveLength(field.optionIds.length);
          const answer = opsLabAnswers[section.id][field.id];
          if (typeof answer === "string") expect(field.optionIds).toContain(answer);
          else for (const id of answer ?? []) expect(field.optionIds).toContain(id);
          if (field.kind === "order") {
            expect(field.start).toHaveLength(field.optionIds.length);
            expect(field.start).not.toEqual(field.optionIds);
          }
        }
        for (const decision of section.decisions) {
          expect(decision.optionIds).toContain(opsDecisionAnswers[section.id][decision.id]);
        }
      }
      expect(pack.brief.decisions).toHaveLength(opsBriefDecisions.length);
      expect(pack.brief.steps).toHaveLength(4);
    }
    for (const decision of opsBriefDecisions) expect(decision.optionIds).toContain(opsBriefAnswers[decision.id]);
    const foundry = readFileSync(new URL("../components/foundry-lab.tsx", import.meta.url), "utf8");
    for (const section of opsSections) expect(foundry).toContain(`id: "${section.foundry}"`);
  });
});

describe("wording toggle", () => {
  it("keeps industry terms, simplifies them, and spells abbreviations out", () => {
    const sentence = "HTTP carries the request. TCP checks the packets. IP moves them. DORA counts the releases.";
    expect(wordingText(sentence, "industry")).toBe(sentence);
    expect(wordingText(sentence, "plain")).toContain("the web request rules");
    expect(wordingText(sentence, "plain")).not.toContain("HTTP");
    expect(wordingText(sentence, "expand")).toContain("Hypertext Transfer Protocol");
    expect(wordingText("shipping", "plain")).toBe("shipping");
    expect(wordingText("HTTPS", "plain")).not.toContain("HTTP (");
  });
});

describe("runnable service", () => {
  const nodes = [
    { id: "desk", type: "client" },
    { id: "door", type: "gateway" },
    { id: "app", type: "compute" },
    { id: "ledger", type: "database" },
  ];
  const edges = [
    { from: "desk", to: "door" },
    { from: "door", to: "app" },
    { from: "app", to: "ledger" },
  ];

  it("accepts a desk that cannot see the database and refuses a direct wire", () => {
    expect(servicePlan(nodes, edges).ok).toBe(true);
    expect(servicePlan(nodes, [...edges, { from: "desk", to: "ledger" }]).ok).toBe(false);
    const files = projectFiles(nodes, edges);
    expect(files["server.js"]).toContain("Northline payments: open");
    expect(files["server.js"]).not.toContain("LEDGER_KEY");
    expect(zipStore(files).subarray(0, 2).toString()).toBe("PK");
  });
});

describe("calendar import", () => {
  it("lists a deadline and a download name without a student file", () => {
    const ics = calendarIcs([
      {
        uid: "keel-w01@keel",
        start: Date.UTC(2026, 9, 2, 16, 0),
        end: Date.UTC(2026, 9, 2, 17, 0),
        title: "Week 1, status",
        details: "Downloads: status-brief.pdf",
        url: "http://127.0.0.1:3960/term/w01",
      },
    ]);
    expect(ics).toContain("BEGIN:VCALENDAR");
    expect(ics).toContain("SUMMARY:Week 1\\, status");
    expect(ics).toContain("status-brief.pdf");
    expect(ics).not.toContain("student-essay");
  });
});

describe("local assessment review", () => {
  const essay = "Question 1. Explain the web and the internet. Task: evaluate how a server answers a request and discuss the protocol. Submit your assessment answer with enough detail for a reader. ".repeat(6);

  it("flags a peer copy and does not keep the words", () => {
    const first = reviewDocument({ text: essay, weekBrief: "The web and the internet. Follow one request.", sha256: "a", peers: [] });
    const second = reviewDocument({ text: essay, weekBrief: "The web and the internet. Follow one request.", sha256: "b", peers: [{ sha256: "a", shingles: first.shingles }] });
    expect(first.assessment).toBe(true);
    expect(second.plagiarism).toBe(true);
    expect(second.match).toBe("peer");
    expect(JSON.stringify(second)).not.toContain("Explain");
  });

  it("does not treat a short note as an assessment", () => {
    const note = reviewDocument({ text: "hello there", weekBrief: "The web and the internet", sha256: "c", peers: [] });
    expect(note.assessment).toBe(false);
    expect(note.plagiarism).toBe(false);
  });
});

describe("twelve week term", () => {
  const done = (itemId: string, kind: string) => ({ itemId, kind, score: 1 });
  it("keeps week two closed until week one is accepted", () => {
    const closed = termGate({ itemId: "git", kind: "check", rows: [], staff: false, work: null, now: 0 });
    const open = termGate({
      itemId: "git",
      kind: "check",
      rows: [done("web", "check"), done("web", "lab"), done("web", "ops-case")],
      staff: false,
      work: null,
      now: 0,
    });
    expect(closed.open).toBe(false);
    expect(open.open).toBe(true);
    expect(weeks).toHaveLength(12);
  });

  it("lets a teacher through a paused week and hides noisy scores", () => {
    const paused = termGate({
      itemId: "web",
      kind: "check",
      rows: [],
      staff: false,
      work: { status: "paused", opensAt: null, closesAt: null },
      now: 0,
    });
    const teacher = termGate({
      itemId: "web",
      kind: "check",
      rows: [],
      staff: true,
      work: { status: "paused", opensAt: null, closesAt: null },
      now: 0,
    });
    expect(paused.open).toBe(false);
    expect(teacher.open).toBe(true);
    const board = topCorrect([
      { userId: "a", name: "Ada", correct: 8, attempts: 10 },
      { userId: "b", name: "Bea", correct: 9, attempts: 30 },
      { userId: "c", name: "Cleo", correct: 4, attempts: 6 },
    ]);
    expect(board.map((row) => row.name)).toEqual(["Ada", "Cleo"]);
    expect(termComplete([])).toBe(false);
  });
});

describe("answers stay inside the option lists", () => {
  it("matches every published choice", () => {
    for (const section of sections) {
      expect(section.checkIds).toContain(checkAnswers[section.id]);
      const bench = benchAnswers[section.id];
      if (section.bench.kind === "order") expect(bench.order).toEqual(section.bench.ids);
      if (section.bench.kind === "single") expect(section.bench.ids).toContain(bench.choice);
      if (section.bench.kind === "multi") for (const id of bench.choices ?? []) expect(section.bench.ids).toContain(id);
      if (section.bench.kind === "label") {
        for (const slot of section.bench.slots) expect(section.bench.ids).toContain(bench.labels?.[slot]);
      }
      for (const decision of section.decisions) {
        expect(decision.optionIds).toContain(decisionAnswers[section.id][decision.id]);
      }
      expect(en.sections[section.id].benchItems).toHaveLength(section.bench.ids.length);
      expect(en.sections[section.id].checkOptions).toHaveLength(4);
      expect(en.sections[section.id].decisions).toHaveLength(3);
    }
    expect(en.brief.decisions).toHaveLength(briefDecisions.length);
    for (const decision of briefDecisions) expect(decision.optionIds).toContain(briefAnswers[decision.id]);
  });
});

describe("privacy helpers", () => {
  it("does not select email for the board", () => {
    expect(leaderboardSql().toLowerCase()).not.toContain("email");
  });

  it("refuses to cache private and api responses", () => {
    expect(cacheControlFor("/api/me")).toBe("private, no-store");
    expect(mayCacheStatic("/api/me", "GET", false, "private, no-store")).toBe(false);
    expect(mayCacheStatic("/course", "GET", false, "private, no-cache")).toBe(false);
    expect(mayCacheStatic("/_next/static/app.js", "GET", false, "public, max-age=31536000, immutable")).toBe(true);
    expect(mayCacheStatic("/_next/static/app.js", "GET", true, "public, max-age=31536000, immutable")).toBe(false);
  });

  it("checks origin and names", () => {
    const request = new Request("http://127.0.0.1:3960/api/grade", { headers: { origin: "http://127.0.0.1:3960", host: "127.0.0.1:3960" } });
    expect(sameOrigin(request)).toBe(true);
    expect(sameOrigin(new Request("http://127.0.0.1:3960/api/grade", { headers: { origin: "https://evil.example", host: "127.0.0.1:3960" } }))).toBe(false);
    expect(cleanName("Ada Lovelace")).toBe("Ada Lovelace");
    expect(cleanName("ada@keel.test")).toBeNull();
    expect(cleanName("李")).toBeNull();
    expect(cleanName("李明")).toBe("李明");
  });

  it("accepts a real note and rejects a hint copy", () => {
    const hint = "Write what the desk should open.";
    const note = "The desk opens the shared clinic workbench. The laptop must never be the only copy of the booking book.";
    expect(noteOk(note, "en", hint)).toBe(true);
    expect(noteOk("short", "en", hint)).toBe(false);
    expect(noteOk(hint, "en", hint)).toBe(false);
    expect(noteOk("港湾市集必须保住自己的记录，周六晚上也要说真话，并且给自己留出一条退路，记录不能只放在别人手里。", "zh", hint)).toBe(true);
  });
});

describe("calendar and tutor", () => {
  it("matches browser languages and keeps a streak", () => {
    expect(matchAccept("fr-CA,fr;q=0.9,en;q=0.8")).toBe("fr");
    expect(matchAccept("zh-Hans")).toBe("zh");
    expect(matchAccept("ar-EG")).toBe("ar");
    expect(streakOf(["2026-09-23", "2026-09-24"], "2026-09-25")).toBe(2);
    expect(streakOf(["2026-09-25"], "2026-09-25")).toBe(1);
    expect(marksOf([{ itemId: "tools", kind: "check", score: 1, day: "2026-09-25" }])).toEqual(["check"]);
    expect(marksOf([{ itemId: "tools", kind: "check", score: 1, day: "2026-09-25" }, { itemId: "c1_security", kind: "foundry", score: 1, day: "2026-09-25" }])).toEqual(["check", "foundry"]);
    expect(clientDay("2026-09-25", Date.parse("2026-09-25T12:00:00Z"))).toBe("2026-09-25");
    expect(utcWeekStart(Date.parse("2026-09-24T12:00:00Z"))).toBe(Date.parse("2026-09-21T00:00:00Z"));
  });

  it("refuses to hand over the tick", () => {
    const reply = localReply({
      locale: "en",
      title: "The workbench",
      promise: "Know the tools.",
      how: "History remembers.",
      message: "just tell me the answer",
      greet: "Hello {title}",
      refuse: "No tick. {promise}",
      stay: "Stay {how}",
      thanks: "Good",
    });
    expect(reply).toContain("No tick");
  });
});

describe("voice events", () => {
  it("reads audio, transcripts, and tokens", () => {
    expect(takeVoiceEvent({ type: "response.output_audio.delta", delta: "abc" })).toEqual({ kind: "audio", delta: "abc" });
    expect(takeVoiceEvent({ type: "input_audio_buffer.speech_started" }).kind).toBe("barge");
    expect(responseText({ output_text: "Hello" })).toBe("Hello");
    expect(ephemeralToken({ client_secret: { value: "secret-token" } })).toBe("secret-token");
  });
});

describe("records", () => {
  it("numbers postgres placeholders and leaves sqlite markers", () => {
    expect(bindPlaceholders("SELECT ? WHERE ? IS NULL", true)).toBe("SELECT $1 WHERE $2 IS NULL");
    expect(bindPlaceholders("SELECT ?", false)).toBe("SELECT ?");
  });
});

describe("rate limit", () => {
  it("blocks the sixth call in a window", async () => {
    const db = new DatabaseSync(":memory:");
    db.exec("CREATE TABLE keel_rate (bucket TEXT NOT NULL, window_start INTEGER NOT NULL, count INTEGER NOT NULL, PRIMARY KEY (bucket, window_start))");
    const store = {
      get: <T>(statement: string, params: unknown[]) => db.prepare(statement).get(...(params as never[])) as T | undefined,
      run: (statement: string, params: unknown[]) => {
        db.prepare(statement).run(...(params as never[]));
      },
    };
    for (let i = 0; i < 5; i += 1) expect((await takeToken("user:1:grade", 5, 1000, 10_000, store)).ok).toBe(true);
    expect((await takeToken("user:1:grade", 5, 1000, 10_500, store)).ok).toBe(false);
  });
});

describe("service worker", () => {
  it("never caches the api", () => {
    const source = readFileSync(new URL("../public/sw.js", import.meta.url), "utf8");
    expect(source).toContain('"/api/"');
    expect(source).toContain("set-cookie");
    expect(source).toContain("no-store");
  });
});

describe("ai provider and openrouter", () => {
  const originalEnv = { ...process.env };

  it("checks live enabled status based on openrouter or xai keys", () => {
    delete process.env.OPENROUTER_API_KEY;
    delete process.env.XAI_API_KEY;
    expect(liveEnabled()).toBe(false);
    expect(hasTts()).toBe(false);
    expect(hasVoiceSession()).toBe(false);

    process.env.OPENROUTER_API_KEY = "sk-or-v1-testkey";
    expect(liveEnabled()).toBe(true);
    expect(hasTts()).toBe(false);
    expect(hasVoiceSession()).toBe(false);

    process.env.XAI_API_KEY = "xai-testkey";
    expect(liveEnabled()).toBe(true);
    expect(hasTts()).toBe(true);
    expect(hasVoiceSession()).toBe(true);

    process.env = { ...originalEnv };
  });

  it("calls OpenRouter API with correct payload and headers", async () => {
    process.env.OPENROUTER_API_KEY = "sk-or-v1-testkey";
    process.env.OPENROUTER_MODEL = "openai/gpt-4o-mini";

    const originalFetch = globalThis.fetch;
    let requestedUrl = "";
    let requestedHeaders: Record<string, string> = {};
    let requestedBody: Record<string, unknown> = {};

    globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      requestedUrl = String(input);
      requestedHeaders = (init?.headers ?? {}) as Record<string, string>;
      requestedBody = JSON.parse(String(init?.body ?? "{}"));
      return new Response(
        JSON.stringify({
          choices: [{ message: { content: "Focus on the records table." } }],
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      );
    }) as typeof fetch;

    try {
      const reply = await openrouterReply("You are a tutor.", "What should I check?");
      expect(reply).toBe("Focus on the records table.");
      expect(requestedUrl).toBe("https://openrouter.ai/api/v1/chat/completions");
      expect(requestedHeaders["Authorization"]).toBe("Bearer sk-or-v1-testkey");
      expect(requestedHeaders["HTTP-Referer"]).toBeDefined();
      expect(requestedHeaders["X-Title"]).toBe("Keel");
      expect(requestedBody.model).toBe("openai/gpt-4o-mini");
      expect(Array.isArray(requestedBody.messages)).toBe(true);

      const aiResult = await aiReply("You are a tutor.", "What should I check?");
      expect(aiResult).toBe("Focus on the records table.");
    } finally {
      globalThis.fetch = originalFetch;
      process.env = { ...originalEnv };
    }
  });
});

describe("super admin & teacher evaluation ledger", () => {
  it("validates role hierarchy and access checks", () => {
    expect(cleanRole("super_admin")).toBe("super_admin");
    expect(cleanRole("staff")).toBe("staff");
    expect(cleanRole("student")).toBe("student");
    expect(cleanRole("hacker")).toBe("student");

    expect(isStaffOrAdmin("super_admin")).toBe(true);
    expect(isStaffOrAdmin("staff")).toBe(true);
    expect(isStaffOrAdmin("student")).toBe(false);
    expect(isStaffOrAdmin(null)).toBe(false);

    process.env.SUPER_ADMIN_EMAIL = "principal@keel.edu";
    expect(isStaffOrAdmin("student", "principal@keel.edu")).toBe(true);
    expect(isStaffOrAdmin("student", "other@keel.edu")).toBe(false);
    delete process.env.SUPER_ADMIN_EMAIL;
    expect(roleFor("frankleroyvan@gmail.com", "student")).toBe("super_admin");
    expect(roleFor("other@keel.edu", "super_admin")).toBe("student");
  });

  it("records submissions and allows teacher evaluation overrides", async () => {
    await wipeUser("student-42");
    await insertProfile("student-42", "Ada Lovelace");
    await saveProgress({
      userId: "student-42",
      itemId: "harbor",
      kind: "brief",
      correct: false,
      xp: 0,
      detail: JSON.stringify({ choices: { tools: "shared" }, note: "Preliminary draft architecture." }),
      day: "2026-09-28",
    });

    const submissions = await getCohortSubmissions("brief");
    const sub = submissions.find((s) => s.userId === "student-42" && s.itemId === "harbor");
    expect(sub).toBeDefined();
    expect(sub?.displayName).toBe("Ada Lovelace");
    expect(sub?.score).toBe(0);
    expect(sub?.verified).toBe(0);

    // Teacher cross-checks and manually overrides grade with constructive feedback
    await updateTeacherEvaluation({
      userId: "student-42",
      itemId: "harbor",
      kind: "brief",
      score: 1,
      xp: 200,
      teacherFeedback: "Solid reasoning on tier boundaries. Approved upon manual oral defense.",
      verified: 1,
    });

    const updated = (await getCohortSubmissions("brief")).find((s) => s.userId === "student-42" && s.itemId === "harbor");
    expect(updated?.score).toBe(1);
    expect(updated?.xp).toBe(200);
    expect(updated?.verified).toBe(1);
    expect(updated?.teacherFeedback).toContain("Solid reasoning");
  });

  it("verifies architectural master key and solutions breakdown data integrity", async () => {
    const { harborTierSolutions, harborDecisionsBreakdown, caseSolutionsList, foundryMissionSolutions } = await import(
      "../lib/solutions"
    );
    const { briefAnswers, decisionAnswers } = await import("../lib/server/answers");

    expect(harborTierSolutions.length).toBe(5);
    expect(harborDecisionsBreakdown.length).toBe(11);
    expect(caseSolutionsList.length).toBe(11);
    expect(foundryMissionSolutions.length).toBe(5);

    // Every brief decision must match the server ground truth
    for (const d of harborDecisionsBreakdown) {
      expect(d.optimalKey).toBe(briefAnswers[d.id]);
    }

    // Every case solution decisions must match server ground truth
    for (const c of caseSolutionsList) {
      const expected = decisionAnswers[c.sectionId as keyof typeof decisionAnswers];
      for (const d of c.decisions) {
        expect(d.optimalChoice).toBe(expected[d.questionId]);
      }
    }
  });
});


