export const SHARE_CHANNEL = "keel.foundry.liveshare.v1";

const ROOM = /^[a-z0-9](?:[a-z0-9-]{1,22}[a-z0-9])?$/;
export const SHARE_LIMIT = 200_000;

export function shareRoom(value: string): string {
  const room = value.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "").slice(0, 24);
  if (room.length < 3 || !ROOM.test(room)) return "";
  return room;
}

export function readShareMessage(value: unknown, room: string, self: string): { kind: "hello" } | { kind: "project"; project: unknown } | null {
  if (!room || !self || !value || typeof value !== "object") return null;
  const raw = value as Record<string, unknown>;
  if (raw.room !== room || typeof raw.from !== "string" || !raw.from || raw.from === self) return null;
  if (raw.kind === "hello") return { kind: "hello" };
  if (raw.kind !== "project" || !raw.project || typeof raw.project !== "object") return null;
  try {
    if (JSON.stringify(raw.project).length > SHARE_LIMIT) return null;
  } catch {
    return null;
  }
  return { kind: "project", project: raw.project };
}
