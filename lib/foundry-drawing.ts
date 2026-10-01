import { boardText, isShape, nodeSize, relationKindOf, umlTool, visibilityOf, type UmlFamily, type UmlNodeType, type UmlRelation, type UmlVisibility, type WireStyle } from "./foundry-board";
import { isExtensionType } from "./foundry-extensions";
import type { ModelSheet } from "./foundry-model";

export type NodeType =
  | "client"
  | "gateway"
  | "auth"
  | "compute"
  | "cache"
  | "database"
  | "queue"
  | "ci"
  | "telemetry"
  | "text"
  | "box"
  | "ellipse"
  | "diamond"
  | "cylinder"
  | "cloud"
  | "note"
  | UmlNodeType;

export interface SystemNode {
  id: string;
  type: NodeType;
  label: string;
  x: number;
  y: number;
  w?: number;
  h?: number;
  z?: number;
  health: "healthy" | "degraded" | "down";
  latency: number; // ms
  capacity: number; // rps
  rps: number;
  role: string;
  industryTool: string;
  stereotype?: string;
  attributes?: string;
  operations?: string;
  visibility?: UmlVisibility;
  abstract?: boolean;
  finalSpec?: boolean;
  leaf?: boolean;
  active?: boolean;
  documentation?: string;
  font?: "Arial" | "Georgia" | "monospace";
  ink?: "ink" | "copper" | "amber";
  align?: "left" | "center" | "right";
  lineStyle?: "solid" | "dashed";
}

export interface Connection {
  id: string;
  from: string;
  to: string;
  status: "idle" | "active" | "error";
  protocol?: string;
  style?: WireStyle;
  kind?: UmlRelation;
  fromRole?: string;
  toRole?: string;
  fromMult?: string;
  toMult?: string;
}

export type ChallengeId = "freeform" | "c1_security" | "c2_design" | "c3_cicd" | "c4_scale" | "c5_observability" | "c6_status";

interface Challenge {
  id: ChallengeId;
  course: "CSC2031" | "CSC2035" | "CSC2033" | "CSC3131" | "SANDBOX";
  courseTitle: string;
  badge: string;
  title: string;
  goal: string;
  hint: string;
  initialNodes: SystemNode[];
  initialConnections: Connection[];
  checkSuccess: (nodes: SystemNode[], conns: Connection[]) => boolean;
}

export interface DemoTemplate {
  id: string;
  name: string;
  badge: string;
  description: string;
  nodes: SystemNode[];
  connections: Connection[];
}

export const SERVICE_TYPES: NodeType[] = ["client", "gateway", "auth", "compute", "cache", "database", "queue", "ci", "telemetry"];
export const DRAW_TYPES: NodeType[] = ["text", "box", "ellipse", "diamond", "cylinder", "cloud", "note"];


const DRAWING_NAMES: Record<string, string> = {
  client: "Client / Browser",
  gateway: "API Gateway / WAF",
  auth: "Auth & Security Guard",
  compute: "App Logic Tier",
  cache: "Distributed Cache",
  database: "Authoritative Database",
  queue: "Message Broker / Queue",
  ci: "CI/CD Pipeline Runner",
  telemetry: "Telemetry & SRE Agent",
  text: "Text",
  box: "Box",
  ellipse: "Ellipse",
  diamond: "Diamond",
  cylinder: "Cylinder",
  cloud: "Cloud",
  note: "Note",
};

export function drawingTypeName(type: string): string {
  return DRAWING_NAMES[type] ?? umlTool(type)?.name ?? "Extension";
}

export function drawingTypeKnown(type: string): boolean {
  return isShape(type) || SERVICE_TYPES.includes(type as NodeType) || isExtensionType(type);
}

function linkMatches(nodes: { id: string; type: string }[], link: { from: string; to: string }, fromType: string, toType: string): boolean {
  const from = nodes.find((node) => node.id === link.from);
  const to = nodes.find((node) => node.id === link.to);
  return from?.type === fromType && to?.type === toType;
}

export function linkIsClientToDatabase(nodes: { id: string; type: string }[], link: { from: string; to: string }): boolean {
  return linkMatches(nodes, link, "client", "database");
}

function wire(nodes: { id: string; type: string }[], connections: { from: string; to: string }[], fromType: string, toType: string): boolean {
  return connections.some((link) => linkMatches(nodes, link, fromType, toType));
}

