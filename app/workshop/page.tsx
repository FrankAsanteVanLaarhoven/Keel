import type { Metadata } from "next";
import Link from "next/link";
import { WorkshopList } from "@/components/workshop-list";
import { t } from "@/lib/i18n/catalog";
import { resolveLocale } from "@/lib/i18n/server";
import { currentUser } from "@/lib/ready";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await resolveLocale();
  const m = t(locale);
  return {
    title: m.workshopTitle,
    description: m.workshopDeck,
    alternates: { canonical: "/workshop" },
    robots: { index: false, follow: false },
  };
}

export default async function WorkshopPage() {
  const locale = await resolveLocale();
  const m = t(locale);
  const user = await currentUser();
  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-5 pb-28 pt-12">
        <p className="kicker">{m.workshop}</p>
        <h1 className="mt-3 text-4xl font-medium tracking-tight">{m.workshopTitle}</h1>
        <p className="mt-4 max-w-2xl leading-7">{m.workshopDeck}</p>
        <p className="mt-3 max-w-2xl text-sm text-soft">{m.workshopHelp}</p>
        <p className="mt-6">{m.workshopSignIn}</p>
        <p className="mt-3"><Link className="underline" href="/sign-in">{m.signIn}</Link></p>
      </div>
    );
  }
  return <WorkshopList m={m} />;
}
