import { getPack } from "@/lib/course";
import { sectionById } from "@/lib/course/meta";
import { guard, json } from "@/lib/http";
import { t } from "@/lib/i18n/catalog";
import { resolveLocale } from "@/lib/i18n/server";
import { userFrom } from "@/lib/ready";
import { liveEnabled, mintVoiceSecret, tutorInstructions } from "@/lib/server/live";
import { getConsent } from "@/lib/store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const user = await userFrom(request);
  if (!user) return json({ error: "auth" }, 401);
  if (!getConsent(user.id) || !liveEnabled()) return json({ error: "voice" }, 403);
  const gated = await guard(request, "voice-session", 20, 60 * 60 * 1000, user.id);
  if (gated.error || !gated.body || typeof gated.body !== "object") return gated.error ?? json({ error: "body" }, 400);
  const sectionId = (gated.body as { sectionId?: string }).sectionId ?? "programme";
  const locale = await resolveLocale();
  const messages = t(locale);
  const pack = getPack(locale);
  const section = sectionById(sectionId);
  const title = section ? pack.sections[section.id].title : sectionId === "brief" ? pack.brief.title : messages.homeTitle;
  const promise = section ? pack.sections[section.id].promise : messages.homeDeck;
  const how = section ? pack.sections[section.id].how[0] : messages.about2;
  const expert = section ? pack.sections[section.id].expert.join(" ") : messages.about3;
  const narration = section ? pack.sections[section.id].narration : sectionId === "brief" ? pack.brief.narration : messages.programmeNarration;
  try {
    const token = await mintVoiceSecret();
    return json({
      token,
      instructions: tutorInstructions({ localeName: locale, title, promise, how, expert, narration }),
    });
  } catch {
    return json({ error: "voice" }, 503);
  }
}
