"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { Messages } from "@/lib/i18n/en";
import { useKeel } from "./keel-context";
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
} from "./icons";

export type NodeType =
  | "client"
  | "gateway"
  | "auth"
  | "compute"
  | "cache"
  | "database"
  | "queue"
  | "ci"
  | "telemetry";

export interface SystemNode {
  id: string;
  type: NodeType;
  label: string;
  x: number;
  y: number;
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
}

interface Particle {
  id: number;
  connId: string;
  progress: number;
  speed: number;
  type: "request" | "response" | "cache_hit" | "db_write" | "blocked" | "ci_test";
}

type ChallengeId = "freeform" | "c1_security" | "c2_design" | "c3_cicd" | "c4_scale" | "c5_observability";

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
  client: { name: "Client / Browser", color: "#38bdf8", Icon: IconClient, tool: "Web / Mobile / React", desc: "User touchpoint that requests data and presents views." },
  gateway: { name: "API Gateway / WAF", color: "#818cf8", Icon: IconGateway, tool: "Nginx / Envoy / Cloudflare", desc: "Routes traffic, terminates SSL, rate-limits, and shields backends." },
  auth: { name: "Auth & Security Guard", color: "#ec4899", Icon: IconAuth, tool: "Better Auth / JWT / OAuth", desc: "Verifies session identity, issues tokens, checks permissions." },
  compute: { name: "App Logic Tier", color: "#a855f7", Icon: IconCompute, tool: "Node.js / Go / Kubernetes Pod", desc: "Runs business rules, processes calculations, handles mutations." },
  cache: { name: "Distributed Cache", color: "#10b981", Icon: IconCache, tool: "Redis / Memcached", desc: "Delivers sub-millisecond responses for repeatable read data." },
  database: { name: "Authoritative Database", color: "#f59e0b", Icon: IconDatabase, tool: "PostgreSQL / SQLite", desc: "Durable persistent storage that records ground truth." },
  queue: { name: "Message Broker / Queue", color: "#f97316", Icon: IconQueue, tool: "Kafka / RabbitMQ / SQS", desc: "Decouples spikes by buffering async jobs and payments." },
  ci: { name: "CI/CD Pipeline Runner", color: "#06b6d4", Icon: IconCI, tool: "GitHub Actions / GitLab CI", desc: "Runs automated linting, unit tests, secret scanning before deploy." },
  telemetry: { name: "Telemetry & SRE Agent", color: "#14b8a6", Icon: IconTelemetry, tool: "Prometheus / Grafana / OTel", desc: "Gathers logs, metrics, traces, and triggers actionable alerts." },
};

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
    initialNodes: DEMO_TEMPLATES[0].nodes,
    initialConnections: DEMO_TEMPLATES[0].connections,
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
];

