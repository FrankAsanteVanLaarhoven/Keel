import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { UML_TOOLS } from "../lib/foundry-board";
import {
  EXTENSION_EXAMPLE,
  EXTENSION_FRAME_HTML,
  compileCommands,
  compileTools,
  extensionDraftError,
  isExtensionType,
  parseExtensionStore,
  readDiagramPatch,
  toolVisible,
} from "../lib/foundry-extensions";

describe("foundry extensions", () => {
  it("keeps an extension shape off the runnable service list", () => {
    expect(isExtensionType("x-stamp")).toBe(true);
    expect(isExtensionType("client")).toBe(false);
    expect(isExtensionType("x-")).toBe(false);
    expect("x-stamp".length).toBeLessThanOrEqual(20);
    for (const tool of UML_TOOLS) expect(isExtensionType(tool.type)).toBe(false);
  });

  it("stores only named scripts and drops a broken file", () => {
    const saved = parseExtensionStore(JSON.stringify({
      items: [
        { id: "ext-1", name: "Stamp notes", source: "keel.tool({})", enabled: true },
        { id: "ext-1", name: "Again", source: "keel.command()", enabled: true },
        { name: "Missing" },
      ],
    }));
    expect(saved).toEqual([{ id: "ext-1", name: "Stamp notes", source: "keel.tool({})", enabled: true }]);
    expect(parseExtensionStore("not json")).toEqual([]);
    expect(extensionDraftError("", "keel.tool({})", 0, false)).toMatch(/name/);
    expect(extensionDraftError("Stamp notes", "", 0, false)).toMatch(/empty/);
    expect(extensionDraftError("Stamp notes", "keel.tool({})", 12, false)).toMatch(/12/);
  });

  it("accepts the example and refuses a shape the desk does not know", () => {
    const tools: unknown[] = [];
    const commands: { name: string; run: (diagram: { nodes: { id: string; label: string }[] }) => unknown }[] = [];
    const keel = {
      tool(spec: unknown) { tools.push(spec); },
      command(name: string, run: (diagram: { nodes: { id: string; label: string }[] }) => unknown) { commands.push({ name, run }); },
    };
    const run = new Function("keel", `"use strict";\n${EXTENSION_EXAMPLE}`) as (api: { tool: (spec: unknown) => void; command: (name: string, run: (diagram: { nodes: { id: string; label: string }[] }) => unknown) => void }) => void;
    run(keel);
    const compiled = compileTools(tools, new Set());
    expect(compiled.error).toBe("");
    expect(compiled.tools[0]).toMatchObject({ id: "x-stamp", glyph: "art", languages: ["uml", "flowchart", "erd"] });
    expect(toolVisible(compiled.tools[0], "uml", "class")).toBe(true);
    expect(toolVisible(compiled.tools[0], "aws", "aws")).toBe(false);
    expect(compileCommands(commands.map((command) => ({ name: command.name }))).commands[0].name).toBe("Number shapes");
    const patch = commands[0].run({ nodes: [{ id: "a", label: "Stamp" }] });
    const applied = readDiagramPatch(patch, new Set(["x-stamp", "box"]), new Set(["a"]), new Set());
    expect(applied).toMatchObject({ updateNodes: [{ id: "a", label: "1. Stamp" }] });
    expect(compileTools([{ id: "stamp", name: "Stamp", languages: ["uml"], glyph: "art" }], new Set()).error).toMatch(/x-stamp/);
    expect(compileTools([{ id: "x-stamp", name: "Stamp", languages: ["uml"], glyph: "spark" }], new Set()).error).toMatch(/known shape/);
  });

  it("applies a small diagram change and rejects a runaway one", () => {
    const added = readDiagramPatch(
      { addNodes: [{ type: "box", label: "Note" }], addConnections: [{ from: "desk", to: "note", kind: "association", label: "uses" }] },
      new Set(["box"]),
      new Set(["desk"]),
      new Set(),
    );
    expect("error" in added).toBe(true);
    const linked = readDiagramPatch(
      { addNodes: [{ key: "note", type: "box", label: "Note" }], addConnections: [{ from: "desk", to: "note", kind: "association", label: "uses" }] },
      new Set(["box"]),
      new Set(["desk"]),
      new Set(),
    );
    expect(linked).toMatchObject({ addNodes: [{ key: "note", type: "box", label: "Note" }], addConnections: [{ from: "desk", to: "note", kind: "association" }] });
    const removed = readDiagramPatch({ deleteNodes: ["desk"] }, new Set(), new Set(["desk"]), new Set(["c1"]));
    expect(removed).toMatchObject({ deleteNodes: ["desk"], summary: "Removed 1 shape." });
    const flood = readDiagramPatch({ addNodes: Array.from({ length: 41 }, () => ({ type: "box" })) }, new Set(["box"]), new Set(), new Set());
    expect(flood).toMatchObject({ error: expect.stringMatching(/40/) });
    const service = readDiagramPatch({ addNodes: [{ type: "not-a-part" }] }, new Set(["box"]), new Set(), new Set());
    expect(service).toMatchObject({ error: expect.stringMatching(/not a tool/) });
  });

  it("runs extension scripts in a frame that cannot reach the class", () => {
    expect(EXTENSION_FRAME_HTML).toContain("default-src 'none'");
    expect(EXTENSION_FRAME_HTML).toContain("script-src 'unsafe-inline' 'unsafe-eval'");
    expect(EXTENSION_FRAME_HTML).not.toContain("fetch(");
    expect(EXTENSION_FRAME_HTML).not.toContain("document.cookie");
    const lab = readFileSync(new URL("../components/foundry-lab.tsx", import.meta.url), "utf8");
    const host = readFileSync(new URL("../components/foundry-extensions.tsx", import.meta.url), "utf8");
    const frame = readFileSync(new URL("../app/foundry-extension-frame/route.ts", import.meta.url), "utf8");
    const proxy = readFileSync(new URL("../proxy.ts", import.meta.url), "utf8");
    expect(lab).toContain(">Extensions</button>");
    expect(host).toContain('sandbox="allow-scripts"');
    expect(host).toContain('src="/foundry-extension-frame"');
    expect(host).not.toContain("srcDoc");
    expect(host).toContain('aria-label="Extensions"');
    expect(host).toContain('aria-label="Extension commands"');
    expect(frame).toContain("frame-ancestors 'self'");
    expect(frame).toContain("EXTENSION_FRAME_HTML");
    expect(proxy).toContain("foundry-extension-frame");
  });
});
