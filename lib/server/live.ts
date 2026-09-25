import { randomBytes } from "node:crypto";
import type { Locale } from "../locale";
import { voiceLanguage } from "../locale";
import { ephemeralToken, responseText } from "../voice-events";

export function liveEnabled(): boolean {
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
  });
  if (!response.ok) throw new Error("tts");
  return response.arrayBuffer();
}

export async function grokReply(instructions: string, message: string): Promise<string> {
  const key = process.env.XAI_API_KEY;
  if (!key) throw new Error("no_key");
  const response = await fetch("https://api.x.ai/v1/responses", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "grok-4.7",
      instructions,
      input: message.slice(0, 2000),
    }),
  });
  if (!response.ok) throw new Error("tutor");
  return responseText(await response.json()).slice(0, 800);
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
