import type { Metadata } from "next";
import { t } from "@/lib/i18n/catalog";
import { resolveLocale } from "@/lib/i18n/server";
import { getAnalyticsOverview } from "@/lib/db";
import { AnalyticsDashboard } from "@/components/analytics-dashboard";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await resolveLocale();
  const m = t(locale);
  return {
    title: `${m.analyticsTitle} — Keel`,
    description: m.analyticsDeck,
    robots: { index: false, follow: false },
  };
}

export default async function AnalyticsPage() {
  const locale = await resolveLocale();
  const m = t(locale);
  const overview = await getAnalyticsOverview();

  return (
    <main id="content" className="pb-28">
      <AnalyticsDashboard m={m} overview={overview} />
    </main>
  );
}
