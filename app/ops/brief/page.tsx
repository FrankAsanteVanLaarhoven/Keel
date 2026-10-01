import type { Metadata } from "next";
import { opsBriefDecisions, opsPictures } from "@/lib/ops/meta";
import { opsCasesAccepted } from "@/lib/ops/gates";
import { getOps } from "@/lib/ops";
import { t } from "@/lib/i18n/catalog";
import { resolveLocale } from "@/lib/i18n/server";
import { currentUser } from "@/lib/ready";
import { listProgress } from "@/lib/store";
import { Figure } from "@/components/figure";
import { CaseForm } from "@/components/work";
import { SectionScope } from "@/components/keel-context";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await resolveLocale();
  const brief = getOps(locale).brief;
  return { title: brief.title, description: brief.dek };
}

export default async function OpsBriefPage() {
  const locale = await resolveLocale();
  const m = t(locale);
  const brief = getOps(locale).brief;
  const user = await currentUser();
  const accepted = user ? opsCasesAccepted(await listProgress(user.id)) : 0;
  const locked = accepted < 4;
  const decisions = opsBriefDecisions.map((decision, index) => ({
    id: decision.id,
    prompt: brief.decisions[index]?.prompt ?? "",
    options: decision.optionIds.map((optionId, optionIndex) => ({
      id: optionId,
      text: brief.decisions[index]?.options[optionIndex] ?? "",
    })),
  }));
  return (
    <SectionScope scope={{ id: "northline", title: brief.title, narration: brief.narration, promise: brief.dek, how: brief.situation[0] }}>
      <article className="mx-auto w-full max-w-[42rem] px-5 pb-36 pt-10">
        <p className="kicker">{m.opsBriefKicker} · NL-05</p>
        <h1 className="mt-3 text-4xl font-medium tracking-tight md:text-5xl">{brief.title}</h1>
        <p className="mt-4 text-xl">{brief.dek}</p>
        <Figure caption={brief.figure} picture={opsPictures.brief} />
        {brief.situation.map((paragraph) => (
          <p key={paragraph} className="mt-4 leading-8">{paragraph}</p>
        ))}
        <p className="mt-6 text-sm text-soft">{locked ? m.opsBriefLocked : m.opsBriefReady}</p>
        <h2 className="mt-8 text-2xl font-medium">{m.task}</h2>
        <p className="mt-3">{brief.task}</p>
        <ol className="mt-4 list-decimal space-y-2 ps-5">
          {brief.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <p className="mt-4 text-sm text-soft">{m.fictional}</p>
        {locked ? <p className="mt-8 border-s-2 border-copper ps-4">{m.opsBriefLocked}</p> : null}
        <CaseForm
          decisions={decisions}
          noteLabel={brief.noteLabel}
          noteHint={brief.noteHint}
          m={m}
          gradeKind="ops-brief"
          locked={locked}
          lockedText={m.opsBriefLocked}
        />
      </article>
    </SectionScope>
  );
}
