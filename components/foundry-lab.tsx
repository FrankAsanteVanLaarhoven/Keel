"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useCallback, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import type { Messages } from "@/lib/i18n/en";
import { useKeel } from "./keel-context";
import { roomPlain, wordingText } from "@/lib/glossary";
import { useWording } from "./wording";
import {
  anchors,
  boardExtent,
  isShape,
  nodeSize,
  pointOnWire,
  snapCoord,
  wirePath,
  wireStyleOf,
  type WireStyle,
} from "@/lib/foundry-board";
import {
  IconClient,
  IconGateway,
  IconAuth,
  IconCompute,
  IconCache,
  IconDatabase,
  IconQueue,
  IconCI,
  IconTelemetry,
  IconPointer,
  IconConnect,
  IconCut,
  IconAutoLayout,
  IconClear,
  IconArchitect,
  IconSurge,
  IconChaos,
  IconAutoHeal,
  IconExport,
  IconRefresh,
  IconCheck,
  IconClose,
  IconXP,
  IconPrinciple,
  IconArrowRight,
  IconPlay,
  IconPause,
  IconAnalytics,
} from "./icons";

function NodeWords({ label, role, tool, type, bare }: { label: string; role: string; tool: string; type: string; bare?: boolean }) {
  const mode = useWording();
  const meaning = mode === "plain" ? roomPlain[type] || wordingText(label, mode) : wordingText(label, mode);
  if (bare) return <span title={wordingText(label, mode)}>{label}</span>;
  return (
    <>
      <p className="mt-1 truncate text-xs font-bold text-inherit" title={meaning}>{label}</p>
      {tool ? <p className="truncate text-[10px] text-inherit opacity-80" title={wordingText(tool, mode)}>{tool.split("/")[0]}</p> : null}
      {role ? <p className="sr-only">{role}</p> : null}
    </>
  );
}

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
  | "note";

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
}

export interface Connection {
  id: string;
  from: string;
  to: string;
  status: "idle" | "active" | "error";
  protocol?: string;
  style?: WireStyle;
}

interface Particle {
  id: number;
  connId: string;
  progress: number;
  speed: number;
  type: "request" | "response" | "cache_hit" | "db_write" | "blocked" | "ci_test";
  label: string;
  protocol: string;
  payloadSize: string;
  latencyMs: number;
  status: string;
  sourceLabel: string;
  targetLabel: string;
  description: string;
}

type ChallengeId = "freeform" | "c1_security" | "c2_design" | "c3_cicd" | "c4_scale" | "c5_observability" | "c6_status";

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

const nodeTypeMeta: Record<
  NodeType,
  {
    name: string;
    color: string;
    Icon: React.ComponentType<{ size?: number; className?: string }>;
    tool: string;
    desc: string;
  }
> = {
  client: { name: "Client / Browser", color: "#1e293b", Icon: IconClient, tool: "Web / Mobile / React", desc: "User touchpoint that requests data and presents views." },
  gateway: { name: "API Gateway / WAF", color: "#1e40af", Icon: IconGateway, tool: "Nginx / Envoy / Cloudflare", desc: "Routes traffic, terminates SSL, rate-limits, and shields backends." },
  auth: { name: "Auth & Security Guard", color: "#831843", Icon: IconAuth, tool: "Better Auth / JWT / OAuth", desc: "Verifies session identity, issues tokens, checks permissions." },
  compute: { name: "App Logic Tier", color: "#3730a3", Icon: IconCompute, tool: "Node.js / Go / Kubernetes Pod", desc: "Runs business rules, processes calculations, handles mutations." },
  cache: { name: "Distributed Cache", color: "#065f46", Icon: IconCache, tool: "Redis / Memcached", desc: "Delivers sub-millisecond responses for repeatable read data." },
  database: { name: "Authoritative Database", color: "#78350f", Icon: IconDatabase, tool: "PostgreSQL / SQLite", desc: "Durable persistent storage that records ground truth." },
  queue: { name: "Message Broker / Queue", color: "#9a3412", Icon: IconQueue, tool: "Kafka / RabbitMQ / SQS", desc: "Decouples spikes by buffering async jobs and payments." },
  ci: { name: "CI/CD Pipeline Runner", color: "#0f766e", Icon: IconCI, tool: "GitHub Actions / GitLab CI", desc: "Runs automated linting, unit tests, secret scanning before deploy." },
  telemetry: { name: "Telemetry & SRE Agent", color: "#115e59", Icon: IconTelemetry, tool: "Prometheus / Grafana / OTel", desc: "Gathers logs, metrics, traces, and triggers actionable alerts." },
  text: { name: "Text", color: "#e4e4e7", Icon: IconPrinciple, tool: "Label", desc: "Text" },
  box: { name: "Box", color: "#a1a1aa", Icon: IconCompute, tool: "Rectangle", desc: "Box" },
  ellipse: { name: "Ellipse", color: "#a1a1aa", Icon: IconClient, tool: "Ellipse", desc: "Ellipse" },
  diamond: { name: "Diamond", color: "#a1a1aa", Icon: IconAuth, tool: "Diamond", desc: "Diamond" },
  cylinder: { name: "Cylinder", color: "#a1a1aa", Icon: IconDatabase, tool: "Cylinder", desc: "Cylinder" },
  cloud: { name: "Cloud", color: "#a1a1aa", Icon: IconGateway, tool: "Cloud", desc: "Cloud" },
  note: { name: "Note", color: "#fbbf24", Icon: IconArchitect, tool: "Note", desc: "Note" },
};

const SERVICE_TYPES: NodeType[] = ["client", "gateway", "auth", "compute", "cache", "database", "queue", "ci", "telemetry"];
const DRAW_TYPES: NodeType[] = ["text", "box", "ellipse", "diamond", "cylinder", "cloud", "note"];

// 5 Rich Prebuilt Production Enterprise Practice Templates
const DEMO_TEMPLATES: DemoTemplate[] = [
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
];

const CHALLENGES: Challenge[] = [
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
      const directDbConn = conns.some((c) => {
        const fromNode = nodes.find((n) => n.id === c.from);
        const toNode = nodes.find((n) => n.id === c.to);
        return fromNode?.type === "client" && toNode?.type === "database";
      });
      return hasAuth && hasApp && !directDbConn;
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
    checkSuccess: (nodes, conns) => {
      const hasApp = nodes.some((n) => n.type === "compute");
      const clientToApp = conns.some((c) => {
        const f = nodes.find((n) => n.id === c.from);
        const t = nodes.find((n) => n.id === c.to);
        return f?.type === "client" && t?.type === "compute";
      });
      const appToDb = conns.some((c) => {
        const f = nodes.find((n) => n.id === c.from);
        const t = nodes.find((n) => n.id === c.to);
        return f?.type === "compute" && t?.type === "database";
      });
      return hasApp && clientToApp && appToDb;
    },
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
    checkSuccess: (nodes, conns) => {
      const hasCi = nodes.some((n) => n.type === "ci");
      const devToCi = conns.some((c) => {
        const f = nodes.find((n) => n.id === c.from);
        const t = nodes.find((n) => n.id === c.to);
        return f?.type === "client" && t?.type === "ci";
      });
      const ciToApp = conns.some((c) => {
        const f = nodes.find((n) => n.id === c.from);
        const t = nodes.find((n) => n.id === c.to);
        return f?.type === "ci" && t?.type === "compute";
      });
      return hasCi && devToCi && ciToApp;
    },
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
    checkSuccess: (nodes, conns) => {
      const hasCache = nodes.some((n) => n.type === "cache");
      const hasQueue = nodes.some((n) => n.type === "queue");
      const appConnectedToCache = conns.some((c) => {
        const f = nodes.find((n) => n.id === c.from);
        const t = nodes.find((n) => n.id === c.to);
        return (f?.type === "compute" && t?.type === "cache") || (f?.type === "cache" && t?.type === "compute");
      });
      return hasCache && hasQueue && appConnectedToCache;
    },
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
    checkSuccess: (nodes, conns) => {
      const hasTelemetry = nodes.some((n) => n.type === "telemetry");
      const linked = conns.some((c) => {
        const f = nodes.find((n) => n.id === c.from);
        const t = nodes.find((n) => n.id === c.to);
        return f?.type === "telemetry" || t?.type === "telemetry";
      });
      return hasTelemetry && linked;
    },
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
    checkSuccess: (nodes, conns) => {
      const hasGateway = nodes.some((n) => n.type === "gateway");
      const hasApp = nodes.some((n) => n.type === "compute");
      const linked = (from: string, to: string) =>
        conns.some((c) => {
          const f = nodes.find((n) => n.id === c.from);
          const t = nodes.find((n) => n.id === c.to);
          return f?.type === from && t?.type === to;
        });
      const clientToDb = linked("client", "database") || linked("database", "client");
      return hasGateway && hasApp && linked("client", "gateway") && linked("gateway", "compute") && linked("compute", "database") && !clientToDb;
    },
  },
];

type CanvasToolMode = "select" | "pan" | "connect" | "disconnect" | "text";
type BoardSnap = { nodes: SystemNode[]; connections: Connection[] };
type Gesture =
  | { kind: "drag"; id: string; origin: BoardSnap }
  | { kind: "resize"; id: string; x: number; y: number; w: number; h: number; origin: BoardSnap }
  | { kind: "pan"; x: number; y: number; left: number; top: number };

let boardSerial = 0;
function freshBoardId(prefix: string) {
  boardSerial += 1;
  return `${prefix}-${boardSerial}`;
}

