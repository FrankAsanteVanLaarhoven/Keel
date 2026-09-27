import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sectionById } from "@/lib/course/meta";
import { getPack } from "@/lib/course";
import { t } from "@/lib/i18n/catalog";
import { resolveLocale } from "@/lib/i18n/server";
import { BenchForm } from "@/components/work";
import { SectionScope } from "@/components/keel-context";
import { Figure } from "@/components/figure";
import { lessonFigures } from "@/lib/course/figures";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const meta = sectionById(id);
  if (!meta) return { title: "Bench" };
  const locale = await resolveLocale();
  const copy = getPack(locale).sections[meta.id];
  const m = t(locale);
  return {
    title: `${m.bench} · ${copy.title}`,
    description: copy.benchPrompt,
    alternates: { canonical: `/course/${meta.id}/bench` },
  };
}

export default async function BenchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const meta = sectionById(id);
  if (!meta) notFound();
  const locale = await resolveLocale();
  const copy = getPack(locale).sections[meta.id];
  const m = t(locale);
  const bench = meta.bench;
  const slots = bench.kind === "label" ? bench.slots.map((slot, index) => ({ id: slot, text: copy.benchSlots[index] ?? slot })) : [];
  const picture = lessonFigures(locale, meta.id)[0];
  return (
    <SectionScope scope={{ id: meta.id, title: copy.title, narration: copy.narration, promise: copy.promise, how: copy.how[0] }}>
      <div className="mx-auto w-full max-w-[42rem] px-5 pb-36 pt-10">
        <p className="kicker">{m.practiceTitle} · {meta.no}</p>
        {picture ? <Figure caption={picture.caption} picture={picture.picture} /> : null}
        <BenchForm
          sectionId={meta.id}
          title={copy.benchTitle}
          prompt={copy.benchPrompt}
          kind={bench.kind}
          items={bench.ids.map((item, index) => ({ id: item, text: copy.benchItems[index] ?? item }))}
          slots={slots}
          choose={bench.kind === "multi" ? bench.choose : undefined}
          m={m}
        />
        <SubmitSectionLink metaId={meta.id} startCaseText={m.startCase} />
      </div>
    </SectionScope>
  );
}

function SubmitSectionLink({ metaId, startCaseText }: { metaId: string; startCaseText: string }) {
  const foundryChallengeMap: Record<string, string> = {
    tiers: "c2_design",
    integration: "c3_cicd",
    scale: "c4_scale",
    observe: "c5_observability",
    security: "c1_security",
  };
  const foundryChallenge = foundryChallengeMap[metaId];

  return (
    <>
      {foundryChallenge ? (
        <div className="mt-8 rounded-xl border border-line bg-raised/70 p-4">
          <p className="text-xs uppercase font-bold tracking-wider text-copper">Interactive Systems Foundry</p>
          <p className="mt-1 text-sm text-ink">Practice this architecture hands-on with live 2D/3D dataflow and chaos simulation.</p>
          <Link
            href={`/foundry?challenge=${foundryChallenge}`}
            className="mt-3 inline-flex items-center gap-2 rounded-lg border border-line bg-paper px-3 py-1.5 text-xs font-semibold text-ink hover:border-copper transition-colors"
          >
            <span>⚡</span> Launch in Interactive Foundry
          </Link>
        </div>
      ) : null}
      <p className="mt-8 text-sm">
        <Link className="underline decoration-line underline-offset-4" href={`/course/${metaId}/case`}>
          {startCaseText}
        </Link>
      </p>
    </>
  );
}
