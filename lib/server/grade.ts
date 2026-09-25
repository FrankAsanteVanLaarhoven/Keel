import { briefDecisions, sectionById, type BenchMeta, type SectionId } from "../course/meta";
import { noteOk } from "../security";
import type { Locale } from "../locale";
import { benchAnswers, briefAnswers, checkAnswers, decisionAnswers, xpFor } from "./answers";

export type GradeResult = {
  correct: boolean;
  locked?: boolean;
  xp: number;
  detail: string | null;
  explain: string[];
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function sameSet(left: string[], right: string[]): boolean {
  if (left.length !== right.length) return false;
  const have = new Set(left);
  return right.every((item) => have.has(item));
}

export function gradeAttempt(input: {
  kind: "check" | "bench" | "case" | "brief";
  sectionId?: string;
  payload: unknown;
  locale: Locale;
  hint: string;
  casesDone: number;
}): GradeResult {
  const body = asRecord(input.payload);
  if (input.kind === "brief") return gradeBrief(body, input.locale, input.hint, input.casesDone);
  const section = sectionById(input.sectionId ?? "");
  if (!section) return { correct: false, xp: 0, detail: null, explain: [] };
  if (input.kind === "check") {
    const choice = typeof body.choice === "string" ? body.choice : "";
    const correct = choice === checkAnswers[section.id];
    return {
      correct,
      xp: correct ? xpFor.check : 0,
      detail: JSON.stringify({ choice }),
      explain: [`${section.id}.check`],
    };
  }
  if (input.kind === "bench") return gradeBench(section.id, section.bench, body);
  return gradeCase(section.id, body, input.locale, input.hint);
}

function gradeBench(id: SectionId, bench: BenchMeta, body: Record<string, unknown>): GradeResult {
  const answer = benchAnswers[id];
  let correct = false;
  let detail: unknown = body;
  if (bench.kind === "order" && answer.order) {
    const order = Array.isArray(body.order) ? body.order.filter((item): item is string => typeof item === "string") : [];
    correct = order.length === answer.order.length && order.every((item, index) => item === answer.order?.[index]);
    detail = { order };
  } else if (bench.kind === "single" && answer.choice) {
    const choice = typeof body.choice === "string" ? body.choice : "";
    correct = choice === answer.choice;
    detail = { choice };
  } else if (bench.kind === "multi" && answer.choices) {
    const choices = Array.isArray(body.choices) ? body.choices.filter((item): item is string => typeof item === "string") : [];
    const known = new Set(bench.ids);
    correct = choices.every((item) => known.has(item)) && sameSet(choices, answer.choices);
    detail = { choices };
  } else if (bench.kind === "label" && answer.labels) {
    const labels = asRecord(body.labels);
    const picked: Record<string, string> = {};
    correct = bench.slots.every((slot) => {
      const value = labels[slot];
      if (typeof value !== "string") return false;
      picked[slot] = value;
      return value === answer.labels?.[slot];
    });
    detail = { labels: picked };
  }
  return { correct, xp: correct ? xpFor.bench : 0, detail: JSON.stringify(detail), explain: [`${id}.bench`] };
}

function gradeCase(id: SectionId, body: Record<string, unknown>, locale: Locale, hint: string): GradeResult {
  const expected = decisionAnswers[id];
  const choices = asRecord(body.choices);
  const picked: Record<string, string> = {};
  let decisionsOk = true;
  for (const [key, value] of Object.entries(expected)) {
    const choice = choices[key];
    if (typeof choice !== "string" || choice !== value) decisionsOk = false;
    if (typeof choice === "string") picked[key] = choice;
  }
  const note = typeof body.note === "string" ? body.note.trim() : "";
  const written = noteOk(note, locale, hint);
  const correct = decisionsOk && written;
  return {
    correct,
    xp: correct ? xpFor.case : 0,
    detail: JSON.stringify({ choices: picked, note }),
    explain: Object.keys(expected).map((key) => `${id}.${key}`),
  };
}

function gradeBrief(body: Record<string, unknown>, locale: Locale, hint: string, casesDone: number): GradeResult {
  if (casesDone < 11) return { correct: false, locked: true, xp: 0, detail: null, explain: [] };
  const choices = asRecord(body.choices);
  const picked: Record<string, string> = {};
  let decisionsOk = true;
  for (const decision of briefDecisions) {
    const choice = choices[decision.id];
    if (typeof choice !== "string" || choice !== briefAnswers[decision.id]) decisionsOk = false;
    if (typeof choice === "string") picked[decision.id] = choice;
  }
  const note = typeof body.note === "string" ? body.note.trim() : "";
  const correct = decisionsOk && noteOk(note, locale, hint);
  return {
    correct,
    xp: correct ? xpFor.brief : 0,
    detail: JSON.stringify({ choices: picked, note }),
    explain: briefDecisions.map((decision) => `brief.${decision.id}`),
  };
}
