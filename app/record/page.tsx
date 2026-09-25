import { getPack } from "@/lib/course";
import { t } from "@/lib/i18n/catalog";
import { resolveLocale } from "@/lib/i18n/server";
import { currentUser } from "@/lib/ready";
import { getProfile, progressSummary } from "@/lib/store";

export default async function RecordPage() {
  const locale = await resolveLocale();
  const m = t(locale);
  const pack = getPack(locale);
  const user = await currentUser();
  const summary = user ? progressSummary(user.id, new Date().toISOString().slice(0, 10)) : null;
  const done = Boolean(summary?.rows.some((row) => row.kind === "brief" && row.score === 1));
  const profile = user ? getProfile(user.id) : null;
  const when = summary?.rows.find((row) => row.kind === "brief" && row.score === 1)?.updatedAt;
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
    </div>
  );
}
