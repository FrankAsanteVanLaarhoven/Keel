import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  checkModel,
  codeTokens,
  diagramSvg,
  htmlNotes,
  readModelFile,
  relationshipLines,
  sketchLanguage,
  unconnectedNodes,
  type ModelSheet,
} from "../lib/foundry-model";

const root = fileURLToPath(new URL("..", import.meta.url));

const card: ModelSheet = {
  name: "Harbor",
  nodes: [{ id: "card", type: "uml-class", label: "Library card", attributes: "title", documentation: "A library card" }],
  connections: [],
};

describe("foundry model", () => {
  it("names a blank shape, a repeated name, and a link with no end", () => {
    const sheet: ModelSheet = {
      name: "Harbor",
      nodes: [
        { id: "a", type: "uml-class", label: "Card" },
        { id: "a", type: "uml-class", label: "" },
        { id: "b", type: "uml-class", label: "Card" },
      ],
      connections: [{ from: "b", to: "missing" }, { from: "b", to: "b" }],
    };
    const issues = checkModel([sheet]);
    expect(issues.map((issue) => issue.message).join("\n")).toMatch(/share an id/);
    expect(issues.map((issue) => issue.message).join("\n")).toMatch(/has no name/);
    expect(issues.map((issue) => issue.message).join("\n")).toMatch(/"Card" is used more than once/);
    expect(issues.map((issue) => issue.message).join("\n")).toMatch(/points at a shape that is not/);
    expect(checkModel([{ name: "Harbor", nodes: [{ id: "a", type: "uml-class", label: "Card" }], connections: [{ from: "a", to: "a" }] }])).toEqual([]);
  });

  it("sketches Java, C#, C++, and Python from the shape name", () => {
    expect(sketchLanguage([card], "java")).toContain("public class LibraryCard");
    expect(sketchLanguage([card], "java")).toContain("private String title");
    expect(sketchLanguage([card], "java")).toContain("// A library card");
    expect(sketchLanguage([card], "cs")).toContain("public class LibraryCard");
    expect(sketchLanguage([card], "cpp")).toContain("class LibraryCard");
    expect(sketchLanguage([card], "cpp")).toContain("#include <string>");
    expect(sketchLanguage([card], "py")).toContain("class LibraryCard:");
    expect(sketchLanguage([card], "java")).toContain("getTitle()");
    expect(sketchLanguage([card], "java")).toContain("setTitle(String value)");
    expect(sketchLanguage([card], "php")).toContain("<?php");
    expect(sketchLanguage([card], "php")).toContain("public string $title");
    expect(sketchLanguage([card], "js")).toContain("export class LibraryCard");
    expect(sketchLanguage([card], "ts")).toContain("title: string");
    expect(sketchLanguage([card], "ruby")).toContain("attr_accessor :title");
    expect(sketchLanguage([card], "sql")).toContain("CREATE TABLE library_card");
    expect(sketchLanguage([card], "sql")).toContain("title text");
    expect(sketchLanguage([card], "graphql")).toContain("type LibraryCard");
    expect(sketchLanguage([card], "graphql")).toContain("title: String");
    expect(sketchLanguage([{ nodes: [], connections: [] }], "java")).toContain("Draw a shape, then sketch the code again.");
    expect(sketchLanguage([{ nodes: [], connections: [] }], "sql")).toContain("-- Draw a shape, then sketch the code again.");
  });

  it("lists the lines on a shape and the shapes with none", () => {
    const sheet: ModelSheet = {
      name: "Harbor",
      nodes: [
        { id: "card", type: "uml-class", label: "Card" },
        { id: "reader", type: "uml-class", label: "Reader" },
        { id: "note", type: "note", label: "Spare" },
      ],
      connections: [{ from: "reader", to: "card", label: "borrows" }],
    };
    expect(relationshipLines(sheet, "card")).toEqual(["Reader to Card (borrows)"]);
    expect(relationshipLines(sheet, "missing")).toEqual(["Select a shape, then look at its lines again."]);
    expect(relationshipLines(sheet, "note")).toEqual(["Spare has no line."]);
    expect(unconnectedNodes(sheet)).toEqual([{ id: "note", label: "Spare" }]);
    expect(unconnectedNodes({ nodes: [{ id: "a", type: "box", label: "Card" }], connections: [{ from: "a", to: "a" }] })).toEqual([]);
  });

  it("escapes notes and draws an ink svg", () => {
    const html = htmlNotes([{
      name: "Harbor",
      nodes: [{ id: "a", type: "note", label: "Card", documentation: "<script>alert(1)</script>\n[go](javascript:alert(1))" }],
      connections: [],
    }], "Harbor");
    expect(html).not.toContain("<script>");
    expect(html).not.toContain('href="javascript:');
    expect(html).toContain("Notes from a Keel Foundry sheet.");
    const svg = diagramSvg({ nodes: [{ id: "a", type: "box", label: "<Card>", x: 10, y: 10 }], connections: [] });
    expect(svg).toContain("&lt;Card&gt;");
    expect(svg).toContain("Card");
    expect(diagramSvg({ nodes: [], connections: [] })).toContain("This diagram is empty.");
  });

  it("reads an export and a bare sheet", () => {
    const exported = readModelFile({
      specVersion: "2.0-keel-foundry",
      sheets: [{ name: "Diagram 1", nodes: [{ id: "a", type: "box", label: "Desk" }], connections: [{ from: "a", to: "a", protocol: "loop" }] }],
    });
    expect(Array.isArray(exported)).toBe(true);
    if (!Array.isArray(exported)) return;
    expect(exported[0].connections[0].label).toBe("loop");
    const bare = readModelFile({ nodes: [{ id: "a", type: "box", label: "Desk" }], connections: [] });
    expect(Array.isArray(bare)).toBe(true);
    expect(readModelFile({ nope: true })).toEqual({ error: "This file is not a Foundry drawing. Open a JSON file saved from this lab." });
    expect(codeTokens("public class Card").some((token) => token.text === "class" && token.keyword)).toBe(true);
  });

  it("writes a sketch from the command line and reports a bad file", () => {
    const dir = mkdtempSync(join(tmpdir(), "keel-foundry-"));
    const file = join(dir, "drawing.json");
    const run = (extra: string[]) => spawnSync(
      process.execPath,
      ["--experimental-strip-types", "scripts/foundry-cli.mjs", file, ...extra],
      { cwd: root, encoding: "utf8" },
    );
    try {
      writeFileSync(file, JSON.stringify({ nodes: [{ id: "c", type: "uml-class", label: "Card" }], connections: [] }));
      const sketch = run(["--code", "java"]);
      expect(sketch.status).toBe(0);
      expect(sketch.stdout).toContain("class Card");
      const clean = run(["--check"]);
      expect(clean.status).toBe(0);
      expect(clean.stdout).toContain("Checked. No notes.");
      writeFileSync(file, JSON.stringify({ nodes: [{ id: "c", type: "uml-class", label: "" }], connections: [] }));
      const notes = run(["--check"]);
      expect(notes.status).toBe(1);
      expect(notes.stdout).toMatch(/has no name/);
      writeFileSync(file, "not json");
      const bad = run(["--check"]);
      expect(bad.status).toBe(2);
      expect(bad.stderr).toContain("This file is not a Foundry drawing. Open a JSON file saved from this lab.");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("keeps the desk local", () => {
    const lab = readFileSync(new URL("../components/foundry-lab.tsx", import.meta.url), "utf8");
    const panel = readFileSync(new URL("../components/foundry-modeling.tsx", import.meta.url), "utf8");
    const model = readFileSync(new URL("../lib/foundry-model.ts", import.meta.url), "utf8");
    const cli = readFileSync(new URL("../scripts/foundry-cli.mjs", import.meta.url), "utf8");
    expect(lab).toContain(">Commands</button>");
    expect(lab).toContain(">Modeling</button>");
    expect(lab).toContain(">Mermaid</button>");
    expect(lab).toContain(">AI desk</button>");
    expect(lab).toContain(">Sketch</button>");
    expect(lab).toContain("queueMicrotask");
    expect(panel).toContain("class build");
    expect(panel).toContain("Windows, macOS, or Linux");
    expect(panel).toContain("SKETCH_LANGUAGES");
    expect(model).toContain('id: "php"');
    expect(model).toContain('id: "graphql"');
    expect(panel).toContain("does not install an extension from the web");
    expect(panel).not.toContain("StarUML");
    expect(lab).toContain('label: "Relationships"');
    expect(lab).toContain('label: "Unconnected"');
    expect(lab).toContain('label: "Copy name"');
    expect(model).not.toContain("XMI");
    for (const source of [panel, model, cli]) {
      expect(source).not.toContain("foundry-mcp");
      expect(source).not.toContain("XAI_API_KEY");
      expect(source).not.toContain("live.ts");
    }
  });
});
