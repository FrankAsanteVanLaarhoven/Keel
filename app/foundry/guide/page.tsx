import type { Metadata } from "next";
import Link from "next/link";
import { FOUNDRY_GUIDE } from "@/lib/foundry-guide";

export const metadata: Metadata = {
  title: "Foundry guide",
  description: "How to draw, check, sketch, and extend a Foundry project in Keel.",
  alternates: { canonical: "/foundry/guide" },
  robots: { index: false, follow: false },
};

export default function FoundryGuidePage() {
  return (
    <div id="content" className="mx-auto max-w-3xl px-5 pb-28 pt-12">
      <p className="text-xs font-semibold uppercase tracking-wider text-soft">Foundry</p>
      <h1 className="mt-3 text-4xl font-medium tracking-tight text-ink">Foundry guide</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-ink">
        This guide explains the drawing desk: the project, the diagrams, the checks, and the extensions kept in this browser.
      </p>
      <p className="mt-4">
        <Link className="inline-flex min-h-11 items-center underline decoration-line underline-offset-4" href="/foundry">Back to Foundry</Link>
        <Link className="ml-6 inline-flex min-h-11 items-center underline decoration-line underline-offset-4" href="/foundry/help">Help</Link>
      </p>

      <nav aria-label="Guide contents" className="mt-10 border-t border-line pt-8">
        {FOUNDRY_GUIDE.map((chapter) => (
          <div key={chapter.id} className="mt-6 first:mt-0">
            <p className="text-sm font-semibold uppercase tracking-wider text-soft">{chapter.title}</p>
            <ul className="mt-2">
              {chapter.sections.map((section) => (
                <li key={section.id}>
                  <a className="inline-flex min-h-11 items-center text-sm underline decoration-line underline-offset-4" href={`#${section.id}`}>{section.title}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {FOUNDRY_GUIDE.map((chapter) => (
        <section key={chapter.id} className="mt-12 border-t border-line pt-8" aria-labelledby={`${chapter.id}-title`}>
          <h2 id={`${chapter.id}-title`} className="text-2xl font-medium text-ink">{chapter.title}</h2>
          {chapter.sections.map((section) => (
            <section key={section.id} id={section.id} className="mt-8 scroll-mt-24">
              <h3 className="text-xl font-medium text-ink">{section.title}</h3>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="mt-3 max-w-2xl leading-8 text-ink">{paragraph}</p>
              ))}
              {section.points ? (
                <ul className="mt-3 max-w-2xl list-disc space-y-2 pl-5 leading-7 text-ink">
                  {section.points.map((point) => <li key={point}>{point}</li>)}
                </ul>
              ) : null}
            </section>
          ))}
        </section>
      ))}
    </div>
  );
}