function touches(nodes: { id: string; type: string }[], connections: { from: string; to: string }[], type: string): boolean {
  return connections.some((link) => {
    const from = nodes.find((node) => node.id === link.from);
    const to = nodes.find((node) => node.id === link.to);
    return from?.type === type || to?.type === type;
  });
}

export function clientReachesDatabase(nodes: { id: string; type: string }[], connections: { from: string; to: string }[]): boolean {
  return wire(nodes, connections, "client", "database");
}

export function architectShouldWatch(fullPage: boolean, guideOpen: boolean): boolean {
  return !fullPage && guideOpen;
}


export function readImportedNode(item: unknown): SystemNode | null {
  if (!item || typeof item !== "object") return null;
  const raw = item as Partial<SystemNode>;
  if (typeof raw.id !== "string" || typeof raw.type !== "string" || !drawingTypeKnown(raw.type)) return null;
  if (typeof raw.x !== "number" || typeof raw.y !== "number") return null;
  const type = raw.type as NodeType;
  return {
    id: raw.id,
    type,
    label: typeof raw.label === "string" ? raw.label : drawingTypeName(type),
    x: raw.x,
    y: raw.y,
    w: typeof raw.w === "number" ? raw.w : undefined,
    h: typeof raw.h === "number" ? raw.h : undefined,
    z: typeof raw.z === "number" ? raw.z : undefined,
    health: raw.health === "down" || raw.health === "degraded" ? raw.health : "healthy",
    latency: typeof raw.latency === "number" ? raw.latency : 20,
    capacity: typeof raw.capacity === "number" ? raw.capacity : 1000,
    rps: typeof raw.rps === "number" ? raw.rps : 0,
    role: typeof raw.role === "string" ? raw.role : "",
    industryTool: typeof raw.industryTool === "string" ? raw.industryTool : "",
    stereotype: boardText(raw.stereotype, 120) || undefined,
    attributes: boardText(raw.attributes, 4000) || undefined,
    operations: boardText(raw.operations, 4000) || undefined,
    visibility: visibilityOf(raw.visibility) || undefined,
    abstract: raw.abstract === true || undefined,
    finalSpec: raw.finalSpec === true || undefined,
    leaf: raw.leaf === true || undefined,
    active: raw.active === true || undefined,
    documentation: boardText(raw.documentation, 4000) || undefined,
    font: raw.font === "Arial" || raw.font === "Georgia" || raw.font === "monospace" ? raw.font : undefined,
    ink: raw.ink === "ink" || raw.ink === "copper" || raw.ink === "amber" ? raw.ink : undefined,
    align: raw.align === "left" || raw.align === "center" || raw.align === "right" ? raw.align : undefined,
    lineStyle: raw.lineStyle === "solid" || raw.lineStyle === "dashed" ? raw.lineStyle : undefined,
  };
}

export function readImportedConnections(items: unknown, ids: Set<string>): Connection[] {
  const next: Connection[] = [];
  if (!Array.isArray(items)) return next;
  for (const item of items) {
    if (!item || typeof item !== "object") continue;
    const raw = item as Partial<Connection> & { source?: string; target?: string };
    const from = typeof raw.from === "string" ? raw.from : raw.source;
    const to = typeof raw.to === "string" ? raw.to : raw.target;
    if (!from || !to || !ids.has(from) || !ids.has(to)) continue;
    next.push({
      id: typeof raw.id === "string" ? raw.id : `c-${from}-${to}`,
      from,
      to,
      status: raw.status === "error" ? "error" : "active",
      protocol: typeof raw.protocol === "string" ? boardText(raw.protocol, 200) : undefined,
      style: raw.style === "elbow" || raw.style === "straight" || raw.style === "curve" ? raw.style : undefined,
      kind: relationKindOf(raw.kind) || undefined,
      fromRole: boardText(raw.fromRole, 80) || undefined,
      toRole: boardText(raw.toRole, 80) || undefined,
      fromMult: boardText(raw.fromMult, 40) || undefined,
      toMult: boardText(raw.toMult, 40) || undefined,
    });
  }
  return next;
}

