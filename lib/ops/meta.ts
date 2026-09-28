export const opsIds = ["web", "git", "devops", "finops"] as const;

export type OpsId = (typeof opsIds)[number];

export type OpsLevel = "ease" | "practice" | "operator" | "expert";

export type LabField =
  | { id: string; kind: "order"; optionIds: string[]; start: string[] }
  | { id: string; kind: "single"; optionIds: string[] }
  | { id: string; kind: "multi"; optionIds: string[] };

export type DecisionMeta = { id: string; optionIds: [string, string, string] };

export type OpsMeta = {
  id: OpsId;
  no: string;
  minutes: number;
  level: OpsLevel;
  checkIds: [string, string, string, string];
  lab: LabField[];
  decisions: [DecisionMeta, DecisionMeta, DecisionMeta];
};

export const opsSections: OpsMeta[] = [
  {
    id: "web",
    no: "01",
    minutes: 50,
    level: "ease",
    checkIds: ["cables", "documents", "bothsame", "browser"],
    lab: [
      {
        id: "path",
        kind: "order",
        optionIds: ["listen", "accept", "read", "validate", "respond", "close"],
        start: ["respond", "listen", "close", "read", "accept", "validate"],
      },
      { id: "status", kind: "single", optionIds: ["ok200", "missing404", "crash500"] },
      { id: "body", kind: "single", optionIds: ["file", "secret", "empty"] },
      { id: "connection", kind: "single", optionIds: ["close", "keep"] },
    ],
    decisions: [
      { id: "fault", optionIds: ["cables", "app", "theme"] },
      { id: "leak", optionIds: ["leak", "hide", "header"] },
      { id: "close", optionIds: ["keep", "close", "second"] },
    ],
  },
  {
    id: "git",
    no: "02",
    minutes: 45,
    level: "practice",
    checkIds: ["git", "github", "deploy", "monitor"],
    lab: [
      { id: "files", kind: "multi", optionIds: ["readme", "source", "env", "dist", "tmp"] },
      { id: "message", kind: "single", optionIds: ["update", "fix", "final"] },
      { id: "branch", kind: "single", optionIds: ["main", "feature"] },
    ],
    decisions: [
      { id: "secret", optionIds: ["leave", "rotate", "email"] },
      { id: "message", optionIds: ["update", "fix", "final"] },
      { id: "branch", optionIds: ["main", "feature", "zip"] },
    ],
  },
  {
    id: "devops",
    no: "03",
    minutes: 50,
    level: "operator",
    checkIds: ["one", "four", "twelve", "none"],
    lab: [
      { id: "code", kind: "single", optionIds: ["dev", "ops", "auto"] },
      { id: "watch", kind: "single", optionIds: ["dev", "ops", "auto"] },
      { id: "rollback", kind: "single", optionIds: ["dev", "ops", "auto"] },
      { id: "frequency", kind: "single", optionIds: ["one", "four", "twenty"] },
      { id: "lead", kind: "single", optionIds: ["half", "eight", "week"] },
      { id: "fail", kind: "single", optionIds: ["none", "one", "all"] },
      { id: "restore", kind: "single", optionIds: ["ten", "twohalf", "weekend"] },
    ],
    decisions: [
      { id: "own", optionIds: ["wait", "own", "skip"] },
      { id: "restore", optionIds: ["lead", "restore", "freq"] },
      { id: "auto", optionIds: ["hide", "auto", "silent"] },
    ],
  },
  {
    id: "finops",
    no: "04",
    minutes: 45,
    level: "expert",
    checkIds: ["large", "value", "vendor", "shared"],
    lab: [
      { id: "ci", kind: "single", optionIds: ["keep", "cap", "stop"] },
      { id: "db", kind: "single", optionIds: ["keep", "cap", "stop"] },
      { id: "tokens", kind: "single", optionIds: ["keep", "cap", "stop"] },
      { id: "shared", kind: "single", optionIds: ["keep", "cap", "stop"] },
    ],
    decisions: [
      { id: "cap", optionIds: ["leave", "cap", "hide"] },
      { id: "tokens", optionIds: ["larger", "stop", "share"] },
      { id: "trust", optionIds: ["fine", "trust", "rename"] },
    ],
  },
];

export const opsBriefDecisions: DecisionMeta[] = [
  { id: "web", optionIds: ["leak", "safe", "hang"] },
  { id: "git", optionIds: ["main", "feature", "zip"] },
  { id: "devops", optionIds: ["skip", "measure", "monthly"] },
  { id: "finops", optionIds: ["spend", "cap", "share"] },
];

export const opsPictures: Record<OpsId | "brief", string> = {
  web: `
  client
    |  packets, with a header
    v
  internet     IP routes, TCP reassembles
    |
    v
  server       listen, read, validate, respond
               then close, or keep the connection
`,
  git: `
  working tree
       |
       +-- README.md, src/status.ts --> feature/status-404
       |
       +-- .env, dist/, notes.tmp     stay out
       |
       v
  main moves only after the checks are green
`,
  devops: `
  Development                 Operations
  write the change            run the service
  add a feature               keep the infrastructure
  fix a defect                keep it available
  unit test                   watch production
  design the application      servers and the network
  version history             deployment
  a development environment   production

  Automation repeats the steps that must not depend on who is awake.
`,
  finops: `
  line                         question
  idle runners                 cap what is unused
  ledger database              keep, and name the service
  unread model summaries       stop until someone uses them
  personal work on the account take it off
`,
  brief: `
  /status file  -->  200, no key, connection closed
  branch        -->  green checks, then main
  four numbers  -->  frequency, lead, failures, restore
  bill          -->  cap the idle, stop the unread
`,
};

export function opsById(id: string): OpsMeta | undefined {
  return opsSections.find((section) => section.id === id);
}

export function nextOpsId(id: string): OpsId | "brief" | null {
  const index = opsSections.findIndex((section) => section.id === id);
  if (index < 0) return null;
  return opsSections[index + 1]?.id ?? "brief";
}

export function previousOpsId(id: string): OpsId | null {
  const index = opsSections.findIndex((section) => section.id === id);
  if (index <= 0) return null;
  return opsSections[index - 1]?.id ?? null;
}
