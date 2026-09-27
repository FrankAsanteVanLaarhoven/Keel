import type { Metadata } from "next";
import { t } from "@/lib/i18n/catalog";
import { resolveLocale } from "@/lib/i18n/server";
import { AuthPanel } from "@/components/account-panel";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await resolveLocale();
  const m = t(locale);
  return {
    title: m.signUpTitle,
    description: m.signUpDeck,
    alternates: { canonical: "/sign-up" },
    robots: { index: false, follow: false },
  };
}

export default async function SignUpPage() {
  const locale = await resolveLocale();
  return <AuthPanel mode="up" m={t(locale)} />;
}
