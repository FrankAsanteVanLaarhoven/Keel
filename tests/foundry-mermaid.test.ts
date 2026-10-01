import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { DiagramSnapshot } from "../lib/foundry-extensions";
import { MERMAID_EXAMPLE, readMermaid, wireframeScreen } from "../lib/foundry-mermaid";
import { sketchPath } from "../lib/foundry-sketch";

const empty: DiagramSnapshot = { language: "uml", family: "class", selectedNodeId: null, nodes: [], connections: [] };

function drawn(source: string, diagram: DiagramSnapshot = empty) {
  const result = readMermaid(source, diagram);
  if ("error" in result) throw new Error(result.error);
  return result;
}

describe("foundry mermaid", () => {
  it("draws the Harbor Library flowchart downward", () => {
    const result = drawn(MERMAID_EXAMPLE);
    expect(result.family).toBe("flowchart");
    expect(result.patch.addNodes.map((node) => [node.type, node.label])).toEqual([
      ["flow-proc", "Reader"],
      ["flow-proc", "Library card"],
      ["flow-decide", "On loan?"],
    ]);
    expect(result.patch.addConnections.map((link) => link.kind)).toEqual(["flow", "flow"]);
    expect(result.patch.addNodes[1].y).toBeGreaterThan(result.patch.addNodes[0].y);
    expect(result.patch.addNodes[1].x).toBe(result.patch.addNodes[0].x);
  });

  it("lays a left-to-right graph across the sheet", () => {
    const across = drawn("graph LR\nA[One] --> B[Two]");
    const down = drawn("flowchart TD\nA[One] --> B[Two]");
    expect(across.patch.addNodes[1].x - across.patch.addNodes[0].x).toBeGreaterThan(down.patch.addNodes[1].x - down.patch.addNodes[0].x);
    expect(drawn("flowchart LR\nReader-->Card[Library card]").patch.addNodes.map((node) => node.label)).toEqual(["Reader", "Library card"]);
  });

  it("reads a class diagram and keeps members out of the sheet", () => {
    const result = drawn(`classDiagram
class Card {
  title
}
class Loan
Card <|-- Loan`);
    expect(result.family).toBe("class");
    expect(result.patch.addNodes.map((node) => [node.type, node.label])).toEqual([
      ["uml-class", "Card"],
      ["uml-class", "Loan"],
    ]);
    expect(result.patch.addConnections).toEqual([
      expect.objectContaining({ kind: "generalization", label: "" }),
    ]);
  });

  it("reads an entity relationship", () => {
    const result = drawn("erDiagram\nCARD ||--o{ LOAN : holds");
    expect(result.family).toBe("erd");
    expect(result.patch.addNodes.map((node) => node.type)).toEqual(["erd-entity", "erd-entity"]);
    expect(result.patch.addConnections[0]).toMatchObject({ kind: "crows", label: "holds" });
  });

  it("reads a sequence, a return, and a participant name", () => {
    const ask = drawn("sequenceDiagram\nparticipant Reader as Library reader\nReader->>Desk: ask");
    expect(ask.family).toBe("sequence");
    expect(ask.patch.addNodes.map((node) => [node.type, node.label])).toEqual([
      ["uml-life", "Library reader"],
      ["uml-life", "Desk"],
    ]);
    expect(ask.patch.addConnections[0]).toMatchObject({ kind: "message", label: "ask" });
    const back = drawn("sequenceDiagram\nReader-->>Desk: back");
    expect(back.patch.addConnections[0].kind).toBe("return");
  });

  it("unwraps a fenced block and refuses an unknown header", () => {
    const fenced = drawn("```mermaid\nflowchart TD\nReader[Reader] --> Card[Card]\n```");
    expect(fenced.patch.addNodes).toHaveLength(2);
    expect(readMermaid("", empty)).toEqual({ error: "Write a Mermaid diagram, then draw again." });
    expect(readMermaid("pie title Pets", empty)).toEqual({
      error: "This desk reads flowchart, classDiagram, erDiagram, and sequenceDiagram. Start with one of those, then draw again.",
    });
    expect(readMermaid("flowchart TD", empty)).toEqual({
      error: "Add a shape such as Reader[Reader] --> Card[Card], then draw again.",
    });
    const long = readMermaid(`flowchart TD\n${"x".repeat(4001)}`, empty);
    expect("error" in long ? long.error : "").toMatch(/4,000 characters/);
  });

  it("stops a description that will not fit the desk", () => {
    const lines = ["flowchart TD", ...Array.from({ length: 13 }, (_, index) => `N${index}[N${index}]`)];
    expect(readMermaid(lines.join("\n"), empty)).toEqual({
      error: "This description has more than 12 shapes. Split it and draw again.",
    });
  });

  it("places a Harbor Library screen", () => {
    const screen = wireframeScreen(empty);
    expect(screen.family).toBe("wireframe");
    expect(screen.patch.addConnections).toEqual([]);
    expect(screen.patch.addNodes.map((node) => [node.type, node.label])).toEqual([
      ["wf-screen", "Library"],
      ["wf-head", "Find a book"],
      ["wf-field", "Card number"],
      ["wf-button", "Search"],
    ]);
    const crowded = wireframeScreen({
      ...empty,
      nodes: ["s0", "s1", "s2", "s3"].map((id) => ({ id, type: "box", label: id, x: 0, y: 0, w: 40, h: 40, stereotype: "" })),
    });
    expect(crowded.patch.addNodes.map((node) => node.key)).toEqual(["w0", "w1", "w2", "w3"]);
  });

  it("keeps the sketch stroke stable", () => {
    const first = sketchPath(280, 180, "screen");
    expect(sketchPath(280, 180, "screen")).toBe(first);
    expect(first.startsWith("M ")).toBe(true);
    expect(first).toContain(" Q ");
    const tiny = sketchPath(8, 8, "tiny").match(/-?\d+/g)?.map(Number) ?? [];
    expect(Math.max(...tiny)).toBeLessThanOrEqual(27);
    expect(Math.max(...tiny)).toBeGreaterThan(20);
  });

  it("keeps the desk in the lab and off the class model", () => {
    const lab = readFileSync(new URL("../components/foundry-lab.tsx", import.meta.url), "utf8");
    const panel = readFileSync(new URL("../components/foundry-mermaid.tsx", import.meta.url), "utf8");
    const parser = readFileSync(new URL("../lib/foundry-mermaid.ts", import.meta.url), "utf8");
    expect(lab).toContain(">Mermaid</button>");
    expect(lab).toContain(">Sketch</button>");
    expect(lab).toContain("foundry-sketch");
    expect(lab).toContain("<FoundryMermaid");
    expect(panel).toContain("Draw from Mermaid");
    expect(panel).toContain("Place a screen");
    expect(panel).not.toContain("foundry-mcp");
    expect(panel).not.toContain("XAI_API_KEY");
    expect(parser).not.toContain("foundry-mcp");
    expect(parser).not.toContain("live.ts");
  });
});