export function nodeExportRecord(n: SystemNode) {
  return {
    id: n.id,
    type: n.type,
    label: n.label,
    x: n.x,
    y: n.y,
    w: n.w,
    h: n.h,
    z: n.z,
    health: n.health,
    role: n.role,
    industryTool: n.industryTool,
    industryEquivalent: n.industryTool,
    stereotype: n.stereotype,
    attributes: n.attributes,
    operations: n.operations,
    visibility: n.visibility,
    abstract: n.abstract,
    finalSpec: n.finalSpec,
    leaf: n.leaf,
    active: n.active,
    documentation: n.documentation,
    font: n.font,
    ink: n.ink,
    align: n.align,
    lineStyle: n.lineStyle,
    latencyMs: n.latency,
    latency: n.latency,
    capacity: n.capacity,
    capacityRps: n.capacity,
    rps: n.rps,
  };
}

export function connectionExportRecord(c: Connection) {
  return {
    id: c.id,
    from: c.from,
    to: c.to,
    source: c.from,
    target: c.to,
    status: c.status,
    style: c.style,
    protocol: c.protocol || "HTTPS",
    kind: c.kind,
    fromRole: c.fromRole,
    toRole: c.toRole,
    fromMult: c.fromMult,
    toMult: c.toMult,
  };
}

