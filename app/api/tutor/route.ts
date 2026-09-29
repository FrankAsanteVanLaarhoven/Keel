import { getPack } from "@/lib/course";
import { sectionById } from "@/lib/course/meta";
import { getOps } from "@/lib/ops";
import { opsById } from "@/lib/ops/meta";
import { guard, json } from "@/lib/http";
import { t } from "@/lib/i18n/catalog";
import { resolveLocale } from "@/lib/i18n/server";
import { userFrom } from "@/lib/ready";
import { aiReply, hasTts, issueUtterance, liveEnabled, tutorInstructions } from "@/lib/server/live";
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
  const opsPack = getOps(locale);
  const ops = body.sectionId ? opsById(body.sectionId) : undefined;
  const section = body.sectionId && body.sectionId !== "programme" && body.sectionId !== "brief" && !ops ? sectionById(body.sectionId) : undefined;
  const opsBrief = body.sectionId === "northline";
  const title = ops
    ? opsPack.sections[ops.id].title
    : opsBrief
      ? opsPack.brief.title
      : section
        ? pack.sections[section.id].title
        : body.sectionId === "brief"
          ? pack.brief.title
          : messages.homeTitle;
  const promise = ops
    ? opsPack.sections[ops.id].promise
    : opsBrief
      ? opsPack.brief.dek
      : section
        ? pack.sections[section.id].promise
        : body.sectionId === "brief"
          ? pack.brief.dek
          : messages.homeDeck;
  const how = ops ? opsPack.sections[ops.id].how[0] : opsBrief ? opsPack.brief.situation[0] : section ? pack.sections[section.id].how[0] : messages.about2;
  const narration = ops
    ? opsPack.sections[ops.id].narration
    : opsBrief
      ? opsPack.brief.narration
      : section
        ? pack.sections[section.id].narration
        : body.sectionId === "brief"
          ? pack.brief.narration
          : messages.programmeNarration;
  const expert = ops ? opsPack.sections[ops.id].expert.join(" ") : opsBrief ? opsPack.brief.task : section ? pack.sections[section.id].expert.join(" ") : messages.about3;
  if (!(await getConsent(user.id)) || !liveEnabled()) {
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
    const text = await aiReply(
      tutorInstructions({ localeName: locale, title, promise, how, expert, narration }),
      message,
    );
    const spoken = text || fill(messages.tutorStay, { title, promise, how });
    const utterance = hasTts() ? issueUtterance(user.id, spoken, locale) : undefined;
    return json({ text: spoken, utterance });
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
