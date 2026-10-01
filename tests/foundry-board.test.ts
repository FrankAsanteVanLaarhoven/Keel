import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  DATAFLOW_PARTS,
  UML_FAMILIES,
  UML_RELATIONS,
  UML_TOOLS,
  boardExtent,
  compartmentLines,
  crowMark,
  defaultFamily,
  defaultSize,
  diagramsFor,
  familyOf,
  isShape,
  languageLabel,
  languageOf,
  memberLine,
  loopPath,
  pointOnWire,
  readStoredProject,
  relationKindOf,
  relationLook,
  relationsFor,
  snapCoord,
  stereotypeLabel,
  toolboxFor,
  toolsFor,
  umlGlyph,
  wirePath,
} from "../lib/foundry-board";
import { servicePlan } from "../lib/runpack";

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
    const drawing = readFileSync(new URL("../lib/foundry-drawing.ts", import.meta.url), "utf8");
    expect(drawing).toContain('id: "freeform"');
    expect(drawing).toContain("initialNodes: []");
    expect(foundry).not.toContain('id: "freeform"');
    expect(foundry).toContain("Blank canvas");
    expect(foundry).toContain("Full page");
    expect(foundry).toContain("Exit full page");
    expect(foundry).toContain('aria-label="Modeling language"');
    expect(foundry).toContain('aria-label="UML diagram"');
    expect(foundry).toContain('aria-label="UML relation"');
    expect(foundry).toContain('aria-label="Toolbox"');
    expect(foundry).toContain('aria-label="Model explorer"');
    expect(foundry).toContain('aria-label="Working diagrams"');
    expect(foundry).toContain("isAbstract");
    expect(foundry).toContain("fromMult");
    expect(foundry).toContain("stereotype");
  });

  it("keeps every UML element off the runnable service list", () => {
    const seen = new Set<string>();
    for (const tool of UML_TOOLS) {
      expect(tool.type.length).toBeLessThanOrEqual(20);
      expect(isShape(tool.type)).toBe(true);
      expect(umlGlyph(tool.type)).toBe(tool.glyph);
      expect(defaultSize(tool.type)).toEqual({ w: tool.w, h: tool.h });
      expect(seen.has(tool.type)).toBe(false);
      seen.add(tool.type);
    }
    const covered = new Set(UML_FAMILIES.flatMap((family) => toolsFor(family.id).map((tool) => tool.type)));
    expect(covered.size).toBe(UML_TOOLS.length);
    for (const family of UML_FAMILIES) {
      if (family.id === "dataflow") expect(toolsFor(family.id)).toEqual([]);
      else expect(toolsFor(family.id).length).toBeGreaterThan(0);
    }
    expect(isShape("database")).toBe(false);
    const plan = servicePlan(
      [
        { id: "desk", type: "client" },
        { id: "door", type: "gateway" },
        { id: "app", type: "compute" },
        { id: "order", type: "uml-class" },
      ],
      [
        { from: "desk", to: "door" },
        { from: "door", to: "app" },
        { from: "order", to: "desk" },
      ],
    );
    expect(plan.ok).toBe(true);
  });

  it("draws UML relations with their markers and keeps class text", () => {
    expect(relationLook("composition")).toMatchObject({ start: "diamond-filled", end: "none", dashed: false });
    expect(relationLook("aggregation")?.start).toBe("diamond");
    expect(relationLook("generalization")?.end).toBe("triangle");
    expect(relationLook("realization")).toMatchObject({ dashed: true, end: "triangle" });
    expect(relationLook("dependency")).toMatchObject({ dashed: true, end: "open" });
    expect(relationLook("include")?.label).toBe("«include»");
    expect(relationLook("extend")?.label).toBe("«extend»");
    expect(relationLook("message")?.end).toBe("arrow");
    expect(relationLook("containment")?.start).toBe("plus");
    expect(relationLook("not-a-kind")).toBeNull();
    expect(relationKindOf("deploy")).toBe("deploy");
    expect(relationKindOf("")).toBe("");
    const named = new Set<string>();
    for (const relation of UML_RELATIONS) {
      expect(relationLook(relation.id)?.name).toBe(relation.name);
      expect(named.has(relation.id)).toBe(false);
      named.add(relation.id);
    }
    for (const family of UML_FAMILIES) {
      if (family.id === "dataflow") expect(relationsFor(family.id)).toEqual([]);
      else expect(relationsFor(family.id).length).toBeGreaterThan(0);
    }
    expect(compartmentLines(" id \n\nname: string ")).toEqual(["id", "name: string"]);
    expect(stereotypeLabel("entity")).toBe("«entity»");
    expect(stereotypeLabel("«interface»")).toBe("«interface»");
    expect(loopPath(10, 20)).toContain("C ");
    expect(crowMark("1")).toBe("one");
    expect(crowMark("0..1")).toBe("optional");
    expect(crowMark("*")).toBe("many");
    expect(crowMark("0..*")).toBe("optional-many");
    expect(memberLine("name", "public")).toBe("+ name");
    expect(memberLine("PK id", "public")).toBe("PK id");
    expect(memberLine("+ title", "private")).toBe("+ title");
    const erd = toolboxFor("erd").flatMap((group) => group.entries.map((entry) => entry.name));
    expect(erd).toContain("Entity");
    expect(erd).toContain("Crow's foot");
    const ai = toolboxFor("ai").flatMap((group) => group.entries.map((entry) => entry.name));
    expect(ai).toContain("Agent");
    expect(ai).toContain("Guard");
    expect(toolboxFor("class").map((group) => group.name)).toContain("Classes (basic)");
    expect(diagramsFor("uml").map((family) => family.id)).toEqual(expect.arrayContaining(["timing", "overview", "infoflow", "profile"]));
    expect(toolboxFor("timing").flatMap((group) => group.entries.map((entry) => entry.name))).toEqual(expect.arrayContaining(["Lifeline", "Duration", "Tick", "Time constraint"]));
    expect(toolboxFor("overview").flatMap((group) => group.entries.map((entry) => entry.name))).toContain("Interaction");
    expect(toolboxFor("infoflow").flatMap((group) => group.entries.map((entry) => entry.name))).toEqual(expect.arrayContaining(["Information", "Item flow"]));
    expect(toolboxFor("profile").flatMap((group) => group.entries.map((entry) => entry.name))).toEqual(expect.arrayContaining(["Stereotype", "Metaclass", "Extension"]));
    const names = (family: string) => toolboxFor(family).flatMap((group) => group.entries.map((entry) => entry.name));
    expect(names("sysml")).toEqual(expect.arrayContaining(["Block", "Requirement", "Port", "Composition", "Item flow", "Satisfy"]));
    expect(names("c4")).toEqual(expect.arrayContaining(["Person", "Container", "Component"]));
    expect(names("flowchart")).toContain("Start");
    expect(names("mindmap")).toContain("Topic");
    expect(names("bpmn")).toEqual(expect.arrayContaining(["Task", "Gateway", "Sequence flow", "Message flow"]));
    const flow = toolboxFor("dataflow").flatMap((group) => group.entries);
    expect(flow.some((entry) => entry.kind === "service" && entry.type === "client")).toBe(true);
    expect(flow.some((entry) => entry.kind === "wire" && entry.name === "Dataflow")).toBe(true);
    expect(flow.some((entry) => entry.kind === "relation")).toBe(false);
    for (const part of DATAFLOW_PARTS) expect(isShape(part.type)).toBe(false);
    expect(umlGlyph("client")).toBe("");
    expect(umlGlyph("sys-block")).toBe("class");
    expect(relationKindOf("")).toBe("");
    expect(relationLook("flow")).toMatchObject({ dashed: false, end: "open" });
    expect(relationLook("branch")).toMatchObject({ end: "none", start: "none" });
    expect(relationLook("sequence")?.end).toBe("arrow");
    expect(relationLook("messageflow")).toMatchObject({ dashed: true, end: "arrow" });
    expect(relationLook("satisfy")?.label).toBe("«satisfy»");
    expect(languageOf("class")).toBe("uml");
    expect(languageOf("deploy")).toBe("uml");
    expect(languageOf("erd")).toBe("erd");
    expect(languageOf("sysml")).toBe("sysml");
    expect(languageOf("bpmn")).toBe("bpmn");
    expect(languageOf("dataflow")).toBe("dataflow");
    expect(languageOf("wireframe")).toBe("wireframe");
    expect(languageOf("aws")).toBe("aws");
    expect(languageOf("gcp")).toBe("gcp");
    expect(languageOf("azure")).toBe("azure");
    expect(names("wireframe")).toEqual(expect.arrayContaining(["Screen", "Button", "Field", "Link"]));
    expect(names("aws")).toEqual(expect.arrayContaining(["EC2", "Lambda", "S3", "RDS"]));
    expect(names("gcp")).toEqual(expect.arrayContaining(["Compute Engine", "Cloud Storage", "Cloud Run"]));
    expect(names("azure")).toEqual(expect.arrayContaining(["Virtual machine", "Blob storage", "Entra ID"]));
    for (const cloud of ["aws-ec2", "gcp-gce", "az-vm", "wf-screen"]) expect(isShape(cloud)).toBe(true);
    expect(diagramsFor("uml").map((item) => item.id)).toEqual(["class", "usecase", "sequence", "activity", "component", "deploy", "state", "object", "package", "timing", "overview", "infoflow", "profile"]);
    expect(defaultFamily("uml")).toBe("class");
    expect(defaultFamily("c4")).toBe("c4");
    expect(familyOf("mindmap")).toBe("mindmap");
    expect(familyOf("nope")).toBe("class");
    expect(languageLabel("sequence")).toBe("UML 2 · Sequence");
    expect(languageLabel("bpmn")).toBe("BPMN");
    const project = readStoredProject({
      sheetId: "blocks",
      sheets: [
        { id: "domain", name: "Domain", family: "erd", nodes: [{ id: "loan" }], connections: [] },
        { id: "blocks", name: "Blocks", family: "sysml", nodes: [{ id: "catalog" }], connections: [] },
      ],
    });
    expect(project?.sheetId).toBe("blocks");
    expect(project?.sheets.map((sheet) => sheet.family)).toEqual(["erd", "sysml"]);
    const legacy = readStoredProject({ nodes: [{ id: "desk", type: "client" }], connections: [] });
    expect(legacy?.sheets).toHaveLength(1);
    expect(legacy?.sheets[0].family).toBe("class");
    expect(legacy?.sheets[0].nodes).toHaveLength(1);
  });
});
