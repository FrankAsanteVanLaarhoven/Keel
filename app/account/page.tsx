import type { Metadata } from "next";
import { t } from "@/lib/i18n/catalog";
import { resolveLocale } from "@/lib/i18n/server";
import { AccountPanel } from "@/components/account-panel";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await resolveLocale();
  const m = t(locale);
  return {
    title: m.accountTitle,
    description: m.displayHelp,
    alternates: { canonical: "/account" },
    robots: { index: false, follow: false },
  };
}

export default async function AccountPage() {
  const locale = await resolveLocale();
  return <AccountPanel m={t(locale)} />;
}
