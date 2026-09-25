import type { SectionId } from "../course/meta";

export const checkAnswers: Record<SectionId, string> = {
  tools: "history",
  platforms: "records",
  design: "task",
  tiers: "application",
  integration: "red",
  deployment: "back",
  maintain: "map",
  scale: "exact",
  observe: "path",
  security: "both",
  futures: "promise",
};

export const benchAnswers: Record<SectionId, { order?: string[]; choice?: string; choices?: string[]; labels?: Record<string, string> }> = {
  tools: { order: ["name", "open", "change", "save", "show"] },
  platforms: { labels: { rider: "phone", inspector: "handheld", night: "desk" } },
  design: { choice: "sequence" },
  tiers: { labels: { see: "browser", decide: "application", remember: "database" } },
  integration: { order: ["change", "checks", "review", "merge"] },
  deployment: { choice: "small" },
  maintain: { choice: "apart" },
  scale: { choice: "exact" },
  observe: { labels: { one: "trace", count: "metric", story: "log" } },
  security: { choices: ["shared", "url", "laptop"] },
  futures: { choice: "leave" },
};

export const decisionAnswers: Record<SectionId, Record<string, string>> = {
  tools: { where: "shared", memory: "history", fail: "stop" },
  platforms: { rider: "phone", same: "records", avoid: "one" },
  design: { first: "task", error: "plain", access: "keyboard" },
  tiers: { allowed: "application", remember: "database", public: "browser" },
  integration: { night: "block", who: "two", secret: "never" },
  deployment: { size: "small", back: "yes", tell: "staff" },
  maintain: { letter: "apart", owner: "named", words: "written" },
  scale: { first: "exact", line: "queue", cache: "public" },
  observe: { night: "trace", alert: "action", quiet: "no" },
  security: { who: "own", grades: "role", leak: "least" },
  futures: { keep: "record", prepare: "exit", refuse: "only" },
};

export const briefAnswers: Record<string, string> = {
  tools: "shared",
  platforms: "same",
  design: "task",
  tiers: "application",
  integration: "block",
  deployment: "small",
  maintain: "apart",
  scale: "exact",
  observe: "path",
  security: "own",
  futures: "leave",
};

export const xpFor = { check: 40, bench: 60, case: 120, brief: 200 } as const;
