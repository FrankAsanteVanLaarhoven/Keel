import type { Metadata } from "next";
import Link from "next/link";
import { opsPictures, opsSections } from "@/lib/ops/meta";
import { getOps } from "@/lib/ops";
import { t } from "@/lib/i18n/catalog";
import { resolveLocale } from "@/lib/i18n/server";
import { Figure } from "@/components/figure";
import { OpsLevel, OpsMarks } from "@/components/ops-walk";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await resolveLocale();
  const m = t(locale);
  return { title: `${m.opsTitle} — Keel`, description: m.opsDeck };
}

export default async function OpsPage() {
  const locale = await resolveLocale();
  const m = t(locale);
  const pack = getOps(locale);
  const levelName = { ease: m.levelEase, practice: m.levelPractice, operator: m.levelOperator, expert: m.levelExpert };
  return (
    <div className="mx-auto max-w-6xl px-5 pb-28 pt-12">
      <p className="kicker">{m.opsKicker}</p>
      <h1 className="mt-3 max-w-3xl text-4xl font-medium tracking-tight md:text-6xl">{m.opsTitle}</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8">{m.opsDeck}</p>
      <p className="mt-4 max-w-2xl leading-8">{m.opsAbout}</p>
      <OpsLevel m={m} />
      <section className="mt-10 border-t border-line pt-8">
        <h2 className="kicker">{m.weekShape}</h2>
        <ul className="mt-4 grid gap-4 md:grid-cols-3">
          {[m.weekRead, m.weekLab, m.weekFile].map((item) => (
            <li key={item} className="border-s border-line ps-4">{item}</li>
          ))}
        </ul>
      </section>
      <Figure caption={pack.sections.devops.figure} picture={opsPictures.devops} />
      <ol className="mt-6 divide-y divide-line border-y border-line">
        {opsSections.map((section) => {
          const copy = pack.sections[section.id];
          return (
            <li key={section.id} className="grid gap-3 py-6 md:grid-cols-[5rem_1fr] md:items-baseline">
              <span className="num text-soft">{section.no}</span>
              <div>
                <p className="kicker">{levelName[section.level]}</p>
                <Link className="text-2xl font-medium" href={`/ops/${section.id}`}>{copy.title}</Link>
                <p className="mt-2 max-w-2xl text-soft">{copy.promise}</p>
                <OpsMarks id={section.id} m={m} />
              </div>
            </li>
          );
        })}
      </ol>
      <p className="mt-8">
        <Link className="text-2xl font-medium" href="/ops/brief">{pack.brief.title}</Link>
        <span className="ms-3 text-sm text-soft">NL-05</span>
      </p>
    </div>
  );
}
