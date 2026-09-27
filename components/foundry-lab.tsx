"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { Messages } from "@/lib/i18n/en";
import { useKeel } from "./keel-context";

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

const nodeTypeMeta: Record<NodeType, { name: string; color: string; icon: string; tool: string; desc: string }> = {
  client: { name: "Client / Browser", color: "#38bdf8", icon: "💻", tool: "Web / Mobile / React", desc: "User touchpoint that requests data and presents views." },
  gateway: { name: "API Gateway / WAF", color: "#818cf8", icon: "🌐", tool: "Nginx / Envoy / Cloudflare", desc: "Routes traffic, terminates SSL, rate-limits, and shields backends." },
  auth: { name: "Auth & Security Guard", color: "#ec4899", icon: "🛡️", tool: "Better Auth / JWT / OAuth", desc: "Verifies session identity, issues tokens, checks permissions." },
  compute: { name: "App Logic Tier", color: "#a855f7", icon: "⚙️", tool: "Node.js / Go / Kubernetes Pod", desc: "Runs business rules, processes calculations, handles mutations." },
  cache: { name: "Distributed Cache", color: "#10b981", icon: "⚡", tool: "Redis / Memcached", desc: "Delivers sub-millisecond responses for repeatable read data." },
  database: { name: "Authoritative Database", color: "#f59e0b", icon: "🗄️", tool: "PostgreSQL / SQLite", desc: "Durable persistent storage that records ground truth." },
  queue: { name: "Message Broker / Queue", color: "#f97316", icon: "📬", tool: "Kafka / RabbitMQ / SQS", desc: "Decouples spikes by buffering async jobs and payments." },
  ci: { name: "CI/CD Pipeline Runner", color: "#06b6d4", icon: "🔨", tool: "GitHub Actions / GitLab CI", desc: "Runs automated linting, unit tests, secret scanning before deploy." },
  telemetry: { name: "Telemetry & SRE Agent", color: "#14b8a6", icon: "📊", tool: "Prometheus / Grafana / OTel", desc: "Gathers logs, metrics, traces, and triggers actionable alerts." },
};