export const DEMO_TEMPLATES: DemoTemplate[] = [
  {
    id: "harbor_ecommerce",
    name: "Harbor Market: 3-Tier E-Commerce",
    badge: "Production Stack",
    description: "Multi-tier architecture with Edge Gateway, Better Auth verification, Node.js API, Redis read cache, PostgreSQL transactional ledger, and Kafka async checkout queue.",
    nodes: [
      { id: "hm-client", type: "client", label: "Shopper Mobile", x: 40, y: 150, health: "healthy", latency: 15, capacity: 500, rps: 80, role: "Client App", industryTool: "iOS / Web" },
      { id: "hm-gateway", type: "gateway", label: "Cloudflare Edge", x: 240, y: 150, health: "healthy", latency: 5, capacity: 5000, rps: 80, role: "Traffic Ingress", industryTool: "Cloudflare WAF" },
      { id: "hm-auth", type: "auth", label: "Auth Guard", x: 240, y: 280, health: "healthy", latency: 8, capacity: 2000, rps: 40, role: "Session Verification", industryTool: "Better Auth" },
      { id: "hm-api", type: "compute", label: "Harbor API Tier", x: 450, y: 150, health: "healthy", latency: 25, capacity: 1500, rps: 80, role: "Core Business Logic", industryTool: "Node.js / Express" },
      { id: "hm-cache", type: "cache", label: "Redis Read Cache", x: 670, y: 60, health: "healthy", latency: 2, capacity: 10000, rps: 60, role: "Sub-ms Catalog Reads", industryTool: "Redis Cluster" },
      { id: "hm-queue", type: "queue", label: "Order Broker", x: 670, y: 260, health: "healthy", latency: 10, capacity: 8000, rps: 30, role: "Async Checkout Buffer", industryTool: "Apache Kafka" },
      { id: "hm-db", type: "database", label: "PostgreSQL Ledger", x: 890, y: 150, health: "healthy", latency: 35, capacity: 800, rps: 20, role: "Durable Transactions", industryTool: "PostgreSQL" },
      { id: "hm-telemetry", type: "telemetry", label: "Prometheus SRE", x: 450, y: 390, health: "healthy", latency: 5, capacity: 5000, rps: 80, role: "Latency & Error Traces", industryTool: "Prometheus / Grafana" },
    ],
    connections: [
      { id: "c-hm-1", from: "hm-client", to: "hm-gateway", status: "active", protocol: "HTTPS / TLS 1.3" },
      { id: "c-hm-2", from: "hm-gateway", to: "hm-auth", status: "active", protocol: "Session Token" },
      { id: "c-hm-3", from: "hm-gateway", to: "hm-api", status: "active", protocol: "gRPC" },
      { id: "c-hm-4", from: "hm-api", to: "hm-cache", status: "active", protocol: "RESP (Redis)" },
      { id: "c-hm-5", from: "hm-api", to: "hm-queue", status: "active", protocol: "Kafka Event" },
      { id: "c-hm-6", from: "hm-api", to: "hm-db", status: "active", protocol: "SQL / TLS" },
      { id: "c-hm-7", from: "hm-api", to: "hm-telemetry", status: "active", protocol: "OTel Traces" },
    ],
  },
  {
    id: "riverside_clinic",
    name: "Riverside Clinic: Zero-Trust Healthcare",
    badge: "HIPAA Compliant",
    description: "Strict isolation architecture: Patient portal traffic flows through a WAF firewall and mandatory RBAC identity guard before touching health records. Directly shielded DB.",
    nodes: [
      { id: "rc-client", type: "client", label: "Patient Portal", x: 40, y: 160, health: "healthy", latency: 18, capacity: 300, rps: 45, role: "Patient Browser", industryTool: "Next.js Web" },
      { id: "rc-waf", type: "gateway", label: "Ingress WAF", x: 240, y: 160, health: "healthy", latency: 6, capacity: 3000, rps: 45, role: "DDOS & Injection Shield", industryTool: "Envoy Proxy" },
      { id: "rc-auth", type: "auth", label: "RBAC Identity Guard", x: 450, y: 160, health: "healthy", latency: 12, capacity: 1500, rps: 45, role: "MFA & Role Tokens", industryTool: "OAuth2 / OIDC" },
      { id: "rc-api", type: "compute", label: "Clinical Records API", x: 670, y: 160, health: "healthy", latency: 30, capacity: 1000, rps: 45, role: "Encrypted Business Logic", industryTool: "Go Microservice" },
      { id: "rc-db", type: "database", label: "Encrypted EHR Store", x: 890, y: 160, health: "healthy", latency: 45, capacity: 600, rps: 45, role: "AES-256 Medical Records", industryTool: "PostgreSQL TDE" },
      { id: "rc-telemetry", type: "telemetry", label: "Audit & Access Log", x: 670, y: 350, health: "healthy", latency: 4, capacity: 4000, rps: 45, role: "Immutable Access Audit", industryTool: "OpenTelemetry" },
    ],
    connections: [
      { id: "c-rc-1", from: "rc-client", to: "rc-waf", status: "active", protocol: "HTTPS mTLS" },
      { id: "c-rc-2", from: "rc-waf", to: "rc-auth", status: "active", protocol: "Header Inspection" },
      { id: "c-rc-3", from: "rc-auth", to: "rc-api", status: "active", protocol: "Verified JWT" },
      { id: "c-rc-4", from: "rc-api", to: "rc-db", status: "active", protocol: "Encrypted SQL" },
      { id: "c-rc-5", from: "rc-api", to: "rc-telemetry", status: "active", protocol: "Audit Stream" },
    ],
  },
  {
    id: "gitops_pipeline",
    name: "GitOps Automated CI/CD Delivery",
    badge: "Continuous Delivery",
    description: "The Andon Cord pipeline: Code commits trigger automated linters, secret scanning, and integration tests before deployment to live production clusters.",
    nodes: [
      { id: "git-dev", type: "client", label: "Developer Laptop", x: 40, y: 170, health: "healthy", latency: 8, capacity: 50, rps: 10, role: "Git Commits", industryTool: "VS Code / Git" },
      { id: "git-ci", type: "ci", label: "GitHub Actions CI", x: 270, y: 170, health: "healthy", latency: 120, capacity: 200, rps: 10, role: "Test & Security Gate", industryTool: "GitHub Actions" },
      { id: "git-auth", type: "auth", label: "OIDC Deploy Auth", x: 490, y: 70, health: "healthy", latency: 15, capacity: 500, rps: 10, role: "Cloud Role Provider", industryTool: "AWS IAM / Workload ID" },
      { id: "git-canary", type: "compute", label: "Canary Staging Pod", x: 490, y: 250, health: "healthy", latency: 25, capacity: 500, rps: 10, role: "Shadow Traffic Verification", industryTool: "K8s Canary" },
      { id: "git-prod", type: "compute", label: "Production Cluster", x: 740, y: 170, health: "healthy", latency: 20, capacity: 2500, rps: 100, role: "Live High-Availability Pod", industryTool: "Kubernetes" },
      { id: "git-telemetry", type: "telemetry", label: "Deployment Metrics", x: 740, y: 360, health: "healthy", latency: 5, capacity: 5000, rps: 100, role: "Error Budget & DORA Tracker", industryTool: "Grafana DORA" },
    ],
    connections: [
      { id: "c-git-1", from: "git-dev", to: "git-ci", status: "active", protocol: "Git Push (SSH)" },
      { id: "c-git-2", from: "git-ci", to: "git-auth", status: "active", protocol: "OIDC Token" },
      { id: "c-git-3", from: "git-ci", to: "git-canary", status: "active", protocol: "Deploy Manifest" },
      { id: "c-git-4", from: "git-canary", to: "git-prod", status: "active", protocol: "Promote on Green" },
      { id: "c-git-5", from: "git-prod", to: "git-telemetry", status: "active", protocol: "Telemetry" },
    ],
  },
  {
    id: "surge_spike",
    name: "1,000,000 RPS Ticket Surge Topology",
    badge: "Extreme Scale",
    description: "Absorbs extreme 10:00 AM traffic spikes without database crashes: Anycast CDN + load balancer distributes load across dual compute pods, backed by a Redis cluster and order queue.",
    nodes: [
      { id: "surge-crowd", type: "client", label: "10:00 AM Shoppers", x: 40, y: 170, health: "healthy", latency: 15, capacity: 20000, rps: 3500, role: "Traffic Surge", industryTool: "Mobile & Web Browsers" },
      { id: "surge-cdn", type: "gateway", label: "Anycast CDN / WAF", x: 240, y: 170, health: "healthy", latency: 4, capacity: 25000, rps: 3500, role: "Edge Caching & Shield", industryTool: "Fastly / Cloudflare" },
      { id: "surge-api1", type: "compute", label: "Ticketing Pod A", x: 460, y: 80, health: "healthy", latency: 25, capacity: 2500, rps: 1750, role: "Stateless App Compute", industryTool: "Node.js Pod" },
      { id: "surge-api2", type: "compute", label: "Ticketing Pod B", x: 460, y: 260, health: "healthy", latency: 26, capacity: 2500, rps: 1750, role: "Stateless App Compute", industryTool: "Node.js Pod" },
      { id: "surge-cache", type: "cache", label: "Redis Cluster (Reads)", x: 690, y: 60, health: "healthy", latency: 2, capacity: 50000, rps: 3000, role: "99% Cache Hit Ratio", industryTool: "Redis Sentinel" },
      { id: "surge-queue", type: "queue", label: "Order Buffer (Writes)", x: 690, y: 260, health: "healthy", latency: 8, capacity: 20000, rps: 500, role: "Asynchronous Absorber", industryTool: "Kafka Broker" },
      { id: "surge-db", type: "database", label: "Sharded PostgreSQL", x: 910, y: 170, health: "healthy", latency: 40, capacity: 1500, rps: 500, role: "Durable Write Master", industryTool: "PostgreSQL Shard" },
    ],
    connections: [
      { id: "c-surge-1", from: "surge-crowd", to: "surge-cdn", status: "active", protocol: "HTTPS / Anycast" },
      { id: "c-surge-2", from: "surge-cdn", to: "surge-api1", status: "active", protocol: "Round-Robin HTTP" },
      { id: "c-surge-3", from: "surge-cdn", to: "surge-api2", status: "active", protocol: "Round-Robin HTTP" },
      { id: "c-surge-4", from: "surge-api1", to: "surge-cache", status: "active", protocol: "Read Cache" },
      { id: "c-surge-5", from: "surge-api2", to: "surge-cache", status: "active", protocol: "Read Cache" },
      { id: "c-surge-6", from: "surge-api1", to: "surge-queue", status: "active", protocol: "Queue Write" },
      { id: "c-surge-7", from: "surge-api2", to: "surge-queue", status: "active", protocol: "Queue Write" },
      { id: "c-surge-8", from: "surge-queue", to: "surge-db", status: "active", protocol: "Drained Batch SQL" },
    ],
  },
  {
    id: "sre_observability",
    name: "Enterprise SRE Observability & Tracing",
    badge: "Observability",
    description: "Full-fidelity monitoring: Microservices stream distributed OpenTelemetry traces to Prometheus and Grafana AlertManager, enabling sub-minute Mean Time to Detection (MTTD).",
    nodes: [
      { id: "sre-user", type: "client", label: "Enterprise Users", x: 40, y: 160, health: "healthy", latency: 12, capacity: 1000, rps: 120, role: "Active Users", industryTool: "Browser Web" },
      { id: "sre-gateway", type: "gateway", label: "API Gateway", x: 260, y: 160, health: "healthy", latency: 5, capacity: 5000, rps: 120, role: "Ingress Router", industryTool: "Kong Gateway" },
      { id: "sre-service", type: "compute", label: "Core Service", x: 500, y: 160, health: "healthy", latency: 30, capacity: 2000, rps: 120, role: "Business Logic", industryTool: "Go Microservice" },
      { id: "sre-db", type: "database", label: "Primary Database", x: 740, y: 160, health: "healthy", latency: 45, capacity: 1000, rps: 120, role: "Storage Tier", industryTool: "PostgreSQL" },
      { id: "sre-telemetry", type: "telemetry", label: "OTel Collector", x: 500, y: 370, health: "healthy", latency: 3, capacity: 10000, rps: 120, role: "Traces & Metrics Aggregator", industryTool: "OpenTelemetry" },
    ],
    connections: [
      { id: "c-sre-1", from: "sre-user", to: "sre-gateway", status: "active", protocol: "HTTPS" },
      { id: "c-sre-2", from: "sre-gateway", to: "sre-service", status: "active", protocol: "gRPC" },
      { id: "c-sre-3", from: "sre-service", to: "sre-db", status: "active", protocol: "SQL" },
      { id: "c-sre-4", from: "sre-gateway", to: "sre-telemetry", status: "active", protocol: "Ingress Traces" },
      { id: "c-sre-5", from: "sre-service", to: "sre-telemetry", status: "active", protocol: "App Spans" },
      { id: "c-sre-6", from: "sre-db", to: "sre-telemetry", status: "active", protocol: "Query Latencies" },
    ],
  },
  {
    id: "library_domain",
    name: "Harbor Library domain",
    badge: "ERD",
    description: "Crow's foot library: a book, an author, a copy, an account, and the library that keeps the records. Fictional. Nothing here is a live catalogue.",
    nodes: [
      { id: "lib-book", type: "erd-entity", label: "Book", x: 80, y: 40, health: "healthy", latency: 0, capacity: 0, rps: 0, role: "", industryTool: "", stereotype: "entity", attributes: "PK ISBN\ntitle\npublisher" },
      { id: "lib-author", type: "erd-entity", label: "Author", x: 420, y: 40, health: "healthy", latency: 0, capacity: 0, rps: 0, role: "", industryTool: "", stereotype: "entity", attributes: "PK name\nbiography" },
      { id: "lib-copy", type: "erd-entity", label: "Book item", x: 80, y: 280, health: "healthy", latency: 0, capacity: 0, rps: 0, role: "", industryTool: "", stereotype: "entity", attributes: "PK barcode\ntag" },
      { id: "lib-account", type: "erd-entity", label: "Account", x: 420, y: 280, health: "healthy", latency: 0, capacity: 0, rps: 0, role: "", industryTool: "", stereotype: "entity", attributes: "PK number\nopened\nstate" },
      { id: "lib-library", type: "erd-entity", label: "Library", x: 250, y: 500, health: "healthy", latency: 0, capacity: 0, rps: 0, role: "", industryTool: "", stereotype: "entity", attributes: "PK name\naddress" },
    ],
    connections: [
      { id: "lib-wrote", from: "lib-author", to: "lib-book", status: "active", kind: "crows", fromMult: "1", toMult: "1..*", fromRole: "wrote", protocol: "" },
      { id: "lib-copyof", from: "lib-book", to: "lib-copy", status: "active", kind: "crows", fromMult: "1", toMult: "0..*", protocol: "" },
      { id: "lib-borrow", from: "lib-account", to: "lib-copy", status: "active", kind: "crows", fromMult: "0..1", toMult: "0..12", fromRole: "borrowed", protocol: "" },
      { id: "lib-records", from: "lib-library", to: "lib-copy", status: "active", kind: "crows", fromMult: "1", toMult: "*", fromRole: "records", protocol: "" },
      { id: "lib-accounts", from: "lib-library", to: "lib-account", status: "active", kind: "crows", fromMult: "1", toMult: "*", fromRole: "accounts", protocol: "" },
    ],
  },
];

