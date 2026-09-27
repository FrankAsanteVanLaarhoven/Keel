import type { Metadata } from "next";
import { briefDecisions } from "@/lib/course/meta";
import { getPack } from "@/lib/course";
import { t } from "@/lib/i18n/catalog";
import { resolveLocale } from "@/lib/i18n/server";
import { currentUser } from "@/lib/ready";
import { progressSummary } from "@/lib/store";
import { lessonFigures } from "@/lib/course/figures";
import { Figure } from "@/components/figure";
import { CaseForm } from "@/components/work";
import { SectionScope } from "@/components/keel-context";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await resolveLocale();
  const m = t(locale);
  const brief = getPack(locale).brief;
  return {
    title: `${brief.title} · ${m.file} ${m.harborFile}`,
    description: brief.dek,
    alternates: { canonical: "/brief" },
  };
}

export default async function BriefPage() {
  const locale = await resolveLocale();
  const m = t(locale);
  const brief = getPack(locale).brief;
  const user = await currentUser();
  const cases = user ? progressSummary(user.id, new Date().toISOString().slice(0, 10)).cases : 0;
  const locked = cases < 11;
  const decisions = briefDecisions.map((decision, index) => ({
    id: decision.id,
    prompt: brief.decisions[index]?.prompt ?? "",
    options: decision.optionIds.map((optionId, optionIndex) => ({
      id: optionId,
      text: brief.decisions[index]?.options[optionIndex] ?? "",
    })),
  }));
  return (
    <SectionScope scope={{ id: "brief", title: brief.title, narration: brief.narration, promise: brief.dek, how: brief.situation[0] }}>
      <article className="mx-auto w-full max-w-[42rem] px-5 pb-36 pt-10">
        <p className="kicker">{m.file} {m.harborFile}</p>
        <h1 className="mt-3 text-4xl font-medium tracking-tight md:text-5xl">{brief.title}</h1>
        <p className="mt-4 text-xl">{brief.dek}</p>
        {lessonFigures(locale, "brief").map((figure) => (
          <Figure key={figure.caption} caption={figure.caption} picture={figure.picture} />
        ))}
        {brief.situation.map((paragraph) => (
          <p key={paragraph} className="mt-4 leading-8">{paragraph}</p>
        ))}
        <p className="mt-6 text-sm text-soft">{locked ? m.briefLocked : m.briefReady}</p>
        <h2 className="mt-8 text-2xl font-medium">{m.task}</h2>
        <p className="mt-3">{brief.task}</p>
        <ol className="mt-4 list-decimal space-y-2 ps-5">
          {brief.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        {locked ? <p className="mt-8 border-s-2 border-copper ps-4">{m.lockedBody}</p> : null}
        <CaseForm decisions={decisions} noteLabel={brief.noteLabel} noteHint={brief.noteHint} m={m} brief locked={locked} />
      </article>
    </SectionScope>
  );
}
