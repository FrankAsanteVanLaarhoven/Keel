import { guard, json } from "@/lib/http";
import { userFrom } from "@/lib/ready";
import { saveProgress } from "@/lib/store";
import { clientDay } from "@/lib/security";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const user = await userFrom(request);
  if (!user) return json({ error: "auth", saved: false }, 401);

  const gated = await guard(request, "foundry", 30, 10 * 60 * 1000, user.id);
  if (gated.error || !gated.body || typeof gated.body !== "object") {
    return gated.error ?? json({ error: "body" }, 400);
  }

  const body = gated.body as { challengeId?: string };
  const challengeId = (body.challengeId ?? "freeform").slice(0, 40);

  const record = saveProgress({
    userId: user.id,
    itemId: challengeId,
    kind: "foundry",
    correct: true,
    xp: 50,
    detail: "Mission completed in Interactive Systems Foundry",
    day: clientDay(new Date().toISOString().slice(0, 10)),
  });

  return json({
    saved: record.saved,
    xp: record.xp,
    mark: "foundry",
  });
}
