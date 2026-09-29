import { getPack } from "@/lib/course";
import { sectionById } from "@/lib/course/meta";
import { getOps } from "@/lib/ops";
import { opsGateOpen } from "@/lib/ops/gates";
import { opsById } from "@/lib/ops/meta";
import { guard, json } from "@/lib/http";
import { resolveLocale } from "@/lib/i18n/server";
import { userFrom } from "@/lib/ready";
import { gradeAttempt } from "@/lib/server/grade";
import { gradeOps } from "@/lib/server/ops-grade";
import { explain } from "@/lib/server/why";
import { recordAttempt, workFor } from "@/lib/classbook";
import { termGate, weekForItem } from "@/lib/term";
import { clientDay, isStaffOrAdmin } from "@/lib/security";
import { getProfile, progressSummary, saveProgress } from "@/lib/store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const user = await userFrom(request);
  const gated = await guard(request, "grade", 40, 10 * 60 * 1000, user?.id);
  if (gated.error || !gated.body || typeof gated.body !== "object") return gated.error ?? json({ error: "body" }, 400);
  const body = gated.body as { kind?: string; sectionId?: string; day?: unknown; note?: unknown };
  const kind = body.kind;
  const opsKind = kind === "lab" || kind === "ops-case" || kind === "ops-brief" ? kind : null;
  const opsSection = opsById(body.sectionId ?? "");
  if (kind !== "check" && kind !== "bench" && kind !== "case" && kind !== "brief" && !opsKind) return json({ error: "kind" }, 400);
  const locale = await resolveLocale();
  const gradeItem = kind === "brief" ? "harbor" : kind === "ops-brief" ? "northline" : (body.sectionId ?? "");
  const gradeKind = kind === "check" && opsSection ? "check" : (opsKind ?? kind ?? "");
  const profile = user ? await getProfile(user.id) : null;
  const staff = isStaffOrAdmin(profile?.role, user?.email);
  const rows = user ? (await progressSummary(user.id, clientDay(body.day))).rows : [];
  const week = weekForItem(gradeItem, gradeKind);
  const gate = termGate({
    itemId: gradeItem,
    kind: gradeKind,
    rows,
    staff,
    work: week ? await workFor(week.id) : null,
    now: Date.now(),
  });
  if (!gate.open) return json({ correct: false, locked: true, saved: false, why: [] });
  if (opsKind || (kind === "check" && opsSection)) {
    const opsGradeKind = kind === "check" ? "check" : opsKind;
    if (!opsGradeKind || (opsGradeKind !== "ops-brief" && !opsSection)) return json({ error: "section" }, 404);
    const ops = getOps(locale);
    const hint = opsGradeKind === "ops-brief" ? ops.brief.noteHint : ops.sections[opsSection!.id].noteHint;
    const rows = user ? (await progressSummary(user.id, clientDay(body.day))).rows : [];
    const result = gradeOps({
      kind: opsGradeKind,
      sectionId: body.sectionId,
      payload: body,
      locale,
      hint,
      open: opsGateOpen({
        kind: opsGradeKind,
        sectionId: body.sectionId,
        signedIn: Boolean(user),
        rows,
      }),
    });
    let saved = false;
    if (user && result.correct && !result.locked) {
      const record = await saveProgress({
        userId: user.id,
        itemId: opsGradeKind === "ops-brief" ? "northline" : (body.sectionId as string),
        kind: opsGradeKind,
        correct: true,
        xp: result.xp,
        detail: result.detail,
        day: clientDay(body.day),
      });
      saved = record.saved;
    }
    if (user && !result.locked) await recordAttempt({ userId: user.id, itemId: opsGradeKind === "ops-brief" ? "northline" : (body.sectionId as string), kind: opsGradeKind, correct: result.correct });
    return json({
      correct: result.correct,
      saved,
      locked: Boolean(result.locked),
      why: result.explain.map((id) => explain(locale, id)).filter(Boolean),
    });
  }
  if (kind !== "check" && kind !== "bench" && kind !== "case" && kind !== "brief") return json({ error: "kind" }, 400);
  if (kind !== "brief" && !sectionById(body.sectionId ?? "")) return json({ error: "section" }, 404);
  const pack = getPack(locale);
  const hint = kind === "brief" ? pack.brief.noteHint : pack.sections[sectionById(body.sectionId ?? "")!.id].noteHint;
  const casesDone = user ? (await progressSummary(user.id, clientDay(body.day))).cases : 0;
  const result = gradeAttempt({
    kind,
    sectionId: body.sectionId,
    payload: body,
    locale,
    hint,
    casesDone,
  });
  let saved = false;
  if (user && !result.locked) {
    const record = await saveProgress({
      userId: user.id,
      itemId: kind === "brief" ? "harbor" : (body.sectionId as string),
      kind,
      correct: result.correct,
      xp: result.xp,
      detail: result.detail,
      day: clientDay(body.day),
    });
    saved = record.saved && result.correct;
  }
  if (user && !result.locked) await recordAttempt({ userId: user.id, itemId: kind === "brief" ? "harbor" : (body.sectionId as string), kind, correct: result.correct });
  return json({
    correct: result.correct,
    saved,
    locked: Boolean(result.locked),
    why: result.explain.map((id) => explain(locale, id)).filter(Boolean),
  });
}
