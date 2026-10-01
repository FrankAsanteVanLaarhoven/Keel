import { randomBytes } from "node:crypto";
import type { Locale } from "../locale";
import { voiceLanguage } from "../locale";
import { ephemeralToken, responseText } from "../voice-events";

function openRouterKey(): string | undefined {
  return process.env.OPENROUTER_API_KEY || process.env.OPEN_ROUTER_KEY || undefined;
}

export function liveEnabled(): boolean {
  return Boolean(openRouterKey() || process.env.XAI_API_KEY);
}

export function hasTts(): boolean {
  return Boolean(process.env.XAI_API_KEY);
}

export function hasVoiceSession(): boolean {
  return Boolean(process.env.XAI_API_KEY);
}

type Issued = { userId: string; text: string; locale: Locale; exp: number };
const issued = new Map<string, Issued>();

export function issueUtterance(userId: string, text: string, locale: Locale): string {
  const now = Date.now();
  for (const [id, row] of issued) if (row.exp < now) issued.delete(id);
  if (issued.size > 200) {
    const oldest = issued.keys().next().value;
    if (oldest) issued.delete(oldest);
  }
  const id = randomBytes(18).toString("base64url");
  issued.set(id, { userId, text: text.slice(0, 800), locale, exp: now + 2 * 60 * 1000 });
  return id;
}

export function takeUtterance(userId: string, id: string): Issued | null {
  const row = issued.get(id);
  if (!row || row.userId !== userId || row.exp < Date.now()) return null;
  issued.delete(id);
  return row;
}

export async function speakText(text: string, locale: Locale): Promise<ArrayBuffer> {
  const key = process.env.XAI_API_KEY;
  if (!key) throw new Error("no_key");
  const response = await fetch("https://api.x.ai/v1/tts", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      text: text.slice(0, 4000),
      voice_id: "eve",
      language: voiceLanguage(locale),
      text_normalization: true,
    }),
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error("tts");
  return response.arrayBuffer();
}

type ReplyLimits = { input?: number; output?: number; maxTokens?: number };

function replyBounds(limits?: ReplyLimits): { input: number; output: number; maxTokens: number } {
  return {
    input: limits?.input ?? 2000,
    output: limits?.output ?? 800,
    maxTokens: limits?.maxTokens ?? 400,
  };
}

export async function openrouterReply(instructions: string, message: string, limits?: ReplyLimits): Promise<string> {
  const key = openRouterKey();
  if (!key) throw new Error("no_key");
  const model = process.env.OPENROUTER_MODEL || "x-ai/grok-4.7";
  const appUrl = process.env.BETTER_AUTH_URL || "https://keel.learn";
  const bounds = replyBounds(limits);
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "HTTP-Referer": appUrl,
      "X-Title": "Keel",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: instructions },
        { role: "user", content: message.slice(0, bounds.input) },
      ],
      max_tokens: bounds.maxTokens,
      temperature: 0.4,
    }),
    signal: AbortSignal.timeout(bounds.maxTokens > 400 ? 20000 : 15000),
  });
  if (!response.ok) throw new Error("openrouter");
  const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const content = data.choices?.[0]?.message?.content ?? "";
  return content.trim().slice(0, bounds.output);
}

export async function directXaiReply(instructions: string, message: string, limits?: ReplyLimits): Promise<string> {
  const key = process.env.XAI_API_KEY;
  if (!key) throw new Error("no_key");
  const bounds = replyBounds(limits);
  const body: { model: string; instructions: string; input: string; max_output_tokens?: number } = {
    model: "grok-4.7",
    instructions,
    input: message.slice(0, bounds.input),
  };
  if (limits?.maxTokens) body.max_output_tokens = bounds.maxTokens;
  const response = await fetch("https://api.x.ai/v1/responses", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(bounds.maxTokens > 400 ? 20000 : 15000),
  });
  if (!response.ok) throw new Error("tutor");
  return responseText(await response.json()).slice(0, bounds.output);
}

export async function aiReply(instructions: string, message: string, limits?: ReplyLimits): Promise<string> {
  if (openRouterKey()) {
    try {
      return await openrouterReply(instructions, message, limits);
    } catch (err) {
      if (process.env.XAI_API_KEY) {
        return await directXaiReply(instructions, message, limits);
      }
      throw err;
    }
  }
  if (process.env.XAI_API_KEY) {
    return directXaiReply(instructions, message, limits);
  }
  throw new Error("no_key");
}

export async function grokReply(instructions: string, message: string): Promise<string> {
  return aiReply(instructions, message);
}

export async function mintVoiceSecret(): Promise<string> {
  const key = process.env.XAI_API_KEY;
  if (!key) throw new Error("no_key");
  const response = await fetch("https://api.x.ai/v1/realtime/client_secrets", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ expires_after: { seconds: 600 } }),
  });
  if (!response.ok) throw new Error("token");
  const token = ephemeralToken(await response.json());
  if (!token) throw new Error("token_shape");
  return token;
}

export function tutorInstructions(input: { localeName: string; title: string; promise: string; how: string; expert: string; narration: string }): string {
  return [
    "You are the Keel tutor, a calm person teaching staff and students, including young learners.",
    `Speak ${input.localeName}. Short spoken sentences. One idea, then one question.`,
    "Do not reveal which option is correct on an unsolved check, bench, or case.",
    "If asked for the answer, refuse in one sentence and restate the idea.",
    "Stay on this lesson. If asked to leave it, decline and return to the case.",
    "No emoji. Do not mention being a model.",
    `Lesson: ${input.title}. ${input.promise}`,
    input.how,
    input.expert,
    input.narration,
  ].join("\n");
}
