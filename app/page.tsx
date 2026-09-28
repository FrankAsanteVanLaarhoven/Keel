import type { Metadata } from "next";
import Link from "next/link";
import { sections } from "@/lib/course/meta";
import { getPack } from "@/lib/course";
import { opsSections } from "@/lib/ops/meta";
import { getOps } from "@/lib/ops";
import { t } from "@/lib/i18n/catalog";
import { resolveLocale } from "@/lib/i18n/server";
import { lessonFigures } from "@/lib/course/figures";
import { Figure } from "@/components/figure";
import { ContinueLink } from "@/components/continue-link";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await resolveLocale();
  const m = t(locale);
  return {
    title: m.homeTitle,
    description: m.homeDeck,
    alternates: { canonical: "/" },
  };
}

export default async function HomePage() {
  const locale = await resolveLocale();
  const m = t(locale);
  const pack = getPack(locale);
  const ops = getOps(locale);
  const levelName = { ease: m.levelEase, practice: m.levelPractice, operator: m.levelOperator, expert: m.levelExpert };
  return (
    <div className="mx-auto max-w-6xl px-5 pb-28 pt-12 md:pt-20">
      <p className="kicker">{m.kicker}</p>
      <h1 className="mt-4 max-w-3xl text-5xl font-medium tracking-tight md:text-7xl">{m.homeTitle}</h1>
      <p className="mt-6 max-w-2xl text-xl leading-8">{m.homeDeck}</p>
      {lessonFigures(locale, "home").map((figure) => (
        <Figure key={figure.caption} caption={figure.caption} picture={figure.picture} />
      ))}
      <div className="mt-8 flex flex-wrap gap-3">
        <ContinueLink m={m} />
        <Link className="border border-line px-4 py-2 text-sm" href="/course">{m.seeCases}</Link>
        <Link className="border border-line px-4 py-2 text-sm" href="/ops">{m.openOps}</Link>
      </div>
      <section className="mt-16 grid gap-10 border-t border-line pt-10 md:grid-cols-2">
        <div>
          <h2 className="kicker">{m.knowledgeTitle}</h2>
          <ul className="mt-4 space-y-3">
            {[m.outcome1, m.outcome2, m.outcome3, m.outcome4].map((item) => (
              <li key={item} className="border-s border-line ps-4">{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="kicker">{m.skillTitle}</h2>
          <ul className="mt-4 space-y-3">
            {[m.outcome1, m.outcome2, m.outcome3, m.outcome4].map((item) => (
              <li key={item} className="border-s border-copper ps-4">{item}</li>
            ))}
          </ul>
        </div>
      </section>
      <section className="mt-16 max-w-3xl">
        <h2 className="text-3xl font-medium tracking-tight">{m.aboutTitle}</h2>
        <p className="mt-4 leading-8">{m.about1}</p>
        <p className="mt-4 leading-8">{m.about2}</p>
        <p className="mt-4 leading-8">{m.about3}</p>
      </section>
      <section className="mt-16">
        <h2 className="kicker">{m.topicsTitle}</h2>
        <ol className="mt-4 divide-y divide-line border-y border-line">
          {sections.map((section) => (
            <li key={section.id}>
              <Link className="flex items-baseline justify-between gap-6 py-4" href={`/course/${section.id}`}>
                <span>
                  <span className="num me-3 text-soft">{section.no}</span>
                  {pack.sections[section.id].title}
                </span>
                <span className="text-sm text-soft">{section.minutes} {m.minutes}</span>
              </Link>
            </li>
          ))}
          <li>
            <Link className="flex items-baseline justify-between gap-6 py-4" href="/brief">
              <span><span className="num me-3 text-soft">12</span>{pack.brief.title}</span>
              <span className="text-sm text-soft">{m.harborFile}</span>
            </Link>
          </li>
        </ol>
      </section>
      <section className="mt-16">
        <p className="kicker">{m.opsKicker}</p>
        <h2 className="mt-3 text-3xl font-medium tracking-tight">{m.opsTitle}</h2>
        <p className="mt-4 max-w-2xl leading-8">{m.opsDeck}</p>
        <ol className="mt-4 divide-y divide-line border-y border-line">
          {opsSections.map((section) => (
            <li key={section.id}>
              <Link className="flex items-baseline justify-between gap-6 py-4" href={`/ops/${section.id}`}>
                <span>
                  <span className="num me-3 text-soft">{section.no}</span>
                  {ops.sections[section.id].title}
                </span>
                <span className="text-sm text-soft">{levelName[section.level]}</span>
              </Link>
            </li>
          ))}
          <li>
            <Link className="flex items-baseline justify-between gap-6 py-4" href="/ops/brief">
              <span><span className="num me-3 text-soft">05</span>{ops.brief.title}</span>
            </Link>
          </li>
        </ol>
      </section>
    </div>
  );
}
