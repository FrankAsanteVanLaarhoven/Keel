import type { Metadata } from "next";
import { t } from "@/lib/i18n/catalog";
import { resolveLocale } from "@/lib/i18n/server";
import { attemptTotals } from "@/lib/classbook";
import { currentUser } from "@/lib/ready";
import { progressSummary } from "@/lib/store";
import { topCorrect } from "@/lib/term";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await resolveLocale();
  const m = t(locale);
  return {
    title: m.standingTitle,
    description: m.standingDeck,
    alternates: { canonical: "/standing" },
  };
}

export default async function StandingPage() {
  const locale = await resolveLocale();
  const m = t(locale);
  const user = await currentUser();
  const today = new Date().toISOString().slice(0, 10);
  const summary = user ? await progressSummary(user.id, today) : null;
  const board = topCorrect(await attemptTotals()).map((row, index) => ({
    rank: index + 1,
    name: row.name,
    xp: row.correct,
    cases: row.attempts,
    you: row.userId === user?.id,
  }));
  const markLabels: Record<string, string> = {
    check: m.markCheck,
    bench: m.markBench,
    case: m.markCase,
    five: m.markFive,
    all: m.markAll,
    brief: m.markBrief,
    foundry: m.markFoundry,
    lab: m.markLab,
    ops: m.markOps,
    opsBrief: m.markOpsBrief,
  };
  return (
    <div className="mx-auto max-w-6xl px-5 pb-28 pt-12">
      <p className="kicker">{m.standing}</p>
      <h1 className="mt-3 text-4xl font-medium tracking-tight md:text-6xl">{m.standingTitle}</h1>
      <p className="mt-4 max-w-2xl">{m.topTenNote}</p>
      {summary ? (
        <p className="mt-6 text-sm text-soft">
          <span className="num text-ink">{summary.xp}</span> {m.points}
          <span className="ms-4 num text-ink">{summary.streak}</span> {summary.streak === 1 ? m.streakOne : m.streak}
        </p>
      ) : null}
      <h2 className="kicker mt-10">{m.marks}</h2>
      <ul className="mt-3 space-y-2">
        {(summary?.marks.length ? summary.marks : []).map((mark) => (
          <li key={mark}>{markLabels[mark]}</li>
        ))}
        {!summary?.marks.length ? <li className="text-soft">{m.noMarks}</li> : null}
      </ul>
      <Board title={m.yourCorrect} rows={board} m={m} />
      <p className="mt-8 text-sm text-soft">{m.noEmail}</p>
    </div>
  );
}

function Board({
  title,
  rows,
  m,
}: {
  title: string;
  rows: { rank: number; name: string; xp: number; cases: number; you: boolean }[];
  m: { place: string; displayName: string; yourCorrect: string; attempts: string; emptyBoard: string; yourRow: string };
}) {
  const top = Math.max(1, ...rows.map((row) => row.xp));
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-medium">{title}</h2>
      {rows.length === 0 ? <p className="mt-4 text-soft">{m.emptyBoard}</p> : null}
      <div className="overflow-x-auto">
        <table className="mt-4 w-full min-w-[32rem] text-start">
          <thead className="kicker text-start">
            <tr>
              <th className="py-2 text-start font-normal">{m.place}</th>
              <th className="py-2 text-start font-normal">{m.displayName}</th>
              <th className="py-2 text-start font-normal">{m.yourCorrect}</th>
              <th className="py-2 text-start font-normal">{m.attempts}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${title}-${row.rank}-${row.name}`} className="border-t border-line">
                <td className="num py-3">{String(row.rank).padStart(2, "0")}</td>
                <td className="py-3">{row.name}{row.you ? ` · ${m.yourRow}` : ""}</td>
                <td className="num py-3">
                  {row.xp}
                  <span className="ms-3 font-mono tracking-tight text-copper" aria-hidden="true">
                    {"#".repeat(row.xp <= 0 ? 0 : Math.max(1, Math.round((row.xp / top) * 16)))}
                  </span>
                </td>
                <td className="num py-3">{row.cases}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
