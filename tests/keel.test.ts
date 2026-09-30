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
import { auth } from "../lib/auth";
import { POST as resetPassphrase } from "../app/api/admin/passphrase/route";
import { bindPlaceholders, isDatabaseWaking, sqlGet } from "../lib/sql";
import { matchAccept } from "../lib/locale";
import { cacheControlFor, canResetPassphrase, cleanName, cleanRole, clientDay, isStaffOrAdmin, leaderboardSql, mayCacheStatic, noteOk, passphraseAttemptLimit, passphraseOk, publicSignInLimit, publicSignUpLimit, roleFor, sameOrigin, utcWeekStart } from "../lib/security";
import { insertProfile, wipeUser } from "../lib/db";
import { clockLimit, clockName, clockPlaces, clocksFromStorage, defaultClockIds, findClocks, localClockId } from "../lib/clocks";
import { markdownBlocks, markdownInlines } from "../lib/markdown";
import { saveProgress, exportFor, getCohortSubmissions, updateTeacherEvaluation } from "../lib/store";
import {
  addWorkshopMember,
  addWorkshopNote,
  createWorkshopPage,
  deleteWorkshopPage,
  readWorkshopPage,
  restoreWorkshopRevision,
  saveWorkshopPage,
  setWorkshopStatus,
  workshopAccess,
} from "../lib/workshop";
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

  it("keeps a classroom allowance and a per-email guessing cap", () => {
    expect(publicSignUpLimit).toEqual({ windowSeconds: 3600, max: 120 });
    expect(publicSignInLimit).toEqual({ windowSeconds: 900, max: 120 });
    expect(passphraseAttemptLimit).toEqual({ windowMs: 5 * 60 * 1000, max: 5 });
    expect(passphraseOk("short")).toBe(false);
    expect(passphraseOk(`twelve chars\n`)).toBe(false);
    expect(passphraseOk("a".repeat(129))).toBe(false);
    expect(passphraseOk("classroom-pass")).toBe(true);
    expect(canResetPassphrase("frankleroyvan@gmail.com", "student@keel.edu")).toBe(true);
    expect(canResetPassphrase("frankleroyvan@gmail.com", "frankleroyvan@gmail.com")).toBe(false);
    expect(canResetPassphrase("frankleroyvan@gmail.com", " FrankLeroyVan@gmail.com ")).toBe(false);
    expect(canResetPassphrase("staff@keel.edu", "student@keel.edu")).toBe(false);
    expect(canResetPassphrase("frankleroyvan@gmail.com", "")).toBe(false);
    process.env.SUPER_ADMIN_EMAIL = "principal@keel.edu";
    expect(canResetPassphrase("principal@keel.edu", "student@keel.edu")).toBe(true);
    expect(canResetPassphrase("principal@keel.edu", "principal@keel.edu")).toBe(false);
    expect(canResetPassphrase("principal@keel.edu", "frankleroyvan@gmail.com")).toBe(false);
    delete process.env.SUPER_ADMIN_EMAIL;
    expect(isDatabaseWaking(Object.assign(new Error("the database system is starting up"), { code: "57P03" }))).toBe(true);
    expect(isDatabaseWaking(new Error("relation does not exist"))).toBe(false);
  });

  it("lets a signed-in person change a passphrase and the super admin replace a forgotten one", async () => {
    const adminEmail = "keel-access-admin@example.com";
    const studentEmail = "keel-access-student@example.com";
    const first = "classroom-passphrase-1";
    const second = "classroom-passphrase-2";
    const third = "classroom-passphrase-3";
    const previousAdmin = process.env.SUPER_ADMIN_EMAIL;
    process.env.SUPER_ADMIN_EMAIL = adminEmail;
    const ids: string[] = [];
    const cookieFor = async (email: string, password: string) => {
      const response = await auth.api.signInEmail({ body: { email, password }, asResponse: true });
      expect(response.ok).toBe(true);
      return response.headers.getSetCookie().map((item) => item.split(";")[0]).join("; ");
    };
    const resetRequest = (cookie: string, email: string, password: string) =>
      new Request("http://127.0.0.1:3960/api/admin/passphrase", {
        method: "POST",
        headers: {
          origin: "http://127.0.0.1:3960",
          host: "127.0.0.1:3960",
          "content-type": "application/json",
          cookie,
        },
        body: JSON.stringify({ email, password }),
      });
    try {
      const ctx = await auth.$context;
      for (const email of [adminEmail, studentEmail]) {
        const existing = await ctx.internalAdapter.findUserByEmail(email);
        if (!existing?.user?.id) continue;
        await wipeUser(existing.user.id);
        await ctx.internalAdapter.deleteUser(existing.user.id);
      }
      const admin = await auth.api.signUpEmail({ body: { name: "Access Admin", email: adminEmail, password: first } });
      const student = await auth.api.signUpEmail({ body: { name: "Access Student", email: studentEmail, password: first } });
      ids.push(admin.user.id, student.user.id);
      await saveProgress({
        userId: student.user.id,
        itemId: "harbor",
        kind: "brief",
        correct: true,
        xp: 10,
        detail: JSON.stringify({ note: "kept across a passphrase reset" }),
        day: "2026-09-30",
      });
      const studentCookie = await cookieFor(studentEmail, first);
      const changed = await auth.api.changePassword({
        body: { currentPassword: first, newPassword: second, revokeOtherSessions: true },
        headers: new Headers({ cookie: studentCookie, origin: "http://127.0.0.1:3960" }),
        asResponse: true,
      });
      expect(changed.status).toBe(200);
      const stale = await auth.api.signInEmail({ body: { email: studentEmail, password: first }, asResponse: true });
      expect(stale.ok).toBe(false);
      const renewed = await cookieFor(studentEmail, second);
      expect((await resetPassphrase(resetRequest(renewed, studentEmail, third))).status).toBe(403);
      const adminCookie = await cookieFor(adminEmail, first);
      expect((await resetPassphrase(resetRequest(adminCookie, adminEmail, third))).status).toBe(403);
      expect((await resetPassphrase(resetRequest(adminCookie, studentEmail, third))).status).toBe(200);
      expect(await auth.api.getSession({ headers: new Headers({ cookie: renewed }) })).toBeNull();
      const previous = await auth.api.signInEmail({ body: { email: studentEmail, password: second }, asResponse: true });
      expect(previous.ok).toBe(false);
      expect((await cookieFor(studentEmail, third)).length).toBeGreaterThan(0);
      const kept = await sqlGet<{ n: number }>(`SELECT COUNT(*) AS n FROM keel_progress WHERE user_id = ?`, [student.user.id]);
      expect(Number(kept?.n ?? 0)).toBeGreaterThan(0);
    } finally {
      if (previousAdmin === undefined) delete process.env.SUPER_ADMIN_EMAIL;
      else process.env.SUPER_ADMIN_EMAIL = previousAdmin;
      const ctx = await auth.$context;
      for (const email of [adminEmail, studentEmail]) {
        const existing = await ctx.internalAdapter.findUserByEmail(email);
        if (!existing?.user?.id) continue;
        await wipeUser(existing.user.id);
        await ctx.internalAdapter.deleteUser(existing.user.id);
      }
      for (const id of ids) await wipeUser(id);
    }
  }, 30_000);

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
});

