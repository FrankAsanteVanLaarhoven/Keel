import type { Metadata } from "next";
import Link from "next/link";
import { listWork, ratings } from "@/lib/classbook";
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
  const profile = user ? getProfile(user.id) : null;
  const staff = isStaffOrAdmin(profile?.role, user?.email);
  const rows = user ? progressSummary(user.id, new Date().toISOString().slice(0, 10)).rows : [];
  const catalogue = listWork();
  const scores = ratings();
  const suggestion = recommendWeeks(rows, scores.map((item) => ({ weekId: item.weekId, stars: item.stars })));
  return (
    <div className="mx-auto max-w-6xl px-5 pb-28 pt-12">
      <p className="kicker">{m.termNav}</p>
      <h1 className="mt-3 text-4xl font-medium tracking-tight md:text-6xl">{m.termTitle}</h1>
      <p className="mt-4 max-w-2xl text-lg">{m.termDeck}</p>
      {suggestion.next ? (
        <p className="mt-6">
          {m.next}: <Link className="underline" href={`/term/${suggestion.next.id}`}>{suggestion.next.title}</Link>
        </p>
      ) : null}
      {suggestion.rated ? (
        <p className="mt-2 text-soft">
          {m.recommended}: <Link className="underline" href={`/term/${suggestion.rated.id}`}>{suggestion.rated.title}</Link>
        </p>
      ) : null}
      <ol className="mt-10 divide-y divide-line border-y border-line">
        {weeks.map((week) => {
          const work = catalogue.find((item) => item.id === week.id) ?? null;
          const window = workOpen(work, Date.now());
          const ready = staff || (window.open && (week.no === 1 || previousWeeksDone(week, rows)));
          const done = weekDone(week, rows);
          const score = scores.find((item) => item.weekId === week.id);
          return (
            <li key={week.id} className="grid gap-2 py-5 md:grid-cols-[5rem_1fr_auto] md:items-baseline">
              <span className="num text-soft">{String(week.no).padStart(2, "0")}</span>
              <div>
                {ready ? (
                  <Link className="text-2xl font-medium" href={`/term/${week.id}`}>{work?.title || week.title}</Link>
                ) : (
                  <p className="text-2xl font-medium text-soft">{work?.title || week.title}</p>
                )}
                <p className="mt-2 max-w-2xl text-soft">{work?.brief || week.promise}</p>
              </div>
              <p className="text-sm text-soft">
                {done ? m.acceptedLabel : ready ? m.weekOpen : window.reason === "paused" ? m.weekPaused : m.weekLocked}
                {score ? <span className="ms-3 num">{score.stars.toFixed(1)}</span> : null}
              </p>
            </li>
          );
        })}
      </ol>
      <p className="mt-8">
        <Link className="underline" href="/survey">{m.surveyTitle}</Link>
      </p>
    </div>
  );
}
