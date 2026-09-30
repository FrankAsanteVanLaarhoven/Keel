import type { Messages } from "@/lib/i18n/en";

interface Props {
  m: Messages;
  overview?: {
    totalEvents: number;
    totalProfiles: number;
    totalProgress: number;
    avgXp: number;
  };
}

export function AnalyticsDashboard({ m, overview }: Props) {
  const figures = [
    { label: m.analyticsPeople, value: overview?.totalProfiles ?? 0 },
    { label: m.analyticsMarks, value: overview?.totalProgress ?? 0 },
    { label: m.analyticsPoints, value: overview?.avgXp ?? 0 },
    { label: m.analyticsEvents, value: overview?.totalEvents ?? 0 },
  ];
  return (
    <div className="mx-auto max-w-6xl px-5 pb-28 pt-12">
      <p className="kicker">{m.analytics}</p>
      <h1 className="mt-3 text-4xl font-medium tracking-tight md:text-6xl">{m.analyticsTitle}</h1>
      <p className="mt-4 max-w-2xl text-lg">{m.analyticsDeck}</p>
      <dl className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {figures.map((item) => (
          <div key={item.label} className="border border-line px-4 py-5">
            <dt className="kicker">{item.label}</dt>
            <dd className="num mt-3 text-3xl">{item.value.toLocaleString()}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
