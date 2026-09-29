import { guard, json } from "@/lib/http";
import { userFrom } from "@/lib/ready";
import { setConsent } from "@/lib/store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const user = await userFrom(request);
  if (!user) return json({ ok: true, stored: "device" });
  const gated = await guard(request, "consent", 20, 60 * 60 * 1000, user.id);
  if (gated.error || !gated.body || typeof gated.body !== "object") return gated.error ?? json({ error: "body" }, 400);
  await setConsent(user.id, (gated.body as { voice?: unknown }).voice === true);
  return json({ ok: true });
}
