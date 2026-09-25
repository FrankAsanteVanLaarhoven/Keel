export const sectionIds = [
  "tools",
  "platforms",
  "design",
  "tiers",
  "integration",
  "deployment",
  "maintain",
  "scale",
  "observe",
  "security",
  "futures",
] as const;

export type SectionId = (typeof sectionIds)[number];

export type BenchMeta =
  | { kind: "order"; ids: string[] }
  | { kind: "single"; ids: string[] }
  | { kind: "multi"; ids: string[]; choose: number }
  | { kind: "label"; slots: string[]; ids: string[] };

export type DecisionMeta = { id: string; optionIds: [string, string, string] };

export type SectionMeta = {
  id: SectionId;
  no: string;
  minutes: number;
  checkIds: [string, string, string, string];
  bench: BenchMeta;
  decisions: [DecisionMeta, DecisionMeta, DecisionMeta];
};

export const sections: SectionMeta[] = [
  {
    id: "tools",
    no: "01",
    minutes: 40,
    checkIds: ["theme", "history", "monitor", "mouse"],
    bench: { kind: "order", ids: ["name", "open", "change", "save", "show"] },
    decisions: [
      { id: "where", optionIds: ["laptop", "shared", "paper"] },
      { id: "memory", optionIds: ["someone", "history", "none"] },
      { id: "fail", optionIds: ["ship", "stop", "hide"] },
    ],
  },
  {
    id: "platforms",
    no: "02",
    minutes: 40,
    checkIds: ["colour", "records", "animation", "brand"],
    bench: { kind: "label", slots: ["rider", "inspector", "night"], ids: ["phone", "handheld", "desk"] },
    decisions: [
      { id: "rider", optionIds: ["paper", "phone", "office"] },
      { id: "same", optionIds: ["colour", "records", "slogan"] },
      { id: "avoid", optionIds: ["three", "one", "none"] },
    ],
  },
  {
    id: "design",
    no: "03",
    minutes: 45,
    checkIds: ["colour", "task", "logo", "database"],
    bench: { kind: "single", ids: ["twelve", "sequence", "pictures"] },
    decisions: [
      { id: "first", optionIds: ["colour", "task", "logo"] },
      { id: "error", optionIds: ["code", "plain", "blank"] },
      { id: "access", optionIds: ["mouse", "keyboard", "print"] },
    ],
  },
  {
    id: "tiers",
    no: "04",
    minutes: 45,
    checkIds: ["browser", "application", "database", "poster"],
    bench: { kind: "label", slots: ["see", "decide", "remember"], ids: ["browser", "application", "database"] },
    decisions: [
      { id: "allowed", optionIds: ["browser", "application", "poster"] },
      { id: "remember", optionIds: ["browser", "application", "database"] },
      { id: "public", optionIds: ["browser", "database", "poster"] },
    ],
  },
  {
    id: "integration",
    no: "05",
    minutes: 40,
    checkIds: ["ship", "red", "ignore", "celebrate"],
    bench: { kind: "order", ids: ["change", "checks", "review", "merge"] },
    decisions: [
      { id: "night", optionIds: ["ship", "block", "skip"] },
      { id: "who", optionIds: ["one", "two", "none"] },
      { id: "secret", optionIds: ["log", "never", "email"] },
    ],
  },
  {
    id: "deployment",
    no: "06",
    minutes: 40,
    checkIds: ["friday", "back", "big", "silent"],
    bench: { kind: "single", ids: ["bang", "small", "silent"] },
    decisions: [
      { id: "size", optionIds: ["big", "small", "secret"] },
      { id: "back", optionIds: ["no", "yes", "hope"] },
      { id: "tell", optionIds: ["nobody", "staff", "poster"] },
    ],
  },
  {
    id: "maintain",
    no: "07",
    minutes: 35,
    checkIds: ["clever", "map", "newest", "longest"],
    bench: { kind: "single", ids: ["together", "apart", "rewrite"] },
    decisions: [
      { id: "letter", optionIds: ["together", "apart", "freeze"] },
      { id: "owner", optionIds: ["nobody", "named", "crowd"] },
      { id: "words", optionIds: ["memory", "written", "chat"] },
    ],
  },
  {
    id: "scale",
    no: "08",
    minutes: 45,
    checkIds: ["prettier", "exact", "louder", "newer"],
    bench: { kind: "single", ids: ["bigger", "exact", "prettier"] },
    decisions: [
      { id: "first", optionIds: ["pretty", "exact", "new"] },
      { id: "line", optionIds: ["hammer", "queue", "close"] },
      { id: "cache", optionIds: ["payment", "public", "nothing"] },
    ],
  },
  {
    id: "observe",
    no: "09",
    minutes: 40,
    checkIds: ["hope", "path", "colour", "reboot"],
    bench: { kind: "label", slots: ["one", "count", "story"], ids: ["trace", "metric", "log"] },
    decisions: [
      { id: "night", optionIds: ["reboot", "trace", "wait"] },
      { id: "alert", optionIds: ["noise", "action", "emailall"] },
      { id: "quiet", optionIds: ["page", "no", "always"] },
    ],
  },
  {
    id: "security",
    no: "10",
    minutes: 50,
    checkIds: ["same", "both", "password", "hidden"],
    bench: { kind: "multi", ids: ["shared", "url", "laptop", "own", "lock", "least"], choose: 3 },
    decisions: [
      { id: "who", optionIds: ["shared", "own", "none"] },
      { id: "grades", optionIds: ["all", "role", "public"] },
      { id: "leak", optionIds: ["laptop", "least", "chat"] },
    ],
  },
  {
    id: "futures",
    no: "11",
    minutes: 35,
    checkIds: ["vendor", "promise", "fashion", "slogan"],
    bench: { kind: "single", ids: ["slogan", "leave", "freeze"] },
    decisions: [
      { id: "keep", optionIds: ["vendor", "record", "slogan"] },
      { id: "prepare", optionIds: ["stay", "exit", "ignore"] },
      { id: "refuse", optionIds: ["only", "many", "none"] },
    ],
  },
];

export const briefDecisions: DecisionMeta[] = [
  { id: "tools", optionIds: ["laptop", "shared", "paper"] },
  { id: "platforms", optionIds: ["separate", "same", "app-only"] },
  { id: "design", optionIds: ["screens", "task", "logo"] },
  { id: "tiers", optionIds: ["browser", "application", "database"] },
  { id: "integration", optionIds: ["later", "block", "skip"] },
  { id: "deployment", optionIds: ["bang", "small", "silent"] },
  { id: "maintain", optionIds: ["together", "apart", "freeze"] },
  { id: "scale", optionIds: ["pretty", "exact", "close"] },
  { id: "observe", optionIds: ["hope", "path", "reboot"] },
  { id: "security", optionIds: ["shared", "own", "public"] },
  { id: "futures", optionIds: ["vendor", "leave", "freeze"] },
];

export function sectionById(id: string): SectionMeta | undefined {
  return sections.find((section) => section.id === id);
}

export function nextSectionId(id: string): SectionId | "brief" | null {
  const index = sections.findIndex((section) => section.id === id);
  if (index < 0) return null;
  return sections[index + 1]?.id ?? "brief";
}