export const CHALLENGES: Challenge[] = [
  {
    id: "freeform",
    course: "SANDBOX",
    courseTitle: "Open Systems Foundry",
    badge: "Freeform",
    title: "Full Systems Architecture Lab",
    goal: "Design, connect, and simulate any multi-tier cloud topology. Stress-test under traffic spikes and chaos engineering.",
    hint: "Use the component palette to add nodes. Drag wire endpoints or use Connect Arrow tool to wire them.",
    initialNodes: [],
    initialConnections: [],
    checkSuccess: () => true,
  },
  {
    id: "c1_security",
    course: "CSC2031",
    courseTitle: "Security Programming",
    badge: "CSC2031",
    title: "Challenge 1: Shield the Naked Database",
    goal: "Vulnerability detected! The client is querying the Database directly. Add an Auth Guard and an App Logic Server between them so unauthenticated users cannot tamper with records.",
    hint: "Add an 'Auth & Security Guard' or 'API Gateway', and an 'App Logic Tier'. Reconnect the flow: Client -> Auth -> App -> DB.",
    initialNodes: [
      { id: "client-sec", type: "client", label: "Untrusted Client", x: 80, y: 180, health: "healthy", latency: 20, capacity: 100, rps: 50, role: "Public Browser", industryTool: "Browser" },
      { id: "db-sec", type: "database", label: "Vulnerable DB", x: 620, y: 180, health: "degraded", latency: 40, capacity: 200, rps: 50, role: "Directly Exposed Database", industryTool: "PostgreSQL" },
    ],
    initialConnections: [
      { id: "c-bad", from: "client-sec", to: "db-sec", status: "error", protocol: "DIRECT TCP (DANGEROUS)" },
    ],
    checkSuccess: (nodes, conns) => {
      const hasAuth = nodes.some((n) => n.type === "auth" || n.type === "gateway");
      const hasApp = nodes.some((n) => n.type === "compute");
      return hasAuth && hasApp && !clientReachesDatabase(nodes, conns);
    },
  },
  {
    id: "c2_design",
    course: "CSC2035",
    courseTitle: "Software Systems Design & Implementation",
    badge: "CSC2035",
    title: "Challenge 2: The Three-Tier Architecture",
    goal: "Enforce separation of concerns: Room 1 (Client), Room 2 (App Logic), Room 3 (Database). Ensure rules and validation live strictly in the middle tier.",
    hint: "Build a chain: Client -> App Logic Tier -> Authoritative Database.",
    initialNodes: [
      { id: "c2-client", type: "client", label: "Clinic Reception", x: 80, y: 180, health: "healthy", latency: 15, capacity: 300, rps: 50, role: "Presentation Room", industryTool: "Desktop Client" },
      { id: "c2-db", type: "database", label: "Patient Booking DB", x: 680, y: 180, health: "healthy", latency: 50, capacity: 500, rps: 50, role: "Persistence Room", industryTool: "PostgreSQL" },
    ],
    initialConnections: [],
    checkSuccess: (nodes, conns) =>
      nodes.some((node) => node.type === "compute") && wire(nodes, conns, "client", "compute") && wire(nodes, conns, "compute", "database"),
  },
  {
    id: "c3_cicd",
    course: "CSC2033",
    courseTitle: "Software Engineering Team Project",
    badge: "CSC2033",
    title: "Challenge 3: The Automated Andon Cord Pipeline",
    goal: "Connect a Continuous Integration pipeline so that code changes pass through automated tests and secret scanning before joining the Production App.",
    hint: "Wire Client/Developer -> CI Pipeline Runner -> App Server. Test what happens when you simulate a failing test.",
    initialNodes: [
      { id: "c3-dev", type: "client", label: "Developer Laptop", x: 80, y: 180, health: "healthy", latency: 10, capacity: 50, rps: 10, role: "Workbench", industryTool: "Git Workspace" },
      { id: "c3-app", type: "compute", label: "Production Roster App", x: 680, y: 180, health: "healthy", latency: 25, capacity: 1000, rps: 10, role: "Live Service", industryTool: "Kubernetes Pod" },
    ],
    initialConnections: [],
    checkSuccess: (nodes, conns) =>
      nodes.some((node) => node.type === "ci") && wire(nodes, conns, "client", "ci") && wire(nodes, conns, "ci", "compute"),
  },
  {
    id: "c4_scale",
    course: "CSC3131",
    courseTitle: "Development & Operations of Systems",
    badge: "CSC3131",
    title: "Challenge 4: The 10:00 AM Ticket Surge",
    goal: "A massive rush of 10,000 requests/second is about to hit! The database can only handle 800 rps. Add a Distributed Cache (for reads) and a Queue (for async orders) to absorb the flood.",
    hint: "Add both a 'Distributed Cache' and a 'Message Broker / Queue' connected to your App Logic Tier.",
    initialNodes: [
      { id: "c4-client", type: "client", label: "10:00 AM Crowd", x: 80, y: 180, health: "healthy", latency: 15, capacity: 10000, rps: 1200, role: "Traffic Surge", industryTool: "Web Browsers" },
      { id: "c4-app", type: "compute", label: "Festival Ticketing API", x: 380, y: 180, health: "degraded", latency: 180, capacity: 1500, rps: 1200, role: "API Backend", industryTool: "Node.js Pod" },
      { id: "c4-db", type: "database", label: "Ticket Database", x: 740, y: 180, health: "down", latency: 500, capacity: 500, rps: 1200, role: "Persistence (Crashed)", industryTool: "PostgreSQL" },
    ],
    initialConnections: [
      { id: "c4-1", from: "c4-client", to: "c4-app", status: "active" },
      { id: "c4-2", from: "c4-app", to: "c4-db", status: "error" },
    ],
    checkSuccess: (nodes, conns) =>
      nodes.some((node) => node.type === "cache")
      && nodes.some((node) => node.type === "queue")
      && (wire(nodes, conns, "compute", "cache") || wire(nodes, conns, "cache", "compute")),
  },
  {
    id: "c5_observability",
    course: "CSC3131",
    courseTitle: "Development & Operations of Systems",
    badge: "CSC3131",
    title: "Challenge 5: The 02:14 AM Observability Alert",
    goal: "An intermittent crash is stranding night couriers! Add a Telemetry & SRE Agent so the system logs every trace and alerts on-call staff with the exact failing request before users report it.",
    hint: "Place a 'Telemetry & SRE Agent' and link it to the App Logic Tier or Gateway.",
    initialNodes: [
      { id: "c5-client", type: "client", label: "Night Courier App", x: 80, y: 180, health: "healthy", latency: 20, capacity: 400, rps: 100, role: "Driver Handheld", industryTool: "Mobile App" },
      { id: "c5-app", type: "compute", label: "Dispatch Gateway", x: 400, y: 180, health: "degraded", latency: 90, capacity: 800, rps: 100, role: "Dispatch Logic", industryTool: "Microservice" },
      { id: "c5-db", type: "database", label: "GPS Tracking Store", x: 720, y: 180, health: "healthy", latency: 30, capacity: 600, rps: 100, role: "Location DB", industryTool: "PostgreSQL" },
    ],
    initialConnections: [
      { id: "c5-1", from: "c5-client", to: "c5-app", status: "active" },
      { id: "c5-2", from: "c5-app", to: "c5-db", status: "active" },
    ],
    checkSuccess: (nodes, conns) => nodes.some((node) => node.type === "telemetry") && touches(nodes, conns, "telemetry"),
  },
  {
    id: "c6_status",
    course: "CSC3131",
    courseTitle: "Development & Operations of Systems",
    badge: "CSC3131",
    title: "Challenge 6: The Status Request",
    goal: "The payments desk asks for /status. The browser must not touch the ledger. Put a gateway between the desk and the application, and keep the database behind the application.",
    hint: "Wire Client → Gateway → App, and App → Database. There must be no wire from the client to the database.",
    initialNodes: [
      { id: "c6-desk", type: "client", label: "Payments Desk", x: 80, y: 180, health: "healthy", latency: 12, capacity: 200, rps: 20, role: "Status Page", industryTool: "Browser" },
      { id: "c6-db", type: "database", label: "Ledger", x: 760, y: 180, health: "healthy", latency: 40, capacity: 400, rps: 0, role: "Key and Records", industryTool: "PostgreSQL" },
    ],
    initialConnections: [],
    checkSuccess: (nodes, conns) =>
      nodes.some((node) => node.type === "gateway")
      && nodes.some((node) => node.type === "compute")
      && wire(nodes, conns, "client", "gateway")
      && wire(nodes, conns, "gateway", "compute")
      && wire(nodes, conns, "compute", "database")
      && !wire(nodes, conns, "client", "database")
      && !wire(nodes, conns, "database", "client"),
  },
];

export type DiagramSheet = { id: string; name: string; family: UmlFamily; nodes: SystemNode[]; connections: Connection[] };

export function sheetsToModel(source: DiagramSheet[]): ModelSheet[] {
  return source.map((sheet) => ({
    id: sheet.id,
    name: sheet.name,
    nodes: sheet.nodes.map((node) => {
      const size = nodeSize(node);
      return {
        id: node.id,
        type: node.type,
        label: node.label,
        x: node.x,
        y: node.y,
        w: size.w,
        h: size.h,
        documentation: node.documentation,
        attributes: node.attributes,
        operations: node.operations,
      };
    }),
    connections: sheet.connections.map((link) => ({
      id: link.id,
      from: link.from,
      to: link.to,
      kind: link.kind,
      label: link.protocol,
    })),
  }));
}
