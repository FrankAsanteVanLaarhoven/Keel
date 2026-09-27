import type { Metadata } from "next";
import { t } from "@/lib/i18n/catalog";
import { resolveLocale } from "@/lib/i18n/server";
import { FoundryLab } from "@/components/foundry-lab";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await resolveLocale();
  const m = t(locale);
  return {
    title: m.foundryTitle,
    description: m.foundryDeck,
    alternates: { canonical: "/foundry" },
  };
}

export default async function FoundryPage({
  searchParams,
}: {
  searchParams?: Promise<{ challenge?: string }>;
}) {
  const locale = await resolveLocale();
  const m = t(locale);
  const resolvedParams = searchParams ? await searchParams : undefined;

  return (
    <main id="content" className="pb-28">
      <FoundryLab m={m} initialChallengeId={resolvedParams?.challenge} />
    </main>
  );
}
