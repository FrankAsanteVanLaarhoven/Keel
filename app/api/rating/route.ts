import { rateWeek, ratings } from "@/lib/classbook";
import { guard, json } from "@/lib/http";
import { userFrom } from "@/lib/ready";

export const runtime = "nodejs";

export async function GET() {
  return json({ ratings: ratings() });
}

export async function POST(request: Request) {
  const user = await userFrom(request);
  if (!user) return json({ error: "auth" }, 401);
  const gated = await guard(request, "rating", 20, 10 * 60 * 1000, user.id);
  if (gated.error || !gated.body || typeof gated.body !== "object") return gated.error ?? json({ error: "body" }, 400);
  const body = gated.body as { weekId?: string; stars?: number; note?: string };
  const ok = rateWeek(user.id, body.weekId ?? "", Number(body.stars), body.note ?? "");
  return json({ ok }, ok ? 200 : 400);
}
