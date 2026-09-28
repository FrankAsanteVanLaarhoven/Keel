import { saveSurvey, surveyFor } from "@/lib/classbook";
import { guard, json } from "@/lib/http";
import { userFrom } from "@/lib/ready";
import { progressSummary } from "@/lib/store";
import { termComplete } from "@/lib/term";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const user = await userFrom(request);
  if (!user) return json({ error: "auth" }, 401);
  const rows = progressSummary(user.id, new Date().toISOString().slice(0, 10)).rows;
  return json({ open: termComplete(rows), survey: surveyFor(user.id) });
}

export async function POST(request: Request) {
  const user = await userFrom(request);
  if (!user) return json({ error: "auth" }, 401);
  const rows = progressSummary(user.id, new Date().toISOString().slice(0, 10)).rows;
  if (!termComplete(rows)) return json({ error: "locked" }, 403);
  const gated = await guard(request, "survey", 10, 10 * 60 * 1000, user.id);
  if (gated.error || !gated.body || typeof gated.body !== "object") return gated.error ?? json({ error: "body" }, 400);
  const body = gated.body as { helped?: boolean; why?: string; better?: string; ease?: number; recommend?: boolean };
  const ok = saveSurvey({
    userId: user.id,
    helped: Boolean(body.helped),
    why: body.why ?? "",
    better: body.better ?? "",
    ease: Number(body.ease),
    recommend: Boolean(body.recommend),
  });
  return json({ ok }, ok ? 200 : 400);
}
