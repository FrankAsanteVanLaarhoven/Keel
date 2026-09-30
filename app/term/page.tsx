import type { Metadata } from "next";
import Link from "next/link";
import { listAnnouncements, listCourses, listWork, ratings } from "@/lib/classbook";
import { t } from "@/lib/i18n/catalog";
import { resolveLocale } from "@/lib/i18n/server";
import { currentUser } from "@/lib/ready";
import { isStaffOrAdmin } from "@/lib/security";
import { getProfile, progressSummary } from "@/lib/store";
import { previousWeeksDone, recommendWeeks, weekDone, weeks, workOpen } from "@/lib/term";

export async function generateMetadata(): Promise<Metadata> {
  const m = t(await resolveLocale());
  return { title: `${m.termTitle} — Keel`, description: m.termDeck, robots: { index: false, follow: false } };
}

export default async function TermPage() {
  const locale = await resolveLocale();
  const m = t(locale);
  const user = await currentUser();
  const profile = user ? await getProfile(user.id) : null;
  const staff = isStaffOrAdmin(profile?.role, user?.email);
  const rows = user ? (await progressSummary(user.id, new Date().toISOString().slice(0, 10))).rows : [];
  const catalogue = await listWork();
  const scores = await ratings();
  const suggestion = recommendWeeks(rows, scores.map((item) => ({ weekId: item.weekId, stars: item.stars })));
  return (
    <div className="mx-auto max-w-6xl px-5 pb-28 pt-12">
      <p className="kicker">{m.termNav}</p>
      <h1 className="mt-3 text-4xl font-medium tracking-tight md:text-6xl">{m.termTitle}</h1>
      <p className="mt-4 max-w-2xl text-lg">{m.termDeck}</p>
      <ol className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {weeks.map((week) => {
          const work = catalogue.find((item) => item.id === week.id) ?? null;
          const window = workOpen(work, Date.now());
          const sequenceOpen = week.no === 1 || previousWeeksDone(week, rows);
          const ready = staff || (window.open && sequenceOpen);
          const done = weekDone(week, rows);
          const current = ready && !done && suggestion.next?.id === week.id;
          const held = !staff && !window.open;
          const note = done ? m.acceptedLabel : current ? m.thisWeek : ready ? m.weekOpen : held ? m.weekPaused : m.weekLocked;
          const score = scores.find((item) => item.weekId === week.id);
          const body = (
            <>
              <span className="flex items-baseline justify-between gap-3">
                <span className="num">{String(week.no).padStart(2, "0")}</span>
                <span className="kicker">{note}</span>
              </span>
              <span className="mt-3 block text-xl font-medium">{work?.title || week.title}</span>
              <span className="mt-2 block text-sm text-soft">{work?.brief || week.promise}</span>
              {score ? <span className="num mt-3 block text-sm">{score.stars.toFixed(1)}</span> : null}
            </>
          );
          const frame = current
            ? "block border border-ink bg-raised px-4 py-4"
            : done
              ? "block border border-line px-4 py-4"
              : ready
                ? "block border border-line px-4 py-4"
                : "block border border-line px-4 py-4 text-soft";
          return (
            <li key={week.id}>
              {ready || done ? (
                <Link className={frame} href={`/term/${week.id}`} aria-current={current ? "true" : undefined}>{body}</Link>
              ) : (
                <div className={frame} aria-disabled="true">{body}</div>
              )}
            </li>
          );
        })}
      </ol>
      <p className="mt-8"><a className="underline" href="/api/calendar">{m.calendarImport}</a></p>
      <p className="mt-2 max-w-2xl text-sm text-soft">{m.calendarHelp}</p>
      <Announcements m={m} />
      <Courses m={m} />
      {suggestion.rated ? (
        <p className="mt-6 text-soft">
          {m.recommended}: <Link className="underline" href={`/term/${suggestion.rated.id}`}>{suggestion.rated.title}</Link>
        </p>
      ) : null}
      <p className="mt-8">
        <Link className="underline" href="/survey">{m.surveyTitle}</Link>
      </p>
    </div>
  );
}

async function Announcements({ m }: { m: ReturnType<typeof t> }) {
  const notes = (await listAnnouncements()).filter((note) => note.status === "published");
  if (!notes.length) return null;
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-medium">{m.announcement}</h2>
      <ul className="mt-4 space-y-4">
        {notes.map((note) => (
          <li key={note.id} className="border border-line px-4 py-3">
            <p className="font-medium">{note.title}</p>
            <p className="mt-2">{note.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

async function Courses({ m }: { m: ReturnType<typeof t> }) {
  const courses = (await listCourses()).filter((course) => workOpen(course, Date.now()).open);
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-medium">{m.publishedCourses}</h2>
      {courses.length === 0 ? <p className="mt-3 text-soft">{m.noCourses}</p> : null}
      <ul className="mt-4 divide-y divide-line border-y border-line">
        {courses.map((course) => (
          <li key={course.id} className="py-4">
            <Link className="text-xl font-medium" href={`/term/course/${course.id}`}>{course.title}</Link>
            <p className="mt-2 text-soft">{course.summary}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
