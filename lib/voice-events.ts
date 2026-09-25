export type VoiceEvent =
  | { kind: "audio"; delta: string }
  | { kind: "assistant"; delta: string }
  | { kind: "user"; text: string }
  | { kind: "barge" }
  | { kind: "error"; message: string }
  | { kind: "ignore" };

export function takeVoiceEvent(event: unknown): VoiceEvent {
  if (!event || typeof event !== "object") return { kind: "ignore" };
  const record = event as { type?: unknown; delta?: unknown; transcript?: unknown; message?: unknown; item?: unknown };
  const type = typeof record.type === "string" ? record.type : "";
  if (type === "response.output_audio.delta" || type === "response.audio.delta") {
    return typeof record.delta === "string" ? { kind: "audio", delta: record.delta } : { kind: "ignore" };
  }
  if (
    type === "response.output_audio_transcript.delta" ||
    type === "response.audio_transcript.delta" ||
    type === "response.output_text.delta"
  ) {
    return typeof record.delta === "string" ? { kind: "assistant", delta: record.delta } : { kind: "ignore" };
  }
  if (type === "conversation.item.input_audio_transcription.completed") {
    return typeof record.transcript === "string" ? { kind: "user", text: record.transcript } : { kind: "ignore" };
  }
  if (type === "input_audio_buffer.speech_started") return { kind: "barge" };
  if (type === "error") {
    return { kind: "error", message: typeof record.message === "string" ? record.message.slice(0, 180) : "voice" };
  }
  return { kind: "ignore" };
}

export function responseText(payload: unknown): string {
  if (!payload || typeof payload !== "object") return "";
  const data = payload as { output_text?: unknown; output?: unknown };
  if (typeof data.output_text === "string") return data.output_text.trim();
  if (!Array.isArray(data.output)) return "";
  let text = "";
  for (const item of data.output) {
    if (!item || typeof item !== "object") continue;
    const content = (item as { content?: unknown }).content;
    if (!Array.isArray(content)) continue;
    for (const part of content) {
      if (!part || typeof part !== "object") continue;
      const piece = part as { type?: unknown; text?: unknown };
      if ((piece.type === "output_text" || piece.type === "text") && typeof piece.text === "string") text += piece.text;
    }
  }
  return text.trim();
}

export function ephemeralToken(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const data = payload as {
    value?: unknown;
    token?: unknown;
    secret?: unknown;
    client_secret?: unknown;
  };
  if (typeof data.client_secret === "string") return data.client_secret;
  if (data.client_secret && typeof data.client_secret === "object") {
    const value = (data.client_secret as { value?: unknown }).value;
    if (typeof value === "string") return value;
  }
  if (typeof data.token === "string") return data.token;
  if (typeof data.secret === "string") return data.secret;
  if (typeof data.value === "string") return data.value;
  return null;
}
