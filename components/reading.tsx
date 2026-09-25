import Link from "next/link";
import { lessonFigures } from "@/lib/course/figures";
import { nextSectionId, type SectionMeta } from "@/lib/course/meta";
import type { SectionCopy } from "@/lib/course/types";
import type { Locale } from "@/lib/locale";
import type { Messages } from "@/lib/i18n/en";
import { Figure } from "./figure";
import { CheckForm, LikeButton } from "./work";

export function Reading({
  meta,
  copy,
  m,
  locale,
}: {
  meta: SectionMeta;
  copy: SectionCopy;
  m: Messages;
  locale: Locale;
}) {
  const next = nextSectionId(meta.id);
  const nextHref = next === "brief" ? "/brief" : next ? `/course/${next}` : "/course";
  const figures = lessonFigures(locale, meta.id);
  return (
    <article className="mx-auto w-full max-w-[42rem] px-5 pb-36 pt-10">
      <p className="kicker">
        {m.section} {meta.no} · {meta.minutes} {m.minutes}
      </p>
      <h1 className="mt-3 text-4xl font-medium tracking-tight md:text-5xl">{copy.title}</h1>
      <p className="mt-4 text-xl leading-snug text-ink">{copy.promise}</p>
      <h2 className="kicker mt-10">{m.objectives}</h2>
      <ul className="mt-3 space-y-2">
        {copy.objectives.map((item) => (
          <li key={item} className="border-s border-copper ps-4">
            {item}
          </li>
        ))}
      </ul>
      <Section heading={m.depthStart} paragraphs={copy.start} />
      {figures[0] ? <Figure caption={figures[0].caption} picture={figures[0].picture} /> : null}
      <Section heading={m.depthHow} paragraphs={copy.how} />
      {figures[1] ? <Figure caption={figures[1].caption} picture={figures[1].picture} /> : null}
      <Section heading={m.depthExpert} paragraphs={copy.expert} />
      <Section heading={`${m.example} · Harbor Market`} paragraphs={copy.example} />
      <CheckForm
        kind="check"
        sectionId={meta.id}
        prompt={copy.checkPrompt}
        options={meta.checkIds.map((id, index) => ({ id, text: copy.checkOptions[index] ?? "" }))}
        m={m}
      />
      <div className="mt-10 flex flex-wrap gap-3">
        <LikeButton sectionId={meta.id} m={m} />
        <Link className="border border-line px-4 py-2 text-sm" href={`/course/${meta.id}/bench`}>
          {m.openPractice}
        </Link>
        <Link className="border border-ink bg-ink px-4 py-2 text-sm text-paper" href={`/course/${meta.id}/case`}>
          {m.startCase}
        </Link>
      </div>
      <p className="mt-8 text-sm text-soft">
        <Link className="underline decoration-line underline-offset-4" href={nextHref}>
          {m.next}
        </Link>
      </p>
    </article>
  );
}

function Section({ heading, paragraphs }: { heading: string; paragraphs: string[] }) {
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-medium tracking-tight">{heading}</h2>
      {paragraphs.map((paragraph) => (
        <p key={paragraph} className="mt-3 text-[1.05rem] leading-8">
          {paragraph}
        </p>
      ))}
    </section>
  );
}
