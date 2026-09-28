import { spawn, type ChildProcess } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { createServer } from "node:net";
import path from "node:path";
import { dataDir } from "@/lib/db";
import { json } from "@/lib/http";
import { userFrom } from "@/lib/ready";
import { projectFiles, servicePlan, zipStore, type PackEdge, type PackNode } from "@/lib/runpack";

export const runtime = "nodejs";

const running = new Map<string, ChildProcess>();

function readGraph(body: unknown): { nodes: PackNode[]; edges: PackEdge[] } | null {
  if (!body || typeof body !== "object") return null;
  const record = body as { nodes?: unknown; connections?: unknown };
  if (!Array.isArray(record.nodes) || !Array.isArray(record.connections)) return null;
  const nodes = record.nodes
    .filter((node): node is { id: string; type: string } => Boolean(node) && typeof node === "object" && typeof (node as { id?: unknown }).id === "string" && typeof (node as { type?: unknown }).type === "string")
    .map((node) => ({ id: node.id.slice(0, 40), type: node.type.slice(0, 20) }));
  const edges = record.connections
    .filter((edge): edge is { from: string; to: string } => Boolean(edge) && typeof edge === "object" && typeof (edge as { from?: unknown }).from === "string" && typeof (edge as { to?: unknown }).to === "string")
    .map((edge) => ({ from: edge.from.slice(0, 40), to: edge.to.slice(0, 40) }));
  return { nodes, edges };
}

function freePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : 0;
      server.close(() => resolve(port));
    });
    server.on("error", reject);
  });
}

export async function POST(request: Request) {
  const user = await userFrom(request);
  if (!user) return json({ error: "auth" }, 401);
  const body = (await request.json().catch(() => null)) as { action?: string; nodes?: unknown; connections?: unknown } | null;
  const graph = readGraph(body);
  if (!graph) return json({ error: "graph" }, 400);
  const plan = servicePlan(graph.nodes, graph.edges);
  const files = projectFiles(graph.nodes, graph.edges);
  if (body?.action === "download") {
    return new Response(new Uint8Array(zipStore(files)), {
      headers: {
        "content-type": "application/zip",
        "content-disposition": "attachment; filename=\"keel-service.zip\"",
        "cache-control": "private, no-store",
      },
    });
  }
  if (!plan.ok) return json({ ok: false, reason: plan.reason }, 422);
  const previous = running.get(user.id);
  if (previous) previous.kill();
  const dir = path.join(dataDir, "runs", user.id.replace(/[^\w-]/g, ""));
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  for (const [name, content] of Object.entries(files)) writeFileSync(path.join(dir, name), content);
  const port = await freePort();
  const child = spawn(process.execPath, ["server.js"], {
    cwd: dir,
    env: { ...process.env, PORT: String(port) },
    stdio: "ignore",
  });
  running.set(user.id, child);
  child.on("exit", () => {
    if (running.get(user.id) === child) running.delete(user.id);
  });
  const url = `http://127.0.0.1:${port}/status`;
  const ready = await waitFor(url);
  if (!ready) {
    child.kill();
    return json({ ok: false, reason: "The service did not answer." }, 500);
  }
  return json({ ok: true, url, reason: plan.reason });
}

async function waitFor(url: string): Promise<boolean> {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return true;
    } catch {
      /* not up yet */
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  return false;
}
