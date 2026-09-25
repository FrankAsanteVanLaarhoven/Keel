import { getPack } from "@/lib/course";
import { sectionById } from "@/lib/course/meta";
import { guard, json } from "@/lib/http";
import { t } from "@/lib/i18n/catalog";
import { resolveLocale } from "@/lib/i18n/server";
import { userFrom } from "@/lib/ready";
import { grokReply, issueUtterance, liveEnabled, tutorInstructions } from "@/lib/server/live";
import { fill, localReply } from "@/lib/tutor";
import { getConsent } from "@/lib/store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const user = await userFrom(request);
  if (!user) return json({ error: "auth" }, 401);
  const gated = await guard(request, "tutor", 30, 10 * 60 * 1000, user.id);
  if (gated.error || !gated.body || typeof gated.body !== "object") return gated.error ?? json({ error: "body" }, 400);
  const body = gated.body as { sectionId?: string; message?: string };
  const message = (body.message ?? "").trim().slice(0, 2000);
  if (!message) return json({ error: "message" }, 400);
  const locale = await resolveLocale();
  const messages = t(locale);
  const pack = getPack(locale);
  const section = body.sectionId && body.sectionId !== "programme" && body.sectionId !== "brief" ? sectionById(body.sectionId) : undefined;
  const title = section ? pack.sections[section.id].title : body.sectionId === "brief" ? pack.brief.title : messages.homeTitle;
  const promise = section ? pack.sections[section.id].promise : body.sectionId === "brief" ? pack.brief.dek : messages.homeDeck;
  const how = section ? pack.sections[section.id].how[0] : messages.about2;
  const narration = section ? pack.sections[section.id].narration : body.sectionId === "brief" ? pack.brief.narration : messages.programmeNarration;
  const expert = section ? pack.sections[section.id].expert.join(" ") : messages.about3;
  if (!getConsent(user.id) || !liveEnabled()) {
    return json({
      text: localReply({
        locale,
        title,
        promise,
        how,
        message,
        greet: messages.tutorGreet,
        refuse: messages.tutorRefuse,
        stay: messages.tutorStay,
        thanks: messages.tutorThanks,
      }),
    });
  }
  try {
    const text = await grokReply(
      tutorInstructions({ localeName: locale, title, promise, how, expert, narration }),
      message,
    );
    const spoken = text || fill(messages.tutorStay, { title, promise, how });
    return json({ text: spoken, utterance: issueUtterance(user.id, spoken, locale) });
  } catch {
    return json({
      text: localReply({
        locale,
        title,
        promise,
        how,
        message,
        greet: messages.tutorGreet,
        refuse: messages.tutorRefuse,
        stay: messages.tutorStay,
        thanks: messages.tutorThanks,
      }),
    });
  }
}
