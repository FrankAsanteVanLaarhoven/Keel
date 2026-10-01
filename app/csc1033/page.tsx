import type { Metadata } from "next";
import Link from "next/link";
import { CscLadder } from "@/components/csc1033-studio";
import { cscWeeks, tiers } from "@/lib/csc1033";
import { t } from "@/lib/i18n/catalog";
import { resolveLocale } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await resolveLocale();
  const m = t(locale);
  return { title: m.cscTitle, description: m.cscDeck };
}

export default async function CscPage() {
  const locale = await resolveLocale();
  const m = t(locale);
  return (
    <div className="mx-auto max-w-6xl px-5 pb-28 pt-12">
      <p className="kicker">CSC1033</p>
      <h1 className="mt-3 max-w-3xl text-4xl font-medium tracking-tight md:text-6xl">{m.cscTitle}</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8">{m.cscDeck}</p>

      <section className="mt-12 border-t border-line pt-8">
        <h2 className="text-2xl font-medium">Module information</h2>
        <p className="mt-4 max-w-3xl leading-8">CSC1033 on Keel is a twelve-week database module, from how a machine stores a fact to how an organisation decides what a model may learn from those facts. The running example is Harbor Library. The patrons, loans, and balances are fictional. Each week has a reading, a lecture, a practical, a live exercise, and a mastery check.</p>
        <p className="mt-4 max-w-3xl leading-8">The Foundry is the drawing studio for the module: entity-relationship diagrams, UML, and the AI design elements used when a later week talks about a model, a dataset, or a guard. Passing a check records the tier on this browser.</p>
      </section>

      <section className="mt-10 border-t border-line pt-8">
        <h2 className="text-2xl font-medium">Module contacts</h2>
        <p className="mt-4 max-w-3xl leading-8">This page does not list a room, a phone number, or a personal address. Questions about the class go to a teacher through Class. Sign in if you need the class book.</p>
        <p className="mt-4 flex flex-wrap gap-4 text-sm">
          <Link className="underline decoration-line underline-offset-4" href="/teach">Class</Link>
          <Link className="underline decoration-line underline-offset-4" href="/sign-in">Sign in</Link>
        </p>
      </section>

      <section className="mt-10 border-t border-line pt-8">
        <h2 className="text-2xl font-medium">From foundation to architect</h2>
        <p className="mt-3 max-w-3xl leading-8">Eight tiers. A tier is proven when every week it names has a recorded check.</p>
        <CscLadder />
      </section>

      <section className="mt-10 border-t border-line pt-8">
        <h2 className="text-2xl font-medium">The twelve weeks</h2>
        <ol className="mt-4 divide-y divide-line border-y border-line">
          {cscWeeks.map((week) => (
            <li key={week.id}>
              <Link className="grid gap-2 py-4 md:grid-cols-[7rem_1fr_auto] md:items-baseline" href={`/csc1033/${week.id}`}>
                <span className="num text-soft">{String(week.no).padStart(2, "0")}</span>
                <span>
                  <span className="block font-medium">{week.title}</span>
                  <span className="mt-1 block text-sm text-soft">Week beginning {week.begins} · {week.badge}</span>
                </span>
                <span className="text-sm text-soft">{tiers.find((tier) => tier.weeks.includes(week.id))?.name}</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
