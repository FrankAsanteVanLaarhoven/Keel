import type { Metadata } from "next";
import { t } from "@/lib/i18n/catalog";
import { resolveLocale } from "@/lib/i18n/server";
import { AuthPanel } from "@/components/account-panel";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await resolveLocale();
  const m = t(locale);
  return {
    title: m.signInTitle,
    description: m.signInDeck,
    alternates: { canonical: "/sign-in" },
    robots: { index: false, follow: false },
  };
}

export default async function SignInPage() {
  const locale = await resolveLocale();
  return <AuthPanel mode="in" m={t(locale)} />;
}
