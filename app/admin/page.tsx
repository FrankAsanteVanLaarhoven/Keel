import type { Metadata } from "next";
import { t } from "@/lib/i18n/catalog";
import { resolveLocale } from "@/lib/i18n/server";
import { AdminLedger } from "@/components/admin-ledger";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await resolveLocale();
  const m = t(locale);
  return {
    title: `Teacher & Super Admin Ledger · ${m.file}`,
    description: "Teacher evaluation ledger for practical capstone answers, cohort results, and manual grading overrides.",
    alternates: { canonical: "/admin" },
    robots: { index: false, follow: false },
  };
}

export default async function AdminPage() {
  const locale = await resolveLocale();
  const m = t(locale);
  return <AdminLedger m={m} />;
}
