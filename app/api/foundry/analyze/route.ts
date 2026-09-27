import { guard, json } from "@/lib/http";
import { userFrom } from "@/lib/ready";
import { aiReply, liveEnabled } from "@/lib/server/live";
import { resolveLocale } from "@/lib/i18n/server";

export const runtime = "nodejs";

interface AnalysisNode {
  id: string;
  type: string;
  label: string;
  health: string;
  capacity?: number;
  latency?: number;
}

interface AnalysisConnection {
  from: string;
  to: string;
}

export async function POST(request: Request) {
  const user = await userFrom(request);
  const gated = await guard(request, "foundry-analyze", 30, 10 * 60 * 1000, user?.id);
  if (gated.error || !gated.body || typeof gated.body !== "object") {
    return gated.error ?? json({ error: "body" }, 400);
  }

  const body = gated.body as {
    nodes?: AnalysisNode[];
    connections?: AnalysisConnection[];
    challengeTitle?: string;
    challengeGoal?: string;
    question?: string;
  };

  const nodes = Array.isArray(body.nodes) ? body.nodes : [];
  const connections = Array.isArray(body.connections) ? body.connections : [];
  const challengeTitle = body.challengeTitle || "Custom Architecture";
  const challengeGoal = body.challengeGoal || "Build a reliable, secure multi-tier system.";
  const question = (body.question || "Analyze my architecture and advise what to fix step-by-step.").trim().slice(0, 1000);
  const locale = await resolveLocale();

  // Rule-based heuristic analysis first
  const hasDirectDb = connections.some((c) => {
    const f = nodes.find((n) => n.id === c.from);
    const t = nodes.find((n) => n.id === c.to);
    return f?.type === "client" && t?.type === "database";
  });
  const hasCompute = nodes.some((n) => n.type === "compute");
  const hasAuth = nodes.some((n) => n.type === "auth" || n.type === "gateway");
  const hasCache = nodes.some((n) => n.type === "cache");
  const hasDown = nodes.some((n) => n.health === "down");
  const isIsolated = nodes.some((n) => !connections.some((c) => c.from === n.id || c.to === n.id));

  // If live AI (OpenRouter) is enabled, generate a personalized, step-by-step educational review
  if (liveEnabled()) {
    try {
      const instructions = [
        "You are the Keel Systems & DevOps AI Architect.",
        `Language: ${locale}. Speak calmly, clearly, and encouragingly. Make concepts so clear that a 14-year-old understands, yet technically sound for an enterprise engineer.`,
        "Format your answer with these exact sections:",
        "1. STATUS: (One encouraging sentence on what is currently happening).",
        "2. WHAT IS WRONG (OR RISKY): (Explain the specific architectural flaw, bottleneck, or vulnerability without confusing jargon).",
        "3. WHY IT MATTERS: (The real-world consequence: e.g. data leak, crash on Tuesday night, slow user experience).",
        "4. STEP-BY-STEP GUIDANCE: (Numbered steps telling the student exactly what to add, delete, or wire to make it production-ready).",
        "No emoji over-use. Concise and actionable. Keep under 250 words total.",
      ].join("\n");

      const prompt = [
        `Active Challenge: ${challengeTitle}`,
        `Goal: ${challengeGoal}`,
        `Current Topology:`,
        `- Nodes (${nodes.length}): ${nodes.map((n) => `${n.label} (${n.type}, health: ${n.health})`).join(", ")}`,
        `- Connections (${connections.length}): ${connections.map((c) => `${c.from} -> ${c.to}`).join(", ")}`,
        `Direct Client-to-DB wire: ${hasDirectDb ? "YES (VULNERABILITY)" : "NO"}`,
        `Has Application Logic Tier: ${hasCompute ? "YES" : "NO (MISSING)"}`,
        `Has Auth/WAF: ${hasAuth ? "YES" : "NO"}`,
        `Has Cache: ${hasCache ? "YES" : "NO"}`,
        `Nodes Offline: ${hasDown ? "YES" : "NO"}`,
        `Isolated Unconnected Nodes: ${isIsolated ? "YES" : "NO"}`,
        `Learner Question: ${question}`,
      ].join("\n");

      const reply = await aiReply(instructions, prompt);
      return json({ reply, directDb: hasDirectDb, hasCompute });
    } catch {
      // Fallback to deterministic expert advice
    }
  }

  // Deterministic fallback explanation if offline or without AI keys
  let issue = "Your architecture has good initial components, but needs proper wiring.";
  let why = "Without clear boundaries, requests can fail or overwhelm single nodes.";
  const steps: string[] = [];

  if (hasDirectDb) {
    issue = "CRITICAL SECURITY RISK: The Client is directly wired to the Authoritative Database.";
    why = "In a real system, direct browser access to a database allows any user to inspect credentials and tamper with records.";
    steps.push("Click on the red wire between Client and Database and disconnect it.");
    steps.push("From the toolbox, add an 'Auth & Security Guard' and an 'App Logic Tier'.");
    steps.push("Connect: Client -> Auth Guard -> App Logic Tier -> Database.");
  } else if (!hasCompute && nodes.length > 2) {
    issue = "MISSING APPLICATION TIER: You have storage and presentation, but nowhere for business rules to live.";
    why = "The 'Three Rooms' rule requires rules (calculations, authorization) to live in a dedicated middle tier.";
    steps.push("Click 'App Logic Tier' in the left Architecture Toolbox.");
    steps.push("Wire your Client or Gateway into the App Logic Tier, then wire App Logic into the Database.");
  } else if (hasDown) {
    issue = "OUTAGE DETECTED: One or more components in your system are down.";
    why = "When a downstream dependency crashes without a fallback or replica, user requests fail completely.";
    steps.push("Select the downed node and set its health to 'Healthy', or click 'Auto-Heal & Restore'.");
    steps.push("Add a Distributed Cache or Queue to buffer requests so single node failures do not cascade.");
  } else {
    issue = "Topology is active, but can be optimized for enterprise scale and observability.";
    why = "Production systems require telemetry agents to track MTTD/MTTR and caches to protect against spikes.";
    steps.push("Add a 'Distributed Cache' (Redis) attached to your App Logic Tier for instant reads.");
    steps.push("Add a 'Telemetry & SRE Agent' to monitor response times and catch errors before users call.");
  }

  const fallbackReply = [
    `STATUS: Architecture audited.`,
    `WHAT IS WRONG: ${issue}`,
    `WHY IT MATTERS: ${why}`,
    `STEP-BY-STEP GUIDANCE:`,
    ...steps.map((s, i) => `${i + 1}. ${s}`),
  ].join("\n\n");

  return json({
    reply: fallbackReply,
    directDb: hasDirectDb,
    hasCompute,
  });
}
