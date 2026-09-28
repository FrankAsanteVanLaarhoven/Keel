import { opsIds, type OpsId } from "./meta";

export type GateRow = { itemId: string; kind: string; score: number };

export function opsGateOpen(input: {
  kind: "check" | "lab" | "ops-case" | "ops-brief";
  sectionId?: string;
  signedIn: boolean;
  rows: GateRow[];
}): boolean {
  const has = (id: string, kind: string) => input.rows.some((row) => row.itemId === id && row.kind === kind && row.score === 1);
  if (input.kind === "ops-brief") return input.signedIn && opsIds.every((id) => has(id, "ops-case"));
  if (!input.signedIn) return true;
  const id = input.sectionId ?? "";
  const index = opsIds.indexOf(id as OpsId);
  if (index < 0) return false;
  const previous = index === 0 ? true : has(opsIds[index - 1] ?? "", "ops-case");
  if (!previous) return false;
  if (input.kind === "check") return true;
  if (input.kind === "lab") return has(id, "check");
  return has(id, "lab");
}

export function opsCasesAccepted(rows: GateRow[]): number {
  return opsIds.filter((id) => rows.some((row) => row.itemId === id && row.kind === "ops-case" && row.score === 1)).length;
}
