import type { Metadata } from "next";
import Link from "next/link";
import { SurveyForm } from "@/components/term-desk";
import { surveyFor } from "@/lib/classbook";
import { t } from "@/lib/i18n/catalog";
import { resolveLocale } from "@/lib/i18n/server";
import { currentUser } from "@/lib/ready";
import { progressSummary } from "@/lib/store";
import { termComplete } from "@/lib/term";

export async function generateMetadata(): Promise<Metadata> {
  const m = t(await resolveLocale());
  return { title: `${m.surveyTitle} — Keel`, description: m.surveyDeck, robots: { index: false, follow: false } };
}

export default async function SurveyPage() {
  const locale = await resolveLocale();
  const m = t(locale);
  const user = await currentUser();
  const rows = user ? (await progressSummary(user.id, new Date().toISOString().slice(0, 10))).rows : [];
  const open = termComplete(rows);
  const existing = user ? await surveyFor(user.id) : null;
  return (
    <article className="mx-auto w-full max-w-[42rem] px-5 pb-36 pt-10">
      <p className="kicker">{m.termNav}</p>
      <h1 className="mt-3 text-4xl font-medium tracking-tight">{m.surveyTitle}</h1>
      <p className="mt-4">{m.surveyDeck}</p>
      {!user ? <p className="mt-6"><Link className="underline" href="/sign-in">{m.signIn}</Link></p> : null}
      {user && !open ? <p className="mt-6 border-s-2 border-copper ps-4">{m.weekLocked}</p> : null}
      {existing ? <p className="mt-6 text-soft">{m.surveyKept}</p> : null}
      {user && open ? <SurveyForm m={m} /> : null}
    </article>
  );
}