type CanvasToolMode = "select" | "connect" | "disconnect";

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
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Simulation State
  const [particles, setParticles] = useState<Particle[]>([]);
  const [trafficMultiplier, setTrafficMultiplier] = useState(1);
  const [chaosActive, setChaosActive] = useState(false);
  const [ciStatus, setCiStatus] = useState<"idle" | "running" | "passed" | "failed">("idle");
  const [xp, setXp] = useState(me?.xp ?? 120);
  const [solvedChallenges, setSolvedChallenges] = useState<string[]>([]);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [showTooltips, setShowTooltips] = useState(true);

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

  const canvasRef = useRef<HTMLDivElement>(null);
  const particleIdRef = useRef(1);

  // Switch challenge
  const selectChallenge = (id: ChallengeId) => {
    const ch = CHALLENGES.find((c) => c.id === id);
    if (!ch) return;
    setActiveChallenge(id);
    setNodes(JSON.parse(JSON.stringify(ch.initialNodes)));
    setConnections(JSON.parse(JSON.stringify(ch.initialConnections)));
    setSelectedNodeId(null);
    setSelectedConnId(null);
    setConnectFromId(null);
    setToast({ message: `Loaded Mission: ${ch.title}`, type: "info" });
  };

  // Load a Prebuilt Demo Template
  const loadTemplate = (templateId: string) => {
    const t = DEMO_TEMPLATES.find((tpl) => tpl.id === templateId);
    if (!t) return;
    setActiveChallenge("freeform");
    setNodes(JSON.parse(JSON.stringify(t.nodes)));
    setConnections(JSON.parse(JSON.stringify(t.connections)));
    setSelectedNodeId(null);
    setSelectedConnId(null);
    setConnectFromId(null);
    setToast({ message: `Loaded Enterprise Template: ${t.name}`, type: "success" });
  };

  // Tidy / Auto-Layout Architecture Tool (Places nodes into neat, non-overlapping enterprise tiers)
  const tidyArchitecture = () => {
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
    };

    const tiers: Record<number, SystemNode[]> = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [] };
    for (const node of nodes) {
      const tier = tierMap[node.type] ?? 2;
      tiers[tier].push(node);
    }

    const updated = nodes.map((node) => {
      const tier = tierMap[node.type] ?? 2;
      const list = tiers[tier];
      const indexInTier = list.findIndex((n) => n.id === node.id);

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

    setNodes(updated);
    setToast({ message: "Auto-Layout complete: Aligned into clean enterprise architectural tiers.", type: "success" });
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
    let statusText = "Enterprise Architecture Verified: Production Ready";
    let whatIsWrong = "No critical design flaws detected. Your dataflow adheres to enterprise separation of concerns.";
    let whyItMatters = "Strict tiering shields private data, protects against single-node crashes, and scales under heavy concurrency.";
    let stepByStep: string[] = [
      "Simulate high traffic with the 'Traffic Surge' button to test latency.",
      "Trigger 'Chaos Monkey' to evaluate failover resiliency.",
      "Add a Telemetry & SRE Agent to monitor real-time MTTR and latency.",
    ];
    let canAutoFix = false;

    if (hasDirectDb) {
      status = "flawed";
      statusText = "Critical Security Flaw: Direct Database Exposure";
      whatIsWrong = "The Client browser is directly wired to the Authoritative Database without passing through an API or security boundary.";
      whyItMatters = "Any individual with a web browser can open Developer Tools, view database credentials, and steal or corrupt customer records. The database can also be knocked offline instantly with simple SQL queries.";
      stepByStep = [
        "Select the red wire connecting Client to Database and cut it.",
        "Add an 'Auth & Security Guard' (or API Gateway) and an 'App Logic Tier' from the Toolbox.",
        "Wire Client -> Auth Guard -> App Logic Tier -> Database.",
      ];
      canAutoFix = true;
    } else if (!hasCompute && nodes.length >= 2) {
      status = "flawed";
      statusText = "Architectural Violation: Missing Application Logic Tier";
      whatIsWrong = "You have storage and user touchpoints, but nowhere for business calculations, access validation, or data sanitization to execute.";
      whyItMatters = "The 'Three Rooms' principle states business rules must reside in a dedicated middle tier. Storing logic on clients leads to tampering; storing it in database triggers degrades performance.";
      stepByStep = [
        "Click 'App Logic Tier' in the left Architecture Toolbox to spawn a compute pod.",
        "Route your Gateway or Client into the App Logic Tier.",
        "Route the App Logic Tier into the Database.",
      ];
      canAutoFix = true;
    } else if (hasDown) {
      status = "flawed";
      statusText = "Active Outage: Downstream Dependency Offline";
      whatIsWrong = "One or more nodes in your critical path have crashed or been killed by chaos testing.";
      whyItMatters = "When a downstream service crashes without a fallback replica or cache buffer, user requests timeout, resulting in failed checkouts and damaged trust.";
      stepByStep = [
        "Select the downed node and change its Health Status to 'Healthy', or click 'Auto-Heal & Restore'.",
        "Introduce a Distributed Cache or Message Queue to decouple asynchronous requests.",
      ];
      canAutoFix = true;
    } else if (isolatedNodes.length > 0) {
      status = "warning";
      statusText = "Orphaned Components: Unconnected Nodes";
      whatIsWrong = `There are ${isolatedNodes.length} node(s) on the canvas (${isolatedNodes.map((n) => n.label).join(", ")}) that have no dataflow connections.`;
      whyItMatters = "Idle, unconnected servers waste cloud budget and create confusion during architecture reviews.";
      stepByStep = [
        "Use the 'Connect Arrow' tool to integrate the isolated nodes into your dataflow pipeline.",
        "Or select the unused nodes and click 'Delete Node'.",
      ];
      canAutoFix = false;
    } else if (isHeavyLoad && !hasCache) {
      status = "warning";
      statusText = "Performance Bottleneck: Database Under Heavy Load";
      whatIsWrong = "Traffic has surged, but every read query is hitting the primary disk database directly without an in-memory cache.";
      whyItMatters = "Databases quickly run out of connection pools during surges, leading to escalating latency (>500ms) and inevitable 504 Gateway Timeouts.";
      stepByStep = [
        "Add a 'Distributed Cache' (Redis) from the toolbox.",
        "Wire the App Logic Tier to the Cache to deliver sub-millisecond responses.",
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

  // Automatic Challenge Progress Evaluation
  useEffect(() => {
    const current = CHALLENGES.find((c) => c.id === activeChallenge);
    if (!current || activeChallenge === "freeform") return;
    const isPassing = current.checkSuccess(nodes, connections);
    if (isPassing && !solvedChallenges.includes(activeChallenge)) {
      setSolvedChallenges((prev) => [...prev, activeChallenge]);
      setXp((prev) => prev + 50);
      setToast({ message: `Mission Passed! +50 XP: ${current.title}`, type: "success" });
      fetch("/api/foundry/complete", {
        method: "POST",
        headers: { "content-type": "application/json", "x-keel": "1" },
        body: JSON.stringify({ challengeId: activeChallenge }),
      })
        .then(() => refresh())
        .catch(() => {});
    }
  }, [nodes, connections, activeChallenge, solvedChallenges, refresh]);

  // Particle Generation Loop (Visual 60 FPS live dataflow)
  useEffect(() => {
    if (connections.length === 0) return;
    const interval = window.setInterval(() => {
      if (connections.length === 0) return;
      const randomConn = connections[Math.floor(Math.random() * connections.length)];
      if (!randomConn) return;

      const fromNode = nodes.find((n) => n.id === randomConn.from);
      const toNode = nodes.find((n) => n.id === randomConn.to);
      if (!fromNode || !toNode || fromNode.health === "down") return;

      let pType: Particle["type"] = "request";
      if (toNode.type === "cache") pType = "cache_hit";
      else if (toNode.type === "database") pType = "db_write";
      else if (toNode.type === "auth" && chaosActive) pType = "blocked";
      else if (toNode.type === "ci") pType = "ci_test";

      particleIdRef.current += 1;
      const newParticle: Particle = {
        id: particleIdRef.current,
        connId: randomConn.id,
        progress: 0,
        speed: (0.016 + Math.random() * 0.01) * trafficMultiplier,
        type: pType,
      };

      setParticles((prev) => [...prev.slice(-35), newParticle]);
    }, 180 / Math.max(1, trafficMultiplier));

    return () => window.clearInterval(interval);
  }, [connections, nodes, trafficMultiplier, chaosActive]);

  // Particle Movement
  useEffect(() => {
    let animId: number;
    const step = () => {
      setParticles((prev) =>
        prev
          .map((p) => ({ ...p, progress: p.progress + p.speed }))
          .filter((p) => p.progress < 1)
      );
      animId = requestAnimationFrame(step);
    };
    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, []);

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
        id: `c-${Date.now()}`,
        from: fromId,
        to: toId,
        status: isDangerous ? "error" : "active",
        protocol: isDangerous ? "DIRECT TCP (VULNERABLE)" : "HTTPS / Dataflow",
      };
      setConnections((prev) => [...prev, newConn]);
      setToast({
        message: isDangerous
          ? "Connected directly to DB! Vulnerability created."
          : `Linked: ${fromNode?.label} ➔ ${toNode?.label}`,
        type: isDangerous ? "error" : "success",
      });
    }
  };

  // Drag & Pointer Handlers
  const handlePointerDown = (id: string, e: React.PointerEvent) => {
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
        setConnections((prev) => prev.filter((c) => c.from !== id && c.to !== id));
        setToast({ message: "Disconnected wires from node", type: "info" });
      }
      return;
    }

    const node = nodes.find((n) => n.id === id);
    if (!node || !canvasRef.current) return;
    setSelectedNodeId(id);
    setSelectedConnId(null);
    setDraggedNodeId(id);
    const rect = canvasRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left - node.x,
      y: e.clientY - rect.top - node.y,
    });
  };

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const currentMouse = {
        x: Math.max(0, Math.min(rect.width, e.clientX - rect.left)),
        y: Math.max(0, Math.min(rect.height, e.clientY - rect.top)),
      };
      setMousePos(currentMouse);

      if (draggedNodeId) {
        const newX = Math.max(10, Math.min(rect.width - 160, e.clientX - rect.left - dragOffset.x));
        const newY = Math.max(10, Math.min(rect.height - 110, e.clientY - rect.top - dragOffset.y));

        setNodes((prev) =>
          prev.map((n) => (n.id === draggedNodeId ? { ...n, x: newX, y: newY } : n))
        );
      }
    },
    [draggedNodeId, dragOffset]
  );

  const handlePointerUp = () => {
    setDraggedNodeId(null);
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

  // CRUD: Add Node
  const addNode = (type: NodeType) => {
    const meta = nodeTypeMeta[type];
    const id = `${type}-${Date.now().toString().slice(-4)}`;
    const newNode: SystemNode = {
      id,
      type,
      label: meta.name.split("/")[0].trim(),
      x: 100 + (nodes.length % 4) * 80,
      y: 100 + (nodes.length % 3) * 60,
      health: "healthy",
      latency: type === "cache" ? 2 : type === "database" ? 45 : 20,
      capacity: type === "gateway" ? 5000 : 1000,
      rps: 50,
      role: meta.desc,
      industryTool: meta.tool,
    };
    setNodes((prev) => [...prev, newNode]);
    setSelectedNodeId(id);
    setSelectedConnId(null);
    setToast({ message: `Added ${meta.name}`, type: "success" });
  };

  // CRUD: Delete Node
  const deleteSelectedNode = () => {
    if (!selectedNodeId) return;
    setNodes((prev) => prev.filter((n) => n.id !== selectedNodeId));
    setConnections((prev) => prev.filter((c) => c.from !== selectedNodeId && c.to !== selectedNodeId));
    setSelectedNodeId(null);
    setToast({ message: "Node deleted", type: "info" });
  };

  // CRUD: Update Node
  const updateSelectedNode = (field: keyof SystemNode, value: unknown) => {
    if (!selectedNodeId) return;
    setNodes((prev) =>
      prev.map((n) => (n.id === selectedNodeId ? { ...n, [field]: value } : n))
    );
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
    let newConns = [...cleanConns];

    // Ensure Auth Guard exists
    let authNode = currentNodes.find((n) => n.type === "auth" || n.type === "gateway");
    if (!authNode) {
      authNode = {
        id: `auth-${Date.now()}`,
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
        id: `compute-${Date.now()}`,
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
        newConns.push({ id: `c-fix-1-${Date.now()}`, from: clientNode.id, to: authNode.id, status: "active", protocol: "HTTPS / TLS" });
      }
    }
    if (authNode && computeNode) {
      if (!newConns.some((c) => c.from === authNode.id && c.to === computeNode.id)) {
        newConns.push({ id: `c-fix-2-${Date.now()}`, from: authNode.id, to: computeNode.id, status: "active", protocol: "Verified Token" });
      }
    }
    if (computeNode && dbNode) {
      if (!newConns.some((c) => c.from === computeNode.id && c.to === dbNode.id)) {
        newConns.push({ id: `c-fix-3-${Date.now()}`, from: computeNode.id, to: dbNode.id, status: "active", protocol: "SQL Connection Pool" });
      }
    }

    setNodes(currentNodes);
    setConnections(newConns);
    tidyArchitecture();
    setToast({ message: "Applied Recommended Architecture: Security boundary and middle tier restored.", type: "success" });
  };

  // Chaos: Kill Random Server
  const triggerChaos = () => {
    const aliveNodes = nodes.filter((n) => n.health !== "down" && n.type !== "client");
    if (aliveNodes.length === 0) return;
    const target = aliveNodes[Math.floor(Math.random() * aliveNodes.length)];
    setNodes((prev) =>
      prev.map((n) => (n.id === target.id ? { ...n, health: "down", rps: 0 } : n))
    );
    setToast({ message: `Chaos Monkey knocked down: ${target.label}`, type: "error" });
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
    setNodes([]);
    setConnections([]);
    setSelectedNodeId(null);
    setSelectedConnId(null);
    setConnectFromId(null);
    setToast({ message: "Canvas cleared", type: "info" });
  };

  // Export Topology
  const exportTopology = () => {
    const topology = {
      specVersion: "2.0-keel-foundry",
      exportedAt: new Date().toISOString(),
      nodes: nodes.map((n) => ({
        id: n.id,
        type: n.type,
        label: n.label,
        industryEquivalent: n.industryTool,
        latencyMs: n.latency,
        capacityRps: n.capacity,
      })),
      connections: connections.map((c) => ({
        source: c.from,
        target: c.to,
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

  // Compute live system stats
  const healthyCount = nodes.filter((n) => n.health === "healthy").length;
  const availability = nodes.length ? Math.round((healthyCount / nodes.length) * 100) : 100;
  const avgLatency = nodes.length ? Math.round(nodes.reduce((acc, n) => acc + (n.health === "down" ? 500 : n.latency), 0) / nodes.length) : 0;
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  const selectedConn = connections.find((c) => c.id === selectedConnId);
  const currentCh = CHALLENGES.find((c) => c.id === activeChallenge) || CHALLENGES[0];
  const connectSourceNode = nodes.find((n) => n.id === connectFromId);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Toast Notification */}
      {toast && (
        <div
          role="status"
          className="fixed bottom-24 right-6 z-40 flex items-center gap-3 rounded-lg border border-line bg-raised px-4 py-3 shadow-xl transition-all"
        >
          <span className="text-base font-bold">
            {toast.type === "success" ? <IconCheck size={16} className="text-good" /> : toast.type === "error" ? <IconChaos size={16} className="text-danger" /> : <IconArchitect size={16} className="text-copper" />}
          </span>
          <span className="text-xs font-semibold text-ink">{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="ms-3 text-xs text-soft hover:text-ink"
            aria-label="Dismiss notification"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header & Academic Lineage */}
      <section className="rounded-xl border border-line bg-raised p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="kicker">DevOps & Systems Engineering Foundry</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink md:text-3xl">
              Systems Architecture & Dataflow Lab
            </h1>
            <p className="mt-1 text-sm text-soft">
              Interactive 2D/3D visual architecture simulator with live directional dataflow, entity relations, full CRUD, and an AI Architect Tutor.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-wider text-soft font-semibold">Gained Experience:</span>
            <span className="rounded-full border border-line bg-paper px-3 py-1 font-mono text-sm font-bold text-copper shadow-xs">
              ⚡ {xp} XP
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

        {/* Missions Selector */}
        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-line pt-4">
          <span className="text-xs font-bold text-soft uppercase tracking-wider">Missions:</span>
          {CHALLENGES.map((ch) => {
            const isSolved = solvedChallenges.includes(ch.id);
            const isActive = activeChallenge === ch.id;
            return (
              <button
                key={ch.id}
                onClick={() => selectChallenge(ch.id)}
                className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all shadow-xs ${
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
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-line bg-raised px-4 py-3 text-sm shadow-xs">
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
      </div>

      {/* Main Studio Area */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-4">
        {/* Left Sidebar: Component Palette & Control Panel */}
        <div className="space-y-4 lg:col-span-1">
          {/* Architecture Toolbox with Premium Vector Icons */}
          <div className="rounded-xl border border-line bg-raised p-4 shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-ink">Architecture Toolbox</h2>
            <p className="mt-1 text-xs text-soft">Click to spawn enterprise nodes into the canvas.</p>
            <div className="mt-3 space-y-1.5">
              {(Object.keys(nodeTypeMeta) as NodeType[]).map((type) => {
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
              <div className="rounded border border-line bg-paper p-2.5 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-soft">Availability</span>
                <p className={`text-base font-bold ${availability > 90 ? "text-good" : "text-danger"}`}>
                  {availability}%
                </p>
              </div>
              <div className="rounded border border-line bg-paper p-2.5 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-soft">Avg Latency</span>
                <p className={`text-base font-bold ${avgLatency < 50 ? "text-good" : "text-copper"}`}>
                  {avgLatency}ms
                </p>
              </div>
              <div className="rounded border border-line bg-paper p-2.5 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-soft">Active Nodes</span>
                <p className="text-base font-bold text-ink">{nodes.length}</p>
              </div>
              <div className="rounded border border-line bg-paper p-2.5 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-soft">Traffic Load</span>
                <p className="text-base font-bold text-ink">{trafficMultiplier}x RPS</p>
              </div>
            </div>

            {/* High-Contrast Chaos & Testing Controls with Vector Icons */}
            <h3 className="mt-4 text-xs font-bold uppercase tracking-wider text-ink">Chaos & Operational Testing</h3>
            <div className="mt-2 space-y-1.5">
              <button
                onClick={() => setTrafficMultiplier((prev) => (prev >= 4 ? 1 : prev + 1))}
                className="w-full rounded-md border border-line bg-paper px-3 py-2 text-xs text-left font-semibold text-ink hover:border-copper hover:bg-raised transition-all flex items-center justify-between shadow-xs"
              >
                <span className="flex items-center gap-2">
                  <IconSurge size={16} className="text-copper" />
                  <span>Traffic Surge</span>
                </span>
                <span className="font-mono text-[10px] font-bold text-copper">{trafficMultiplier}x Load</span>
              </button>

              <button
                onClick={triggerChaos}
                className="w-full rounded-md border border-danger/40 bg-paper px-3 py-2 text-xs text-left font-bold text-danger hover:bg-danger/10 transition-all flex items-center justify-between shadow-xs"
              >
                <span className="flex items-center gap-2">
                  <IconChaos size={16} className="text-danger" />
                  <span>Chaos Monkey: Kill Server</span>
                </span>
                <span className="text-[10px] uppercase font-mono">Disrupt</span>
              </button>

              <button
                onClick={runCiPipeline}
                className="w-full rounded-md border border-line bg-paper px-3 py-2 text-xs text-left font-semibold text-ink hover:border-ink transition-all flex items-center justify-between shadow-xs"
              >
                <span className="flex items-center gap-2">
                  <IconCI size={16} className="text-ink" />
                  <span>Trigger CI Pipeline</span>
                </span>
                <span className={`font-mono text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                  ciStatus === "passed" ? "bg-good/10 text-good" : ciStatus === "failed" ? "bg-danger/10 text-danger" : "bg-raised text-soft"
                }`}>
                  {ciStatus}
                </span>
              </button>

              <button
                onClick={autoHeal}
                className="w-full rounded-md border border-good/40 bg-paper px-3 py-2 text-xs text-left font-bold text-good hover:bg-good/10 transition-all flex items-center justify-between shadow-xs"
              >
                <span className="flex items-center gap-2">
                  <IconAutoHeal size={16} className="text-good" />
                  <span>Auto-Heal & Restore</span>
                </span>
                <span className="text-[10px] uppercase font-mono">Heal</span>
              </button>

              <button
                onClick={exportTopology}
                className="w-full rounded-md border border-line bg-paper px-3 py-2 text-xs text-left font-medium text-ink hover:border-copper hover:bg-raised transition-all flex items-center justify-between shadow-xs"
              >
                <span className="flex items-center gap-2">
                  <IconExport size={16} className="text-ink" />
                  <span>Export Architecture Spec</span>
                </span>
                <span className="text-[10px] text-soft font-mono">JSON</span>
              </button>
            </div>
          </div>
        </div>

        {/* Center / Right: Interactive Canvas & Toolbar */}
        <div className="flex flex-col gap-4 lg:col-span-3">
          {/* Canvas Enterprise Toolbar with Precision Vector Icons */}
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line bg-raised px-4 py-2.5 shadow-xs">
            {/* Interactive Modes */}
            <div className="flex items-center gap-1.5">
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
                onClick={tidyArchitecture}
                className="flex items-center gap-1.5 rounded-lg border border-line bg-paper px-3 py-1.5 text-xs font-semibold text-ink hover:border-copper transition-all shadow-xs"
                title="Automatically organize nodes into clean, non-overlapping architectural tiers"
              >
                <IconAutoLayout size={15} />
                <span>Auto-Layout</span>
              </button>
            </div>

            {/* Template Selector Dropdown */}
            <div className="flex items-center gap-2">
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

          {/* Interactive 2D/3D Canvas */}
          <div
            ref={canvasRef}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="relative h-[580px] w-full select-none overflow-hidden rounded-xl border border-zinc-700 bg-zinc-950 shadow-inner"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)`,
              backgroundSize: "28px 28px",
            }}
          >
            {/* Canvas Header Legend */}
            <div className="absolute left-3 top-3 z-20 flex items-center gap-2 rounded-lg border border-white/10 bg-black/70 px-3 py-1.5 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono text-zinc-200 font-semibold">Live Architecture Canvas</span>
              <span className="text-[10px] text-zinc-400">| Drag nodes • Drag port handles to link</span>
            </div>

            {/* SVG Directional Connections Layer */}
            <svg className="absolute inset-0 h-full w-full pointer-events-auto">
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

                const x1 = fromNode.x + 144;
                const y1 = fromNode.y + 44;
                const x2 = toNode.x;
                const y2 = toNode.y + 44;
                const isError = conn.status === "error" || fromNode.health === "down" || toNode.health === "down";
                const isSelected = selectedConnId === conn.id;

                const dx = Math.max(40, Math.abs(x2 - x1) * 0.45);
                const pathD = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

                return (
                  <g
                    key={conn.id}
                    className="cursor-pointer group"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (toolMode === "disconnect") {
                        setConnections((prev) => prev.filter((c) => c.id !== conn.id));
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
                  d={`M ${connectSourceNode.x + 144} ${connectSourceNode.y + 44} C ${connectSourceNode.x + 180} ${connectSourceNode.y + 44}, ${mousePos.x - 40} ${mousePos.y}, ${mousePos.x} ${mousePos.y}`}
                  fill="none"
                  stroke="#d08968"
                  strokeWidth="2.5"
                  strokeDasharray="4 4"
                  markerEnd="url(#arrow-temp)"
                  className="pointer-events-none"
                />
              )}

              {/* Animated Data Particles */}
              {particles.map((p) => {
                const conn = connections.find((c) => c.id === p.connId);
                if (!conn) return null;
                const fromNode = nodes.find((n) => n.id === conn.from);
                const toNode = nodes.find((n) => n.id === conn.to);
                if (!fromNode || !toNode) return null;

                const x1 = fromNode.x + 144;
                const y1 = fromNode.y + 44;
                const x2 = toNode.x;
                const y2 = toNode.y + 44;
                const dx = Math.max(40, Math.abs(x2 - x1) * 0.45);

                const t = p.progress;
                const cx =
                  (1 - t) * (1 - t) * (1 - t) * x1 +
                  3 * (1 - t) * (1 - t) * t * (x1 + dx) +
                  3 * (1 - t) * t * t * (x2 - dx) +
                  t * t * t * x2;
                const cy =
                  (1 - t) * (1 - t) * (1 - t) * y1 +
                  3 * (1 - t) * (1 - t) * t * y1 +
                  3 * (1 - t) * t * t * y2 +
                  t * t * t * y2;

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

                return (
                  <circle
                    key={p.id}
                    cx={cx}
                    cy={cy}
                    r={p.type === "blocked" ? 5 : 4}
                    fill={color}
                    className="pointer-events-none"
                    filter="drop-shadow(0 0 5px currentColor)"
                  />
                );
              })}
            </svg>

            {/* Interactive Drag & Drop Nodes with Vector Icons */}
            {nodes.map((node) => {
              const meta = nodeTypeMeta[node.type];
              const NodeIcon = meta.Icon;
              const isSelected = selectedNodeId === node.id;
              const isDown = node.health === "down";
              const isDegraded = node.health === "degraded";
              const isConnectSource = connectFromId === node.id;

              return (
                <div
                  key={node.id}
                  onPointerDown={(e) => handlePointerDown(node.id, e)}
                  style={{
                    transform: `translate3d(${node.x}px, ${node.y}px, 0)`,
                  }}
                  className={`absolute z-10 flex w-36 cursor-grab flex-col rounded-xl border p-2.5 shadow-xl backdrop-blur-md transition-shadow active:cursor-grabbing ${
                    isConnectSource
                      ? "border-amber-400 ring-2 ring-amber-400/60 bg-zinc-900 text-zinc-100"
                      : isSelected
                        ? "border-copper ring-2 ring-copper/60 bg-zinc-900 text-zinc-100 shadow-copper/20"
                        : isDown
                          ? "border-rose-600 bg-rose-950/90 text-rose-100"
                          : isDegraded
                            ? "border-amber-500 bg-amber-950/90 text-amber-100"
                            : "border-zinc-700/80 bg-zinc-900/95 text-zinc-100 hover:border-zinc-500"
                  }`}
                >
                  {/* Left Input Port */}
                  <div
                    onClick={(e) => endPortConnect(node.id, e)}
                    title="Input Port: Click to connect wire here"
                    className="absolute -left-2 top-9 h-4 w-4 rounded-full border-2 border-zinc-900 bg-zinc-400 hover:bg-emerald-400 hover:scale-125 transition-transform cursor-pointer"
                  />

                  {/* Right Output Port */}
                  <div
                    onClick={(e) => startPortConnect(node.id, e)}
                    title="Output Port: Click to draw arrow out"
                    className="absolute -right-2 top-9 h-4 w-4 rounded-full border-2 border-zinc-900 bg-zinc-400 hover:bg-copper hover:scale-125 transition-transform cursor-pointer"
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-zinc-300">
                      <NodeIcon size={18} />
                    </span>
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        isDown
                          ? "bg-rose-500 animate-ping"
                          : isDegraded
                            ? "bg-amber-400"
                            : "bg-emerald-400"
                      }`}
                    />
                  </div>

                  <p className="mt-1 truncate text-xs font-bold text-zinc-100">{node.label}</p>
                  <p className="truncate text-[10px] text-zinc-400">{meta.name.split("/")[0]}</p>

                  <div className="mt-2 flex items-center justify-between border-t border-zinc-700/60 pt-1.5 text-[9px] text-zinc-400">
                    <span className="font-mono text-zinc-300">{node.latency}ms</span>
                    <span className="font-mono text-zinc-300">{node.rps} rps</span>
                  </div>

                  {showTooltips && (
                    <div className="mt-1 rounded bg-black/60 px-1 py-0.5 text-center font-mono text-[8px] text-zinc-400 truncate">
                      {node.industryTool.split("/")[0]}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Connection Inspector Drawer */}
          {selectedConn && (
            <div className="flex items-center justify-between rounded-xl border border-line bg-raised p-4 shadow-xs">
              <div className="flex items-center gap-3">
                <span className="text-copper">
                  <IconConnect size={18} />
                </span>
                <div>
                  <h4 className="text-xs font-bold text-ink">
                    Connection: {nodes.find((n) => n.id === selectedConn.from)?.label} ➔ {nodes.find((n) => n.id === selectedConn.to)?.label}
                  </h4>
                  <p className="text-[11px] text-soft">Protocol: {selectedConn.protocol || "HTTPS / Dataflow"}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setConnections((prev) => prev.filter((c) => c.id !== selectedConn.id));
                    setSelectedConnId(null);
                    setToast({ message: "Connection removed", type: "info" });
                  }}
                  className="flex items-center gap-1.5 rounded border border-danger/40 bg-paper px-3 py-1.5 text-xs font-bold text-danger hover:bg-danger/10 transition-colors shadow-xs"
                >
                  <IconCut size={14} />
                  <span>Disconnect Wire</span>
                </button>
              </div>
            </div>
          )}

          {/* Selected Node Inspector Drawer (Full CRUD) */}
          {selectedNode && (
            <div className="rounded-xl border border-line bg-raised p-4 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-copper">
                    {(() => {
                      const SelectedIcon = nodeTypeMeta[selectedNode.type].Icon;
                      return <SelectedIcon size={22} />;
                    })()}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-ink">{selectedNode.label}</h3>
                    <p className="text-xs text-soft">{nodeTypeMeta[selectedNode.type].name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setConnectFromId(selectedNode.id);
                      setToast({ message: "Click destination node to link arrow", type: "info" });
                    }}
                    className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold transition-all shadow-xs ${
                      connectFromId === selectedNode.id
                        ? "border-copper bg-copper text-raised"
                        : "border-line bg-paper text-ink hover:border-copper"
                    }`}
                  >
                    <IconConnect size={14} />
                    <span>{connectFromId === selectedNode.id ? "Connecting..." : "Connect Arrow"}</span>
                  </button>
                  <button
                    onClick={deleteSelectedNode}
                    className="flex items-center gap-1.5 rounded-lg border border-danger/40 bg-paper px-3 py-1.5 text-xs font-bold text-danger hover:bg-danger/10 transition-colors shadow-xs"
                  >
                    <IconClear size={14} />
                    <span>Delete Node</span>
                  </button>
                </div>
              </div>

              {/* Node Customization Controls (CRUD Update) */}
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-4">
                <div>
                  <label htmlFor="node-label" className="text-[10px] uppercase font-bold text-soft">Node Label</label>
                  <input
                    id="node-label"
                    type="text"
                    value={selectedNode.label}
                    onChange={(e) => updateSelectedNode("label", e.target.value)}
                    className="mt-1 w-full rounded border border-line bg-paper px-2 py-1 text-xs font-semibold text-ink"
                  />
                </div>

                <div>
                  <label htmlFor="node-health" className="text-[10px] uppercase font-bold text-soft">Health Status</label>
                  <select
                    id="node-health"
                    value={selectedNode.health}
                    onChange={(e) => updateSelectedNode("health", e.target.value)}
                    className="mt-1 w-full rounded border border-line bg-paper px-2 py-1 text-xs font-semibold text-ink"
                  >
                    <option value="healthy">Healthy (Operational)</option>
                    <option value="degraded">Degraded (High Latency)</option>
                    <option value="down">Down (Outage / Crash)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="node-latency" className="text-[10px] uppercase font-bold text-soft">Latency (ms)</label>
                  <input
                    id="node-latency"
                    type="number"
                    min="1"
                    max="1000"
                    value={selectedNode.latency}
                    onChange={(e) => updateSelectedNode("latency", Number(e.target.value))}
                    className="mt-1 w-full rounded border border-line bg-paper px-2 py-1 text-xs font-semibold text-ink"
                  />
                </div>

                <div>
                  <label htmlFor="node-rps" className="text-[10px] uppercase font-bold text-soft">RPS Capacity</label>
                  <input
                    id="node-rps"
                    type="number"
                    min="10"
                    max="50000"
                    value={selectedNode.capacity}
                    onChange={(e) => updateSelectedNode("capacity", Number(e.target.value))}
                    className="mt-1 w-full rounded border border-line bg-paper px-2 py-1 text-xs font-semibold text-ink"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Integrated AI Architecture Tutor & Step-by-Step Guide Panel */}
          {showAiGuide && (
            <div className="rounded-xl border border-line bg-raised p-5 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-copper">
                    <IconArchitect size={22} />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-ink">AI Architecture Tutor & Inspector</h3>
                    <p className="text-xs text-soft">Continuous heuristic and LLM analysis: detects flaws, explains why, and provides step-by-step guidance.</p>
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
                    <span>{aiAnalyzing ? "Auditing..." : "Re-Audit"}</span>
                  </button>
                </div>
              </div>

              {/* 4-Section Educational Guidance */}
              {aiReport && (
                <div className="mt-4 space-y-3">
                  <div className="rounded-lg border border-line bg-paper p-3 shadow-xs">
                    <p className="kicker text-[10px] text-soft">1. Status</p>
                    <p className="mt-0.5 text-xs font-bold text-ink">{aiReport.statusText}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="rounded-lg border border-line bg-paper p-3 shadow-xs">
                      <p className="kicker text-[10px] text-danger">2. What is Wrong (or Risky)</p>
                      <p className="mt-1 text-xs leading-relaxed text-ink">{aiReport.whatIsWrong}</p>
                    </div>

                    <div className="rounded-lg border border-line bg-paper p-3 shadow-xs">
                      <p className="kicker text-[10px] text-copper">3. Why it Matters</p>
                      <p className="mt-1 text-xs leading-relaxed text-ink">{aiReport.whyItMatters}</p>
                    </div>
                  </div>

                  <div className="rounded-lg border border-line bg-paper p-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <p className="kicker text-[10px] text-good">4. Step-by-Step Guided Action Plan</p>
                      {aiReport.canAutoFix && (
                        <button
                          onClick={applyRecommendedFix}
                          className="flex items-center gap-1.5 rounded border border-good/40 bg-good/10 px-2.5 py-1 text-xs font-bold text-good hover:bg-good/20 transition-all shadow-xs"
                        >
                          <IconArchitect size={13} />
                          <span>Apply Recommended Fix</span>
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
                  </div>

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
                      placeholder="Ask AI Architect (e.g. 'Why do we need a Redis cache between API and DB?')..."
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

          {/* Quick Guide Card */}
          <div className="rounded-xl border border-line bg-raised p-4 text-xs text-soft shadow-xs">
            <h4 className="font-bold text-ink">💡 Systems Engineering Learning Principle</h4>
            <p className="mt-1 leading-relaxed">
              In modern distributed cloud architecture, every component must have a single clear responsibility. Direct connections between clients and databases expose credentials and crash under spikes. By inserting an API Gateway, an Auth Guard, and an App Logic Tier with in-memory caching, systems become resilient, secure, and observable.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