const CHALLENGES: Challenge[] = [
  {
    id: "freeform",
    course: "SANDBOX",
    courseTitle: "Open Systems Foundry",
    badge: "Freeform",
    title: "Full Systems Architecture Lab",
    goal: "Design, connect, and simulate any multi-tier cloud topology. Stress-test under traffic spikes and chaos engineering.",
    hint: "Use the component palette to add nodes. Drag wire endpoints to connect them.",
    initialNodes: [
      { id: "client-1", type: "client", label: "Shopper Mobile", x: 80, y: 180, health: "healthy", latency: 20, capacity: 500, rps: 80, role: "Client App", industryTool: "iOS / Web" },
      { id: "gateway-1", type: "gateway", label: "Edge Gateway", x: 280, y: 180, health: "healthy", latency: 5, capacity: 5000, rps: 80, role: "Traffic Ingress", industryTool: "Nginx / Cloudflare" },
      { id: "app-1", type: "compute", label: "Harbor API", x: 500, y: 180, health: "healthy", latency: 35, capacity: 1200, rps: 80, role: "App Logic Server", industryTool: "Node.js / Go" },
      { id: "cache-1", type: "cache", label: "Stall Cache", x: 500, y: 60, health: "healthy", latency: 2, capacity: 10000, rps: 60, role: "Read Acceleration", industryTool: "Redis" },
      { id: "db-1", type: "database", label: "Market Ledger", x: 740, y: 180, health: "healthy", latency: 45, capacity: 800, rps: 20, role: "Durable Records", industryTool: "PostgreSQL" },
    ],
    initialConnections: [
      { id: "c1", from: "client-1", to: "gateway-1", status: "active" },
      { id: "c2", from: "gateway-1", to: "app-1", status: "active" },
      { id: "c3", from: "app-1", to: "cache-1", status: "active" },
      { id: "c4", from: "app-1", to: "db-1", status: "active" },
    ],
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
      { id: "client-sec", type: "client", label: "Untrusted Client", x: 100, y: 180, health: "healthy", latency: 20, capacity: 100, rps: 50, role: "Public Browser", industryTool: "Browser" },
      { id: "db-sec", type: "database", label: "Vulnerable DB", x: 600, y: 180, health: "degraded", latency: 40, capacity: 200, rps: 50, role: "Directly Exposed Database", industryTool: "PostgreSQL" },
    ],
    initialConnections: [
      { id: "c-bad", from: "client-sec", to: "db-sec", status: "error" },
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
      { id: "c2-client", type: "client", label: "Clinic Reception", x: 100, y: 180, health: "healthy", latency: 15, capacity: 300, rps: 50, role: "Presentation Room", industryTool: "Desktop Client" },
      { id: "c2-db", type: "database", label: "Patient Booking DB", x: 600, y: 180, health: "healthy", latency: 50, capacity: 500, rps: 50, role: "Persistence Room", industryTool: "PostgreSQL" },
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
      { id: "c3-dev", type: "client", label: "Developer Laptop", x: 100, y: 180, health: "healthy", latency: 10, capacity: 50, rps: 10, role: "Workbench", industryTool: "Git Workspace" },
      { id: "c3-app", type: "compute", label: "Production Roster App", x: 650, y: 180, health: "healthy", latency: 25, capacity: 1000, rps: 10, role: "Live Service", industryTool: "Kubernetes Pod" },
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
      { id: "c4-db", type: "database", label: "Ticket Database", x: 720, y: 180, health: "down", latency: 500, capacity: 500, rps: 1200, role: "Persistence (Crashed)", industryTool: "PostgreSQL" },
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
      { id: "c5-client", type: "client", label: "Night Courier App", x: 100, y: 180, health: "healthy", latency: 20, capacity: 400, rps: 100, role: "Driver Handheld", industryTool: "Mobile App" },
      { id: "c5-app", type: "compute", label: "Dispatch Gateway", x: 420, y: 180, health: "degraded", latency: 90, capacity: 800, rps: 100, role: "Dispatch Logic", industryTool: "Microservice" },
      { id: "c5-db", type: "database", label: "GPS Tracking Store", x: 700, y: 180, health: "healthy", latency: 30, capacity: 600, rps: 100, role: "Location DB", industryTool: "PostgreSQL" },
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

export function FoundryLab({ m, initialChallengeId }: { m: Messages; initialChallengeId?: string }) {
  const { me, refresh } = useKeel();
  const validInitial = CHALLENGES.find((c) => c.id === initialChallengeId);
  const [activeChallenge, setActiveChallenge] = useState<ChallengeId>(validInitial ? (initialChallengeId as ChallengeId) : "freeform");
  const [nodes, setNodes] = useState<SystemNode[]>(validInitial ? validInitial.initialNodes : CHALLENGES[0].initialNodes);
  const [connections, setConnections] = useState<Connection[]>(validInitial ? validInitial.initialConnections : CHALLENGES[0].initialConnections);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [connectFromId, setConnectFromId] = useState<string | null>(null);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Particle[]>([]);
  const [trafficMultiplier, setTrafficMultiplier] = useState(1);
  const [chaosActive, setChaosActive] = useState(false);
  const [ciStatus, setCiStatus] = useState<"idle" | "running" | "passed" | "failed">("idle");
  const [xp, setXp] = useState(me?.xp ?? 120);
  const [solvedChallenges, setSolvedChallenges] = useState<string[]>([]);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [showTooltips, setShowTooltips] = useState(true);

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
    setConnectFromId(null);
    setToast({ message: `Loaded: ${ch.title}`, type: "info" });
  };

  // Evaluate challenge condition
  useEffect(() => {
    const current = CHALLENGES.find((c) => c.id === activeChallenge);
    if (!current || activeChallenge === "freeform") return;
    const isPassing = current.checkSuccess(nodes, connections);
    if (isPassing && !solvedChallenges.includes(activeChallenge)) {
      setSolvedChallenges((prev) => [...prev, activeChallenge]);
      setXp((prev) => prev + 50);
      setToast({ message: `🎉 Mission Passed! +50 XP: ${current.title}`, type: "success" });
      fetch("/api/foundry/complete", {
        method: "POST",
        headers: { "content-type": "application/json", "x-keel": "1" },
        body: JSON.stringify({ challengeId: activeChallenge }),
      })
        .then(() => refresh())
        .catch(() => {});
    }
  }, [nodes, connections, activeChallenge, solvedChallenges, refresh]);

  // Particle generator loop
  useEffect(() => {
    if (connections.length === 0) return;
    const interval = window.setInterval(() => {
      if (connections.length === 0) return;
      // Spawn new particles along active connections
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
        speed: (0.015 + Math.random() * 0.01) * trafficMultiplier,
        type: pType,
      };

      setParticles((prev) => [...prev.slice(-35), newParticle]);
    }, 180 / Math.max(1, trafficMultiplier));

    return () => window.clearInterval(interval);
  }, [connections, nodes, trafficMultiplier, chaosActive]);

  // Particle movement animation
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

  // Drag node handling
  const handlePointerDown = (id: string, e: React.PointerEvent) => {
    if (connectFromId) {
      if (connectFromId !== id) {
        // Create connection
        const exists = connections.some(
          (c) => (c.from === connectFromId && c.to === id) || (c.from === id && c.to === connectFromId)
        );
        if (!exists) {
          const newConn: Connection = {
            id: `c-${Date.now()}`,
            from: connectFromId,
            to: id,
            status: "active",
          };
          setConnections((prev) => [...prev, newConn]);
          setToast({ message: "Connected nodes successfully", type: "success" });
        }
      }
      setConnectFromId(null);
      return;
    }

    const node = nodes.find((n) => n.id === id);
    if (!node || !canvasRef.current) return;
    setSelectedNodeId(id);
    setDraggedNodeId(id);
    const rect = canvasRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left - node.x,
      y: e.clientY - rect.top - node.y,
    });
  };

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!draggedNodeId || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const newX = Math.max(20, Math.min(rect.width - 160, e.clientX - rect.left - dragOffset.x));
    const newY = Math.max(20, Math.min(rect.height - 100, e.clientY - rect.top - dragOffset.y));

    setNodes((prev) =>
      prev.map((n) => (n.id === draggedNodeId ? { ...n, x: newX, y: newY } : n))
    );
  }, [draggedNodeId, dragOffset]);

  const handlePointerUp = () => {
    setDraggedNodeId(null);
  };

  // CRUD: Add Node
  const addNode = (type: NodeType) => {
    const meta = nodeTypeMeta[type];
    const id = `${type}-${Date.now().toString().slice(-4)}`;
    const newNode: SystemNode = {
      id,
      type,
      label: meta.name.split("/")[0].trim(),
      x: 100 + Math.random() * 300,
      y: 100 + Math.random() * 200,
      health: "healthy",
      latency: type === "cache" ? 2 : type === "database" ? 45 : 20,
      capacity: type === "gateway" ? 5000 : 1000,
      rps: 50,
      role: meta.desc,
      industryTool: meta.tool,
    };
    setNodes((prev) => [...prev, newNode]);
    setSelectedNodeId(id);
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

  // Chaos: Kill Random Server
  const triggerChaos = () => {
    const aliveNodes = nodes.filter((n) => n.health !== "down" && n.type !== "client");
    if (aliveNodes.length === 0) return;
    const target = aliveNodes[Math.floor(Math.random() * aliveNodes.length)];
    setNodes((prev) =>
      prev.map((n) => (n.id === target.id ? { ...n, health: "down", rps: 0 } : n))
    );
    setToast({ message: `💥 Chaos Monkey knocked down: ${target.label}!`, type: "error" });
  };

  // Chaos: Auto Heal
  const autoHeal = () => {
    setNodes((prev) => prev.map((n) => ({ ...n, health: "healthy", latency: Math.min(n.latency, 35) })));
    setTrafficMultiplier(1);
    setChaosActive(false);
    setToast({ message: "🩺 System restored: All nodes healthy and responsive.", type: "success" });
  };

  // CI/CD Simulator
  const runCiPipeline = () => {
    setCiStatus("running");
    setToast({ message: "🔨 Running CI Pipeline: Automated Lint, Tests, Secret Scan...", type: "info" });
    setTimeout(() => {
      const willPass = Math.random() > 0.3;
      if (willPass) {
        setCiStatus("passed");
        setToast({ message: "✅ CI/CD Pipeline Green! Deployed to Staging / Canary.", type: "success" });
      } else {
        setCiStatus("failed");
        setToast({ message: "🛑 CI/CD Pipeline Red: Test failure blocked merge! Andon cord engaged.", type: "error" });
      }
    }, 1800);
  };

  // Export Topology
  const exportTopology = () => {
    const topology = {
      specVersion: "1.0-keel-foundry",
      exportedAt: new Date().toISOString(),
      nodes: nodes.map((n) => ({
        id: n.id,
        type: n.type,
        name: n.label,
        industryEquivalent: n.industryTool,
        latencyMs: n.latency,
        capacityRps: n.capacity,
      })),
      connections: connections.map((c) => ({
        source: c.from,
        target: c.to,
      })),
    };
    const blob = new Blob([JSON.stringify(topology, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `keel-topology-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setToast({ message: "📥 Architecture topology exported as JSON.", type: "success" });
  };

  // Compute live system stats
  const healthyCount = nodes.filter((n) => n.health === "healthy").length;
  const availability = nodes.length ? Math.round((healthyCount / nodes.length) * 100) : 100;
  const avgLatency = nodes.length ? Math.round(nodes.reduce((acc, n) => acc + (n.health === "down" ? 500 : n.latency), 0) / nodes.length) : 0;
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  const currentCh = CHALLENGES.find((c) => c.id === activeChallenge) || CHALLENGES[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Toast Notification */}
      {toast && (
        <div
          role="status"
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg transition-all ${
            toast.type === "success"
              ? "border-emerald-600 bg-emerald-950 text-emerald-200"
              : toast.type === "error"
                ? "border-rose-600 bg-rose-950 text-rose-200"
                : "border-sky-600 bg-sky-950 text-sky-200"
          }`}
        >
          <span className="text-lg">{toast.type === "success" ? "✓" : toast.type === "error" ? "⚠" : "ℹ"}</span>
          <span className="text-sm font-medium">{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="ms-3 text-xs opacity-70 hover:opacity-100"
            aria-label="Dismiss notification"
          >
            ✕
          </button>
        </div>
      )}

      {/* Curriculum Lineage Banner */}
      <div className="rounded-xl border border-line bg-raised/70 p-5 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="kicker">Academic Prerequisites & Career Lineage</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
              Systems Engineering & DevOps Foundry
            </h1>
            <p className="mt-1 text-sm text-soft">
              Interactive 2D/3D visual architecture simulator with real live dataflow, full CRUD customization, and chaos testing.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-wider text-soft">Gained Experience:</span>
            <span className="rounded-full border border-line bg-paper px-3 py-1 font-mono text-sm font-bold text-copper">
              ⚡ {xp} XP
            </span>
            <span className="rounded-full border border-emerald-600/40 bg-emerald-950/60 px-3 py-1 text-xs font-semibold text-emerald-300">
              {solvedChallenges.length}/5 Missions Complete
            </span>
          </div>
        </div>

        {/* Visual Lineage Nodes from uploaded image */}
        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-4">
          <div className="rounded-lg border border-pink-500/40 bg-pink-950/30 p-3 text-pink-200">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-pink-400">Prerequisite</span>
            <h3 className="text-sm font-semibold">CSC2031 — Security Programming</h3>
            <p className="mt-1 text-xs text-pink-300/80">RBAC, JWT, WAF shields, encryption, secure boundaries.</p>
          </div>

          <div className="rounded-lg border border-purple-500/40 bg-purple-950/30 p-3 text-purple-200">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400">Prerequisite</span>
            <h3 className="text-sm font-semibold">CSC2035 — Systems Design</h3>
            <p className="mt-1 text-xs text-purple-300/80">3-Tier architecture, caches, read-replicas, decoupling.</p>
          </div>

          <div className="rounded-lg border border-sky-500/40 bg-sky-950/30 p-3 text-sky-200">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400">Prerequisite</span>
            <h3 className="text-sm font-semibold">CSC2033 — Team Project</h3>
            <p className="mt-1 text-xs text-sky-300/80">CI/CD pipelines, automated testing, merge gates, git flow.</p>
          </div>

          <div className="rounded-lg border-2 border-indigo-500 bg-indigo-950/60 p-3 text-indigo-100 shadow-md shadow-indigo-950/50">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-300">Target Capstone</span>
            <h3 className="text-sm font-bold text-white">CSC3131 — DevOps of Systems</h3>
            <p className="mt-1 text-xs text-indigo-200/90">Observability, resilience, scale, telemetry & operations.</p>
          </div>
        </div>
      </div>

      {/* Challenge Selector Tabs */}
      <div className="mt-6 flex flex-wrap gap-2 border-b border-line pb-3">
        {CHALLENGES.map((ch) => {
          const isSolved = solvedChallenges.includes(ch.id);
          const isSelected = activeChallenge === ch.id;
          return (
            <button
              key={ch.id}
              onClick={() => selectChallenge(ch.id)}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                isSelected
                  ? "border-copper bg-copper/10 text-ink shadow-sm"
                  : "border-line bg-raised hover:bg-raised/80 text-soft"
              }`}
            >
              <span>{isSolved ? "✅" : "🎯"}</span>
              <span>{ch.badge}</span>
              <span className="font-semibold">{ch.title.split(":")[1] || ch.title}</span>
            </button>
          );
        })}
      </div>

      {/* Current Objective Bar */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-line bg-raised/40 px-4 py-3 text-sm">
        <div className="max-w-3xl">
          <span className="font-semibold text-copper">Active Objective: </span>
          <span className="text-ink">{currentCh.goal}</span>
          <p className="mt-0.5 text-xs text-soft">💡 <span className="font-medium">Hint:</span> {currentCh.hint}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => selectChallenge(activeChallenge)}
            className="rounded border border-line bg-paper px-2.5 py-1 text-xs hover:border-ink"
          >
            Reset Challenge
          </button>
          <label className="flex items-center gap-1.5 text-xs text-soft cursor-pointer">
            <input
              type="checkbox"
              checked={showTooltips}
              onChange={(e) => setShowTooltips(e.target.checked)}
              className="rounded"
            />
            Enterprise Mapping
          </label>
        </div>
      </div>

      {/* Main Foundry Workspace */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Left Toolbar / Palette */}
        <div className="space-y-4 lg:col-span-1">
          <div className="rounded-xl border border-line bg-raised/80 p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-soft">Architecture Toolbox</h2>
            <p className="mt-1 text-xs text-soft">Click to add nodes into the live simulator canvas.</p>
            <div className="mt-3 space-y-1.5">
              {(Object.keys(nodeTypeMeta) as NodeType[]).map((type) => {
                const meta = nodeTypeMeta[type];
                return (
                  <button
                    key={type}
                    onClick={() => addNode(type)}
                    className="flex w-full items-center justify-between rounded-lg border border-line bg-paper px-3 py-2 text-left text-xs transition-colors hover:border-copper hover:bg-raised"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base">{meta.icon}</span>
                      <span className="font-medium">{meta.name}</span>
                    </span>
                    <span className="font-mono text-[10px] text-soft">{meta.tool.split("/")[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Telemetry HUD */}
          <div className="rounded-xl border border-line bg-raised/80 p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-soft">Live Telemetry HUD</h2>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded border border-line bg-paper p-2">
                <span className="text-[10px] text-soft">Availability</span>
                <p className={`text-base font-bold ${availability > 90 ? "text-emerald-400" : "text-rose-400"}`}>
                  {availability}%
                </p>
              </div>
              <div className="rounded border border-line bg-paper p-2">
                <span className="text-[10px] text-soft">Average Latency</span>
                <p className={`text-base font-bold ${avgLatency < 50 ? "text-emerald-400" : "text-amber-400"}`}>
                  {avgLatency}ms
                </p>
              </div>
              <div className="rounded border border-line bg-paper p-2">
                <span className="text-[10px] text-soft">Active Nodes</span>
                <p className="text-base font-bold text-ink">{nodes.length}</p>
              </div>
              <div className="rounded border border-line bg-paper p-2">
                <span className="text-[10px] text-soft">Traffic Load</span>
                <p className="text-base font-bold text-ink">{trafficMultiplier}x RPS</p>
              </div>
            </div>

            {/* Chaos & Control Actions */}
            <h3 className="mt-4 text-xs font-semibold uppercase tracking-wider text-soft">Chaos & CI/CD Testing</h3>
            <div className="mt-2 grid grid-cols-1 gap-1.5">
              <button
                onClick={() => setTrafficMultiplier((prev) => (prev >= 4 ? 1 : prev + 1))}
                className="w-full rounded border border-line bg-paper px-3 py-1.5 text-xs text-left font-medium hover:border-ink transition-colors flex items-center justify-between"
              >
                <span>⚡ Traffic Surge</span>
                <span className="font-mono text-[10px] text-copper">{trafficMultiplier}x</span>
              </button>
              <button
                onClick={triggerChaos}
                className="w-full rounded border border-rose-900/60 bg-rose-950/30 px-3 py-1.5 text-xs text-left font-medium text-rose-300 hover:bg-rose-900/40 transition-colors"
              >
                💥 Chaos Monkey: Kill Server
              </button>
              <button
                onClick={runCiPipeline}
                className="w-full rounded border border-cyan-900/60 bg-cyan-950/30 px-3 py-1.5 text-xs text-left font-medium text-cyan-300 hover:bg-cyan-900/40 transition-colors flex items-center justify-between"
              >
                <span>🔨 Trigger CI Pipeline</span>
                <span className="font-mono text-[10px]">{ciStatus.toUpperCase()}</span>
              </button>
              <button
                onClick={autoHeal}
                className="w-full rounded border border-emerald-900/60 bg-emerald-950/30 px-3 py-1.5 text-xs text-left font-medium text-emerald-300 hover:bg-emerald-900/40 transition-colors"
              >
                🩺 Auto-Heal & Restore
              </button>
              <button
                onClick={exportTopology}
                className="w-full rounded border border-line bg-paper px-3 py-1.5 text-xs text-left font-medium text-soft hover:text-ink hover:border-ink transition-colors"
              >
                📥 Export Architecture Spec
              </button>
            </div>
          </div>
        </div>

        {/* Center / Right: The Interactive 2D/3D Canvas */}
        <div className="flex flex-col gap-4 lg:col-span-3">
          <div
            ref={canvasRef}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="relative h-[560px] w-full select-none overflow-hidden rounded-xl border border-line bg-zinc-950 shadow-inner"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)`,
              backgroundSize: "28px 28px",
            }}
          >
            {/* Canvas Header Controls */}
            <div className="absolute left-3 top-3 z-10 flex items-center gap-2 rounded-lg border border-white/10 bg-black/60 px-3 py-1.5 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono text-zinc-300">Live Dataflow Simulator (60 FPS)</span>
              {connectFromId && (
                <span className="ms-2 rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-300 animate-bounce">
                  Click destination node to wire connection
                </span>
              )}
            </div>

            {/* SVG Wiring Connections Layer */}
            <svg className="pointer-events-none absolute inset-0 h-full w-full">
              <defs>
                <linearGradient id="activeWire" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity="0.8" />
                </linearGradient>
                <linearGradient id="errorWire" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#fb7185" stopOpacity="0.9" />
                </linearGradient>
              </defs>

              {connections.map((conn) => {
                const fromNode = nodes.find((n) => n.id === conn.from);
                const toNode = nodes.find((n) => n.id === conn.to);
                if (!fromNode || !toNode) return null;

                const x1 = fromNode.x + 70;
                const y1 = fromNode.y + 40;
                const x2 = toNode.x + 70;
                const y2 = toNode.y + 40;
                const isError = conn.status === "error" || fromNode.health === "down" || toNode.health === "down";

                // Curved cubic Bezier wire
                const dx = Math.abs(x2 - x1) * 0.5;
                const pathD = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

                return (
                  <g key={conn.id}>
                    <path
                      d={pathD}
                      fill="none"
                      stroke={isError ? "url(#errorWire)" : "url(#activeWire)"}
                      strokeWidth={isError ? "3" : "2"}
                      strokeDasharray={isError ? "4 4" : undefined}
                      opacity={isError ? 0.9 : 0.6}
                    />
                  </g>
                );
              })}

              {/* Animated Data Particles */}
              {particles.map((p) => {
                const conn = connections.find((c) => c.id === p.connId);
                if (!conn) return null;
                const fromNode = nodes.find((n) => n.id === conn.from);
                const toNode = nodes.find((n) => n.id === conn.to);
                if (!fromNode || !toNode) return null;

                const x1 = fromNode.x + 70;
                const y1 = fromNode.y + 40;
                const x2 = toNode.x + 70;
                const y2 = toNode.y + 40;
                const dx = Math.abs(x2 - x1) * 0.5;

                // Approximate cubic bezier point
                const t = p.progress;
                const cx = (1 - t) * (1 - t) * (1 - t) * x1 + 3 * (1 - t) * (1 - t) * t * (x1 + dx) + 3 * (1 - t) * t * t * (x2 - dx) + t * t * t * x2;
                const cy = (1 - t) * (1 - t) * (1 - t) * y1 + 3 * (1 - t) * (1 - t) * t * y1 + 3 * (1 - t) * t * t * y2 + t * t * t * y2;

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
                    filter="drop-shadow(0 0 4px currentColor)"
                  />
                );
              })}
            </svg>

            {/* Interactive Drag & Drop Nodes */}
            {nodes.map((node) => {
              const meta = nodeTypeMeta[node.type];
              const isSelected = selectedNodeId === node.id;
              const isDown = node.health === "down";
              const isDegraded = node.health === "degraded";

              return (
                <div
                  key={node.id}
                  onPointerDown={(e) => handlePointerDown(node.id, e)}
                  style={{
                    transform: `translate3d(${node.x}px, ${node.y}px, 0)`,
                  }}
                  className={`absolute z-10 flex w-36 cursor-grab flex-col rounded-xl border p-2.5 shadow-lg backdrop-blur-md transition-shadow active:cursor-grabbing ${
                    isSelected
                      ? "border-copper ring-2 ring-copper/50 shadow-copper/20"
                      : isDown
                        ? "border-rose-600 bg-rose-950/80 text-rose-200"
                        : isDegraded
                          ? "border-amber-500 bg-amber-950/80 text-amber-200"
                          : "border-white/15 bg-zinc-900/90 text-zinc-100 hover:border-white/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{meta.icon}</span>
                    <span
                      className={`h-2 w-2 rounded-full ${
                        isDown
                          ? "bg-rose-500 animate-ping"
                          : isDegraded
                            ? "bg-amber-400"
                            : "bg-emerald-400"
                      }`}
                    />
                  </div>

                  <p className="mt-1 truncate text-xs font-bold">{node.label}</p>
                  <p className="truncate text-[10px] text-zinc-400">{meta.name.split("/")[0]}</p>

                  <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-1.5 text-[9px] text-zinc-400">
                    <span>{node.latency}ms</span>
                    <span className="font-mono text-zinc-300">{node.rps} rps</span>
                  </div>

                  {showTooltips && (
                    <div className="mt-1 rounded bg-black/40 px-1 py-0.5 text-center font-mono text-[8px] text-zinc-400 truncate">
                      {node.industryTool.split("/")[0]}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Selected Node Inspector Drawer (Full CRUD) */}
          {selectedNode ? (
            <div className="rounded-xl border border-line bg-raised/90 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{nodeTypeMeta[selectedNode.type].icon}</span>
                  <div>
                    <h3 className="text-sm font-bold text-ink">{selectedNode.label}</h3>
                    <p className="text-xs text-soft">{nodeTypeMeta[selectedNode.type].name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setConnectFromId(selectedNode.id)}
                    className={`rounded border px-2.5 py-1 text-xs font-medium transition-colors ${
                      connectFromId === selectedNode.id
                        ? "border-amber-500 bg-amber-500/20 text-amber-300"
                        : "border-line bg-paper text-ink hover:border-copper"
                    }`}
                  >
                    🔗 {connectFromId === selectedNode.id ? "Connecting..." : "Connect Wire"}
                  </button>
                  <button
                    onClick={deleteSelectedNode}
                    className="rounded border border-rose-900 bg-rose-950/40 px-2.5 py-1 text-xs font-medium text-rose-300 hover:bg-rose-900/60"
                  >
                    🗑️ Delete Node
                  </button>
                </div>
              </div>

              {/* Node Customization Controls (CRUD Update) */}
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-soft">Node Label</label>
                  <input
                    type="text"
                    value={selectedNode.label}
                    onChange={(e) => updateSelectedNode("label", e.target.value)}
                    className="mt-1 w-full rounded border border-line bg-paper px-2 py-1 text-xs font-medium text-ink"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-soft">Health Status</label>
                  <select
                    value={selectedNode.health}
                    onChange={(e) => updateSelectedNode("health", e.target.value)}
                    className="mt-1 w-full rounded border border-line bg-paper px-2 py-1 text-xs font-medium text-ink"
                  >
                    <option value="healthy">Healthy (Operational)</option>
                    <option value="degraded">Degraded (High Latency)</option>
                    <option value="down">Down (Outage / Crash)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-soft">Latency (ms)</label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={selectedNode.latency}
                    onChange={(e) => updateSelectedNode("latency", Number(e.target.value))}
                    className="mt-1 w-full rounded border border-line bg-paper px-2 py-1 text-xs font-medium text-ink"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-soft">RPS Capacity</label>
                  <input
                    type="number"
                    min="100"
                    max="50000"
                    step="100"
                    value={selectedNode.capacity}
                    onChange={(e) => updateSelectedNode("capacity", Number(e.target.value))}
                    className="mt-1 w-full rounded border border-line bg-paper px-2 py-1 text-xs font-medium text-ink"
                  />
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-soft border-t border-line/60 pt-2">
                <span>
                  <strong className="text-ink">Operational Role:</strong> {selectedNode.role}
                </span>
                <span className="font-mono text-[11px] text-copper">
                  Enterprise Equivalent: {selectedNode.industryTool}
                </span>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-line/60 bg-raised/40 p-4 text-center text-xs text-soft">
              Select any node on the canvas to inspect its real-time metrics, edit parameters, or wire connections.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
