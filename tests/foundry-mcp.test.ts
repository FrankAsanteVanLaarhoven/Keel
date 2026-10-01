import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  FOUNDRY_MCP_PATH,
  handleFoundryMcpMessage,
  localDiagram,
  mcpOriginAllowed,
  sketchCode,
  suggestionsFor,
  wantsFoundryModel,
  type FoundryMcpPayload,
} from "../lib/foundry-mcp";
import type { DiagramSnapshot } from "../lib/foundry-extensions";

const empty: DiagramSnapshot = { language: "uml", family: "class", selectedNodeId: null, nodes: [], connections: [] };

function payload(result: { body: unknown }): FoundryMcpPayload {
  const body = result.body as { result?: { structuredContent?: FoundryMcpPayload; isError?: boolean } };
  return body.result?.structuredContent as FoundryMcpPayload;
}

describe("foundry mcp", () => {
  it("speaks initialize, tools, and notifications", async () => {
    const started = await handleFoundryMcpMessage({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: { protocolVersion: "2025-03-26", capabilities: {}, clientInfo: { name: "test", version: "0" } },
    }, { allowModel: false });
    const body = started.body as { result: { protocolVersion: string; serverInfo: { name: string }; capabilities: { tools: unknown } } };
    expect(body.result.protocolVersion).toBe("2025-03-26");
    expect(body.result.serverInfo.name).toBe("keel-foundry");
    expect(body.result.capabilities.tools).toBeTruthy();

    const listed = await handleFoundryMcpMessage({ jsonrpc: "2.0", id: 2, method: "tools/list" }, { allowModel: false });
    const names = (listed.body as { result: { tools: { name: string }[] } }).result.tools.map((tool) => tool.name);
    expect(names).toEqual(["list_desk", "suggest_diagram", "generate_diagram", "generate_code"]);

    const notice = await handleFoundryMcpMessage({ jsonrpc: "2.0", method: "notifications/initialized" }, { allowModel: false });
    expect(notice.status).toBe(202);
    expect(notice.body).toBeNull();

    const missing = await handleFoundryMcpMessage({ jsonrpc: "2.0", id: 3, method: "resources/list" }, { allowModel: false });
    expect((missing.body as { error: { code: number } }).error.code).toBe(-32601);
    expect(mcpOriginAllowed(null, "127.0.0.1:3960")).toBe(true);
    expect(mcpOriginAllowed("https://evil.example", "127.0.0.1:3960")).toBe(false);
    expect(mcpOriginAllowed("http://127.0.0.1:3964", "127.0.0.1:3964")).toBe(true);
  });

  it("draws, suggests, and sketches on the desk without a model", async () => {
    const drawn = await handleFoundryMcpMessage({
      jsonrpc: "2.0",
      id: 4,
      method: "tools/call",
      params: { name: "generate_diagram", arguments: { prompt: "Card and Loan", diagram: { ...empty, family: "class" } } },
    }, { allowModel: false });
    const diagram = payload(drawn);
    expect(diagram.source).toBe("desk");
    expect(diagram.note).toContain("Answered on this desk");
    expect(diagram.patch?.addNodes.map((node) => node.label)).toEqual(["Card", "Loan"]);
    expect(diagram.patch?.addNodes.every((node) => node.type === "uml-class")).toBe(true);
    expect(diagram.patch?.addConnections[0]?.kind).toBe("association");

    const flow = localDiagram("Client to Gateway to Compute", { ...empty, language: "dataflow", family: "dataflow" });
    expect(flow.addNodes.map((node) => node.type)).toEqual(["client", "gateway", "compute"]);
    expect(flow.addConnections.every((link) => link.kind === "")).toBe(true);

    const blank = await handleFoundryMcpMessage({
      jsonrpc: "2.0",
      id: 5,
      method: "tools/call",
      params: { name: "generate_diagram", arguments: { prompt: "   ", diagram: empty } },
    }, { allowModel: false });
    expect((blank.body as { result: { isError: boolean } }).result.isError).toBe(true);
    expect(payload(blank).summary).toContain("Describe the diagram");

    const hints = suggestionsFor({
      ...empty,
      nodes: [
        { id: "n1", type: "uml-class", label: "Card", x: 0, y: 0, w: 160, h: 90, stereotype: "" },
        { id: "n2", type: "uml-class", label: "Card", x: 200, y: 0, w: 160, h: 90, stereotype: "" },
      ],
    });
    expect(hints.some((hint) => hint.includes("share the name Card"))).toBe(true);
    expect(hints.some((hint) => hint.includes("not linked"))).toBe(true);
    expect(suggestionsFor(empty)[0]).toContain("empty");

    const code = sketchCode({
      language: "erd",
      family: "erd",
      selectedNodeId: null,
      nodes: [{ id: "e1", type: "erd-entity", label: "Library card", x: 0, y: 0, w: 160, h: 90, stereotype: "" }],
      connections: [],
    });
    expect(code).toContain("CREATE TABLE library_card");
    expect(code.toLowerCase()).not.toContain("dockerfile");
    expect(code.toLowerCase()).not.toContain("github");

    const services = sketchCode({
      language: "dataflow",
      family: "dataflow",
      selectedNodeId: null,
      nodes: [{ id: "c", type: "client", label: "Reader", x: 0, y: 0, w: 120, h: 70, stereotype: "" }],
      connections: [],
    });
    expect(services).toContain("not started");
    expect(wantsFoundryModel({ method: "tools/call", params: { name: "suggest_diagram" } })).toBe(false);
    expect(wantsFoundryModel({ method: "tools/call", params: { name: "generate_code" } })).toBe(true);
  });

  it("uses a fitting model reply and keeps a desk sketch when the reply does not fit", async () => {
    let calls = 0;
    const reply = async () => {
      calls += 1;
      return JSON.stringify({
        addNodes: [
          { key: "a", type: "uml-class", label: "Member", x: 40, y: 40, stereotype: "" },
          { key: "b", type: "uml-class", label: "Copy", x: 240, y: 40, stereotype: "" },
        ],
        addConnections: [{ from: "a", to: "b", kind: "association", label: "" }],
      });
    };
    const drawn = await handleFoundryMcpMessage({
      jsonrpc: "2.0",
      id: 6,
      method: "tools/call",
      params: { name: "generate_diagram", arguments: { prompt: "Card and Loan", diagram: empty } },
    }, { allowModel: true, reply });
    expect(payload(drawn).source).toBe("model");
    expect(payload(drawn).patch?.addNodes.map((node) => node.label)).toEqual(["Member", "Copy"]);
    expect(payload(drawn).note).toContain("class model");

    const fallback = await handleFoundryMcpMessage({
      jsonrpc: "2.0",
      id: 7,
      method: "tools/call",
      params: { name: "generate_diagram", arguments: { prompt: "Card and Loan", diagram: empty } },
    }, { allowModel: true, reply: async () => "not a diagram" });
    expect(payload(fallback).source).toBe("desk");
    expect(payload(fallback).note).toContain("did not fit");
    expect(payload(fallback).patch?.addNodes[0]?.label).toBe("Card");

    const suggest = await handleFoundryMcpMessage({
      jsonrpc: "2.0",
      id: 8,
      method: "tools/call",
      params: { name: "suggest_diagram", arguments: { diagram: empty } },
    }, { allowModel: true, reply: async () => { throw new Error("should not run"); } });
    expect(payload(suggest).suggestions[0]).toContain("empty");

    const unsafe = await handleFoundryMcpMessage({
      jsonrpc: "2.0",
      id: 9,
      method: "tools/call",
      params: {
        name: "generate_code",
        arguments: {
          diagram: {
            ...empty,
            nodes: [{ id: "n1", type: "uml-class", label: "Card", x: 0, y: 0, w: 160, h: 90, stereotype: "" }],
          },
        },
      },
    }, { allowModel: true, reply: async () => "FROM scratch\nDockerfile\napi_key=secret" });
    expect(payload(unsafe).source).toBe("desk");
    expect(payload(unsafe).code).toContain("export type Card");
    expect(payload(unsafe).code.toLowerCase()).not.toContain("api_key");
    expect(calls).toBe(1);
  });

  it("keeps the endpoint on the server and the desk button in the lab", () => {
    const route = readFileSync(new URL("../app/api/foundry/mcp/route.ts", import.meta.url), "utf8");
    const panel = readFileSync(new URL("../components/foundry-ai.tsx", import.meta.url), "utf8");
    const lab = readFileSync(new URL("../components/foundry-lab.tsx", import.meta.url), "utf8");
    expect(FOUNDRY_MCP_PATH).toBe("/api/foundry/mcp");
    expect(route).toContain("getConsent");
    expect(route).toContain("liveEnabled");
    expect(route).toContain("mcpOriginAllowed");
    expect(route).not.toContain("Access-Control-Allow-Origin");
    expect(route).not.toContain("XAI_API_KEY");
    expect(panel).toContain("Draw diagram");
    expect(panel).toContain("Sketch code");
    expect(panel).toContain("mcp-protocol-version");
    expect(panel).not.toContain("XAI_API_KEY");
    expect(panel).not.toContain("OPENROUTER");
    expect(lab).toContain(">AI desk</button>");
    expect(lab).toContain("<FoundryAi");
  });
});
