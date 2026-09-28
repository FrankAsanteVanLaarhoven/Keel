export type WeekNeed = { itemId: string; kind: string };

export type WeekDef = {
  id: string;
  no: number;
  title: string;
  promise: string;
  href: string;
  required: WeekNeed[];
};

export const weeks: WeekDef[] = [
  {
    id: "w01",
    no: 1,
    title: "The web and the internet",
    promise: "Follow one request and leave the key off the page.",
    href: "/ops/web",
    required: [
      { itemId: "web", kind: "check" },
      { itemId: "web", kind: "lab" },
      { itemId: "web", kind: "ops-case" },
    ],
  },
  {
    id: "w02",
    no: 2,
    title: "Git and the shared history",
    promise: "Commit the fix on a branch and keep the secret out.",
    href: "/ops/git",
    required: [
      { itemId: "git", kind: "check" },
      { itemId: "git", kind: "lab" },
      { itemId: "git", kind: "ops-case" },
    ],
  },
  {
    id: "w03",
    no: 3,
    title: "The workbench",
    promise: "Name the tools and keep the work on a shared bench.",
    href: "/course/tools",
    required: [
      { itemId: "tools", kind: "check" },
      { itemId: "tools", kind: "bench" },
      { itemId: "tools", kind: "case" },
    ],
  },
  {
    id: "w04",
    no: 4,
    title: "One record, several doors",
    promise: "Keep one record behind every door a person uses.",
    href: "/course/platforms",
    required: [
      { itemId: "platforms", kind: "check" },
      { itemId: "platforms", kind: "bench" },
      { itemId: "platforms", kind: "case" },
    ],
  },
  {
    id: "w05",
    no: 5,
    title: "Design the task",
    promise: "Start from the person's job, and leave a way back.",
    href: "/course/design",
    required: [
      { itemId: "design", kind: "check" },
      { itemId: "design", kind: "bench" },
      { itemId: "design", kind: "case" },
    ],
  },
  {
    id: "w06",
    no: 6,
    title: "Three rooms",
    promise: "Separate what is seen, what decides, and what is remembered.",
    href: "/course/tiers",
    required: [
      { itemId: "tiers", kind: "check" },
      { itemId: "tiers", kind: "bench" },
      { itemId: "tiers", kind: "case" },
    ],
  },
  {
    id: "w07",
    no: 7,
    title: "Integration",
    promise: "Let the checks stop a bad change before it is shared.",
    href: "/course/integration",
    required: [
      { itemId: "integration", kind: "check" },
      { itemId: "integration", kind: "bench" },
      { itemId: "integration", kind: "case" },
    ],
  },
  {
    id: "w08",
    no: 8,
    title: "Release and return",
    promise: "Ship a small change that can be taken back.",
    href: "/course/deployment",
    required: [
      { itemId: "deployment", kind: "check" },
      { itemId: "deployment", kind: "bench" },
      { itemId: "deployment", kind: "case" },
    ],
  },
  {
    id: "w09",
    no: 9,
    title: "Development and operations",
    promise: "Read the four DORA numbers off a real week.",
    href: "/ops/devops",
    required: [
      { itemId: "devops", kind: "check" },
      { itemId: "devops", kind: "lab" },
      { itemId: "devops", kind: "ops-case" },
    ],
  },
  {
    id: "w10",
    no: 10,
    title: "Seeing a failure",
    promise: "Follow one failed request instead of rebooting the room.",
    href: "/course/observe",
    required: [
      { itemId: "observe", kind: "check" },
      { itemId: "observe", kind: "bench" },
      { itemId: "observe", kind: "case" },
    ],
  },
  {
    id: "w11",
    no: 11,
    title: "Who may see what",
    promise: "Give each person their own door, and no more.",
    href: "/course/security",
    required: [
      { itemId: "security", kind: "check" },
      { itemId: "security", kind: "bench" },
      { itemId: "security", kind: "case" },
    ],
  },
  {
    id: "w12",
    no: 12,
    title: "Cost, trust, and the release",
    promise: "Defend the bill, then file the Northline release.",
    href: "/ops/finops",
    required: [
      { itemId: "finops", kind: "check" },
      { itemId: "finops", kind: "lab" },
      { itemId: "finops", kind: "ops-case" },
      { itemId: "northline", kind: "ops-brief" },
    ],
  },
];

