"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/locale";
import { speechLang, voiceLanguage } from "@/lib/locale";
import type { Messages } from "@/lib/i18n/en";
import { fill, localReply } from "@/lib/tutor";
import { takeVoiceEvent } from "@/lib/voice-events";
import { base64PcmToFloat, floatToBase64Pcm, resample } from "@/lib/pcm";
import type { Scope } from "./keel-context";

type Turn = { role: "you" | "tutor"; text: string };

export function VoiceDock({ locale, m, scope, consent, live, pinned }: { locale: Locale; m: Messages; scope: Scope; consent: boolean; live: boolean; pinned: boolean }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [status, setStatus] = useState<"idle" | "listening" | "speaking">("idle");
  const [linked, setLinked] = useState(false);
  const [note, setNote] = useState("");
  const audio = useRef<AudioContext | null>(null);
  const socket = useRef<WebSocket | null>(null);
  const sources = useRef<AudioBufferSourceNode[]>([]);
  const nextTime = useRef(0);
  const speaking = useRef(false);

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
      socket.current?.close();
      void audio.current?.close();
    };
  }, []);

  function stopSpeech() {
    window.speechSynthesis?.cancel();
    for (const source of sources.current) {
      try {
        source.stop();
      } catch {
        /* already stopped */
      }
    }
    sources.current = [];
    nextTime.current = 0;
    speaking.current = false;
    setStatus("idle");
  }

  function stopAll() {
    stopSpeech();
    socket.current?.close();
    socket.current = null;
    setLinked(false);
    void audio.current?.close();
    audio.current = null;
  }

  function speakDevice(line: string) {
    stopSpeech();
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(line);
    utterance.lang = speechLang(locale);
    const voices = window.speechSynthesis.getVoices();
    const match = voices.find((voice) => voice.lang.toLowerCase().startsWith(speechLang(locale).slice(0, 2)) && /natural|premium|enhanced/i.test(voice.name))
      ?? voices.find((voice) => voice.lang.toLowerCase().startsWith(speechLang(locale).slice(0, 2)));
    if (match) utterance.voice = match;
    utterance.onstart = () => setStatus("speaking");
    utterance.onend = () => setStatus("idle");
    window.speechSynthesis.speak(utterance);
    speaking.current = true;
  }

  async function playBuffer(float32: Float32Array) {
    if (!audio.current) audio.current = new AudioContext({ sampleRate: 24000 });
    if (audio.current.state === "suspended") await audio.current.resume();
    const copy = new ArrayBuffer(float32.byteLength);
    const channel = new Float32Array(copy);
    channel.set(float32);
    const buffer = audio.current.createBuffer(1, channel.length, 24000);
    buffer.copyToChannel(channel, 0);
    const source = audio.current.createBufferSource();
    source.buffer = buffer;
    source.connect(audio.current.destination);
    const start = Math.max(audio.current.currentTime, nextTime.current);
    source.start(start);
    nextTime.current = start + buffer.duration;
    sources.current.push(source);
    setStatus("speaking");
    source.onended = () => {
      sources.current = sources.current.filter((item) => item !== source);
      if (sources.current.length === 0) setStatus("listening");
    };
  }

  async function ask(message: string) {
    const trimmed = message.trim();
    if (!trimmed) return;
    setTurns((current) => [...current.slice(-7), { role: "you", text: trimmed }]);
    setText("");
    if (!(consent && live)) {
      const reply = localReply({
        locale,
        title: scope.title,
        promise: scope.promise,
        how: scope.how,
        message: trimmed,
        greet: m.tutorGreet,
        refuse: m.tutorRefuse,
        stay: m.tutorStay,
        thanks: m.tutorThanks,
      });
      setTurns((current) => [...current.slice(-7), { role: "tutor", text: reply }]);
      setNote(m.deviceNote);
      speakDevice(reply);
      return;
    }
    const response = await fetch("/api/tutor", {
      method: "POST",
      headers: { "content-type": "application/json", "x-keel": "1" },
      body: JSON.stringify({ sectionId: scope.id, message: trimmed }),
    });
    if (response.status === 429) {
      setNote(m.rateLimited);
      return;
    }
    const data = (await response.json()) as { text?: string; utterance?: string };
    const reply = data.text || fill(m.tutorStay, { title: scope.title, promise: scope.promise, how: scope.how });
    setTurns((current) => [...current.slice(-7), { role: "tutor", text: reply }]);
    if (data.utterance) {
      const audioResponse = await fetch("/api/voice/utter", {
        method: "POST",
        headers: { "content-type": "application/json", "x-keel": "1" },
        body: JSON.stringify({ id: data.utterance }),
      });
      if (audioResponse.ok) {
        stopSpeech();
        const blob = await audioResponse.blob();
        const url = URL.createObjectURL(blob);
        const player = new Audio(url);
        player.onended = () => URL.revokeObjectURL(url);
        await player.play();
        setNote(m.liveVoice);
        return;
      }
    }
    speakDevice(reply);
  }

  async function listen() {
    if (status === "speaking") {
      stopSpeech();
      return;
    }
    if (consent && live) {
      const response = await fetch("/api/voice/speak", {
        method: "POST",
        headers: { "content-type": "application/json", "x-keel": "1" },
        body: JSON.stringify({ sectionId: scope.id }),
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const player = new Audio(url);
        setStatus("speaking");
        player.onended = () => {
          URL.revokeObjectURL(url);
          setStatus("idle");
        };
        await player.play();
        setNote(m.liveVoice);
        return;
      }
    }
    setNote(m.onDevice);
    speakDevice(scope.narration);
  }

  async function talk() {
    if (socket.current) {
      stopAll();
      return;
    }
    if (!consent || !live) {
      setOpen(true);
      setNote(!live ? m.keyMissing : m.liveNeed);
      return;
    }
    setOpen(true);
    setStatus("listening");
    const secret = await fetch("/api/voice/session", {
      method: "POST",
      headers: { "content-type": "application/json", "x-keel": "1" },
      body: JSON.stringify({ sectionId: scope.id }),
    });
    if (!secret.ok) {
      setNote(secret.status === 429 ? m.rateLimited : m.keyMissing);
      setStatus("idle");
      return;
    }
    const session = (await secret.json()) as { token: string; instructions: string };
    const context = new AudioContext();
    audio.current = context;
    if (context.state === "suspended") await context.resume();
    await context.audioWorklet.addModule("/pcm-worklet.js");
    const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, channelCount: 1 } });
    const source = context.createMediaStreamSource(stream);
    const worklet = new AudioWorkletNode(context, "pcm-capture");
    source.connect(worklet);
    const ws = new WebSocket(`wss://api.x.ai/v1/realtime?model=grok-voice-latest`, [`xai-client-secret.${session.token}`]);
    socket.current = ws;
    setLinked(true);
    let pending = new Float32Array(0);
    worklet.port.onmessage = (event: MessageEvent<Float32Array>) => {
      if (ws.readyState !== WebSocket.OPEN) return;
      const chunk = resample(event.data, context.sampleRate, 24000);
      const merged = new Float32Array(pending.length + chunk.length);
      merged.set(pending);
      merged.set(chunk, pending.length);
      pending = merged;
      if (pending.length < 2400) return;
      ws.send(JSON.stringify({ type: "input_audio_buffer.append", audio: floatToBase64Pcm(pending) }));
      pending = new Float32Array(0);
    };
    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: "session.update",
        session: {
          voice: "eve",
          instructions: session.instructions,
          reasoning: { effort: "none" },
          turn_detection: { type: "server_vad", silence_duration_ms: 700 },
          audio: {
            input: { format: { type: "audio/pcm", rate: 24000 }, transcription: { language_hint: voiceLanguage(locale) } },
            output: { format: { type: "audio/pcm", rate: 24000 } },
          },
        },
      }));
    };
    ws.onmessage = (message) => {
      const event = takeVoiceEvent(JSON.parse(String(message.data)));
      if (event.kind === "barge") stopSpeech();
      if (event.kind === "audio") void playBuffer(base64PcmToFloat(event.delta));
      if (event.kind === "assistant") {
        setTurns((current) => {
          const last = current[current.length - 1];
          if (last?.role === "tutor") return [...current.slice(0, -1), { role: "tutor", text: last.text + event.delta }];
          return [...current, { role: "tutor", text: event.delta }];
        });
      }
      if (event.kind === "user") setTurns((current) => [...current, { role: "you", text: event.text }]);
      if (event.kind === "error") setNote(m.genericError);
    };
    ws.onclose = () => {
      stream.getTracks().forEach((track) => track.stop());
      setStatus("idle");
    };
  }

  return (
    <section className={pinned ? "no-print fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper" : "no-print border-t border-line bg-paper"}>
      {open ? (
        <div className="mx-auto max-w-3xl px-4 pt-3">
          <p className="kicker">{m.transcript}</p>
          <div className="mt-2 max-h-36 space-y-2 overflow-auto text-sm">
            {turns.map((turn, index) => (
              <p key={`${turn.role}-${index}`}>
                <span className="text-soft">{turn.role === "you" ? m.ask : m.tutor}. </span>
                {turn.text}
              </p>
            ))}
          </div>
          {note ? <p className="mt-2 text-sm text-soft">{note}</p> : null}
        </div>
      ) : null}
      <form
        className="mx-auto flex max-w-3xl items-center gap-2 px-4 py-3"
        onSubmit={(event) => {
          event.preventDefault();
          setOpen(true);
          void ask(text);
        }}
      >
        <p className="kicker hidden sm:block">{m.tutor}</p>
        <label className="sr-only" htmlFor="ask">{m.typeHint}</label>
        <input
          id="ask"
          className="min-w-0 flex-1 border border-line bg-raised px-3 py-2 text-sm"
          value={text}
          placeholder={m.typeHint}
          onChange={(event) => setText(event.target.value)}
        />
        <button className="text-sm underline" type="submit">{m.send}</button>
        <button className="text-sm underline" type="button" onClick={() => void listen()}>{status === "speaking" ? m.stop : m.listen}</button>
        <button className="border border-ink px-3 py-2 text-sm" type="button" onClick={() => void talk()}>
          {linked ? m.endTalk : m.talk}
        </button>
      </form>
    </section>
  );
}
