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
        <p className="mt-8 text-sm">
          <Link className="underline decoration-line underline-offset-4" href={`/course/${meta.id}/case`}>{m.startCase}</Link>
        </p>
      </div>
    </SectionScope>
  );
}
