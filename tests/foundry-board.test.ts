import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { boardExtent, isShape, pointOnWire, snapCoord, wirePath } from "../lib/foundry-board";

describe("foundry board", () => {
  it("grows past a part placed at the right of a wide drawing", () => {
    const extent = boardExtent([{ x: 890, y: 150, type: "database" }]);
    expect(extent.w).toBeGreaterThan(890 + 144);
    expect(extent.h).toBeGreaterThanOrEqual(1100);
  });

  it("draws straight, elbow, and curve wires", () => {
    expect(wirePath(0, 0, 100, 0, "straight")).toBe("M 0 0 L 100 0");
    expect(wirePath(0, 0, 100, 40, "elbow")).toContain("L 50 0");
    expect(wirePath(0, 10, 80, 30, "curve")).toContain("C ");
  });

  it("keeps a packet on the wire the user picked", () => {
    expect(pointOnWire(0, 0, 100, 40, 0.5, "straight")).toEqual({ x: 50, y: 20 });
    const elbow = pointOnWire(0, 0, 100, 0, 0.5, "elbow");
    expect(elbow.y).toBe(0);
    const curve = pointOnWire(0, 0, 100, 0, 0, "curve");
    expect(curve).toEqual({ x: 0, y: 0 });
  });

  it("snaps a dragged part to the grid", () => {
    expect(snapCoord(33)).toBe(40);
    expect(snapCoord(0)).toBe(0);
  });

  it("keeps drawing shapes out of the service list", () => {
    expect(isShape("box")).toBe(true);
    expect(isShape("text")).toBe(true);
    expect(isShape("database")).toBe(false);
  });

  it("opens the freeform lab on an empty canvas", () => {
    const foundry = readFileSync(new URL("../components/foundry-lab.tsx", import.meta.url), "utf8");
    expect(foundry).toContain('id: "freeform"');
    expect(foundry).toContain("initialNodes: []");
    expect(foundry).toContain("Blank canvas");
    expect(foundry).toContain("Full page");
    expect(foundry).toContain("Exit full page");
  });
});
