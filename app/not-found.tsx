import type { Metadata } from "next";
import Link from "next/link";
import { t } from "@/lib/i18n/catalog";
import { resolveLocale } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "404",
  description: "This page is not in the programme.",
  robots: { index: false, follow: false },
};

export default async function NotFound() {
  const m = t(await resolveLocale());
  return (
    <div className="mx-auto max-w-3xl px-5 py-20">
      <p className="kicker">404</p>
      <h1 className="mt-3 text-4xl font-medium tracking-tight md:text-5xl">{m.notFound}</h1>
      <p className="mt-4 text-lg text-soft">{m.notFoundBody}</p>
      <div className="mt-8 flex flex-wrap gap-4 text-sm">
        <Link className="border border-ink bg-ink px-4 py-2 text-paper" href="/">
          {m.homeLink}
        </Link>
        <Link className="border border-line px-4 py-2 text-ink" href="/course">
          {m.seeCases}
        </Link>
      </div>
    </div>
  );
}