export function FoundryLab({ m, initialChallengeId }: { m: Messages; initialChallengeId?: string }) {
  const { me, refresh } = useKeel();
  const validInitial = CHALLENGES.find((c) => c.id === initialChallengeId);
  const [activeChallenge, setActiveChallenge] = useState<ChallengeId>(validInitial ? (initialChallengeId as ChallengeId) : "freeform");
  const [nodes, setNodes] = useState<SystemNode[]>(validInitial ? validInitial.initialNodes : CHALLENGES[0].initialNodes);
  const [connections, setConnections] = useState<Connection[]>(validInitial ? validInitial.initialConnections : CHALLENGES[0].initialConnections);
  
  // Selection and drawing state
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedConnId, setSelectedConnId] = useState<string | null>(null);
  const [toolMode, setToolMode] = useState<CanvasToolMode>("select");
  const [connectFromId, setConnectFromId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  // Simulation State
  const [particles, setParticles] = useState<Particle[]>([]);
  const [trafficMultiplier, setTrafficMultiplier] = useState(1);
  const [flowSpeed, setFlowSpeed] = useState<0.25 | 0.5 | 1 | 2>(0.5);
  const [flowPaused, setFlowPaused] = useState(false);
  const [hoveredParticle, setHoveredParticle] = useState<Particle | null>(null);
  const [selectedParticle, setSelectedParticle] = useState<Particle | null>(null);
  const [showAnalyticsDrawer, setShowAnalyticsDrawer] = useState(false);
  const [recentPacketLedger, setRecentPacketLedger] = useState<Particle[]>([]);
  const [chaosActive, setChaosActive] = useState(false);
  const [ciStatus, setCiStatus] = useState<"idle" | "running" | "passed" | "failed">("idle");
  const [xp, setXp] = useState(me?.xp ?? 120);
  const [solvedChallenges, setSolvedChallenges] = useState<string[]>([]);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [showTooltips] = useState(true);

  // AI Architect & Guide State
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiReport, setAiReport] = useState<{
    status: "verified" | "flawed" | "warning";
    statusText: string;
    whatIsWrong: string;
    whyItMatters: string;
    stepByStep: string[];
    canAutoFix: boolean;
  } | null>(null);
  const [aiQuestion, setAiQuestion] = useState("");
  const [showAiGuide, setShowAiGuide] = useState(true);
  const [fullPage, setFullPage] = useState(true);
  const portalReady = useSyncExternalStore(() => () => {}, () => true, () => false);
  const [zoom, setZoom] = useState(1);
  const [snap, setSnap] = useState(true);
  const [wireStyle, setWireStyle] = useState<WireStyle>("curve");
  const [showRail, setShowRail] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [gesture, setGesture] = useState<Gesture | null>(null);
  const [historyCounts, setHistoryCounts] = useState({ past: 0, future: 0 });

  const boardRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const particleIdRef = useRef(1);
  const nodesRef = useRef(nodes);
  const connectionsRef = useRef(connections);
  const historyRef = useRef<{ past: BoardSnap[]; future: BoardSnap[] }>({ past: [], future: [] });
  const editRemembered = useRef(false);
  const zoomRef = useRef(zoom);
  const snapRef = useRef(snap);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const gestureRef = useRef<Gesture | null>(null);
  const awardedMissions = useRef(new Set<string>());
  const commands = useRef({
    undo: () => {},
    redo: () => {},
    copy: () => {},
    remove: () => {},
  });

  useEffect(() => {
    nodesRef.current = nodes;
    connectionsRef.current = connections;
    zoomRef.current = zoom;
    snapRef.current = snap;
    gestureRef.current = gesture;
  }, [nodes, connections, zoom, snap, gesture]);

  const boardPoint = useCallback((clientX: number, clientY: number) => {
    const rect = boardRef.current?.getBoundingClientRect();
    const scale = zoomRef.current || 1;
    if (!rect) return { x: 0, y: 0 };
    return { x: (clientX - rect.left) / scale, y: (clientY - rect.top) / scale };
  }, []);

  function snapshot(): BoardSnap {
    return {
      nodes: nodesRef.current.map((node) => ({ ...node })),
      connections: connectionsRef.current.map((conn) => ({ ...conn })),
    };
  }

  function publishHistory() {
    setHistoryCounts({
      past: historyRef.current.past.length,
      future: historyRef.current.future.length,
    });
  }

  function remember() {
    historyRef.current.past.push(snapshot());
    if (historyRef.current.past.length > 80) historyRef.current.past.shift();
    historyRef.current.future = [];
    publishHistory();
  }

  function undo() {
    const prev = historyRef.current.past.pop();
    if (!prev) return;
    historyRef.current.future.push(snapshot());
    nodesRef.current = prev.nodes;
    connectionsRef.current = prev.connections;
    setNodes(prev.nodes);
    setConnections(prev.connections);
    publishHistory();
  }

  function redo() {
    const next = historyRef.current.future.pop();
    if (!next) return;
    historyRef.current.past.push(snapshot());
    nodesRef.current = next.nodes;
    connectionsRef.current = next.connections;
    setNodes(next.nodes);
    setConnections(next.connections);
    publishHistory();
  }

  function rememberOnce() {
    if (editRemembered.current) return;
    editRemembered.current = true;
    remember();
  }

  const canUndo = historyCounts.past > 0;
  const canRedo = historyCounts.future > 0;

  // Switch challenge
  const selectChallenge = (id: ChallengeId) => {
    const ch = CHALLENGES.find((c) => c.id === id);
    if (!ch) return;
    remember();
    const nextNodes = JSON.parse(JSON.stringify(ch.initialNodes)) as SystemNode[];
    const nextConnections = JSON.parse(JSON.stringify(ch.initialConnections)) as Connection[];
    nodesRef.current = nextNodes;
    connectionsRef.current = nextConnections;
    setActiveChallenge(id);
    setNodes(nextNodes);
    setConnections(nextConnections);
    setSelectedNodeId(null);
    setSelectedConnId(null);
    setConnectFromId(null);
    setEditingId(null);
    setToast({ message: `Loaded Mission: ${ch.title}`, type: "info" });
  };

  // Load a Prebuilt Demo Template
  const loadTemplate = (templateId: string) => {
    const t = DEMO_TEMPLATES.find((tpl) => tpl.id === templateId);
    if (!t) return;
    remember();
    const nextNodes = JSON.parse(JSON.stringify(t.nodes)) as SystemNode[];
    const nextConnections = JSON.parse(JSON.stringify(t.connections)) as Connection[];
    nodesRef.current = nextNodes;
    connectionsRef.current = nextConnections;
    setActiveChallenge("freeform");
    setNodes(nextNodes);
    setConnections(nextConnections);
    setSelectedNodeId(null);
    setSelectedConnId(null);
    setConnectFromId(null);
    setEditingId(null);
    setToast({ message: t.name, type: "success" });
  };

  // Tidy / Auto-Layout Architecture Tool (Places nodes into neat, non-overlapping enterprise tiers)
  const tidyArchitecture = (source?: SystemNode[], record = true) => {
    const tierMap: Record<NodeType, number> = {
      client: 0,
      gateway: 1,
      auth: 1,
      compute: 2,
      ci: 2,
      cache: 3,
      queue: 3,
      database: 4,
      telemetry: 5,
      text: 6,
      box: 6,
      ellipse: 6,
      diamond: 6,
      cylinder: 6,
      cloud: 6,
      note: 6,
    };

    const list = source ?? nodesRef.current;
    if (record) remember();
    const tiers: Record<number, SystemNode[]> = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
    for (const node of list) {
      if (isShape(node.type)) continue;
      const tier = tierMap[node.type] ?? 2;
      tiers[tier].push(node);
    }

    const updated = list.map((node) => {
      if (isShape(node.type)) return node;
      const tier = tierMap[node.type] ?? 2;
      const tierList = tiers[tier] ?? [];
      const indexInTier = tierList.findIndex((n) => n.id === node.id);

      if (tier === 5) {
        // Telemetry row at bottom
        return {
          ...node,
          x: 340 + indexInTier * 220,
          y: 400,
        };
      }

      const x = 50 + tier * 210;
      const y = 60 + indexInTier * 135;
      return { ...node, x, y };
    });

    nodesRef.current = updated;
    setNodes(updated);
    setToast({ message: "The parts are lined up.", type: "success" });
  };

  // Live Heuristic & AI Diagnostic Engine
  const runAiDiagnostic = useCallback(async (customQuestion?: string) => {
    setAiAnalyzing(true);

    // 1. Rule-based heuristic verification
    const hasDirectDb = connections.some((c) => {
      const f = nodes.find((n) => n.id === c.from);
      const t = nodes.find((n) => n.id === c.to);
      return f?.type === "client" && t?.type === "database";
    });
    const hasCompute = nodes.some((n) => n.type === "compute");
    const hasDown = nodes.some((n) => n.health === "down");
    const isolatedNodes = nodes.filter((n) => !connections.some((c) => c.from === n.id || c.to === n.id));
    const hasCache = nodes.some((n) => n.type === "cache");
    const isHeavyLoad = trafficMultiplier >= 2;

    let status: "verified" | "flawed" | "warning" = "verified";
    let statusText = "The drawing holds.";
    let whatIsWrong = "The person, the decision, and the record stay apart.";
    let whyItMatters = "A person reaches the record only through the part that decides.";
    let stepByStep: string[] = [];
    let canAutoFix = false;

    if (hasDirectDb) {
      status = "flawed";
      statusText = "The person reaches the record directly.";
      whatIsWrong = "The client is connected to the database. Nothing between them checks who the person is or what they may do.";
      whyItMatters = "Anyone who can open the page can read and change the records.";
      stepByStep = [
        "Remove the line from the client to the database.",
        "Put a check and the application between them.",
        "Connect the client to the check, the check to the application, and the application to the database.",
      ];
      canAutoFix = true;
    } else if (!hasCompute && nodes.length >= 2) {
      status = "flawed";
      statusText = "The decision has nowhere to live.";
      whatIsWrong = "The drawing has a person and a record, and no application between them.";
      whyItMatters = "A rule that lives in the browser can be changed by the person using it.";
      stepByStep = [
        "Add the application.",
        "Connect the person to the application, and the application to the record.",
      ];
      canAutoFix = true;
    } else if (hasDown) {
      status = "flawed";
      statusText = "A part of the drawing is down.";
      whatIsWrong = "A part on the path is down, so the request stops there.";
      whyItMatters = "The person gets no answer while that part is down.";
      stepByStep = [
        "Mark that part healthy, or restore it.",
        "Give the request another place to wait if that part fails.",
      ];
      canAutoFix = true;
    } else if (isolatedNodes.length > 0) {
      status = "warning";
      statusText = "A part is not connected.";
      whatIsWrong = `${isolatedNodes.map((n) => n.label).join(", ")} ${isolatedNodes.length === 1 ? "has" : "have"} no line.`;
      whyItMatters = "A part with no line does no work.";
      stepByStep = ["Connect it, or remove it."];
      canAutoFix = false;
    } else if (isHeavyLoad && !hasCache) {
      status = "warning";
      statusText = "The record is taking every read.";
      whatIsWrong = "The load is high, and every read goes to the database.";
      whyItMatters = "The database runs out of room for new requests, and the answer gets slow.";
      stepByStep = [
        "Add a cache beside the application.",
        "Send repeated reads to the cache.",
      ];
      canAutoFix = true;
    }

    // Attempt AI enhancement via OpenRouter endpoint
    try {
      const res = await fetch("/api/foundry/analyze", {
        method: "POST",
        headers: { "content-type": "application/json", "x-keel": "1" },
        body: JSON.stringify({
          nodes: nodes.map((n) => ({ id: n.id, type: n.type, label: n.label, health: n.health })),
          connections: connections.map((c) => ({ from: c.from, to: c.to })),
          challengeTitle: activeChallenge,
          question: customQuestion,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          const text = String(data.reply);
          const wrongMatch = text.match(/WHAT IS WRONG[\s\S]*?:([\s\S]*?)(?=WHY IT MATTERS|$)/i);
          const whyMatch = text.match(/WHY IT MATTERS[\s\S]*?:([\s\S]*?)(?=STEP-BY-STEP GUIDANCE|$)/i);
          const stepsMatch = text.match(/STEP-BY-STEP GUIDANCE[\s\S]*?:([\s\S]*)$/i);

          if (wrongMatch && wrongMatch[1]) whatIsWrong = wrongMatch[1].trim();
          if (whyMatch && whyMatch[1]) whyItMatters = whyMatch[1].trim();
          if (stepsMatch && stepsMatch[1]) {
            const parsedSteps = stepsMatch[1]
              .split(/\n\d+\.\s+/)
              .map((s) => s.trim())
              .filter(Boolean);
            if (parsedSteps.length > 0) stepByStep = parsedSteps;
          }
        }
      }
    } catch {
      // Keep heuristic fallback
    }

    setAiReport({
      status,
      statusText,
      whatIsWrong,
      whyItMatters,
      stepByStep,
      canAutoFix,
    });
    setAiAnalyzing(false);
  }, [nodes, connections, trafficMultiplier, activeChallenge]);

  // Run AI analysis on topology change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      void runAiDiagnostic();
    }, 600);
    return () => clearTimeout(timer);
  }, [nodes.length, connections.length, trafficMultiplier, runAiDiagnostic]);

  // Mission progress follows the drawing. The award itself is deferred so it is not a render cascade.
  useEffect(() => {
    const current = CHALLENGES.find((c) => c.id === activeChallenge);
    if (!current || activeChallenge === "freeform") return;
    if (solvedChallenges.includes(activeChallenge) || awardedMissions.current.has(activeChallenge)) return;
    if (!current.checkSuccess(nodes, connections)) return;
    const missionId = activeChallenge;
    const title = current.title;
    const timer = window.setTimeout(() => {
      if (awardedMissions.current.has(missionId)) return;
      awardedMissions.current.add(missionId);
      setSolvedChallenges((prev) => (prev.includes(missionId) ? prev : [...prev, missionId]));
      setXp((prev) => prev + 50);
      setToast({ message: `Mission Passed! +50 XP: ${title}`, type: "success" });
      fetch("/api/foundry/complete", {
        method: "POST",
        headers: { "content-type": "application/json", "x-keel": "1" },
        body: JSON.stringify({ challengeId: missionId }),
      })
        .then(() => refresh())
        .catch(() => {});
    }, 0);
    return () => window.clearTimeout(timer);
  }, [nodes, connections, activeChallenge, solvedChallenges, refresh]);

  // Particle Generation Loop (Human-trackable live dataflow)
  useEffect(() => {
    if (connections.length === 0 || flowPaused || selectedParticle !== null) return;
    const interval = window.setInterval(() => {
      if (connections.length === 0) return;
      const randomConn = connections[Math.floor(Math.random() * connections.length)];
      if (!randomConn) return;

      const fromNode = nodes.find((n) => n.id === randomConn.from);
      const toNode = nodes.find((n) => n.id === randomConn.to);
      if (!fromNode || !toNode || fromNode.health === "down") return;

      let pType: Particle["type"] = "request";
      let pLabel = "HTTP GET /api/v1/feed";
      let pProtocol = "HTTPS / TLS 1.3";
      let pSize = "840 B";
      let pLatency = 14;
      let pStatus = "200 OK";
      let pDesc = "User touchpoint initiating secure TLS session to ingress tier.";

      if (toNode.type === "cache") {
        pType = "cache_hit";
        pLabel = "REDIS GET session:token";
        pProtocol = "RESP / TCP:6379";
        pSize = "420 B";
        pLatency = 2;
        pStatus = "CACHE_HIT";
        pDesc = "In-memory key-value read bypasses database disk IO for sub-millisecond retrieval.";
      } else if (toNode.type === "database") {
        pType = "db_write";
        pLabel = "SQL INSERT INTO orders";
        pProtocol = "PostgreSQL / TCP:5432";
        pSize = "3.2 KB";
        pLatency = 24;
        pStatus = "ACID COMMITTED";
        pDesc = "Synchronous durable write with write-ahead log (WAL) synchronization.";
      } else if (toNode.type === "auth") {
        pType = chaosActive ? "blocked" : "request";
        pLabel = "JWT Session Token Verify";
        pProtocol = "gRPC / TLS";
        pSize = "1.1 KB";
        pLatency = 4;
        pStatus = chaosActive ? "401 UNAUTHORIZED" : "200 VERIFIED";
        pDesc = chaosActive
          ? "Fault injection: Security Guard revoked compromised token at the edge."
          : "Zero-trust verification validating cryptographic signature and RBAC scopes.";
      } else if (toNode.type === "queue") {
        pType = "request";
        pLabel = "KAFKA PRODUCE events.orders";
        pProtocol = "Kafka Binary / TCP:9092";
        pSize = "2.4 KB";
        pLatency = 5;
        pStatus = "ACK_ALL";
        pDesc = "Asynchronous decoupled message published across partitioned event stream.";
      } else if (toNode.type === "ci") {
        pType = "ci_test";
        pLabel = "CI/CD Test Runner Artifact";
        pProtocol = "GitOps / SSH";
        pSize = "14.2 KB";
        pLatency = 38;
        pStatus = "PASS";
        pDesc = "Automated pipeline runner executing unit tests and container builds.";
      }

      particleIdRef.current += 1;
      const newParticle: Particle = {
        id: particleIdRef.current,
        connId: randomConn.id,
        progress: 0,
        // Gentle human-trackable speed (3-6s transit) scaled by flowSpeed and trafficMultiplier
        speed: (0.003 + Math.random() * 0.0015) * flowSpeed * trafficMultiplier,
        type: pType,
        label: pLabel,
        protocol: pProtocol,
        payloadSize: pSize,
        latencyMs: pLatency,
        status: pStatus,
        sourceLabel: fromNode.label,
        targetLabel: toNode.label,
        description: pDesc,
      };

      setParticles((prev) => [...prev.slice(-25), newParticle]);
      setRecentPacketLedger((prev) => [newParticle, ...prev.slice(0, 19)]);
    }, 450 / Math.max(0.5, trafficMultiplier * flowSpeed));

    return () => window.clearInterval(interval);
  }, [connections, nodes, trafficMultiplier, chaosActive, flowPaused, selectedParticle, flowSpeed]);

  // Particle Movement Animation Loop
  useEffect(() => {
    let animId: number;
    const step = () => {
      // If paused or inspecting a selected particle, STOP the flow completely!
      if (!flowPaused && selectedParticle === null) {
        // If hovered, slow down to 0.15x speed for effortless tracking
        const speedScale = hoveredParticle !== null ? 0.15 : 1.0;
        setParticles((prev) =>
          prev
            .map((p) => ({ ...p, progress: p.progress + p.speed * speedScale }))
            .filter((p) => p.progress < 1)
        );
      }
      animId = requestAnimationFrame(step);
    };
    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [flowPaused, selectedParticle, hoveredParticle]);

  const applyPointer = useCallback((clientX: number, clientY: number) => {
    const point = boardPoint(clientX, clientY);
    setMousePos(point);
    const act = gestureRef.current;
    if (!act) return;
    if (act.kind === "pan") {
      if (viewportRef.current) {
        viewportRef.current.scrollLeft = act.left - (clientX - act.x);
        viewportRef.current.scrollTop = act.top - (clientY - act.y);
      }
      return;
    }
    if (act.kind === "resize") {
      let w = Math.max(72, act.w + (point.x - act.x));
      let h = Math.max(48, act.h + (point.y - act.y));
      if (snapRef.current) {
        w = Math.max(72, snapCoord(w));
        h = Math.max(48, snapCoord(h));
      }
      setNodes((prev) => {
        const next = prev.map((node) => (node.id === act.id ? { ...node, w, h } : node));
        nodesRef.current = next;
        return next;
      });
      return;
    }
    const off = dragOffsetRef.current;
    let x = Math.max(0, point.x - off.x);
    let y = Math.max(0, point.y - off.y);
    if (snapRef.current) {
      x = Math.max(0, snapCoord(x));
      y = Math.max(0, snapCoord(y));
    }
    setNodes((prev) => {
      const next = prev.map((node) => (node.id === act.id ? { ...node, x, y } : node));
      nodesRef.current = next;
      return next;
    });
  }, [boardPoint]);

  const finishGesture = useCallback(() => {
    const act = gestureRef.current;
    if (!act) return;
    gestureRef.current = null;
    setGesture(null);
    if (act.kind !== "drag" && act.kind !== "resize") return;
    const before = act.origin.nodes.find((node) => node.id === act.id);
    const after = nodesRef.current.find((node) => node.id === act.id);
    if (!before || !after) return;
    if (before.x === after.x && before.y === after.y && before.w === after.w && before.h === after.h) return;
    historyRef.current.past.push(act.origin);
    if (historyRef.current.past.length > 80) historyRef.current.past.shift();
    historyRef.current.future = [];
    setHistoryCounts({
      past: historyRef.current.past.length,
      future: historyRef.current.future.length,
    });
  }, []);

  useEffect(() => {
    if (!gesture) return;
    const move = (event: PointerEvent) => applyPointer(event.clientX, event.clientY);
    const up = () => finishGesture();
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [gesture, applyPointer, finishGesture]);

  useEffect(() => {
    if (!fullPage) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [fullPage]);

  useEffect(() => {
    const view = viewportRef.current;
    if (!view) return;
    const onWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      setZoom((current) => Math.min(2, Math.max(0.25, current * (event.deltaY > 0 ? 0.9 : 1.1))));
    };
    view.addEventListener("wheel", onWheel, { passive: false });
    return () => view.removeEventListener("wheel", onWheel);
  }, [fullPage]);

  // Connect Nodes helper
  const makeConnection = (fromId: string, toId: string) => {
    if (fromId === toId) return;
    const exists = connections.some(
      (c) => (c.from === fromId && c.to === toId) || (c.from === toId && c.to === fromId)
    );
    if (!exists) {
      const fromNode = nodes.find((n) => n.id === fromId);
      const toNode = nodes.find((n) => n.id === toId);
      const isDangerous = fromNode?.type === "client" && toNode?.type === "database";

      const newConn: Connection = {
        id: freshBoardId("c"),
        from: fromId,
        to: toId,
        status: isDangerous ? "error" : "active",
        protocol: isDangerous ? "DIRECT TCP (VULNERABLE)" : "HTTPS / Dataflow",
        style: wireStyle,
      };
      remember();
      const next = [...connectionsRef.current, newConn];
      connectionsRef.current = next;
      setConnections(next);
      setSelectedConnId(newConn.id);
      setToast({
        message: isDangerous
          ? "Connected directly to DB! Vulnerability created."
          : `Linked: ${fromNode?.label} → ${toNode?.label}`,
        type: isDangerous ? "error" : "success",
      });
    }
  };

  // Drag & Pointer Handlers
  const handlePointerDown = (id: string, e: React.PointerEvent) => {
    if (toolMode === "pan" || e.altKey || e.button === 1) {
      const view = viewportRef.current;
      if (!view) return;
      const nextGesture: Gesture = { kind: "pan", x: e.clientX, y: e.clientY, left: view.scrollLeft, top: view.scrollTop };
      gestureRef.current = nextGesture;
      setGesture(nextGesture);
      return;
    }
    if (toolMode === "text") {
      setSelectedNodeId(id);
      setSelectedConnId(null);
      setEditingId(id);
      return;
    }
    if (toolMode === "connect" || connectFromId) {
      if (connectFromId) {
        if (connectFromId !== id) {
          makeConnection(connectFromId, id);
        }
        setConnectFromId(null);
      } else {
        setConnectFromId(id);
      }
      return;
    }

    if (toolMode === "disconnect") {
      const conns = connections.filter((c) => c.from === id || c.to === id);
      if (conns.length > 0) {
        remember();
        const next = connectionsRef.current.filter((c) => c.from !== id && c.to !== id);
        connectionsRef.current = next;
        setConnections(next);
        setToast({ message: "Disconnected wires from node", type: "info" });
      }
      return;
    }

    const node = nodes.find((n) => n.id === id);
    if (!node) return;
    const point = boardPoint(e.clientX, e.clientY);
    setSelectedNodeId(id);
    setSelectedConnId(null);
    const offset = { x: point.x - node.x, y: point.y - node.y };
    dragOffsetRef.current = offset;
    const nextGesture: Gesture = { kind: "drag", id, origin: snapshot() };
    gestureRef.current = nextGesture;
    setGesture(nextGesture);
  };

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    applyPointer(e.clientX, e.clientY);
  }, [applyPointer]);

  const handlePointerUp = () => {
    finishGesture();
  };

  // Node Port Drag-to-Connect
  const startPortConnect = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConnectFromId(nodeId);
    setToast({ message: "Drawing arrow: Click a destination node to complete data link.", type: "info" });
  };

  const endPortConnect = (targetNodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (connectFromId && connectFromId !== targetNodeId) {
      makeConnection(connectFromId, targetNodeId);
    }
    setConnectFromId(null);
  };

  function visibleOrigin() {
    const view = viewportRef.current;
    const board = boardRef.current;
    const count = nodesRef.current.length;
    if (!view || !board) return { x: 80 + (count % 4) * 36, y: 80 + (count % 3) * 28 };
    const boardRect = board.getBoundingClientRect();
    const viewRect = view.getBoundingClientRect();
    const scale = zoomRef.current || 1;
    return {
      x: Math.max(0, (viewRect.left + 56 - boardRect.left) / scale + (count % 5) * 24),
      y: Math.max(0, (viewRect.top + 72 - boardRect.top) / scale + (count % 3) * 24),
    };
  }

  // CRUD: Add Node
  const addNode = (type: NodeType, at?: { x: number; y: number }) => {
    const meta = nodeTypeMeta[type];
    const spot = at ?? visibleOrigin();
    const id = freshBoardId(type);
    const size = nodeSize({ type });
    const drawing = isShape(type);
    const newNode: SystemNode = {
      id,
      type,
      label: meta.name.split("/")[0].trim(),
      x: Math.max(0, spot.x),
      y: Math.max(0, spot.y),
      w: drawing ? size.w : undefined,
      h: drawing ? size.h : undefined,
      z: nodesRef.current.length + 1,
      health: "healthy",
      latency: type === "cache" ? 2 : type === "database" ? 45 : 20,
      capacity: type === "gateway" ? 5000 : 1000,
      rps: drawing ? 0 : 50,
      role: drawing ? "" : meta.desc,
      industryTool: drawing ? "" : meta.tool,
    };
    remember();
    const next = [...nodesRef.current, newNode];
    nodesRef.current = next;
    setNodes(next);
    setSelectedNodeId(id);
    setSelectedConnId(null);
    if (type === "text") setEditingId(id);
    setToast({ message: `Added ${meta.name}`, type: "success" });
  };

  function startResize(id: string, event: React.PointerEvent) {
    event.stopPropagation();
    event.preventDefault();
    const node = nodesRef.current.find((item) => item.id === id);
    if (!node) return;
    const size = nodeSize(node);
    const point = boardPoint(event.clientX, event.clientY);
    const nextGesture: Gesture = { kind: "resize", id, x: point.x, y: point.y, w: size.w, h: size.h, origin: snapshot() };
    gestureRef.current = nextGesture;
    setGesture(nextGesture);
  }

  function onBackgroundPointerDown(event: React.PointerEvent) {
    if (toolMode === "pan" || event.button === 1 || event.altKey) {
      const view = viewportRef.current;
      if (!view) return;
      const nextGesture: Gesture = { kind: "pan", x: event.clientX, y: event.clientY, left: view.scrollLeft, top: view.scrollTop };
      gestureRef.current = nextGesture;
      setGesture(nextGesture);
      return;
    }
    if (toolMode === "text") {
      addNode("text", boardPoint(event.clientX, event.clientY));
      return;
    }
    setSelectedNodeId(null);
    setSelectedConnId(null);
    setConnectFromId(null);
    setEditingId(null);
  }

  // CRUD: Delete Node
  const deleteSelectedNode = () => {
    if (!selectedNodeId) return;
    remember();
    const nextNodes = nodesRef.current.filter((n) => n.id !== selectedNodeId);
    const nextConnections = connectionsRef.current.filter((c) => c.from !== selectedNodeId && c.to !== selectedNodeId);
    nodesRef.current = nextNodes;
    connectionsRef.current = nextConnections;
    setNodes(nextNodes);
    setConnections(nextConnections);
    setSelectedNodeId(null);
    setEditingId(null);
    setToast({ message: "Node deleted", type: "info" });
  };

  function deleteSelection() {
    if (selectedNodeId) {
      deleteSelectedNode();
      return;
    }
    if (!selectedConnId) return;
    remember();
    const next = connectionsRef.current.filter((conn) => conn.id !== selectedConnId);
    connectionsRef.current = next;
    setConnections(next);
    setSelectedConnId(null);
    setToast({ message: "Connection removed", type: "info" });
  }

  function duplicateSelected() {
    const source = nodesRef.current.find((node) => node.id === selectedNodeId);
    if (!source) return;
    remember();
    const copy: SystemNode = {
      ...source,
      id: freshBoardId(source.type),
      x: source.x + 28,
      y: source.y + 28,
      z: (source.z ?? 0) + 1,
      label: source.label,
    };
    const next = [...nodesRef.current, copy];
    nodesRef.current = next;
    setNodes(next);
    setSelectedNodeId(copy.id);
  }

  function orderSelected(direction: "front" | "back") {
    if (!selectedNodeId) return;
    remember();
    setNodes((prev) => {
      const levels = prev.map((node) => node.z ?? 0);
      const nextZ = direction === "front" ? Math.max(...levels, 0) + 1 : Math.min(...levels, 0) - 1;
      const next = prev.map((node) => (node.id === selectedNodeId ? { ...node, z: nextZ } : node));
      nodesRef.current = next;
      return next;
    });
  }

  function chooseWire(style: WireStyle) {
    setWireStyle(style);
    if (!selectedConnId) return;
    remember();
    const next = connectionsRef.current.map((conn) => (conn.id === selectedConnId ? { ...conn, style } : conn));
    connectionsRef.current = next;
    setConnections(next);
  }

  function zoomBy(factor: number) {
    setZoom((current) => Math.min(2, Math.max(0.25, Math.round(current * factor * 100) / 100)));
  }

  function fitView() {
    const view = viewportRef.current;
    if (!view) return;
    const ext = boardExtent(nodesRef.current);
    const next = Math.min(1.5, Math.max(0.25, Math.min((view.clientWidth - 32) / ext.w, (view.clientHeight - 32) / ext.h)));
    setZoom(Number.isFinite(next) && next > 0 ? next : 1);
    view.scrollTo({ left: 0, top: 0 });
  }

  // CRUD: Update Node
  const updateSelectedNode = (field: keyof SystemNode, value: unknown) => {
    if (!selectedNodeId) return;
    setNodes((prev) => {
      const next = prev.map((n) => (n.id === selectedNodeId ? { ...n, [field]: value } : n));
      nodesRef.current = next;
      return next;
    });
  };

  // Auto-Fix via AI Guide (Applies recommended architecture)
  const applyRecommendedFix = () => {
    // 1. Remove dangerous direct client-to-db connections
    const cleanConns = connections.filter((c) => {
      const f = nodes.find((n) => n.id === c.from);
      const t = nodes.find((n) => n.id === c.to);
      return !(f?.type === "client" && t?.type === "database");
    });

    let currentNodes = [...nodes];
    const newConns = [...cleanConns];

    // Ensure Auth Guard exists
    let authNode = currentNodes.find((n) => n.type === "auth" || n.type === "gateway");
    if (!authNode) {
      authNode = {
        id: freshBoardId("auth"),
        type: "auth",
        label: "Better Auth Guard",
        x: 250,
        y: 150,
        health: "healthy",
        latency: 8,
        capacity: 2500,
        rps: 80,
        role: "Session Validation & MFA",
        industryTool: "Better Auth / JWT",
      };
      currentNodes.push(authNode);
    }

    // Ensure Compute exists
    let computeNode = currentNodes.find((n) => n.type === "compute");
    if (!computeNode) {
      computeNode = {
        id: freshBoardId("compute"),
        type: "compute",
        label: "App Logic Server",
        x: 470,
        y: 150,
        health: "healthy",
        latency: 25,
        capacity: 1500,
        rps: 80,
        role: "Business Rules Tier",
        industryTool: "Node.js / Express",
      };
      currentNodes.push(computeNode);
    }

    // Restore any down nodes
    currentNodes = currentNodes.map((n) => ({ ...n, health: "healthy" }));

    // Re-wire proper flow
    const clientNode = currentNodes.find((n) => n.type === "client");
    const dbNode = currentNodes.find((n) => n.type === "database");

    if (clientNode && authNode) {
      if (!newConns.some((c) => c.from === clientNode.id && c.to === authNode.id)) {
        newConns.push({ id: freshBoardId("c-fix-1"), from: clientNode.id, to: authNode.id, status: "active", protocol: "HTTPS / TLS" });
      }
    }
    if (authNode && computeNode) {
      if (!newConns.some((c) => c.from === authNode.id && c.to === computeNode.id)) {
        newConns.push({ id: freshBoardId("c-fix-2"), from: authNode.id, to: computeNode.id, status: "active", protocol: "Verified Token" });
      }
    }
    if (computeNode && dbNode) {
      if (!newConns.some((c) => c.from === computeNode.id && c.to === dbNode.id)) {
        newConns.push({ id: freshBoardId("c-fix-3"), from: computeNode.id, to: dbNode.id, status: "active", protocol: "SQL Connection Pool" });
      }
    }

    remember();
    nodesRef.current = currentNodes;
    connectionsRef.current = newConns;
    setConnections(newConns);
    tidyArchitecture(currentNodes, false);
    setToast({ message: "Applied Recommended Architecture: Security boundary and middle tier restored.", type: "success" });
  };

  // Chaos: Simulate Node Outage (Fault Injection)
  const triggerChaos = () => {
    const aliveNodes = nodes.filter((n) => n.health !== "down" && n.type !== "client" && !isShape(n.type));
    if (aliveNodes.length === 0) return;
    const target = aliveNodes[Math.floor(Math.random() * aliveNodes.length)];
    setNodes((prev) =>
      prev.map((n) => (n.id === target.id ? { ...n, health: "down", rps: 0 } : n))
    );
    setToast({ message: `Fault Injection: Offline node ${target.label}`, type: "error" });
  };

  // Chaos: Auto Heal
  const autoHeal = () => {
    setNodes((prev) => prev.map((n) => ({ ...n, health: "healthy", latency: Math.min(n.latency, 35) })));
    setTrafficMultiplier(1);
    setChaosActive(false);
    setToast({ message: "System restored: All components healthy.", type: "success" });
  };

  // CI/CD Simulator
  const runCiPipeline = () => {
    setCiStatus("running");
    setToast({ message: "Running CI Pipeline: Automated Lint, Tests, Secret Scan...", type: "info" });
    setTimeout(() => {
      const willPass = Math.random() > 0.3;
      if (willPass) {
        setCiStatus("passed");
        setToast({ message: "CI/CD Pipeline Green: Deployed to Staging / Canary.", type: "success" });
      } else {
        setCiStatus("failed");
        setToast({ message: "CI/CD Pipeline Red: Test failure blocked merge! Andon cord engaged.", type: "error" });
      }
    }, 1600);
  };

  // Clear Canvas
  const clearCanvas = () => {
    remember();
    nodesRef.current = [];
    connectionsRef.current = [];
    setNodes([]);
    setConnections([]);
    setSelectedNodeId(null);
    setSelectedConnId(null);
    setConnectFromId(null);
    setEditingId(null);
    setParticles([]);
    setToast({ message: "Canvas cleared", type: "info" });
  };

  function blankCanvas() {
    remember();
    nodesRef.current = [];
    connectionsRef.current = [];
    setActiveChallenge("freeform");
    setNodes([]);
    setConnections([]);
    setSelectedNodeId(null);
    setSelectedConnId(null);
    setConnectFromId(null);
    setEditingId(null);
    setParticles([]);
    setToast({ message: "Blank canvas", type: "info" });
  }

  function openDrawing(file: File) {
    file.text().then((text) => {
      const data = JSON.parse(text) as { nodes?: unknown; connections?: unknown };
      if (!Array.isArray(data.nodes)) throw new Error("nodes");
      const nextNodes: SystemNode[] = [];
      for (const item of data.nodes) {
        if (!item || typeof item !== "object") continue;
        const raw = item as Partial<SystemNode>;
        if (typeof raw.id !== "string" || typeof raw.type !== "string" || !nodeTypeMeta[raw.type as NodeType]) continue;
        if (typeof raw.x !== "number" || typeof raw.y !== "number") continue;
        const type = raw.type as NodeType;
        nextNodes.push({
          id: raw.id,
          type,
          label: typeof raw.label === "string" ? raw.label : nodeTypeMeta[type].name,
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
        });
      }
      const ids = new Set(nextNodes.map((node) => node.id));
      const nextConnections: Connection[] = [];
      if (Array.isArray(data.connections)) {
        for (const item of data.connections) {
          if (!item || typeof item !== "object") continue;
          const raw = item as Partial<Connection> & { source?: string; target?: string };
          const from = typeof raw.from === "string" ? raw.from : raw.source;
          const to = typeof raw.to === "string" ? raw.to : raw.target;
          if (!from || !to || !ids.has(from) || !ids.has(to)) continue;
          nextConnections.push({
            id: typeof raw.id === "string" ? raw.id : `c-${from}-${to}`,
            from,
            to,
            status: raw.status === "error" ? "error" : "active",
            protocol: typeof raw.protocol === "string" ? raw.protocol : undefined,
            style: raw.style === "elbow" || raw.style === "straight" || raw.style === "curve" ? raw.style : undefined,
          });
        }
      }
      remember();
      nodesRef.current = nextNodes;
      connectionsRef.current = nextConnections;
      setActiveChallenge("freeform");
      setNodes(nextNodes);
      setConnections(nextConnections);
      setSelectedNodeId(null);
      setSelectedConnId(null);
      setToast({ message: "Drawing opened", type: "success" });
    }).catch(() => setToast({ message: "That file is not a Foundry drawing. Open a JSON file saved from this lab.", type: "error" }));
  }

  useEffect(() => {
    commands.current = { undo, redo, copy: duplicateSelected, remove: deleteSelection };
  });

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = !!target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT" || target.isContentEditable);
      const key = event.key.toLowerCase();
      if ((event.metaKey || event.ctrlKey) && key === "z") {
        event.preventDefault();
        if (event.shiftKey) commands.current.redo();
        else commands.current.undo();
        return;
      }
      if ((event.metaKey || event.ctrlKey) && key === "y") {
        event.preventDefault();
        commands.current.redo();
        return;
      }
      if (typing) return;
      if ((event.metaKey || event.ctrlKey) && key === "d") {
        event.preventDefault();
        commands.current.copy();
      } else if (event.key === "Delete" || event.key === "Backspace") {
        if (!nodesRef.current.length && !connectionsRef.current.length) return;
        event.preventDefault();
        commands.current.remove();
      } else if (event.key === "Escape") {
        setToolMode("select");
        setConnectFromId(null);
        setEditingId(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Export Topology
  const exportTopology = () => {
    const topology = {
      specVersion: "2.0-keel-foundry",
      exportedAt: new Date().toISOString(),
      nodes: nodes.map((n) => ({
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
        latencyMs: n.latency,
        latency: n.latency,
        capacity: n.capacity,
        capacityRps: n.capacity,
        rps: n.rps,
      })),
      connections: connections.map((c) => ({
        id: c.id,
        from: c.from,
        to: c.to,
        source: c.from,
        target: c.to,
        status: c.status,
        style: c.style,
        protocol: c.protocol || "HTTPS",
      })),
    };
    const blob = new Blob([JSON.stringify(topology, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `keel-architecture-spec-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setToast({ message: "Architecture topology exported as JSON.", type: "success" });
  };

  const runService = async (action: "run" | "download") => {
    const response = await fetch("/api/project", {
      method: "POST",
      headers: { "content-type": "application/json", "x-keel": "1" },
      body: JSON.stringify({
        action,
        nodes: nodes.map((node) => ({ id: node.id, type: node.type })),
        connections: connections.map((edge) => ({ from: edge.from, to: edge.to })),
      }),
    });
    if (response.status === 401) {
      setToast({ message: "Sign in to run this service.", type: "error" });
      return;
    }
    if (action === "download") {
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { reason?: string } | null;
        setToast({ message: data?.reason || "The service file was not made.", type: "error" });
        return;
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "keel-service.zip";
      link.click();
      URL.revokeObjectURL(url);
      setToast({ message: "Service downloaded. Run it with node server.js.", type: "success" });
      return;
    }
    const data = (await response.json().catch(() => null)) as { url?: string; reason?: string } | null;
    if (!response.ok || !data?.url) {
      setToast({ message: data?.reason || "This board cannot run yet.", type: "error" });
      return;
    }
    setToast({ message: data.url, type: "success" });
    window.open(data.url, "_blank", "noopener");
  };

  // Compute live system stats
  const measured = nodes.filter((n) => !isShape(n.type));
  const healthyCount = measured.filter((n) => n.health === "healthy").length;
  const availability = measured.length ? Math.round((healthyCount / measured.length) * 100) : 100;
  const avgLatency = measured.length ? Math.round(measured.reduce((acc, n) => acc + (n.health === "down" ? 500 : n.latency), 0) / measured.length) : 0;
  const extent = boardExtent(nodes);
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  const selectedConn = connections.find((c) => c.id === selectedConnId);
  const currentCh = CHALLENGES.find((c) => c.id === activeChallenge) || CHALLENGES[0];
  const connectSourceNode = nodes.find((n) => n.id === connectFromId);

  const lab = (
    <div data-foundry-root="" className={fullPage ? "fixed inset-0 z-40 flex flex-col overflow-hidden bg-paper" : "mx-auto max-w-7xl px-4 py-8"}>
      {/* Toast Notification */}
      {toast && (
        <div
          role="status"
          className="fixed bottom-24 right-6 z-[60] flex items-center gap-3 rounded-lg border border-line bg-raised px-4 py-3 shadow-xl transition-all"
        >
          <span className="text-base font-bold">
            {toast.type === "success" ? <IconCheck size={16} className="text-good" /> : toast.type === "error" ? <IconChaos size={16} className="text-danger" /> : <IconArchitect size={16} className="text-copper" />}
          </span>
          <span className="text-xs font-semibold text-ink">{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="ms-3 text-soft hover:text-ink flex items-center justify-center"
            aria-label="Dismiss notification"
          >
            <IconClose size={12} />
          </button>
        </div>
      )}

      {/* Header & Academic Lineage */}
      <section className={fullPage ? "shrink-0 border-b border-line bg-paper px-3 py-2" : "rounded-xl border border-line bg-raised p-5 shadow-xs"}>
        {!fullPage && (<>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="kicker">DevOps & Systems Engineering Foundry</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink md:text-3xl">
              Systems Architecture & Dataflow Lab
            </h1>
            <p className="mt-1 text-sm text-soft">
              Interactive 2D/3D visual architecture simulator with live directional dataflow, entity relations, full CRUD, and an AI Architect Tutor.
            </p>
            <p className="mt-2"><Link className="text-sm underline" href="/foundry/pipeline">{m.pipeline}</Link></p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-wider text-soft font-semibold">Gained Experience:</span>
            <span className="flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1 font-mono text-sm font-bold text-copper shadow-xs">
              <IconXP size={13} className="text-copper" /> {xp} XP
            </span>
            <span className="rounded-full border border-good/30 bg-good/10 px-3 py-1 text-xs font-semibold text-good">
              {solvedChallenges.length}/5 Missions Complete
            </span>
          </div>
        </div>

        {/* Visual Lineage Prerequisites */}
        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-4">
          <div className="rounded-lg border border-line bg-paper p-3 text-ink shadow-xs">
            <span className="kicker block text-xs">Prerequisite 1</span>
            <h3 className="text-xs font-bold text-ink">CSC2031 — Security Programming</h3>
            <p className="mt-1 text-xs text-soft">RBAC, JWT tokens, WAF shields, encryption boundaries.</p>
          </div>

          <div className="rounded-lg border border-line bg-paper p-3 text-ink shadow-xs">
            <span className="kicker block text-xs">Prerequisite 2</span>
            <h3 className="text-xs font-bold text-ink">CSC2035 — Systems Design</h3>
            <p className="mt-1 text-xs text-soft">3-Tier architecture, Redis caches, read-replicas, decoupling.</p>
          </div>

          <div className="rounded-lg border border-line bg-paper p-3 text-ink shadow-xs">
            <span className="kicker block text-xs">Prerequisite 3</span>
            <h3 className="text-xs font-bold text-ink">CSC2033 — Team Project</h3>
            <p className="mt-1 text-xs text-soft">CI/CD pipelines, automated testing, merge gates, git flow.</p>
          </div>

          <div className="rounded-lg border-2 border-copper bg-paper p-3 text-ink shadow-xs">
            <span className="kicker block text-xs text-copper font-bold">Capstone Foundry</span>
            <h3 className="text-xs font-bold text-ink">CSC3131 — DevOps & Operations</h3>
            <p className="mt-1 text-xs text-soft">Observability, MTTD/MTTR, SLA/SLO, chaos recovery.</p>
          </div>
        </div>
        </>)}

        {/* Missions Selector */}
        <div className={`${fullPage ? "flex max-h-14 shrink-0 flex-nowrap items-center gap-2 overflow-x-auto md:max-h-none md:flex-wrap md:overflow-visible" : "mt-5 flex flex-wrap items-center gap-2 border-t border-line pt-4"}`}>
          {fullPage && <h1 className="text-sm font-bold text-ink">Foundry</h1>}
          <span className="text-xs font-bold text-soft uppercase tracking-wider">Missions:</span>
          {CHALLENGES.map((ch) => {
            const isSolved = solvedChallenges.includes(ch.id);
            const isActive = activeChallenge === ch.id;
            return (
              <button
                key={ch.id}
                onClick={() => selectChallenge(ch.id)}
                className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg border px-3 py-1.5 text-xs font-semibold shadow-xs transition-all ${
                  isActive
                    ? "border-copper bg-copper text-raised shadow-xs"
                    : "border-line bg-paper text-ink hover:border-copper hover:bg-raised"
                }`}
              >
                <span>{ch.badge}</span>
                <span>{ch.title.split(":")[1]?.trim() || ch.title}</span>
                {isSolved && <IconCheck size={14} className="text-good font-bold" />}
              </button>
            );
          })}
        </div>
      </section>

      {/* Mission Objective Bar */}
      {!fullPage && <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-line bg-raised px-4 py-3 text-sm shadow-xs">
        <div className="flex items-center gap-3">
          <span className="rounded bg-paper border border-line px-2 py-0.5 text-xs font-mono font-bold text-copper">
            {currentCh.badge}
          </span>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-ink">{currentCh.title}</h2>
            <p className="text-xs text-soft mt-0.5">{currentCh.goal}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-soft">Need guidance?</span>
          <button
            onClick={() => setShowAiGuide((prev) => !prev)}
            className="rounded border border-line bg-paper px-2.5 py-1 text-xs font-bold text-ink hover:border-copper transition-colors shadow-xs flex items-center gap-1.5"
          >
            <IconArchitect size={15} className="text-copper" />
            <span>{showAiGuide ? "Hide AI Architect" : "Show AI Architect"}</span>
          </button>
        </div>
      </div>}

      {/* Main Studio Area */}
      <div className={fullPage ? "relative flex min-h-0 flex-1 flex-col" : "relative mt-4 grid grid-cols-1 gap-4 lg:grid-cols-4"}>
        {/* Left Sidebar: Component Palette & Control Panel */}
        <div className={fullPage ? (showRail ? "absolute start-3 top-16 z-30 max-h-[calc(100%-5rem)] w-72 space-y-4 overflow-auto" : "hidden") : "space-y-4 lg:col-span-1"}>
          {/* Architecture Toolbox with Premium Vector Icons */}
          <div className="rounded-xl border border-line bg-raised p-4 shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-ink">Architecture Toolbox</h2>
            <p className="mt-1 text-xs text-soft">Click to spawn enterprise nodes into the canvas.</p>
            <div className="mt-3 space-y-1.5">
              {SERVICE_TYPES.map((type) => {
                const meta = nodeTypeMeta[type];
                const NodeIcon = meta.Icon;
                return (
                  <button
                    key={type}
                    onClick={() => addNode(type)}
                    className="flex w-full items-center justify-between rounded-lg border border-line bg-paper px-3 py-2 text-left text-xs font-medium text-ink transition-all hover:border-copper hover:bg-raised shadow-xs group"
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="text-copper group-hover:scale-110 transition-transform">
                        <NodeIcon size={18} />
                      </span>
                      <span className="font-semibold">{meta.name.split("/")[0]}</span>
                    </span>
                    <span className="font-mono text-[10px] text-soft">{meta.tool.split("/")[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Telemetry HUD */}
          <div className="rounded-xl border border-line bg-raised p-4 shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-ink">Live Telemetry HUD</h2>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg border border-line bg-paper p-2.5 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-ink tracking-wider">Availability</span>
                <p className={`text-lg font-mono font-bold mt-0.5 ${availability >= 90 ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"}`}>
                  {availability}%
                </p>
              </div>
              <div className="rounded-lg border border-line bg-paper p-2.5 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-ink tracking-wider">Avg Latency</span>
                <p className="text-lg font-mono font-bold text-ink mt-0.5">
                  {avgLatency}<span className="text-xs font-normal text-soft ms-0.5">ms</span>
                </p>
              </div>
              <div className="rounded-lg border border-line bg-paper p-2.5 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-ink tracking-wider">Active Nodes</span>
                <p className="text-lg font-mono font-bold text-ink mt-0.5">{nodes.length}</p>
              </div>
              <div className="rounded-lg border border-line bg-paper p-2.5 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-ink tracking-wider">Traffic Load</span>
                <p className="text-lg font-mono font-bold text-ink mt-0.5">{trafficMultiplier}x <span className="text-xs font-normal text-soft">RPS</span></p>
              </div>
            </div>

            {/* High-Contrast Fault & Operational Testing Controls with Enterprise Vector Icons */}
            <h3 className="mt-5 text-xs font-bold uppercase tracking-wider text-ink">Fault Injection & Simulation</h3>
            <div className="mt-2.5 space-y-2">
              <button
                onClick={() => setTrafficMultiplier((prev) => (prev >= 4 ? 1 : prev + 1))}
                className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-xs text-left font-semibold text-ink hover:border-ink hover:bg-raised transition-all flex items-center justify-between shadow-xs"
              >
                <span className="flex items-center gap-2">
                  <IconSurge size={16} className="text-ink" />
                  <span>Traffic Surge</span>
                </span>
                <span className="font-mono text-[10px] font-bold text-ink px-2 py-0.5 rounded bg-raised border border-line">
                  {trafficMultiplier}x LOAD
                </span>
              </button>

              <button
                onClick={triggerChaos}
                className="w-full rounded-lg border border-red-300 dark:border-red-800 bg-paper px-3 py-2 text-xs text-left font-bold text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-all flex items-center justify-between shadow-xs"
              >
                <span className="flex items-center gap-2">
                  <IconChaos size={16} className="text-red-700 dark:text-red-400" />
                  <span>Fault Injection: Outage</span>
                </span>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800">
                  INJECT
                </span>
              </button>

              <button
                onClick={runCiPipeline}
                className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-xs text-left font-semibold text-ink hover:border-ink hover:bg-raised transition-all flex items-center justify-between shadow-xs"
              >
                <span className="flex items-center gap-2">
                  <IconCI size={16} className="text-ink" />
                  <span>Trigger CI Pipeline</span>
                </span>
                <span className={`font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                  ciStatus === "passed"
                    ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
                    : ciStatus === "failed"
                      ? "bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 border-red-300 dark:border-red-800"
                      : "bg-raised text-ink border-line"
                }`}>
                  {ciStatus}
                </span>
              </button>

              <button
                onClick={autoHeal}
                className="w-full rounded-lg border border-emerald-300 dark:border-emerald-800 bg-paper px-3 py-2 text-xs text-left font-bold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-all flex items-center justify-between shadow-xs"
              >
                <span className="flex items-center gap-2">
                  <IconAutoHeal size={16} className="text-emerald-700 dark:text-emerald-400" />
                  <span>Auto-Heal & Restore</span>
                </span>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  RESTORE
                </span>
              </button>

              <button
                onClick={exportTopology}
                className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-xs text-left font-semibold text-ink hover:border-ink hover:bg-raised transition-all flex items-center justify-between shadow-xs"
              >
                <span className="flex items-center gap-2">
                  <IconExport size={16} className="text-ink" />
                  <span>Export Architecture Spec</span>
                </span>
                <span className="font-mono text-[10px] font-bold text-ink px-2 py-0.5 rounded bg-raised border border-line">
                  JSON
                </span>
              </button>

              <button
                onClick={() => void runService("run")}
                className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-xs text-left font-semibold text-ink hover:border-ink hover:bg-raised transition-all flex items-center justify-between shadow-xs"
              >
                <span className="flex items-center gap-2">
                  <IconPlay size={16} className="text-ink" />
                  <span>Run this service</span>
                </span>
                <span className="font-mono text-[10px] font-bold text-ink px-2 py-0.5 rounded bg-raised border border-line">LIVE</span>
              </button>

              <button
                onClick={() => void runService("download")}
                className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-xs text-left font-semibold text-ink hover:border-ink hover:bg-raised transition-all flex items-center justify-between shadow-xs"
              >
                <span className="flex items-center gap-2">
                  <IconExport size={16} className="text-ink" />
                  <span>Download the service</span>
                </span>
                <span className="font-mono text-[10px] font-bold text-ink px-2 py-0.5 rounded bg-raised border border-line">ZIP</span>
              </button>
            </div>
          </div>
        </div>

        {/* Center / Right: Interactive Canvas & Toolbar */}
        <div className={fullPage ? "flex min-h-0 flex-1 flex-col gap-2 p-2" : "flex flex-col gap-4 lg:col-span-3"}>
          {/* Canvas Enterprise Toolbar with Precision Vector Icons */}
          <div className={`flex shrink-0 flex-wrap items-center justify-between gap-2 rounded-xl border border-line bg-raised px-3 py-2 shadow-xs ${fullPage ? "max-h-40 overflow-y-auto md:max-h-none md:overflow-visible" : ""}`}>
            {/* Interactive Modes */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => { setToolMode("select"); setConnectFromId(null); }}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                  toolMode === "select"
                    ? "border-copper bg-copper text-raised shadow-xs"
                    : "border-line bg-paper text-ink hover:border-copper"
                }`}
              >
                <IconPointer size={15} />
                <span>Select / Move</span>
              </button>

              <button
                onClick={() => { setToolMode("connect"); }}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                  toolMode === "connect" || connectFromId
                    ? "border-copper bg-copper text-raised shadow-xs"
                    : "border-line bg-paper text-ink hover:border-copper"
                }`}
              >
                <IconConnect size={15} />
                <span>Connect Arrow</span>
              </button>

              <button
                onClick={() => { setToolMode("disconnect"); setConnectFromId(null); }}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                  toolMode === "disconnect"
                    ? "border-danger bg-danger text-raised shadow-xs"
                    : "border-line bg-paper text-ink hover:border-danger hover:text-danger"
                }`}
              >
                <IconCut size={15} />
                <span>Cut Wire</span>
              </button>

              <button
                type="button"
                onClick={() => { setToolMode("pan"); setConnectFromId(null); }}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                  toolMode === "pan"
                    ? "border-copper bg-copper text-raised shadow-xs"
                    : "border-line bg-paper text-ink hover:border-copper"
                }`}
              >
                <span>Hand</span>
              </button>

              <button
                type="button"
                onClick={() => { setToolMode("text"); setConnectFromId(null); }}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                  toolMode === "text"
                    ? "border-copper bg-copper text-raised shadow-xs"
                    : "border-line bg-paper text-ink hover:border-copper"
                }`}
              >
                <span>Text</span>
              </button>

              {DRAW_TYPES.filter((type) => type !== "text").map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => addNode(type)}
                  className="rounded-lg border border-line bg-paper px-2.5 py-1.5 text-xs font-semibold text-ink hover:border-copper"
                >
                  {nodeTypeMeta[type].name}
                </button>
              ))}

              <button type="button" onClick={undo} disabled={!canUndo} className="rounded-lg border border-line bg-paper px-2.5 py-1.5 text-xs font-semibold text-ink hover:border-copper disabled:opacity-40">Undo</button>
              <button type="button" onClick={redo} disabled={!canRedo} className="rounded-lg border border-line bg-paper px-2.5 py-1.5 text-xs font-semibold text-ink hover:border-copper disabled:opacity-40">Redo</button>
              <button type="button" onClick={duplicateSelected} className="rounded-lg border border-line bg-paper px-2.5 py-1.5 text-xs font-semibold text-ink hover:border-copper">Copy</button>
              <button type="button" onClick={deleteSelection} className="rounded-lg border border-line bg-paper px-2.5 py-1.5 text-xs font-semibold text-ink hover:border-danger hover:text-danger">Delete</button>
              <button type="button" aria-pressed={snap} onClick={() => setSnap((value) => !value)} className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold ${snap ? "border-copper bg-copper text-raised" : "border-line bg-paper text-ink"}`}>Snap</button>
              <button type="button" onClick={() => orderSelected("front")} className="rounded-lg border border-line bg-paper px-2.5 py-1.5 text-xs font-semibold text-ink hover:border-copper">Front</button>
              <button type="button" onClick={() => orderSelected("back")} className="rounded-lg border border-line bg-paper px-2.5 py-1.5 text-xs font-semibold text-ink hover:border-copper">Back</button>
              <label className="sr-only" htmlFor="wire-style">Connector style</label>
              <select id="wire-style" aria-label="Connector style" value={selectedConn ? wireStyleOf(selectedConn.style) : wireStyle} onChange={(e) => chooseWire(e.target.value as WireStyle)} className="rounded-lg border border-line bg-paper px-2 py-1.5 text-xs font-semibold text-ink">
                <option value="curve">Curve</option>
                <option value="elbow">Elbow</option>
                <option value="straight">Straight</option>
              </select>
              <button type="button" onClick={() => zoomBy(1 / 0.9)} className="rounded-lg border border-line bg-paper px-2 py-1.5 text-xs font-semibold text-ink" aria-label="Zoom in">+</button>
              <button type="button" onClick={() => setZoom(1)} className="rounded-lg border border-line bg-paper px-2 py-1.5 text-xs font-semibold text-ink">{Math.round(zoom * 100)}%</button>
              <button type="button" onClick={() => zoomBy(0.9)} className="rounded-lg border border-line bg-paper px-2 py-1.5 text-xs font-semibold text-ink" aria-label="Zoom out">−</button>
              <button type="button" onClick={fitView} className="rounded-lg border border-line bg-paper px-2.5 py-1.5 text-xs font-semibold text-ink hover:border-copper">Fit</button>

              <button
                onClick={() => tidyArchitecture()}
                className="flex items-center gap-1.5 rounded-lg border border-line bg-paper px-3 py-1.5 text-xs font-semibold text-ink hover:border-copper transition-all shadow-xs"
                title="Automatically organize nodes into clean, non-overlapping architectural tiers"
              >
                <IconAutoLayout size={15} />
                <span>Auto-Layout</span>
              </button>
            </div>

            {/* Template Selector Dropdown */}
            <div className="flex flex-wrap items-center gap-2">
              <label htmlFor="add-part" className="sr-only">Add a part</label>
              <select
                id="add-part"
                aria-label="Add a part"
                value=""
                onChange={(e) => {
                  if (!e.target.value) return;
                  addNode(e.target.value as NodeType);
                }}
                className="rounded-lg border border-line bg-paper px-2.5 py-1.5 text-xs font-semibold text-ink shadow-xs"
              >
                <option value="">Add a part</option>
                {SERVICE_TYPES.map((type) => (
                  <option key={type} value={type}>{nodeTypeMeta[type].name.split("/")[0]}</option>
                ))}
              </select>
              <label htmlFor="tpl-select" className="text-xs font-bold text-soft uppercase tracking-wider hidden sm:inline">
                Template:
              </label>
              <select
                id="tpl-select"
                onChange={(e) => { if (e.target.value) loadTemplate(e.target.value); }}
                defaultValue=""
                className="rounded-lg border border-line bg-paper px-2.5 py-1.5 text-xs font-semibold text-ink shadow-xs"
              >
                <option value="" disabled>Load Demo Practice Template...</option>
                {DEMO_TEMPLATES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>

              <button
                onClick={clearCanvas}
                className="flex items-center gap-1 rounded-lg border border-line bg-paper px-2.5 py-1.5 text-xs font-medium text-soft hover:text-danger hover:border-danger transition-colors"
                title="Clear all canvas nodes"
              >
                <IconClear size={14} />
                <span>Clear</span>
              </button>
              <button type="button" onClick={blankCanvas} className="rounded-lg border border-line bg-paper px-2.5 py-1.5 text-xs font-semibold text-ink hover:border-copper">Blank canvas</button>
              <button type="button" onClick={() => fileRef.current?.click()} className="rounded-lg border border-line bg-paper px-2.5 py-1.5 text-xs font-semibold text-ink hover:border-copper">Open</button>
              <input
                ref={fileRef}
                type="file"
                accept="application/json,.json"
                className="sr-only"
                aria-label="Open a Foundry drawing"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  e.target.value = "";
                  if (file) openDrawing(file);
                }}
              />
              {fullPage && (
                <button type="button" onClick={() => setShowRail((value) => !value)} className="rounded-lg border border-line bg-paper px-2.5 py-1.5 text-xs font-semibold text-ink hover:border-copper" aria-pressed={showRail}>Parts</button>
              )}
              <button type="button" onClick={() => { setFullPage((value) => !value); setShowRail(false); }} className="rounded-lg border border-copper bg-paper px-2.5 py-1.5 text-xs font-semibold text-ink hover:bg-copper hover:text-raised">
                {fullPage ? "Exit full page" : "Full page"}
              </button>
            </div>
          </div>

          {/* Mode Banner / Live Drawing Guide */}
          {(connectFromId || toolMode === "connect" || toolMode === "disconnect") && (
            <div className={`flex items-center justify-between rounded-lg border px-4 py-2 text-xs font-semibold shadow-xs ${
              toolMode === "disconnect"
                ? "border-danger/40 bg-danger/10 text-danger"
                : "border-copper/40 bg-copper/10 text-copper"
            }`}>
              <span className="flex items-center gap-2">
                {toolMode === "disconnect" ? (
                  <>
                    <IconCut size={16} />
                    <span>Wire Cutter Active: Click any connection wire (or node) to disconnect it.</span>
                  </>
                ) : connectFromId ? (
                  <>
                    <IconConnect size={16} />
                    <span>Drawing Arrow: Click target node to link from &apos;{connectSourceNode?.label}&apos; with directional arrow.</span>
                  </>
                ) : (
                  <>
                    <IconConnect size={16} />
                    <span>Connect Arrow Active: Click any source node to begin drawing a data link.</span>
                  </>
                )}
              </span>
              <button
                onClick={() => { setToolMode("select"); setConnectFromId(null); }}
                className="underline hover:opacity-80 font-bold"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Interactive canvas. The frame stays on screen. The board inside it scrolls and grows. */}
          <div className={`relative w-full rounded-xl border border-zinc-700 bg-zinc-950 shadow-inner ${fullPage ? "min-h-0 flex-1" : "h-[calc(100dvh-9rem)] min-h-[36rem]"}`}>
            {/* Canvas Header Legend & Speed / Flow Controls */}
            <div className="absolute left-3 top-3 z-30 flex max-w-[calc(100%-1.5rem)] flex-wrap items-center gap-2 rounded-lg border border-white/10 bg-black/75 px-3 py-1.5 backdrop-blur-md">
              <span className={`h-2 w-2 rounded-full ${flowPaused || selectedParticle ? "bg-amber-400" : "bg-emerald-400 animate-pulse"}`} />
              <span className="text-xs font-mono text-zinc-200 font-semibold">
                {flowPaused || selectedParticle ? "Flow Frozen" : "Live Dataflow"}
              </span>

              {/* Play / Freeze Flow Toggle */}
              <button
                onClick={() => {
                  setFlowPaused((prev) => !prev);
                  if (selectedParticle) setSelectedParticle(null);
                }}
                className="flex items-center gap-1 rounded bg-zinc-800 hover:bg-zinc-700 px-2 py-0.5 text-[11px] font-mono font-bold text-zinc-200 transition-colors"
                title={flowPaused ? "Resume flow" : "Pause flow to inspect behavior"}
              >
                {flowPaused ? <IconPlay size={11} className="text-emerald-400" /> : <IconPause size={11} className="text-amber-400" />}
                <span>{flowPaused ? "Resume" : "Freeze"}</span>
              </button>

              {/* Speed Selector */}
              <div className="flex items-center gap-1 rounded bg-zinc-900/90 px-1 py-0.5 border border-zinc-700/60">
                {([0.25, 0.5, 1, 2] as const).map((spd) => (
                  <button
                    key={spd}
                    onClick={() => { setFlowSpeed(spd); setFlowPaused(false); }}
                    className={`px-1.5 py-0.5 text-[10px] font-mono rounded transition-colors ${
                      flowSpeed === spd && !flowPaused
                        ? "bg-copper text-zinc-100 font-bold"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>

              {/* Live Graphs & Analytics Toggle */}
              <button
                onClick={() => setShowAnalyticsDrawer((prev) => !prev)}
                className={`flex items-center gap-1 rounded px-2.5 py-0.5 text-[11px] font-mono font-semibold transition-all ${
                  showAnalyticsDrawer
                    ? "bg-copper text-raised border border-copper"
                    : "bg-zinc-800 text-zinc-300 hover:text-zinc-100 border border-zinc-700"
                }`}
                title="Toggle In-Lab Live Telemetry & Architecture Graphs"
              >
                <IconAnalytics size={12} />
                <span>Live Graphs</span>
              </button>
            </div>

            <div
              ref={viewportRef}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className={`absolute inset-0 z-0 overflow-auto ${toolMode === "pan" ? "cursor-grab" : ""}`}
            >
              <div style={{ width: extent.w * zoom, height: extent.h * zoom }}>
                <div
                  ref={boardRef}
                  className="relative"
                  style={{
                    width: extent.w,
                    height: extent.h,
                    transform: `scale(${zoom})`,
                    transformOrigin: "0 0",
                    backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)",
                    backgroundSize: "28px 28px",
                  }}
                >

            {/* SVG Directional Connections Layer */}
            <svg className="absolute inset-0 h-full w-full pointer-events-auto">
              <rect width="100%" height="100%" fill="transparent" onPointerDown={onBackgroundPointerDown} />
              <defs>
                {/* Directional Arrowheads */}
                <marker
                  id="arrow-active"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#38bdf8" />
                </marker>
                <marker
                  id="arrow-error"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#f43f5e" />
                </marker>
                <marker
                  id="arrow-temp"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#d08968" />
                </marker>

                <linearGradient id="activeWire" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity="0.8" />
                </linearGradient>
                <linearGradient id="errorWire" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#fb7185" stopOpacity="0.9" />
                </linearGradient>
              </defs>

              {/* Render Connections */}
              {connections.map((conn) => {
                const fromNode = nodes.find((n) => n.id === conn.from);
                const toNode = nodes.find((n) => n.id === conn.to);
                if (!fromNode || !toNode) return null;

                const fromPort = anchors(fromNode).out;
                const toPort = anchors(toNode).inn;
                const x1 = fromPort.x;
                const y1 = fromPort.y;
                const x2 = toPort.x;
                const y2 = toPort.y;
                const isError = conn.status === "error" || fromNode.health === "down" || toNode.health === "down";
                const isSelected = selectedConnId === conn.id;
                const pathD = wirePath(x1, y1, x2, y2, wireStyleOf(conn.style));

                return (
                  <g
                    key={conn.id}
                    className="cursor-pointer group"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (toolMode === "disconnect") {
                        remember();
                        const next = connectionsRef.current.filter((c) => c.id !== conn.id);
                        connectionsRef.current = next;
                        setConnections(next);
                        setToast({ message: "Connection severed", type: "info" });
                      } else {
                        setSelectedConnId(conn.id);
                        setSelectedNodeId(null);
                      }
                    }}
                  >
                    <path
                      d={pathD}
                      fill="none"
                      stroke="transparent"
                      strokeWidth="16"
                    />
                    <path
                      d={pathD}
                      fill="none"
                      stroke={isError ? "url(#errorWire)" : isSelected ? "#d08968" : "url(#activeWire)"}
                      strokeWidth={isSelected ? "3.5" : isError ? "2.5" : "2"}
                      strokeDasharray={isError ? "4 4" : undefined}
                      opacity={isSelected ? 1 : isError ? 0.9 : 0.65}
                      markerEnd={isError ? "url(#arrow-error)" : "url(#arrow-active)"}
                      className="group-hover:stroke-copper transition-colors"
                    />
                  </g>
                );
              })}

              {/* Temporary live wire following mouse when drawing connection */}
              {connectFromId && connectSourceNode && (
                <path
                  d={wirePath(anchors(connectSourceNode).out.x, anchors(connectSourceNode).out.y, mousePos.x, mousePos.y, wireStyle)}
                  fill="none"
                  stroke="#d08968"
                  strokeWidth="2.5"
                  strokeDasharray="4 4"
                  markerEnd="url(#arrow-temp)"
                  className="pointer-events-none"
                />
              )}

              {/* Animated Data Particles with Interactive Inspection */}
              {particles.map((p) => {
                const conn = connections.find((c) => c.id === p.connId);
                if (!conn) return null;
                const fromNode = nodes.find((n) => n.id === conn.from);
                const toNode = nodes.find((n) => n.id === conn.to);
                if (!fromNode || !toNode) return null;

                const fromPort = anchors(fromNode).out;
                const toPort = anchors(toNode).inn;
                const spot = pointOnWire(fromPort.x, fromPort.y, toPort.x, toPort.y, p.progress, wireStyleOf(conn.style));
                const cx = spot.x;
                const cy = spot.y;

                const color =
                  p.type === "cache_hit"
                    ? "#34d399"
                    : p.type === "blocked"
                      ? "#f43f5e"
                      : p.type === "db_write"
                        ? "#fbbf24"
                        : p.type === "ci_test"
                          ? "#38bdf8"
                          : "#818cf8";

                const isHovered = hoveredParticle?.id === p.id;
                const isSelected = selectedParticle?.id === p.id;

                return (
                  <g
                    key={p.id}
                    className="cursor-pointer"
                    onPointerEnter={() => setHoveredParticle(p)}
                    onPointerLeave={() => setHoveredParticle((curr) => (curr?.id === p.id ? null : curr))}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (selectedParticle?.id === p.id) {
                        setSelectedParticle(null);
                        setFlowPaused(false);
                      } else {
                        setSelectedParticle(p);
                        setFlowPaused(true);
                      }
                    }}
                  >
                    {/* Invisible large hit-box for easy click/hover */}
                    <circle cx={cx} cy={cy} r={18} fill="transparent" />

                    {/* Outer glowing pulse ring */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isSelected ? 10 : isHovered ? 8 : 6}
                      fill={color}
                      opacity={isSelected ? 0.45 : isHovered ? 0.35 : 0.2}
                      className={isSelected ? "animate-ping" : undefined}
                    />

                    {/* Inner high-contrast solid packet core */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isSelected ? 6 : isHovered ? 5 : 4}
                      fill={color}
                      stroke="var(--raised)"
                      strokeWidth={isSelected ? 2 : 1}
                      filter="drop-shadow(0 0 6px currentColor)"
                    />

                    {/* Floating Label HUD Tooltip right above packet when hovered or selected */}
                    {(isHovered || isSelected) && (
                      <foreignObject
                        x={Math.max(10, Math.min(1000, cx - 110))}
                        y={Math.max(10, cy - 75)}
                        width="220"
                        height="65"
                        className="overflow-visible pointer-events-auto"
                      >
                        <div
                          className="rounded-lg border border-line bg-raised p-2 text-ink shadow-xl text-[11px] backdrop-blur-md"
                          style={{ borderLeft: `3px solid ${color}` }}
                        >
                          <div className="flex items-center justify-between gap-1 font-bold">
                            <span className="truncate">{p.label}</span>
                            <span className="text-[9px] font-mono text-soft uppercase tracking-wider px-1 rounded bg-paper">
                              {p.latencyMs}ms
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-soft mt-0.5">
                            <span>{p.sourceLabel} → {p.targetLabel}</span>
                            <span className="font-mono text-good">{p.status}</span>
                          </div>
                          <div className="text-[9px] text-copper font-mono mt-1 text-center font-semibold">
                            {isSelected ? "Flow Stopped • Click to Resume" : "Click to Freeze & Inspect"}
                          </div>
                        </div>
                      </foreignObject>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Interactive Drag & Drop Nodes with Vector Icons */}
            {[...nodes].sort((a, b) => (a.z ?? 0) - (b.z ?? 0)).map((node) => {
              const meta = nodeTypeMeta[node.type];
              const NodeIcon = meta.Icon;
              const isSelected = selectedNodeId === node.id;
              const isDown = node.health === "down";
              const isDegraded = node.health === "degraded";
              const isConnectSource = connectFromId === node.id;
              const drawing = isShape(node.type);
              const size = nodeSize(node);
              const shapeClass = node.type === "ellipse" || node.type === "cylinder"
                ? "rounded-full"
                : node.type === "cloud"
                  ? "rounded-[2rem]"
                  : node.type === "note"
                    ? "rounded-sm bg-amber-100 text-zinc-900"
                    : node.type === "text" || node.type === "diamond"
                      ? "border-transparent bg-transparent shadow-none"
                      : "rounded-xl";

              return (
                <div
                  key={node.id}
                  onPointerDown={(e) => handlePointerDown(node.id, e)}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    setEditingId(node.id);
                  }}
                  style={{
                    transform: `translate3d(${node.x}px, ${node.y}px, 0)`,
                    width: size.w,
                    height: node.h || drawing ? size.h : undefined,
                    zIndex: 10 + (node.z ?? 0),
                  }}
                  className={`absolute flex cursor-grab flex-col border p-2.5 active:cursor-grabbing ${
                    node.type === "text" || node.type === "diamond"
                      ? shapeClass
                      : `${shapeClass} shadow-xl ${
                        node.type === "note"
                          ? ""
                          : isConnectSource
                            ? "border-amber-400 ring-2 ring-amber-400/60 bg-zinc-900 text-zinc-100"
                            : isSelected
                              ? "border-copper ring-2 ring-copper/60 bg-zinc-900 text-zinc-100"
                              : isDown
                                ? "border-rose-600 bg-rose-950/90 text-rose-100"
                                : isDegraded
                                  ? "border-amber-500 bg-amber-950/90 text-amber-100"
                                  : drawing
                                    ? "border-zinc-600 bg-zinc-900/90 text-zinc-100"
                                    : "border-zinc-700/80 bg-zinc-900/95 text-zinc-100 hover:border-zinc-500"
                      }`
                  }`}
                >
                  {node.type === "diamond" && (
                    <div
                      className={`pointer-events-none absolute inset-0 ${isSelected ? "bg-zinc-800" : "bg-zinc-900"}`}
                      style={{ clipPath: "polygon(50% 0, 100% 50%, 50% 100%, 0 50%)" }}
                    />
                  )}
                  <div
                    onClick={(e) => endPortConnect(node.id, e)}
                    title="Input"
                    className="absolute -left-2 top-1/2 z-20 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-zinc-900 bg-zinc-400 hover:bg-emerald-400 hover:scale-125 transition-transform cursor-pointer"
                  />
                  <div
                    onClick={(e) => startPortConnect(node.id, e)}
                    title="Output"
                    className="absolute -right-2 top-1/2 z-20 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-zinc-900 bg-zinc-400 hover:bg-copper hover:scale-125 transition-transform cursor-pointer"
                  />

                  {node.type !== "text" && (
                    <div className="relative z-10 flex items-center justify-between">
                      <span className={node.type === "note" ? "text-zinc-800" : "text-zinc-300"}>
                        <NodeIcon size={18} />
                      </span>
                      {!drawing || node.health !== "healthy" ? (
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${
                            isDown ? "bg-rose-500 animate-ping" : isDegraded ? "bg-amber-400" : "bg-emerald-400"
                          }`}
                        />
                      ) : <span />}
                    </div>
                  )}

                  {editingId === node.id ? (
                    <input
                      autoFocus
                      aria-label="Name"
                      value={node.label}
                      onFocus={rememberOnce}
                      onBlur={() => {
                        editRemembered.current = false;
                        setEditingId(null);
                      }}
                      onChange={(e) => updateSelectedNode("label", e.target.value)}
                      onPointerDown={(e) => e.stopPropagation()}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === "Escape") setEditingId(null);
                      }}
                      className="relative z-10 mt-1 w-full bg-transparent text-xs font-bold text-inherit outline-none"
                    />
                  ) : (
                    <div className={`relative z-10 ${node.type === "note" ? "[&_p]:text-zinc-900" : ""}`}>
                      <NodeWords label={node.label} role={node.role} tool={drawing ? "" : node.industryTool} type={node.type} />
                    </div>
                  )}

                  {!drawing && (
                    <div className="relative z-10 mt-2 flex items-center justify-between gap-2 border-t border-zinc-700/60 pt-1.5 text-[9px] text-zinc-300">
                      <span className="truncate font-mono">{node.latency} ms</span>
                      <span className="truncate font-mono">{node.rps} rps</span>
                    </div>
                  )}

                  {showTooltips && !drawing && node.industryTool && (
                    <div className="relative z-10 mt-1 truncate rounded bg-black/60 px-1 py-0.5 text-center font-mono text-[8px] text-zinc-400">
                      {node.industryTool.split("/")[0]}
                    </div>
                  )}

                  {isSelected && toolMode === "select" && (
                    <button
                      type="button"
                      aria-label="Resize"
                      className="absolute -bottom-1.5 -right-1.5 z-20 h-3.5 w-3.5 cursor-nwse-resize rounded-sm border border-zinc-900 bg-copper"
                      onPointerDown={(e) => startResize(node.id, e)}
                    />
                  )}
                </div>
              );
            })}
                </div>
              </div>
            </div>

            {/* Deep Packet Inspector HUD Card (Active when particle is clicked / frozen) */}
            {selectedParticle && (
              <div className="absolute top-14 left-4 right-4 z-30 mx-auto max-w-xl rounded-xl border border-copper bg-raised p-4 text-xs shadow-2xl backdrop-blur-lg">
                <div className="flex items-center justify-between border-b border-line pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-copper/15 text-copper">
                      <IconTelemetry size={14} />
                    </span>
                    <div>
                      <h4 className="font-bold text-ink">
                        Deep Packet Inspection #{selectedParticle.id}: {selectedParticle.label}
                      </h4>
                      <p className="text-[10px] text-soft">Dataflow stopped for behavioral analysis</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded-full border border-danger/30 bg-danger/10 px-2.5 py-0.5 text-[10px] font-mono font-bold text-danger">
                      ❚❚ FLOW STOPPED
                    </span>
                    <button
                      onClick={() => {
                        setSelectedParticle(null);
                        setFlowPaused(false);
                      }}
                      className="flex items-center gap-1.5 rounded-lg border border-copper bg-copper px-3 py-1 font-bold text-raised shadow-xs hover:opacity-90 transition-opacity"
                    >
                      <IconPlay size={12} />
                      <span>Resume Flow</span>
                    </button>
                  </div>
                </div>

                {/* Packet Specs Grid */}
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 font-mono text-[11px]">
                  <div className="rounded border border-line bg-paper p-2">
                    <span className="text-[9px] text-soft uppercase block">Route</span>
                    <span className="font-bold text-ink truncate block">
                      {selectedParticle.sourceLabel} → {selectedParticle.targetLabel}
                    </span>
                  </div>
                  <div className="rounded border border-line bg-paper p-2">
                    <span className="text-[9px] text-soft uppercase block">Protocol</span>
                    <span className="font-bold text-copper truncate block">{selectedParticle.protocol}</span>
                  </div>
                  <div className="rounded border border-line bg-paper p-2">
                    <span className="text-[9px] text-soft uppercase block">Latency</span>
                    <span className="font-bold text-good block">{selectedParticle.latencyMs} ms</span>
                  </div>
                  <div className="rounded border border-line bg-paper p-2">
                    <span className="text-[9px] text-soft uppercase block">Wire Status</span>
                    <span className="font-bold text-ink block">{selectedParticle.status}</span>
                  </div>
                </div>

                <p className="mt-2.5 rounded bg-paper/60 p-2 text-xs text-soft leading-relaxed border border-line/50">
                  <strong className="text-ink">Architectural Mechanism: </strong>
                  {selectedParticle.description}
                </p>
              </div>
            )}
          </div>

          {/* Live In-Lab Architecture Telemetry & Graph Drawer */}
          {showAnalyticsDrawer && (
            <div className="rounded-xl border border-line bg-raised p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-copper">
                    <IconAnalytics size={18} />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-ink">In-Lab Real-Time Telemetry & Architecture Graphs</h3>
                    <p className="text-[11px] text-soft">Live flight metrics, latency waterfalls, and throughput telemetry.</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAnalyticsDrawer(false)}
                  className="rounded-md border border-line bg-paper px-2.5 py-1 text-xs font-semibold text-soft hover:text-ink"
                >
                  <IconClose size={12} className="inline mr-1" />
                  Close Graphs
                </button>
              </div>

              {/* 3-Column Analytics Grid */}
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {/* 1. Live RPS Waveform (Area Graph) */}
                <div className="rounded-lg border border-line bg-paper p-3 text-xs flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-ink flex items-center gap-1.5">
                        <IconSurge size={14} className="text-copper" />
                        Live Throughput
                      </span>
                      <span className="font-mono text-copper font-bold">{Math.round(nodes.reduce((acc, n) => acc + (n.health === 'down' ? 0 : n.rps), 0) * trafficMultiplier * (flowPaused ? 0 : 1))} RPS</span>
                    </div>
                    <p className="text-[10px] text-soft">Aggregated request rate across active cluster nodes</p>

                    {/* SVG Mini Waveform */}
                    <div className="mt-3">
                      <svg viewBox="0 0 200 60" className="w-full h-16 overflow-visible" aria-label="Live throughput mini graph">
                        <defs>
                          <linearGradient id="miniAreaGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#d08968" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#d08968" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M 0 45 Q 25 30, 50 38 T 100 20 T 150 28 T 200 15 L 200 60 L 0 60 Z"
                          fill="url(#miniAreaGrad)"
                        />
                        <path
                          d="M 0 45 Q 25 30, 50 38 T 100 20 T 150 28 T 200 15"
                          fill="none"
                          stroke="#d08968"
                          strokeWidth="2"
                        />
                        <line x1="0" y1="12" x2="200" y2="12" stroke="#ef4444" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                      </svg>
                      <div className="flex justify-between font-mono text-[9px] text-soft mt-1">
                        <span>-30s</span>
                        <span className="text-danger font-semibold">Ceiling: 1,000 RPS</span>
                        <span>Now</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Latency Breakdown */}
                <div className="rounded-lg border border-line bg-paper p-3 text-xs flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-ink flex items-center gap-1.5">
                        <IconTelemetry size={14} className="text-copper" />
                        Latency Percentiles
                      </span>
                      <span className="font-mono text-good font-bold">{Math.round(nodes.reduce((acc, n) => acc + (n.health === 'down' ? 0 : n.latency), 0) / Math.max(1, nodes.length))} ms avg</span>
                    </div>
                    <p className="text-[10px] text-soft">End-to-end roundtrip delay by percentile</p>

                    <div className="mt-3 space-y-2 font-mono text-[10px]">
                      <div>
                        <div className="flex justify-between text-soft mb-0.5">
                          <span>p50 (Median)</span>
                          <span className="text-ink font-bold">12 ms</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-line overflow-hidden">
                          <div className="h-full rounded-full bg-good w-[20%]" />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-soft mb-0.5">
                          <span>p90 (Standard)</span>
                          <span className="text-ink font-bold">34 ms</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-line overflow-hidden">
                          <div className="h-full rounded-full bg-copper w-[45%]" />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-soft mb-0.5">
                          <span>p99 (Tail Peak)</span>
                          <span className="text-danger font-bold">68 ms</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-line overflow-hidden">
                          <div className="h-full rounded-full bg-danger w-[75%]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Traffic Composition */}
                <div className="rounded-lg border border-line bg-paper p-3 text-xs flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-ink flex items-center gap-1.5">
                        <IconCache size={14} className="text-copper" />
                        Traffic Breakdown
                      </span>
                      <span className="font-mono text-ink font-bold">{particles.length} in flight</span>
                    </div>
                    <p className="text-[10px] text-soft">Real-time classification of flowing packets</p>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] font-mono">
                      <div className="rounded bg-raised p-1.5 border border-line/60">
                        <span className="text-soft block text-[9px]">Cache Hits</span>
                        <span className="font-bold text-good">
                          {particles.filter((p) => p.type === 'cache_hit').length} pkts
                        </span>
                      </div>
                      <div className="rounded bg-raised p-1.5 border border-line/60">
                        <span className="text-soft block text-[9px]">DB Writes</span>
                        <span className="font-bold text-amber-500">
                          {particles.filter((p) => p.type === 'db_write').length} pkts
                        </span>
                      </div>
                      <div className="rounded bg-raised p-1.5 border border-line/60">
                        <span className="text-soft block text-[9px]">Blocked / 401</span>
                        <span className="font-bold text-danger">
                          {particles.filter((p) => p.type === 'blocked').length} pkts
                        </span>
                      </div>
                      <div className="rounded bg-raised p-1.5 border border-line/60">
                        <span className="text-soft block text-[9px]">HTTP Ingress</span>
                        <span className="font-bold text-sky-400">
                          {particles.filter((p) => p.type === 'request').length} pkts
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Flight Packet Audit Stream */}
              <div className="rounded-lg border border-line bg-paper p-3 text-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-ink">Live Flight Packet Audit Ledger</span>
                  <span className="text-[10px] font-mono text-soft">Showing recent wire transits • Click to inspect</span>
                </div>

                <div className="max-h-36 overflow-y-auto font-mono text-[11px] divide-y divide-line/40">
                  {recentPacketLedger.length === 0 ? (
                    <p className="py-2 text-center text-soft text-[11px]">Awaiting wire traffic...</p>
                  ) : (
                    recentPacketLedger.slice(0, 8).map((pkt) => (
                      <div
                        key={pkt.id}
                        onClick={() => {
                          setSelectedParticle(pkt);
                          setFlowPaused(true);
                        }}
                        className="py-1.5 flex items-center justify-between hover:bg-raised px-2 rounded cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-copper font-bold">#{pkt.id}</span>
                          <span className="truncate">{pkt.label}</span>
                          <span className="text-[9px] text-soft">({pkt.sourceLabel} → {pkt.targetLabel})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-good">{pkt.latencyMs}ms</span>
                          <span className="rounded bg-raised px-1 py-0.5 text-[9px] text-ink font-semibold">
                            {pkt.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Connection Inspector Drawer */}
          {selectedConn && (
            <div className="flex items-center justify-between rounded-xl border border-line bg-paper p-4 shadow-xs">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-raised text-ink">
                  <IconConnect size={18} />
                </span>
                <div>
                  <h4 className="flex items-center gap-2 font-mono text-xs font-bold text-ink">
                    <span>Connection: {nodes.find((n) => n.id === selectedConn.from)?.label}</span>
                    <IconArrowRight size={13} className="text-copper" />
                    <span>{nodes.find((n) => n.id === selectedConn.to)?.label}</span>
                  </h4>
                  <label htmlFor="conn-protocol" className="mt-1 block font-mono text-[10px] font-bold uppercase tracking-wider text-soft">Protocol</label>
                  <input
                    id="conn-protocol"
                    value={selectedConn.protocol || ""}
                    onFocus={rememberOnce}
                    onBlur={() => { editRemembered.current = false; }}
                    onChange={(e) => {
                      const next = connectionsRef.current.map((conn) => conn.id === selectedConn.id ? { ...conn, protocol: e.target.value } : conn);
                      connectionsRef.current = next;
                      setConnections(next);
                    }}
                    className="mt-1 w-full rounded-lg border border-line bg-paper px-2 py-1 font-mono text-[11px] text-ink"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    remember();
                    const next = connectionsRef.current.filter((c) => c.id !== selectedConn.id);
                    connectionsRef.current = next;
                    setConnections(next);
                    setSelectedConnId(null);
                    setToast({ message: "Connection removed", type: "info" });
                  }}
                  className="flex items-center gap-1.5 rounded-lg border border-red-300 dark:border-red-900/60 bg-red-50/60 dark:bg-red-950/20 px-3.5 py-1.5 font-mono text-xs font-bold text-red-700 dark:text-red-400 hover:bg-red-100/60 transition-colors shadow-xs"
                >
                  <IconCut size={14} />
                  <span>Disconnect Wire</span>
                </button>
              </div>
            </div>
          )}

          {/* Selected Node Inspector Drawer (Full CRUD) */}
          {selectedNode && (
            <div className={`rounded-xl border border-line bg-paper p-5 shadow-xs ${fullPage ? "max-h-48 shrink-0 overflow-auto" : ""}`}>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3.5">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-raised shadow-2xs"
                    style={{ color: nodeTypeMeta[selectedNode.type].color }}
                  >
                    {(() => {
                      const SelectedIcon = nodeTypeMeta[selectedNode.type].Icon;
                      return <SelectedIcon size={20} />;
                    })()}
                  </div>
                  <div>
                    <h3 className="font-mono text-sm font-bold text-ink tracking-tight">{selectedNode.label}</h3>
                    <p className="font-mono text-xs text-soft">{nodeTypeMeta[selectedNode.type].name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setConnectFromId(selectedNode.id);
                      setToast({ message: "Click destination node to link arrow", type: "info" });
                    }}
                    className={`flex items-center gap-1.5 rounded-lg border px-3.5 py-1.5 font-mono text-xs font-bold transition-all shadow-xs ${
                      connectFromId === selectedNode.id
                        ? "border-ink bg-ink text-paper"
                        : "border-line bg-paper text-ink hover:border-ink hover:bg-raised"
                    }`}
                  >
                    <IconConnect size={14} />
                    <span>{connectFromId === selectedNode.id ? "Connecting..." : "Connect Wire"}</span>
                  </button>
                  <button
                    onClick={deleteSelectedNode}
                    className="flex items-center gap-1.5 rounded-lg border border-red-300 dark:border-red-900/60 bg-red-50/60 dark:bg-red-950/20 px-3.5 py-1.5 font-mono text-xs font-bold text-red-700 dark:text-red-400 hover:bg-red-100/60 transition-colors shadow-xs"
                  >
                    <IconClear size={14} />
                    <span>Delete Node</span>
                  </button>
                </div>
              </div>

              {/* Node Customization Controls (CRUD Update) */}
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-4">
                <div>
                  <label htmlFor="node-label" className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink">
                    Node Label
                  </label>
                  <input
                    id="node-label"
                    type="text"
                    value={selectedNode.label}
                    onFocus={rememberOnce}
                    onBlur={() => { editRemembered.current = false; }}
                    onChange={(e) => updateSelectedNode("label", e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-line bg-paper px-3 py-1.5 font-mono text-xs font-semibold text-ink focus:border-ink focus:outline-hidden"
                  />
                </div>

                <div>
                  <label htmlFor="node-health" className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink">
                    Health Status
                  </label>
                  <select
                    id="node-health"
                    value={selectedNode.health}
                    onChange={(e) => updateSelectedNode("health", e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-line bg-paper px-3 py-1.5 font-mono text-xs font-semibold text-ink focus:border-ink focus:outline-hidden"
                  >
                    <option value="healthy">Healthy (Operational)</option>
                    <option value="degraded">Degraded (High Latency)</option>
                    <option value="down">Down (Outage / Crash)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="node-latency" className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink">
                    Latency (ms)
                  </label>
                  <input
                    id="node-latency"
                    type="number"
                    value={selectedNode.latency}
                    onFocus={rememberOnce}
                    onBlur={() => { editRemembered.current = false; }}
                    onChange={(e) => updateSelectedNode("latency", Number(e.target.value))}
                    className="mt-1.5 w-full rounded-lg border border-line bg-paper px-3 py-1.5 font-mono text-xs font-semibold text-ink focus:border-ink focus:outline-hidden"
                  />
                </div>

                <div>
                  <label htmlFor="node-rps" className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink">
                    RPS Capacity
                  </label>
                  <input
                    id="node-rps"
                    type="number"
                    value={selectedNode.capacity}
                    onFocus={rememberOnce}
                    onBlur={() => { editRemembered.current = false; }}
                    onChange={(e) => updateSelectedNode("capacity", Number(e.target.value))}
                    className="mt-1.5 w-full rounded-lg border border-line bg-paper px-3 py-1.5 font-mono text-xs font-semibold text-ink focus:border-ink focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Enterprise Architecture Metadata Footer */}
              <div className="mt-4 grid grid-cols-1 gap-4 border-t border-line/60 pt-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="node-role" className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink">Role</label>
                  <input
                    id="node-role"
                    type="text"
                    value={selectedNode.role}
                    onFocus={rememberOnce}
                    onBlur={() => { editRemembered.current = false; }}
                    onChange={(e) => updateSelectedNode("role", e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-line bg-paper px-3 py-1.5 font-mono text-xs font-semibold text-ink focus:border-ink focus:outline-hidden"
                  />
                </div>
                <div>
                  <label htmlFor="node-tool" className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink">Field name</label>
                  <input
                    id="node-tool"
                    type="text"
                    value={selectedNode.industryTool}
                    onFocus={rememberOnce}
                    onBlur={() => { editRemembered.current = false; }}
                    onChange={(e) => updateSelectedNode("industryTool", e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-line bg-paper px-3 py-1.5 font-mono text-xs font-semibold text-ink focus:border-ink focus:outline-hidden"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Integrated AI Architecture Tutor & Step-by-Step Guide Panel */}
          {!fullPage && showAiGuide && (
            <div className="rounded-xl border border-line bg-raised p-5 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-copper">
                    <IconArchitect size={22} />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-ink">Review</h3>
                    <p className="text-xs text-soft">What this drawing is doing, and what to change.</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {aiReport && (
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                      aiReport.status === "verified"
                        ? "bg-good/10 text-good border border-good/30"
                        : aiReport.status === "flawed"
                          ? "bg-danger/10 text-danger border border-danger/30"
                          : "bg-warn/10 text-warn border border-warn/30"
                    }`}>
                      {aiReport.status === "verified" ? (
                        <>
                          <IconCheck size={13} />
                          <span>Verified</span>
                        </>
                      ) : (
                        <>
                          <IconChaos size={13} />
                          <span>Flaw Detected</span>
                        </>
                      )}
                    </span>
                  )}
                  <button
                    onClick={() => void runAiDiagnostic()}
                    disabled={aiAnalyzing}
                    className="flex items-center gap-1.5 rounded-lg border border-line bg-paper px-3 py-1 text-xs font-semibold text-ink hover:border-copper transition-colors shadow-xs"
                  >
                    <IconRefresh size={13} className={aiAnalyzing ? "animate-spin" : ""} />
                    <span>{aiAnalyzing ? "Checking…" : "Check again"}</span>
                  </button>
                </div>
              </div>

              {/* 4-Section Educational Guidance */}
              {aiReport && (
                <div className="mt-4 space-y-3">
                  <div className="rounded-lg border border-line bg-paper p-3 shadow-xs">
                    <p className="kicker text-[10px] text-soft">Now</p>
                    <p className="mt-0.5 text-xs font-bold text-ink">{aiReport.statusText}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="rounded-lg border border-line bg-paper p-3 shadow-xs">
                      <p className="kicker text-[10px] text-danger">The risk</p>
                      <p className="mt-1 text-xs leading-relaxed text-ink">{aiReport.whatIsWrong}</p>
                    </div>

                    <div className="rounded-lg border border-line bg-paper p-3 shadow-xs">
                      <p className="kicker text-[10px] text-copper">Why it matters</p>
                      <p className="mt-1 text-xs leading-relaxed text-ink">{aiReport.whyItMatters}</p>
                    </div>
                  </div>

                  {aiReport.stepByStep.length > 0 ? <div className="rounded-lg border border-line bg-paper p-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <p className="kicker text-[10px] text-good">What to change</p>
                      {aiReport.canAutoFix && (
                        <button
                          onClick={applyRecommendedFix}
                          className="flex items-center gap-1.5 rounded border border-good/40 bg-good/10 px-2.5 py-1 text-xs font-bold text-good hover:bg-good/20 transition-all shadow-xs"
                        >
                          <IconArchitect size={13} />
                          <span>Apply this change</span>
                        </button>
                      )}
                    </div>
                    <ol className="mt-2 space-y-1 text-xs text-ink list-decimal list-inside">
                      {aiReport.stepByStep.map((step, idx) => (
                        <li key={idx} className="leading-relaxed">
                          <span className="font-medium">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div> : null}

                  {/* Ask AI Architecture Question Form */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (aiQuestion.trim()) {
                        void runAiDiagnostic(aiQuestion);
                        setAiQuestion("");
                      }
                    }}
                    className="mt-3 flex items-center gap-2"
                  >
                    <input
                      type="text"
                      value={aiQuestion}
                      onChange={(e) => setAiQuestion(e.target.value)}
                      placeholder="Ask about this drawing"
                      className="min-w-0 flex-1 rounded-lg border border-line bg-paper px-3 py-2 text-xs font-medium text-ink shadow-xs"
                    />
                    <button
                      type="submit"
                      disabled={aiAnalyzing || !aiQuestion.trim()}
                      className="flex items-center gap-1.5 rounded-lg border border-copper bg-copper px-4 py-2 text-xs font-bold text-raised shadow-xs hover:opacity-90 disabled:opacity-50"
                    >
                      <IconArchitect size={14} />
                      <span>Ask Tutor</span>
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {!fullPage && <div className="rounded-xl border border-line bg-raised p-4 text-xs text-soft shadow-xs">
            <h4 className="flex items-center gap-2 font-bold text-ink">
              <IconPrinciple size={16} className="text-copper" />
              <span>One job each</span>
            </h4>
            <p className="mt-1 leading-relaxed">
              Each part of the drawing has one job. The person does not talk to the record directly.
            </p>
          </div>}
        </div>
      </div>
    </div>
  );

  if (fullPage && portalReady) return createPortal(lab, document.body);
  return lab;
}