export type ProgressMark = { itemId: string; kind: string; score: number };

export type WorkWindow = {
  status: "draft" | "scheduled" | "published" | "paused";
  opensAt: number | null;
  closesAt: number | null;
};

export function weekById(id: string): WeekDef | undefined {
  return weeks.find((week) => week.id === id);
}

export function weekForItem(itemId: string, kind: string): WeekDef | undefined {
  return weeks.find((week) => week.required.some((need) => need.itemId === itemId && need.kind === kind));
}

export function weekDone(week: WeekDef, rows: ProgressMark[]): boolean {
  return week.required.every((need) => rows.some((row) => row.itemId === need.itemId && row.kind === need.kind && row.score === 1));
}

export function weeksDone(rows: ProgressMark[]): number {
  return weeks.filter((week) => weekDone(week, rows)).length;
}

export function termComplete(rows: ProgressMark[]): boolean {
  return weeksDone(rows) === weeks.length;
}

export function previousWeeksDone(week: WeekDef, rows: ProgressMark[]): boolean {
  return weeks.filter((item) => item.no < week.no).every((item) => weekDone(item, rows));
}

export function workOpen(work: WorkWindow | null, now: number): { open: boolean; reason: "published" | "paused" | "draft" | "early" | "closed" } {
  if (!work || work.status === "published") {
    if (work?.closesAt && now > work.closesAt) return { open: false, reason: "closed" };
    return { open: true, reason: "published" };
  }
  if (work.status === "paused") return { open: false, reason: "paused" };
  if (work.status === "draft") return { open: false, reason: "draft" };
  if (work.opensAt && now < work.opensAt) return { open: false, reason: "early" };
  if (work.closesAt && now > work.closesAt) return { open: false, reason: "closed" };
  return { open: true, reason: "published" };
}

export function termGate(input: {
  itemId: string;
  kind: string;
  rows: ProgressMark[];
  staff: boolean;
  work: WorkWindow | null;
  now: number;
}): { open: boolean; reason: string } {
  const week = weekForItem(input.itemId, input.kind);
  if (!week) return { open: true, reason: "free" };
  if (input.staff) return { open: true, reason: "staff" };
  const window = workOpen(input.work, input.now);
  if (!window.open) return window;
  if (week.no === 1 || previousWeeksDone(week, input.rows)) return { open: true, reason: "ready" };
  return { open: false, reason: "locked" };
}

export type AttemptStanding = { userId: string; name: string; correct: number; attempts: number };

export function standingEligible(row: AttemptStanding): boolean {
  if (row.correct < 1) return false;
  const wrong = row.attempts - row.correct;
  return wrong <= row.correct;
}

export function topCorrect(rows: AttemptStanding[], limit = 10): AttemptStanding[] {
  return rows
    .filter(standingEligible)
    .sort((a, b) => b.correct - a.correct || a.name.localeCompare(b.name))
    .slice(0, limit);
}

export function recommendWeeks(rows: ProgressMark[], ratings: { weekId: string; stars: number }[]): { next: WeekDef | null; rated: WeekDef | null } {
  const next = weeks.find((week) => !weekDone(week, rows) && (week.no === 1 || previousWeeksDone(week, rows))) ?? null;
  const averages = new Map<string, { sum: number; count: number }>();
  for (const rating of ratings) {
    const current = averages.get(rating.weekId) ?? { sum: 0, count: 0 };
    current.sum += rating.stars;
    current.count += 1;
    averages.set(rating.weekId, current);
  }
  const rated =
    weeks
      .filter((week) => week.id !== next?.id && !weekDone(week, rows))
      .sort((a, b) => {
        const left = averages.get(a.id);
        const right = averages.get(b.id);
        const leftScore = left ? left.sum / left.count : 0;
        const rightScore = right ? right.sum / right.count : 0;
        return rightScore - leftScore;
      })[0] ?? null;
  return { next, rated: rated && (averages.get(rated.id)?.count ?? 0) > 0 ? rated : null };
}
