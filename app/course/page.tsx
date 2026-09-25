import Link from "next/link";
import { sections } from "@/lib/course/meta";
import { getPack } from "@/lib/course";
import { t } from "@/lib/i18n/catalog";
import { resolveLocale } from "@/lib/i18n/server";
import { Marks } from "@/components/marks";
import { Figure } from "@/components/figure";
import { lessonFigures } from "@/lib/course/figures";

export default async function CoursePage() {
  const locale = await resolveLocale();
  const m = t(locale);
  const pack = getPack(locale);
  return (
    <div className="mx-auto max-w-6xl px-5 pb-28 pt-12">
      <p className="kicker">{m.cases}</p>
      <h1 className="mt-3 text-4xl font-medium tracking-tight md:text-6xl">{m.youWillMake}</h1>
      <p className="mt-4 max-w-2xl text-lg">{m.about3}</p>
      {lessonFigures(locale, "home").map((figure) => (
        <Figure key={figure.caption} caption={figure.caption} picture={figure.picture} />
      ))}
      <ol className="mt-10 divide-y divide-line border-y border-line">
        {sections.map((section) => {
          const copy = pack.sections[section.id];
          return (
            <li key={section.id} className="grid gap-3 py-6 md:grid-cols-[5rem_1fr_auto] md:items-baseline">
              <span className="num text-soft">{section.no}</span>
              <div>
                <Link className="text-2xl font-medium" href={`/course/${section.id}`}>{copy.title}</Link>
                <p className="mt-2 max-w-2xl text-soft">{copy.promise}</p>
                <p className="mt-3 flex flex-wrap gap-4 text-sm">
                  <Link className="underline decoration-line underline-offset-4" href={`/course/${section.id}/bench`}>{m.bench}</Link>
                  <Link className="underline decoration-line underline-offset-4" href={`/course/${section.id}/case`}>{m.capstone} {copy.caseFile}</Link>
                </p>
              </div>
              <Marks id={section.id} m={m} minutes={section.minutes} />
            </li>
          );
        })}
      </ol>
    </div>
  );
}
