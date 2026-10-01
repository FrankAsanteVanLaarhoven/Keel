import type { Metadata } from "next";
import Link from "next/link";
import { FOUNDRY_HELP } from "@/lib/foundry-help";

export const metadata: Metadata = {
  title: "Foundry help",
  description: "Where to read the Foundry guide, open a sample drawing, and read the Apache-2.0 grant. There is no license key.",
  alternates: { canonical: "/foundry/help" },
  robots: { index: false, follow: false },
};

export default function FoundryHelpPage() {
  return (
    <div id="content" className="mx-auto max-w-3xl px-5 pb-28 pt-12">
      <p className="text-xs font-semibold uppercase tracking-wider text-soft">Foundry</p>
      <h1 className="mt-3 text-4xl font-medium tracking-tight text-ink">Foundry help</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-ink">
        This page points at the guide, the sample drawings on the desk, the extension calls, and the Apache-2.0 grant.
      </p>
      <p className="mt-4 flex flex-wrap gap-x-6">
        <Link className="inline-flex min-h-11 items-center underline decoration-line underline-offset-4" href="/foundry">Back to Foundry</Link>
        <Link className="inline-flex min-h-11 items-center underline decoration-line underline-offset-4" href="/foundry/guide">Foundry guide</Link>
      </p>

      {FOUNDRY_HELP.map((section) => (
        <section key={section.id} id={section.id} className="mt-12 scroll-mt-24 border-t border-line pt-8">
          <h2 className="text-2xl font-medium text-ink">{section.title}</h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph} className="mt-3 max-w-2xl leading-8 text-ink">{paragraph}</p>
          ))}
          {section.points ? (
            <ul className="mt-3 max-w-2xl list-disc space-y-2 pl-5 leading-7 text-ink">
              {section.points.map((point) => <li key={point}>{point}</li>)}
            </ul>
          ) : null}
          {section.links ? (
            <ul className="mt-3">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link className="inline-flex min-h-11 items-center underline decoration-line underline-offset-4" href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}
    </div>
  );
}
