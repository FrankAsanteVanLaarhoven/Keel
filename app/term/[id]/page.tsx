import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { WeekTools } from "@/components/term-desk";
import { filesFor, listWork, reviewsFor } from "@/lib/classbook";
import { t } from "@/lib/i18n/catalog";
import { resolveLocale } from "@/lib/i18n/server";
import { currentUser } from "@/lib/ready";
import { isStaffOrAdmin } from "@/lib/security";
import { getProfile, progressSummary } from "@/lib/store";
import { previousWeeksDone, weekById, weekDone, workOpen } from "@/lib/term";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const week = weekById(id);
  return { title: week ? `${week.title} — Keel` : "Keel", robots: { index: false, follow: false } };
}

export default async function WeekPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const week = weekById(id);
  if (!week) notFound();
  const locale = await resolveLocale();
  const m = t(locale);
  const user = await currentUser();
  const profile = user ? await getProfile(user.id) : null;
  const staff = isStaffOrAdmin(profile?.role, user?.email);
  const rows = user ? (await progressSummary(user.id, new Date().toISOString().slice(0, 10))).rows : [];
  const work = (await listWork()).find((item) => item.id === week.id) ?? null;
  const window = workOpen(work, Date.now());
  const ready = staff || (window.open && (week.no === 1 || previousWeeksDone(week, rows)));
  const files = user ? await filesFor(week.id, user.id, staff) : [];
  const reviews = user ? await reviewsFor(week.id, user.id, staff) : [];
  return (
    <article className="mx-auto w-full max-w-[42rem] px-5 pb-36 pt-10">
      <p className="kicker">{m.termNav} · {String(week.no).padStart(2, "0")}</p>
      <h1 className="mt-3 text-4xl font-medium tracking-tight">{work?.title || week.title}</h1>
      <p className="mt-4 text-xl">{work?.brief || week.promise}</p>
      <p className="mt-4 text-sm text-soft">{weekDone(week, rows) ? m.acceptedLabel : ready ? m.weekOpen : m.weekLocked}</p>
      {ready ? (
        <p className="mt-6">
          <Link className="border border-ink bg-ink px-4 py-2 text-sm text-paper" href={week.href}>{m.begin}</Link>
        </p>
      ) : (
        <p className="mt-6 border-s-2 border-copper ps-4">{m.weekLocked}</p>
      )}
      <h2 className="mt-10 text-2xl font-medium">{m.requiredWork}</h2>
      <ul className="mt-3 space-y-2">
        {week.required.map((need) => {
          const done = rows.some((row) => row.itemId === need.itemId && row.kind === need.kind && row.score === 1);
          const name = need.kind === "check"
            ? m.check
            : need.kind === "lab" || need.kind === "bench"
              ? m.practice
              : need.kind === "ops-brief"
                ? m.yourBrief
                : m.capstone;
          return (
            <li key={`${need.itemId}-${need.kind}`}>
              {done ? m.acceptedLabel : m.weekOpen} · {name}
            </li>
          );
        })}
      </ul>
      {user && ready ? <WeekTools weekId={week.id} files={files} reviews={reviews} m={m} /> : null}
      {!user ? <p className="mt-8"><Link className="underline" href="/sign-in">{m.signIn}</Link></p> : null}
    </article>
  );
}
