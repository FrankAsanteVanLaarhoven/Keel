import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CscListen, CscWeekLab } from "@/components/csc1033-studio";
import { cscWeeks, weekById, type WeekId } from "@/lib/csc1033";

export function generateStaticParams() {
  return cscWeeks.map((week) => ({ id: week.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const week = weekById(id);
  if (!week) return { title: "CSC1033" };
  return {
    title: `CSC1033 week ${week.no}: ${week.title}`,
    description: week.promise,
  };
}

export default async function CscWeekPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const week = weekById(id);
  if (!week) notFound();
  const weekId = week.id as WeekId;
  return (
    <article className="mx-auto max-w-6xl px-5 pb-28 pt-12">
      <p className="kicker">CSC1033 · Week {week.no} of 12 · {week.badge}</p>
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <h1 className="max-w-3xl text-4xl font-medium tracking-tight">{week.title}</h1>
        <CscListen weekId={weekId} />
      </div>
      <p className="mt-4 max-w-3xl text-lg leading-8">{week.promise}</p>
      <p className="mt-4 text-sm text-soft">Week beginning {week.begins}</p>

      <section className="mt-10 border-t border-line pt-8">
        <h2 className="text-2xl font-medium">Weekly overview</h2>
        <p className="mt-4 max-w-3xl leading-8">{week.overview}</p>
      </section>

      <CscWeekLab weekId={weekId} part="tasks" />

      <section className="mt-10 border-t border-line pt-8">
        <h2 className="text-2xl font-medium">Lecture material</h2>
        <h3 className="mt-4 text-xl font-medium">{week.lectureTitle}</h3>
        <p className="mt-3 max-w-3xl leading-8">{week.lecture}</p>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <article className="rounded-lg border border-line p-4">
            <h3 className="text-sm font-medium">Primary literature</h3>
            <p className="mt-2 text-sm leading-6">{week.citation}</p>
          </article>
          <article className="rounded-lg border border-line p-4">
            <h3 className="text-sm font-medium">Syllabus alignment</h3>
            <p className="mt-2 text-sm leading-6">{week.syllabus}</p>
          </article>
          <article className="rounded-lg border border-line p-4">
            <h3 className="text-sm font-medium">Production reference</h3>
            <p className="mt-2 text-sm leading-6">{week.industry}</p>
          </article>
        </div>
        <h3 className="mt-8 text-xl font-medium">A plain account</h3>
        <p className="mt-3 max-w-3xl leading-8">{week.analogy}</p>
      </section>

      <section className="mt-10 border-t border-line pt-8">
        <h2 className="text-2xl font-medium">{week.practicalTitle}</h2>
        <p className="mt-4 max-w-3xl leading-8">{week.practical}</p>
      </section>

      <CscWeekLab weekId={weekId} part="lab" />

      <section className="mt-10 border-t border-line pt-8">
        <h2 className="text-2xl font-medium">Weekly review</h2>
        <p className="mt-4 max-w-3xl leading-8">{week.wrap}</p>
        <p className="mt-4 max-w-3xl leading-8 text-soft">{week.narration}</p>
        <p className="mt-6 flex flex-wrap gap-4 text-sm">
          <Link className="underline decoration-line underline-offset-4" href="/csc1033">All twelve weeks</Link>
          {week.no > 1 ? <Link className="underline decoration-line underline-offset-4" href={`/csc1033/w${week.no - 1}`}>Previous week</Link> : null}
          {week.no < 12 ? <Link className="underline decoration-line underline-offset-4" href={`/csc1033/w${week.no + 1}`}>Next week</Link> : null}
        </p>
      </section>
    </article>
  );
}
