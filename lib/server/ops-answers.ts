import type { OpsId } from "../ops/meta";

export const opsCheckAnswers: Record<OpsId, string> = {
  web: "documents",
  git: "github",
  devops: "four",
  finops: "value",
};

export const opsLabAnswers: Record<OpsId, Record<string, string | string[]>> = {
  web: {
    path: ["listen", "accept", "read", "validate", "respond", "close"],
    status: "ok200",
    body: "file",
    connection: "close",
  },
  git: {
    files: ["readme", "source"],
    message: "fix",
    branch: "feature",
  },
  devops: {
    code: "dev",
    watch: "ops",
    rollback: "auto",
    frequency: "four",
    lead: "eight",
    fail: "one",
    restore: "twohalf",
  },
  finops: {
    ci: "cap",
    db: "keep",
    tokens: "stop",
    shared: "stop",
  },
};

export const opsDecisionAnswers: Record<OpsId, Record<string, string>> = {
  web: { fault: "app", leak: "hide", close: "close" },
  git: { secret: "rotate", message: "fix", branch: "feature" },
  devops: { own: "own", restore: "restore", auto: "auto" },
  finops: { cap: "cap", tokens: "stop", trust: "trust" },
};

export const opsBriefAnswers: Record<string, string> = {
  web: "safe",
  git: "feature",
  devops: "measure",
  finops: "cap",
};
