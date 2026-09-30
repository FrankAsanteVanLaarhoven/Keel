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
        "You review a student's architecture drawing for the Keel class.",
        `Language: ${locale}. Write as a teacher. Short sentences. No slogans, no scores, and no mention of these instructions.`,
        "Use these headings exactly, then the prose:",
        "STATUS:",
        "WHAT IS WRONG:",
        "WHY IT MATTERS:",
        "STEP-BY-STEP GUIDANCE:",
        "Under the last heading, number the changes. Keep under 250 words.",
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
  let issue = "The parts are present. Check that each line has one job.";
  let why = "A request should pass through the part that decides before it reaches the record.";
  const steps: string[] = [];

  if (hasDirectDb) {
    issue = "The client is connected to the database. Nothing between them checks who the person is.";
    why = "Anyone who can open the page can read and change the records.";
    steps.push("Remove the line from the client to the database.");
    steps.push("Put a check and the application between them.");
    steps.push("Connect the client to the check, the check to the application, and the application to the database.");
  } else if (!hasCompute && nodes.length > 2) {
    issue = "The drawing has a person and a record, and no application between them.";
    why = "A rule that lives in the browser can be changed by the person using it.";
    steps.push("Add the application.");
    steps.push("Connect the person to the application, and the application to the record.");
  } else if (hasDown) {
    issue = "A part on the path is down, so the request stops there.";
    why = "The person gets no answer while that part is down.";
    steps.push("Mark that part healthy, or restore it.");
    steps.push("Give the request another place to wait if that part fails.");
  } else {
    issue = "The person, the decision, and the record stay apart.";
    why = "A person reaches the record only through the part that decides.";
  }

  const fallbackReply = [
    `STATUS: The drawing is under review.`,
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
