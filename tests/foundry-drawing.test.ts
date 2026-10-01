import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  CHALLENGES,
  SERVICE_TYPES,
  architectShouldWatch,
  clientReachesDatabase,
  connectionExportRecord,
  drawingTypeKnown,
  drawingTypeName,
  linkIsClientToDatabase,
  nodeExportRecord,
  readImportedConnections,
  readImportedNode,
  sheetsToModel,
} from "../lib/foundry-drawing";

function part(id: string, type: "client" | "gateway" | "auth" | "compute" | "cache" | "database" | "queue" | "ci" | "telemetry") {
  return { id, type, label: id, x: 0, y: 0, health: "healthy" as const, latency: 1, capacity: 1, rps: 0, role: "", industryTool: "" };
}

function link(from: string, to: string) {
  return { id: `${from}-${to}`, from, to, status: "active" as const };
}

describe("foundry drawing", () => {
  it("names the service parts from one list", () => {
    expect(drawingTypeName("client")).toBe("Client / Browser");
    expect(drawingTypeName("database")).toBe("Authoritative Database");
    expect(drawingTypeName("erd-entity").length).toBeGreaterThan(0);
    expect(drawingTypeName("nope")).toBe("Extension");
    for (const type of SERVICE_TYPES) expect(drawingTypeName(type)).not.toBe("Extension");
  });

  it("reads a saved shape and drops an unknown one", () => {
    const card = readImportedNode({ id: "a", type: "client", x: 10, y: 20 });
    expect(card?.label).toBe("Client / Browser");
    expect(card?.health).toBe("healthy");
    expect(readImportedNode({ id: "b", type: "spark", x: 1, y: 1 })).toBeNull();
    expect(drawingTypeKnown("x-stamp")).toBe(true);
    expect(readImportedNode({ id: "s", type: "x-stamp", label: "Stamp", x: 1, y: 2 })?.label).toBe("Stamp");
    expect(readImportedNode({ id: "c", type: "client" })).toBeNull();
  });

  it("drops a link whose end is missing and keeps source and target names", () => {
    const links = readImportedConnections(
      [{ from: "a", to: "missing" }, { source: "a", target: "b", protocol: "loop" }],
      new Set(["a", "b"]),
    );
    expect(links).toHaveLength(1);
    expect(links[0]).toMatchObject({ from: "a", to: "b", protocol: "loop" });
  });

  it("writes both latency names and both link ends", () => {
    const node = readImportedNode({ id: "a", type: "box", label: "Card", x: 1, y: 2, latency: 7 });
    expect(node).not.toBeNull();
    const record = nodeExportRecord(node!);
    expect(record.latency).toBe(7);
    expect(record.latencyMs).toBe(7);
    const saved = connectionExportRecord({ id: "c", from: "a", to: "b", status: "active", protocol: "" });
    expect(saved.source).toBe("a");
    expect(saved.target).toBe("b");
    expect(saved.protocol).toBe("HTTPS");
  });

  it("turns the open sheet into the model the checker reads", () => {
    const shape = readImportedNode({ id: "a", type: "uml-class", label: "Card", x: 4, y: 8, documentation: "A card" });
    expect(shape).not.toBeNull();
    const sheets = sheetsToModel([{
      id: "diagram-1",
      name: "Diagram 1",
      family: "class",
      nodes: [shape!],
      connections: [{ id: "c", from: "a", to: "a", status: "active", protocol: "loop" }],
    }]);
    expect(sheets[0].nodes[0].documentation).toBe("A card");
    expect(sheets[0].nodes[0].w).toBeGreaterThan(0);
    expect(sheets[0].connections[0].label).toBe("loop");
  });

  it("starts freeform empty and keeps each lesson short of done", () => {
    const freeform = CHALLENGES.find((item) => item.id === "freeform");
    expect(freeform?.initialNodes).toEqual([]);
    expect(freeform?.checkSuccess([], [])).toBe(true);
    for (const id of ["c1_security", "c2_design", "c3_cicd", "c4_scale", "c5_observability", "c6_status"]) {
      const challenge = CHALLENGES.find((item) => item.id === id);
      expect(challenge).toBeTruthy();
      expect(challenge?.checkSuccess(challenge.initialNodes, challenge.initialConnections)).toBe(false);
    }
  });

  it("accepts a shielded desk and refuses a client wired to the database", () => {
    const security = CHALLENGES.find((item) => item.id === "c1_security");
    expect(security).toBeTruthy();
    expect(clientReachesDatabase(security!.initialNodes, security!.initialConnections)).toBe(true);
    const nodes = [part("desk", "client"), part("door", "auth"), part("app", "compute"), part("book", "database")];
    expect(security!.checkSuccess(nodes, [link("desk", "book")])).toBe(false);
    expect(security!.checkSuccess(nodes, [link("desk", "door"), link("door", "app"), link("app", "book")])).toBe(true);
    expect(linkIsClientToDatabase(nodes, link("desk", "book"))).toBe(true);
    expect(linkIsClientToDatabase(nodes, link("app", "book"))).toBe(false);
  });

  it("accepts the status desk only when the ledger stays behind the application", () => {
    const status = CHALLENGES.find((item) => item.id === "c6_status");
    const nodes = [part("desk", "client"), part("door", "gateway"), part("app", "compute"), part("book", "database")];
    const sound = [link("desk", "door"), link("door", "app"), link("app", "book")];
    expect(status?.checkSuccess(nodes, sound)).toBe(true);
    expect(status?.checkSuccess(nodes, [...sound, link("desk", "book")])).toBe(false);
    expect(status?.checkSuccess(nodes, [...sound, link("book", "desk")])).toBe(false);
  });

  it("watches the old architect only when that panel is open", () => {
    expect(architectShouldWatch(true, true)).toBe(false);
    expect(architectShouldWatch(false, false)).toBe(false);
    expect(architectShouldWatch(false, true)).toBe(true);
    const lab = readFileSync(new URL("../components/foundry-lab.tsx", import.meta.url), "utf8");
    expect(lab).toContain("architectShouldWatch(fullPage, showAiGuide)");
    const drawing = readFileSync(new URL("../lib/foundry-drawing.ts", import.meta.url), "utf8");
    expect(drawing).not.toContain("foundry-mcp");
    expect(drawing).not.toContain("live.ts");
    expect(drawing).not.toContain('from "react"');
  });
});
