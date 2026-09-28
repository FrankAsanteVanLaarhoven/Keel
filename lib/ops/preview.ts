import type { OpsId } from "./meta";

export type LabFields = Record<string, string | string[]>;

function one(fields: LabFields, key: string): string {
  const value = fields[key];
  return typeof value === "string" ? value : "";
}

function many(fields: LabFields, key: string): string[] {
  const value = fields[key];
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

export function previewFlags(id: OpsId, fields: LabFields): { warn: boolean } {
  if (id === "web") return { warn: one(fields, "body") === "secret" || one(fields, "status") === "crash500" };
  if (id === "git") {
    const files = many(fields, "files");
    const dirty = files.includes("env") || files.includes("dist") || files.includes("tmp");
    return { warn: dirty || one(fields, "branch") === "main" };
  }
  if (id === "finops") return { warn: one(fields, "shared") === "keep" || one(fields, "tokens") === "keep" };
  return { warn: false };
}

export function webWire(fields: LabFields): string[] {
  const status = one(fields, "status");
  const body = one(fields, "body");
  const connection = one(fields, "connection");
  const statusLine =
    status === "ok200" ? "HTTP/1.0 200 OK" : status === "missing404" ? "HTTP/1.0 404 Not Found" : status === "crash500" ? "HTTP/1.0 500 Internal Server Error" : "";
  const conn = connection === "keep" ? "keep-alive" : connection === "close" ? "close" : "";
  const payload = body === "file" ? "Northline payments: open" : body === "secret" ? "LEDGER_KEY=live-secret" : "";
  if (!statusLine) return [];
  return [statusLine, conn ? `Connection: ${conn}` : "", "", payload];
}
