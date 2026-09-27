import { guard, json } from "@/lib/http";
import { userFrom } from "@/lib/ready";
import { hasTts, liveEnabled, speakText, takeUtterance } from "@/lib/server/live";
import { getConsent } from "@/lib/store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const user = await userFrom(request);
  if (!user || !getConsent(user.id) || !liveEnabled() || !hasTts()) return json({ error: "auth" }, 401);
  const gated = await guard(request, "utter", 30, 10 * 60 * 1000, user.id);
  if (gated.error || !gated.body || typeof gated.body !== "object") return gated.error ?? json({ error: "body" }, 400);
  const row = takeUtterance(user.id, (gated.body as { id?: string }).id ?? "");
  if (!row) return json({ error: "utterance" }, 404);
  try {
    const audio = await speakText(row.text, row.locale);
    return new Response(audio, {
      headers: { "content-type": "audio/mpeg", "cache-control": "private, no-store", "x-content-type-options": "nosniff" },
    });
  } catch {
    return json({ error: "voice" }, 503);
  }
}
