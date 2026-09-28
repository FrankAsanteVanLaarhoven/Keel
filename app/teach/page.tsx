import type { Metadata } from "next";
import Link from "next/link";
import { PublishDesk, TeachForms } from "@/components/term-desk";
import { allReviews, cohort, listAttempts, listWork } from "@/lib/classbook";
import { t } from "@/lib/i18n/catalog";
import { resolveLocale } from "@/lib/i18n/server";
import { currentUser } from "@/lib/ready";
import { isStaffOrAdmin } from "@/lib/security";
import { getProfile } from "@/lib/store";
import { weeksDone } from "@/lib/term";
import { progressSummary } from "@/lib/store";

export async function generateMetadata(): Promise<Metadata> {
  const m = t(await resolveLocale());
  return { title: `${m.teachTitle} — Keel`, description: m.teachDeck, robots: { index: false, follow: false } };
}

export default async function TeachPage() {
  const locale = await resolveLocale();
  const m = t(locale);
  const user = await currentUser();
  const profile = user ? getProfile(user.id) : null;
  if (!user || !isStaffOrAdmin(profile?.role, user.email)) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-20">
        <h1 className="text-4xl font-medium">{m.teachTitle}</h1>
        <p className="mt-4">{m.teachClosed}</p>
        <p className="mt-6"><Link className="underline" href="/sign-in">{m.signIn}</Link></p>
      </div>
    );
  }
  const people = cohort();
  const attempts = listAttempts().slice(0, 80);
  const work = listWork();
  return (
    <div className="mx-auto max-w-6xl px-5 pb-28 pt-12">
      <p className="kicker">{m.teachNav}</p>
      <h1 className="mt-3 text-4xl font-medium tracking-tight md:text-6xl">{m.teachTitle}</h1>
      <p className="mt-4 max-w-2xl">{m.teachDeck}</p>
      <h2 className="mt-10 text-2xl font-medium">{m.cohort}</h2>
      {people.length === 0 ? <p className="mt-4 text-soft">{m.noCohort}</p> : null}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-start">
          <thead className="kicker">
            <tr>
              <th className="py-2 text-start font-normal">{m.displayName}</th>
              <th className="py-2 text-start font-normal">{m.email}</th>
              <th className="py-2 text-start font-normal">{m.attempts}</th>
              <th className="py-2 text-start font-normal">{m.failures}</th>
              <th className="py-2 text-start font-normal">{m.yourCorrect}</th>
              <th className="py-2 text-start font-normal">{m.termNav}</th>
            </tr>
          </thead>
          <tbody>
            {people.map((person) => {
              const rows = progressSummary(person.id, new Date().toISOString().slice(0, 10)).rows;
              return (
                <tr key={person.id} className="border-t border-line">
                  <td className="py-3">{person.name}</td>
                  <td className="py-3">{person.email}</td>
                  <td className="num py-3">{person.attempts}</td>
                  <td className="num py-3">{person.failures}</td>
                  <td className="num py-3">{person.correct}</td>
                  <td className="num py-3">{weeksDone(rows)}/12</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <h2 className="mt-12 text-2xl font-medium">{m.recentTries}</h2>
      <ul className="mt-4 divide-y divide-line border-y border-line">
        {attempts.map((attempt) => (
          <li key={`${attempt.userId}-${attempt.createdAt}-${attempt.itemId}`} className="flex flex-wrap justify-between gap-3 py-3 text-sm">
            <span>{attempt.itemId} · {attempt.kind}</span>
            <span>{attempt.correct ? m.correct : m.notYet}</span>
            <time className="num text-soft">{new Date(attempt.createdAt).toISOString().slice(0, 16).replace("T", " ")}</time>
          </li>
        ))}
      </ul>
      <h2 className="mt-12 text-2xl font-medium">{m.reviewTitle}</h2>
      <p className="mt-2 max-w-2xl text-sm text-soft">{m.reviewHold}</p>
      <ul className="mt-4 divide-y divide-line border-y border-line">
        {allReviews().map((review) => (
          <li key={review.id} className="flex flex-wrap justify-between gap-3 py-3 text-sm">
            <span>{review.name} · {review.weekId}</span>
            <span>{review.assessment ? m.reviewAssessment : m.reviewNotAssessment}</span>
            <span>{review.plagiarism ? m.reviewPlagiarism : m.reviewClear}</span>
            <span className="num text-soft">{review.coverage}</span>
          </li>
        ))}
      </ul>
      <h2 className="mt-12 text-2xl font-medium">{m.newCourse}</h2>
      <p className="mt-2 max-w-2xl text-sm text-soft">{m.calendarHelp}</p>
      <p className="mt-3"><a className="underline" href="/api/calendar">{m.calendarImport}</a></p>
      <PublishDesk m={m} />
      <h2 className="mt-12 text-2xl font-medium">{m.workTitle}</h2>
      <TeachForms work={work} m={m} />
    </div>
  );
}
