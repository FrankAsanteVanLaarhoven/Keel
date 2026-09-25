import { getPack } from "@/lib/course";
import { sectionById } from "@/lib/course/meta";
import { guard, json } from "@/lib/http";
import { t } from "@/lib/i18n/catalog";
import { resolveLocale } from "@/lib/i18n/server";
import { userFrom } from "@/lib/ready";
import { liveEnabled, speakText } from "@/lib/server/live";
import { getConsent } from "@/lib/store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const user = await userFrom(request);
  if (!user) return json({ error: "auth" }, 401);
  if (!getConsent(user.id) || !liveEnabled()) return json({ engine: "device" }, 404);
  const gated = await guard(request, "speak", 20, 10 * 60 * 1000, user.id);
  if (gated.error || !gated.body || typeof gated.body !== "object") return gated.error ?? json({ error: "body" }, 400);
  const sectionId = (gated.body as { sectionId?: string }).sectionId ?? "";
  const locale = await resolveLocale();
  const pack = getPack(locale);
  const section = sectionById(sectionId);
  const text = section
    ? pack.sections[section.id].narration
    : sectionId === "brief"
      ? pack.brief.narration
      : t(locale).programmeNarration;
  try {
    const audio = await speakText(text, locale);
    return new Response(audio, {
      headers: {
        "content-type": "audio/mpeg",
        "cache-control": "private, no-store",
        "x-content-type-options": "nosniff",
      },
    });
  } catch {
    return json({ engine: "device" }, 503);
  }
}
