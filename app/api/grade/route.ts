import { getPack } from "@/lib/course";
import { sectionById } from "@/lib/course/meta";
import { guard, json } from "@/lib/http";
import { resolveLocale } from "@/lib/i18n/server";
import { userFrom } from "@/lib/ready";
import { gradeAttempt } from "@/lib/server/grade";
import { explain } from "@/lib/server/why";
import { clientDay } from "@/lib/security";
import { progressSummary, saveProgress } from "@/lib/store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const user = await userFrom(request);
  const gated = await guard(request, "grade", 40, 10 * 60 * 1000, user?.id);
  if (gated.error || !gated.body || typeof gated.body !== "object") return gated.error ?? json({ error: "body" }, 400);
  const body = gated.body as { kind?: string; sectionId?: string; day?: unknown; note?: unknown };
  const kind = body.kind;
  if (kind !== "check" && kind !== "bench" && kind !== "case" && kind !== "brief") return json({ error: "kind" }, 400);
  if (kind !== "brief" && !sectionById(body.sectionId ?? "")) return json({ error: "section" }, 404);
  const locale = await resolveLocale();
  const pack = getPack(locale);
  const hint = kind === "brief" ? pack.brief.noteHint : pack.sections[sectionById(body.sectionId ?? "")!.id].noteHint;
  const casesDone = user ? progressSummary(user.id, clientDay(body.day)).cases : 0;
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
    const record = saveProgress({
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
  return json({
    correct: result.correct,
    saved,
    locked: Boolean(result.locked),
    why: result.explain.map((id) => explain(locale, id)).filter(Boolean),
  });
}
