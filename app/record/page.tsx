import type { Metadata } from "next";
import { getPack } from "@/lib/course";
import { getOps } from "@/lib/ops";
import { t } from "@/lib/i18n/catalog";
import { resolveLocale } from "@/lib/i18n/server";
import { currentUser } from "@/lib/ready";
import { getProfile, progressSummary } from "@/lib/store";
import { termComplete } from "@/lib/term";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await resolveLocale();
  const m = t(locale);
  return {
    title: m.recordTitle,
    description: m.recordLine,
    alternates: { canonical: "/record" },
    robots: { index: false, follow: false },
  };
}

export default async function RecordPage() {
  const locale = await resolveLocale();
  const m = t(locale);
  const pack = getPack(locale);
  const ops = getOps(locale);
  const user = await currentUser();
  const summary = user ? progressSummary(user.id, new Date().toISOString().slice(0, 10)) : null;
  const done = Boolean(summary?.rows.some((row) => row.kind === "brief" && row.score === 1));
  const opsDone = Boolean(summary?.rows.some((row) => row.kind === "ops-brief" && row.score === 1));
  const termDone = summary ? termComplete(summary.rows) : false;
  const profile = user ? getProfile(user.id) : null;
  const when = summary?.rows.find((row) => row.kind === "brief" && row.score === 1)?.updatedAt;
  const opsWhen = summary?.rows.find((row) => row.kind === "ops-brief" && row.score === 1)?.updatedAt;
  return (
    <div className="mx-auto max-w-3xl px-5 pb-28 pt-12">
      <p className="kicker">{m.record}</p>
      <h1 className="mt-3 text-4xl font-medium tracking-tight">{m.recordTitle}</h1>
      {!done ? <p className="mt-6">{m.recordPending}</p> : (
        <article className="mt-10 border border-line bg-raised px-8 py-10">
          <p className="kicker">Keel</p>
          <h2 className="mt-6 text-3xl font-medium">{profile?.display_name}</h2>
          <p className="mt-2 text-soft">{profile?.role === "staff" ? m.roleStaff : m.roleStudent}</p>
          <p className="mt-8 text-xl leading-8">{m.recordLine}</p>
          <p className="mt-4">{pack.brief.title}</p>
          {when ? <p className="num mt-8 text-sm text-soft">{new Date(when).toISOString().slice(0, 10)}</p> : null}
          <p className="mt-6 text-sm text-soft">{m.recordDone}</p>
        </article>
      )}
      {!opsDone ? <p className="mt-6">{m.opsRecordPending}</p> : (
        <article className="mt-10 border border-line bg-raised px-8 py-10">
          <p className="kicker">Keel</p>
          <h2 className="mt-6 text-3xl font-medium">{profile?.display_name}</h2>
          <p className="mt-2 text-soft">{profile?.role === "staff" ? m.roleStaff : m.roleStudent}</p>
          <p className="mt-8 text-xl leading-8">{m.opsRecordLine}</p>
          <p className="mt-4">{ops.brief.title}</p>
          {opsWhen ? <p className="num mt-8 text-sm text-soft">{new Date(opsWhen).toISOString().slice(0, 10)}</p> : null}
          <p className="mt-6 text-sm text-soft">{m.recordDone}</p>
        </article>
      )}
      {termDone ? (
        <article className="mt-10 border border-ink px-8 py-10">
          <p className="kicker">Keel</p>
          <h2 className="mt-6 text-3xl font-medium">{m.certificateTitle}</h2>
          <p className="mt-6 text-2xl">{profile?.display_name}</p>
          <p className="mt-4 text-xl leading-8">{m.certificateLine}</p>
          <p className="num mt-8 text-sm text-soft">{new Date().toISOString().slice(0, 10)}</p>
        </article>
      ) : null}
    </div>
  );
}
