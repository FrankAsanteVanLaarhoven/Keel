import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { nextSectionId, sectionById } from "@/lib/course/meta";
import { getPack } from "@/lib/course";
import { t } from "@/lib/i18n/catalog";
import { resolveLocale } from "@/lib/i18n/server";
import { lessonFigures } from "@/lib/course/figures";
import { Figure } from "@/components/figure";
import { CaseForm } from "@/components/work";
import { SectionScope } from "@/components/keel-context";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const meta = sectionById(id);
  if (!meta) return { title: "Case" };
  const locale = await resolveLocale();
  const copy = getPack(locale).sections[meta.id];
  const m = t(locale);
  return {
    title: `${m.capstone} ${copy.caseFile} · ${copy.title}`,
    description: copy.caseTask,
    alternates: { canonical: `/course/${meta.id}/case` },
  };
}

export default async function CasePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const meta = sectionById(id);
  if (!meta) notFound();
  const locale = await resolveLocale();
  const copy = getPack(locale).sections[meta.id];
  const m = t(locale);
  const next = nextSectionId(meta.id);
  const decisions = meta.decisions.map((decision, index) => ({
    id: decision.id,
    prompt: copy.decisions[index]?.prompt ?? "",
    options: decision.optionIds.map((optionId, optionIndex) => ({
      id: optionId,
      text: copy.decisions[index]?.options[optionIndex] ?? "",
    })),
  }));
  return (
    <SectionScope scope={{ id: meta.id, title: copy.title, narration: copy.narration, promise: copy.promise, how: copy.how[0] }}>
      <article className="mx-auto w-full max-w-[42rem] px-5 pb-36 pt-10">
        <p className="kicker">{m.file} {copy.caseFile}</p>
        <h1 className="mt-3 text-4xl font-medium tracking-tight">{copy.caseTitle}</h1>
        <p className="mt-2 text-soft">{copy.caseOrg}</p>
        <p className="mt-6 text-sm text-soft">{m.fictional}</p>
        {lessonFigures(locale, meta.id).slice(0, 1).map((figure) => (
          <Figure key={figure.caption} caption={figure.caption} picture={figure.picture} />
        ))}
        <h2 className="mt-8 text-2xl font-medium">{m.situation}</h2>
        {copy.caseSituation.map((paragraph) => (
          <p key={paragraph} className="mt-3 leading-8">{paragraph}</p>
        ))}
        <h2 className="mt-8 text-2xl font-medium">{m.task}</h2>
        <p className="mt-3 leading-8">{copy.caseTask}</p>
        <h2 className="kicker mt-8">{m.steps}</h2>
        <ol className="mt-3 list-decimal space-y-2 ps-5">
          {copy.caseSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <CaseForm sectionId={meta.id} decisions={decisions} noteLabel={copy.noteLabel} noteHint={copy.noteHint} m={m} />
        <p className="mt-8 text-sm">
          <Link className="underline decoration-line underline-offset-4" href={next === "brief" ? "/brief" : `/course/${next ?? ""}`}>
            {m.next}
          </Link>
        </p>
      </article>
    </SectionScope>
  );
}
