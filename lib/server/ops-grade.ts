import { opsBriefDecisions, opsById, type LabField, type OpsId } from "../ops/meta";
import type { LabFields } from "../ops/preview";
import { noteOk } from "../security";
import type { Locale } from "../locale";
import { xpFor } from "./answers";
import type { GradeResult } from "./grade";
import { opsBriefAnswers, opsCheckAnswers, opsDecisionAnswers, opsLabAnswers } from "./ops-answers";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function sameSet(left: string[], right: string[]): boolean {
  if (left.length !== right.length) return false;
  const have = new Set(left);
  return right.every((item) => have.has(item));
}

function readFields(spec: LabField[], body: Record<string, unknown>): LabFields | null {
  const raw = asRecord(body.fields);
  const fields: LabFields = {};
  for (const field of spec) {
    const value = raw[field.id];
    if (field.kind === "single") {
      if (typeof value !== "string" || !field.optionIds.includes(value)) return null;
      fields[field.id] = value;
      continue;
    }
    if (!Array.isArray(value) || !value.every((item): item is string => typeof item === "string")) return null;
    if (field.kind === "order") {
      if (value.length !== field.optionIds.length || !sameSet(value, field.optionIds)) return null;
    } else if (!value.every((item) => field.optionIds.includes(item))) {
      return null;
    }
    fields[field.id] = value;
  }
  return fields;
}

function labCorrect(id: OpsId, fields: LabFields): boolean {
  return Object.entries(opsLabAnswers[id]).every(([key, answer]) => {
    const value = fields[key];
    if (Array.isArray(answer)) {
      if (!Array.isArray(value) || value.length !== answer.length || !sameSet(value, answer)) return false;
      if (key === "path") return answer.every((item, index) => value[index] === item);
      return true;
    }
    return value === answer;
  });
}

export function gradeOps(input: {
  kind: "check" | "lab" | "ops-case" | "ops-brief";
  sectionId?: string;
  payload: unknown;
  locale: Locale;
  hint: string;
  open: boolean;
}): GradeResult {
  if (!input.open) return { correct: false, locked: true, xp: 0, detail: null, explain: [] };
  const body = asRecord(input.payload);
  if (input.kind === "ops-brief") return gradeOpsBrief(body, input.locale, input.hint);
  const section = opsById(input.sectionId ?? "");
  if (!section) return { correct: false, xp: 0, detail: null, explain: [] };
  if (input.kind === "check") {
    const choice = typeof body.choice === "string" ? body.choice : "";
    const correct = choice === opsCheckAnswers[section.id];
    return { correct, xp: correct ? xpFor.check : 0, detail: JSON.stringify({ choice }), explain: [`${section.id}.check`] };
  }
  if (input.kind === "lab") return gradeOpsLab(section.id, section.lab, body);
  return gradeOpsCase(section.id, body, input.locale, input.hint);
}

function gradeOpsLab(id: OpsId, spec: LabField[], body: Record<string, unknown>): GradeResult {
  const fields = readFields(spec, body);
  const correct = fields ? labCorrect(id, fields) : false;
  return {
    correct,
    xp: correct ? xpFor.lab : 0,
    detail: JSON.stringify({ fields: fields ?? {} }),
    explain: [`${id}.lab`],
  };
}

function gradeOpsCase(id: OpsId, body: Record<string, unknown>, locale: Locale, hint: string): GradeResult {
  const expected = opsDecisionAnswers[id];
  const choices = asRecord(body.choices);
  const picked: Record<string, string> = {};
  let decisionsOk = true;
  for (const [key, value] of Object.entries(expected)) {
    const choice = choices[key];
    if (typeof choice !== "string" || choice !== value) decisionsOk = false;
    if (typeof choice === "string") picked[key] = choice;
  }
  const note = typeof body.note === "string" ? body.note.trim() : "";
  const correct = decisionsOk && noteOk(note, locale, hint);
  return {
    correct,
    xp: correct ? xpFor.case : 0,
    detail: JSON.stringify({ choices: picked, note }),
    explain: Object.keys(expected).map((key) => `${id}.${key}`),
  };
}

function gradeOpsBrief(body: Record<string, unknown>, locale: Locale, hint: string): GradeResult {
  const choices = asRecord(body.choices);
  const picked: Record<string, string> = {};
  let decisionsOk = true;
  for (const decision of opsBriefDecisions) {
    const choice = choices[decision.id];
    if (typeof choice !== "string" || choice !== opsBriefAnswers[decision.id]) decisionsOk = false;
    if (typeof choice === "string") picked[decision.id] = choice;
  }
  const note = typeof body.note === "string" ? body.note.trim() : "";
  const correct = decisionsOk && noteOk(note, locale, hint);
  return {
    correct,
    xp: correct ? xpFor.brief : 0,
    detail: JSON.stringify({ choices: picked, note }),
    explain: opsBriefDecisions.map((decision) => `opsbrief.${decision.id}`),
  };
}

