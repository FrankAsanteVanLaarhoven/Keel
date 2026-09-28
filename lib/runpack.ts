import { crc32 } from "node:zlib";

export type PackNode = { id: string; type: string };
export type PackEdge = { from: string; to: string };

const types = new Set(["client", "gateway", "auth", "compute", "cache", "database", "queue", "ci", "telemetry"]);

export function servicePlan(nodes: PackNode[], edges: PackEdge[]): { ok: boolean; reason: string } {
  const cleanNodes = nodes.filter((node) => types.has(node.type));
  const byId = new Map(cleanNodes.map((node) => [node.id, node.type]));
  const linked = (from: string, to: string) =>
    edges.some((edge) => byId.get(edge.from) === from && byId.get(edge.to) === to);
  const has = (type: string) => cleanNodes.some((node) => node.type === type);
  if (linked("client", "database") || linked("database", "client")) {
    return { ok: false, reason: "The client is wired straight to the database. Put the application between them." };
  }
  if (!has("client") || !has("gateway") || !has("compute")) {
    return { ok: false, reason: "The service needs a client, a gateway, and an application." };
  }
  if (!linked("client", "gateway") || !linked("gateway", "compute")) {
    return { ok: false, reason: "Wire the client to the gateway, and the gateway to the application." };
  }
  if (has("database") && !linked("compute", "database")) {
    return { ok: false, reason: "The database is on the board, but the application does not reach it." };
  }
  return { ok: true, reason: "The desk can call /status. The ledger key stays in the environment." };
}

const serverSource = `import http from "node:http";
import { readFileSync } from "node:fs";
const plan = JSON.parse(readFileSync(new URL("./service.json", import.meta.url), "utf8"));
if (!plan.ok) {
  console.error(plan.reason);
  process.exit(1);
}
const port = Number(process.env.PORT || 3970);
const server = http.createServer((request, response) => {
  const path = new URL(request.url || "/", "http://127.0.0.1").pathname;
  if (request.method === "GET" && path === "/status") {
    response.writeHead(200, { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" });
    response.end("Northline payments: open\\n");
    return;
  }
  response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
  response.end("Not found\\n");
});
server.listen(port, "127.0.0.1", () => {
  console.log("http://127.0.0.1:" + port + "/status");
});
`;

export function projectFiles(nodes: PackNode[], edges: PackEdge[]): Record<string, string> {
  const plan = servicePlan(nodes, edges);
  const service = {
    ok: plan.ok,
    reason: plan.reason,
    rooms: nodes.filter((node) => types.has(node.type)).map((node) => node.type),
  };
  return {
    "package.json": JSON.stringify({ name: "keel-service", private: true, type: "module", scripts: { start: "node server.js" } }, null, 2) + "\n",
    "service.json": JSON.stringify(service, null, 2) + "\n",
    "server.js": serverSource,
    "README.md": `# Keel service\n\n${plan.reason}\n\nRun it on this machine:\n\n\`\`\`\nnode server.js\n\`\`\`\n\nThen open http://127.0.0.1:3970/status\n\nThe status line is the file. A ledger key, if you add one later, belongs in the environment and must not appear in the response.\n`,
    ".env.example": "PORT=3970\n",
  };
}

export function zipStore(files: Record<string, string>): Buffer {
  const locals: Buffer[] = [];
  const centrals: Buffer[] = [];
  let offset = 0;
  for (const [name, content] of Object.entries(files)) {
    const data = Buffer.from(content);
    const nameBytes = Buffer.from(name);
    const crc = crc32(data);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0, 6);
    local.writeUInt16LE(0, 8);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(data.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(nameBytes.length, 26);
    locals.push(local, nameBytes, data);
    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(data.length, 20);
    central.writeUInt32LE(data.length, 24);
    central.writeUInt16LE(nameBytes.length, 28);
    central.writeUInt32LE(offset, 42);
    centrals.push(central, nameBytes);
    offset += local.length + nameBytes.length + data.length;
  }
  const centralStart = offset;
  const centralSize = centrals.reduce((sum, part) => sum + part.length, 0);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(Object.keys(files).length, 8);
  end.writeUInt16LE(Object.keys(files).length, 10);
  end.writeUInt32LE(centralSize, 12);
  end.writeUInt32LE(centralStart, 16);
  return Buffer.concat([...locals, ...centrals, end]);
}
