import { json, settle } from "@/lib/http";
import { takeToken } from "@/lib/rate";
import { userFrom } from "@/lib/ready";
import { clientBucket, readJson } from "@/lib/security";
import { getConsent } from "@/lib/store";
import { aiReply, liveEnabled } from "@/lib/server/live";
import { MCP_PROTOCOLS, handleFoundryMcpMessage, mcpOriginAllowed, wantsFoundryModel } from "@/lib/foundry-mcp";

export const runtime = "nodejs";

const ALLOW = { allow: "POST" };

export function GET() {
  return new Response(null, { status: 405, headers: { ...ALLOW, "cache-control": "no-store" } });
}

export function DELETE() {
  return new Response(null, { status: 405, headers: ALLOW });
}

export async function POST(request: Request) {
  return settle(() => postMcp(request));
}

async function postMcp(request: Request): Promise<Response> {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!mcpOriginAllowed(origin, host)) return rpcHttp(null, -32600, "This desk only answers this class.", 403);
  const accept = request.headers.get("accept") ?? "";
  if (!accept.includes("application/json") || !accept.includes("text/event-stream")) {
    return rpcHttp(null, -32600, "Send Accept with application/json and text/event-stream, then try again.", 400);
  }
  const version = request.headers.get("mcp-protocol-version");
  if (version && !MCP_PROTOCOLS.has(version)) {
    return rpcHttp(null, -32600, "This desk speaks MCP 2025-03-26 and 2025-06-18.", 400);
  }
  let body: unknown;
  try {
    body = await readJson(request, 80_000);
  } catch {
    return rpcHttp(null, -32700, "The message was not valid JSON. Send one JSON-RPC object and try again.", 400);
  }
  const user = await userFrom(request);
  const rate = await takeToken(`${clientBucket(request, user?.id)}:foundry-mcp`, 40, 10 * 60 * 1000);
  if (!rate.ok) {
    return rpcHttp(idOf(body), -32000, "This desk is pausing requests. Wait a moment and try again.", 429, { "retry-after": String(rate.retryAfter) });
  }
  let allowModel = false;
  let deskNote = "";
  if (user && wantsFoundryModel(body)) {
    allowModel = Boolean(await getConsent(user.id)) && liveEnabled();
    if (allowModel) {
      const modelRate = await takeToken(`user:${user.id}:foundry-mcp-model`, 8, 10 * 60 * 1000);
      if (!modelRate.ok) {
        allowModel = false;
        deskNote = "The class model is pausing for a few minutes, so this came from the desk.";
      }
    }
  }
  const result = await handleFoundryMcpMessage(body, {
    allowModel,
    deskNote,
    reply: allowModel
      ? (instructions, message) => aiReply(instructions, message, { input: 6000, output: 4000, maxTokens: 1200 })
      : undefined,
  });
  if (result.body === null) return new Response(null, { status: result.status, headers: { "cache-control": "no-store" } });
  return json(result.body, result.status, { "mcp-protocol-version": "2025-06-18" });
}

function idOf(body: unknown): unknown {
  if (!body || typeof body !== "object" || Array.isArray(body)) return null;
  return "id" in body ? (body as { id?: unknown }).id ?? null : null;
}

function rpcHttp(id: unknown, code: number, message: string, status: number, headers?: Record<string, string>) {
  return json({ jsonrpc: "2.0", id, error: { code, message } }, status, headers);
}