describe("workshop", () => {
  it("renders safe markdown and keeps a draft private until it is published", () => {
    const blocks = markdownBlocks("# Title\n\n- one\n- two\n\n```\nalert(1)\n```\n\n<script>alert(1)</script>");
    expect(blocks.find((block) => block.type === "h")).toMatchObject({ level: 1, text: "Title" });
    expect(blocks.find((block) => block.type === "ul")).toMatchObject({ items: ["one", "two"] });
    expect(blocks.find((block) => block.type === "code")).toMatchObject({ text: "alert(1)" });
    expect(blocks.find((block) => block.type === "p")).toMatchObject({ text: "<script>alert(1)</script>" });
    const inlines = markdownInlines("See [x](javascript:alert(1)) and [ok](https://example.com).");
    expect(inlines.some((part) => part.type === "link" && part.href.startsWith("javascript:"))).toBe(false);
    expect(inlines).toContainEqual({ type: "link", text: "ok", href: "https://example.com" });
    expect(workshopAccess({ actorId: null, staff: true, ownerId: "a", memberIds: [], status: "published" })).toBe("none");
    expect(workshopAccess({ actorId: "a", staff: false, ownerId: "a", memberIds: [], status: "draft" })).toBe("edit");
    expect(workshopAccess({ actorId: "b", staff: false, ownerId: "a", memberIds: ["b"], status: "draft" })).toBe("edit");
    expect(workshopAccess({ actorId: "c", staff: true, ownerId: "a", memberIds: [], status: "draft" })).toBe("read");
    expect(workshopAccess({ actorId: "c", staff: false, ownerId: "a", memberIds: [], status: "published" })).toBe("read");
    expect(workshopAccess({ actorId: "c", staff: false, ownerId: "a", memberIds: [], status: "draft" })).toBe("none");
  });

  it("keeps every save, stops a stale write, and removes the page with the owner", async () => {
    const owner = "workshop-owner-test";
    const mate = "workshop-mate-test";
    const stranger = "workshop-stranger-test";
    const staff = "workshop-staff-test";
    const twinA = "workshop-twin-a";
    const twinB = "workshop-twin-b";
    const ids = [owner, mate, stranger, staff, twinA, twinB];
    let pageId = "";
    try {
      for (const id of ids) await wipeUser(id);
      await insertProfile(owner, "Workshop Owner");
      await insertProfile(mate, "Workshop Mate");
      await insertProfile(stranger, "Workshop Stranger");
      await insertProfile(staff, "Workshop Staff", "staff");
      await insertProfile(twinA, "Twin Name");
      await insertProfile(twinB, "Twin Name");
      const created = await createWorkshopPage(owner, "Harbor desk");
      pageId = created.id;
      const first = await readWorkshopPage(owner, false, created.id);
      expect(first.error).toBeNull();
      if (first.error) return;
      expect(first.page.body).toContain("What we are building");
      expect(first.manage).toBe(true);
      const saved = await saveWorkshopPage(owner, false, created.id, "Harbor desk", "We decided on one door.", 1);
      expect(saved.ok).toBe(true);
      const stale = await saveWorkshopPage(owner, false, created.id, "Harbor desk", "late", 1);
      expect(stale.ok).toBe(false);
      if (!stale.ok) expect(stale.error).toBe("conflict");
      expect((await readWorkshopPage(stranger, false, created.id)).error).toBe("forbidden");
      const staffRead = await readWorkshopPage(staff, true, created.id);
      expect(staffRead.error).toBeNull();
      if (!staffRead.error) expect(staffRead.manage).toBe(true);
      expect((await addWorkshopMember(owner, false, created.id, "Nobody Here")).ok).toBe(false);
      expect((await addWorkshopMember(owner, false, created.id, "Twin Name")).ok).toBe(false);
      const ambiguous = await addWorkshopMember(owner, false, created.id, "Twin Name");
      expect(ambiguous.ok).toBe(false);
      if (!ambiguous.ok) expect(ambiguous.error).toBe("ambiguous");
      expect((await addWorkshopMember(owner, false, created.id, "Workshop Mate")).ok).toBe(true);
      expect((await addWorkshopNote(stranger, false, created.id, "I can see this")).ok).toBe(false);
      expect((await addWorkshopNote(mate, false, created.id, "Check the door.")).ok).toBe(true);
      expect((await saveWorkshopPage(mate, false, created.id, "Harbor desk", "Mate wrote this.", 2)).ok).toBe(true);
      expect((await setWorkshopStatus(mate, false, created.id, "published")).ok).toBe(false);
      expect((await deleteWorkshopPage(mate, false, created.id)).ok).toBe(false);
      expect((await setWorkshopStatus(owner, false, created.id, "published")).ok).toBe(true);
      const publicRead = await readWorkshopPage(stranger, false, created.id);
      expect(publicRead.error).toBeNull();
      if (!publicRead.error) expect(publicRead.page.access).toBe("read");
      expect((await addWorkshopNote(stranger, false, created.id, "Still outside")).ok).toBe(false);
      expect((await setWorkshopStatus(staff, true, created.id, "draft")).ok).toBe(true);
      expect((await readWorkshopPage(stranger, false, created.id)).error).toBe("forbidden");
      const restored = await restoreWorkshopRevision(owner, false, created.id, 1);
      expect(restored.ok).toBe(true);
      const after = await readWorkshopPage(owner, false, created.id);
      expect(after.error).toBeNull();
      if (!after.error) expect(after.page.body).toContain("What we are building");
      const exported = await exportFor(owner);
      expect(exported.workshop.some((page) => page.title === "Harbor desk")).toBe(true);
      await wipeUser(owner);
      expect((await readWorkshopPage(staff, true, created.id)).error).toBe("missing");
      pageId = "";
    } finally {
      if (pageId) await deleteWorkshopPage(owner, true, pageId);
      for (const id of ids) await wipeUser(id);
    }
  });
});

