export type ProgressRow = { itemId: string; kind: string; score: number; day: string | null };

export function marksOf(rows: ProgressRow[]): string[] {
  const done = (kind: string) => rows.some((row) => row.kind === kind && row.score === 1);
  const cases = rows.filter((row) => row.kind === "case" && row.score === 1).length;
  const marks: string[] = [];
  if (done("check")) marks.push("check");
  if (done("bench")) marks.push("bench");
  if (done("case")) marks.push("case");
  if (cases >= 5) marks.push("five");
  if (cases >= 11) marks.push("all");
  if (done("brief")) marks.push("brief");
  return marks;
}

function previousDay(day: string): string {
  const stamp = Date.parse(`${day}T00:00:00Z`);
  return new Date(stamp - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

export function streakOf(days: string[], today: string): number {
  const have = new Set(days.filter(Boolean));
  let cursor = have.has(today) ? today : previousDay(today);
  if (!have.has(cursor)) return 0;
  let count = 0;
  while (have.has(cursor)) {
    count += 1;
    cursor = previousDay(cursor);
  }
  return count;
}

export function casesAccepted(rows: ProgressRow[]): number {
  return rows.filter((row) => row.kind === "case" && row.score === 1).length;
}