describe("solutions", () => {
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

describe("world clock", () => {
  it("keeps a removable list on this device and matches a typed country", () => {
    expect(defaultClockIds).toEqual(["local", "Europe/London", "America/New_York", "Africa/Lagos", "Asia/Tokyo"]);
    expect(clocksFromStorage(null)).toEqual([...defaultClockIds]);
    expect(clocksFromStorage("[]")).toEqual([]);
    expect(clocksFromStorage("not-json")).toEqual([...defaultClockIds]);
    expect(clocksFromStorage("[\"nope\", \"Africa/Accra\", \"Africa/Accra\", \"local\"]")).toEqual(["Africa/Accra", "local"]);
    const nine = ["local", "Europe/London", "America/New_York", "Africa/Lagos", "Asia/Tokyo", "Africa/Accra", "Europe/Paris", "Asia/Shanghai", "Europe/Berlin"];
    expect(clocksFromStorage(JSON.stringify(nine))).toHaveLength(clockLimit);
    expect(findClocks("Ghana", "en")).toEqual(["Africa/Accra"]);
    expect(findClocks("Accra", "en")).toEqual(["Africa/Accra"]);
    expect(findClocks("Alemania", "es")).toEqual(["Europe/Berlin"]);
    expect(findClocks("日本", "ja")).toEqual(["Asia/Tokyo"]);
    expect(findClocks("guinea", "en").length).toBeGreaterThan(1);
    const states = findClocks("united states", "en");
    expect(states.length).toBeGreaterThan(1);
    expect(states).toContain("America/New_York");
    expect(findClocks("no such country", "en")).toEqual([]);
    expect(clockName("Africa/Accra", "en")).toBe("Ghana");
    expect(clockName("America/Chicago", "en")).toBe("United States (Chicago)");
    const zones = new Set<string>();
    for (const place of clockPlaces) {
      expect(place.region).toMatch(/^[A-Z]{2}$/);
      expect(zones.has(place.zone)).toBe(false);
      zones.add(place.zone);
      expect(new Intl.DateTimeFormat("en", { timeZone: place.zone, hour: "2-digit" }).format(new Date("2026-01-15T12:00:00Z"))).toMatch(/\d/);
      const name = new Intl.DisplayNames(["en"], { type: "region" }).of(place.region);
      expect(name && name !== place.region).toBe(true);
    }
    expect(zones.has(localClockId)).toBe(false);
  });
});


