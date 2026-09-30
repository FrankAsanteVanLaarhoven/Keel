"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Messages } from "@/lib/i18n/en";
import { MarkdownView } from "./markdown-view";

type PageSnap = {
  title: string;
  body: string;
  revision: number;
  status: "draft" | "published";
  ownerName: string;
  access: "edit" | "read";
  members: { id: string; name: string }[];
};

type Loaded = {
  manage: boolean;
  page: PageSnap;
  notes: { id: string; body: string; name: string }[];
  revisions: { revision: number; title: string; name: string }[];
  here: string[];
};

type Draft = {
  title: string;
  body: string;
  savedTitle: string;
  savedBody: string;
  revision: number;
};

export function WorkshopEditor({ id, m }: { id: string; m: Messages }) {
  const router = useRouter();
  const draft = useRef<Draft>({ title: "", body: "", savedTitle: "", savedBody: "", revision: 0 });
  const loadedRef = useRef<Loaded | null>(null);
  const loadRef = useRef<(quiet?: boolean) => Promise<void>>(async () => {});
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [mode, setMode] = useState<"write" | "read" | "both">("both");
  const [message, setMessage] = useState("");
  const [conflict, setConflict] = useState<PageSnap | null>(null);
  const [pending, setPending] = useState(false);
  const [member, setMember] = useState("");
  const [note, setNote] = useState("");
  const [missing, setMissing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const adopt = useCallback((next: Loaded) => {
    loadedRef.current = next;
    draft.current = {
      title: next.page.title,
      body: next.page.body,
      savedTitle: next.page.title,
      savedBody: next.page.body,
      revision: next.page.revision,
    };
    setLoaded(next);
    setTitle(next.page.title);
    setBody(next.page.body);
    setConflict(null);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load(quiet = false) {
      const response = await fetch(`/api/workshop/${id}`, { headers: { "x-keel": "1" } });
      if (cancelled) return;
      if (response.status === 404) {
        setMissing(true);
        return;
      }
      if (!response.ok) {
        if (!quiet) setMessage(response.status === 503 ? m.waking : response.status === 403 ? m.workshopPrivate : response.status === 401 ? m.workshopSignIn : m.genericError);
        return;
      }
      const next = (await response.json()) as Loaded;
      if (cancelled) return;
      if (next.page.revision < draft.current.revision) return;
      const dirty = draft.current.title !== draft.current.savedTitle || draft.current.body !== draft.current.savedBody;
      if (!loadedRef.current || !dirty) adopt(next);
      else {
        loadedRef.current = next;
        setLoaded(next);
        if (next.page.revision !== draft.current.revision) setConflict(next.page);
      }
    }
    loadRef.current = load;
    void load();
    const timer = window.setInterval(() => {
      if (document.visibilityState === "hidden") return;
      void load(true);
    }, 8000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [adopt, id, m]);

  function writeTitle(value: string) {
    draft.current = { ...draft.current, title: value };
    setTitle(value);
  }

  function writeBody(value: string) {
    draft.current = { ...draft.current, body: value };
    setBody(value);
  }

  async function save(nextTitle = title, nextBody = body, nextRevision = draft.current.revision) {
    setPending(true);
    setMessage("");
    const response = await fetch(`/api/workshop/${id}`, {
      method: "PUT",
      headers: { "content-type": "application/json", "x-keel": "1" },
      body: JSON.stringify({ title: nextTitle, body: nextBody, revision: nextRevision }),
    });
    setPending(false);
    if (response.status === 409) {
      const payload = (await response.json()) as { current: PageSnap | null };
      if (payload.current) setConflict(payload.current);
      setMessage(m.workshopConflict);
      return;
    }
    if (!response.ok) {
      setMessage(response.status === 503 ? m.waking : response.status === 429 ? m.rateLimited : response.status === 403 ? m.workshopPrivate : m.genericError);
      return;
    }
    const payload = (await response.json()) as { revision: number };
    draft.current = { title: nextTitle, body: nextBody, savedTitle: nextTitle, savedBody: nextBody, revision: payload.revision };
    setTitle(nextTitle);
    setBody(nextBody);
    setConflict(null);
    setMessage(m.workshopSaved);
    await loadRef.current(true);
  }

  async function act(payload: Record<string, unknown>) {
    setPending(true);
    setMessage("");
    const response = await fetch(`/api/workshop/${id}`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-keel": "1" },
      body: JSON.stringify(payload),
    });
    setPending(false);
    if (response.status === 404 && payload.action === "member") {
      setMessage(m.workshopMemberMissing);
      return;
    }
    if (response.status === 409 && payload.action === "member") {
      setMessage(m.workshopMemberAmbiguous);
      return;
    }
    if (response.status === 409 && payload.action === "restore") {
      setMessage(m.workshopConflict);
      await loadRef.current(true);
      return;
    }
    if (!response.ok) {
      setMessage(response.status === 503 ? m.waking : response.status === 429 ? m.rateLimited : response.status === 403 ? m.workshopPrivate : m.genericError);
      return;
    }
    if (payload.action === "member") {
      setMember("");
      setMessage(m.workshopMemberAdded);
    }
    if (payload.action === "note") setNote("");
    await loadRef.current(true);
  }

  async function remove() {
    setPending(true);
    setMessage("");
    const response = await fetch(`/api/workshop/${id}`, { method: "DELETE", headers: { "x-keel": "1" } });
    setPending(false);
    if (response.ok) {
      router.push("/workshop");
      return;
    }
    setMessage(response.status === 503 ? m.waking : response.status === 403 ? m.workshopPrivate : response.status === 429 ? m.rateLimited : m.genericError);
  }

  if (missing) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-16">
        <h1 className="text-4xl font-medium tracking-tight">{m.workshopTitle}</h1>
        <p className="mt-4">{m.workshopEmpty}</p>
        <p className="mt-6"><Link className="underline" href="/workshop">{m.workshop}</Link></p>
      </div>
    );
  }
  if (!loaded) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-16">
        <h1 className="text-4xl font-medium tracking-tight">{m.workshopTitle}</h1>
        <p className="mt-4" role="status">{m.loading}</p>
      </div>
    );
  }
  const editing = loaded.page.access === "edit";
  const canNote = editing || loaded.manage;
  const showWrite = editing && mode !== "read";
  const showRead = mode !== "write" || !editing;

  return (
    <div className="mx-auto max-w-6xl px-5 pb-28 pt-12">
      <p className="kicker"><Link className="underline" href="/workshop">{m.workshop}</Link></p>
      <h1 className="mt-3 text-4xl font-medium tracking-tight">{title || loaded.page.title}</h1>
      <p className="mt-3 text-sm text-soft">
        {loaded.page.status === "published" ? m.workshopPublished : m.workshopDraft}
        {" · "}
        {m.workshopOwner}: {loaded.page.ownerName}
        {" · "}
        {m.workshopHere}: {loaded.here.length ? loaded.here.join(", ") : m.workshopAlone}
      </p>
      <p className="mt-3 max-w-2xl text-sm text-soft">{m.workshopHelp}</p>
      {editing ? (
        <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label={m.workshopBoth}>
          {(["write", "read", "both"] as const).map((item) => (
            <button key={item} className={mode === item ? "border border-ink px-3 py-2 text-sm" : "border border-line px-3 py-2 text-sm text-soft"} type="button" onClick={() => setMode(item)} aria-pressed={mode === item}>
              {item === "write" ? m.workshopWrite : item === "read" ? m.workshopRead : m.workshopBoth}
            </button>
          ))}
        </div>
      ) : null}
      <div className={mode === "both" && editing ? "mt-6 grid gap-6 lg:grid-cols-2" : "mt-6"}>
        {showWrite ? (
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              void save();
            }}
          >
            <label className="block">
              <span className="text-sm">{m.workshopPageTitle}</span>
              <input className="mt-1 w-full border border-line bg-raised px-3 py-2" value={title} required minLength={2} maxLength={80} autoComplete="off" onChange={(event) => writeTitle(event.target.value)} />
            </label>
            <label className="block">
              <span className="sr-only">{m.workshopWrite}</span>
              <textarea className="min-h-80 w-full border border-line bg-raised px-3 py-2 font-mono text-sm" value={body} maxLength={80000} onChange={(event) => writeBody(event.target.value)} />
            </label>
            <button className="border border-ink bg-ink px-4 py-2 text-sm text-paper disabled:opacity-40" type="submit" disabled={pending} aria-busy={pending}>
              {pending ? m.loading : m.workshopSave}
            </button>
          </form>
        ) : null}
        {showRead ? (
          <article className="border border-line p-4">
            <MarkdownView source={editing && mode !== "read" ? body : loaded.page.body} />
          </article>
        ) : null}
      </div>
      {message ? <p role={message === m.workshopSaved || message === m.workshopMemberAdded ? "status" : "alert"} className="mt-4">{message}</p> : null}
      {conflict ? (
        <div className="mt-4 border border-copper p-4">
          <p>{m.workshopConflict}</p>
          <div className="mt-3 max-h-48 overflow-auto border border-line p-3">
            <MarkdownView source={conflict.body} />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button className="border border-ink px-3 py-2 text-sm" type="button" disabled={pending} onClick={() => void save(title, body, conflict.revision)}>{m.workshopKeepMine}</button>
            <button className="border border-line px-3 py-2 text-sm" type="button" disabled={pending} onClick={() => adopt({ ...loaded, page: { ...loaded.page, ...conflict } })}>{m.workshopTakeTheirs}</button>
          </div>
        </div>
      ) : null}
      <div className="mt-12 grid gap-10 lg:grid-cols-3">
        <section>
          <h2 className="text-xl font-medium">{m.workshopMembers}</h2>
          <ul className="mt-3 space-y-1 text-sm">
            <li>{loaded.page.ownerName}</li>
            {loaded.page.members.map((person) => <li key={person.id}>{person.name}</li>)}
          </ul>
          {loaded.manage ? (
            <form className="mt-4 space-y-2" onSubmit={(event) => { event.preventDefault(); void act({ action: "member", name: member }); }}>
              <label className="block text-sm">
                {m.workshopMemberName}
                <input className="mt-1 w-full border border-line bg-raised px-3 py-2" value={member} required minLength={2} maxLength={80} autoComplete="off" onChange={(event) => setMember(event.target.value)} />
              </label>
              <button className="border border-line px-3 py-2 text-sm" type="submit" disabled={pending} aria-busy={pending}>{m.workshopAddMember}</button>
            </form>
          ) : null}
          {loaded.manage ? (
            <div className="mt-4">
              <button className="border border-line px-3 py-2 text-sm" type="button" disabled={pending} aria-busy={pending} onClick={() => void act({ action: "status", status: loaded.page.status === "published" ? "draft" : "published" })}>
                {loaded.page.status === "published" ? m.workshopUnpublish : m.workshopPublish}
              </button>
            </div>
          ) : null}
        </section>
        <section>
          <h2 className="text-xl font-medium">{m.workshopNotes}</h2>
          <ul className="mt-3 space-y-3 text-sm">
            {loaded.notes.map((item) => (
              <li key={item.id} className="border-s-2 border-line ps-3">
                <p className="text-soft">{item.name}</p>
                <p>{item.body}</p>
              </li>
            ))}
          </ul>
          {canNote ? (
            <form className="mt-4 space-y-2" onSubmit={(event) => { event.preventDefault(); void act({ action: "note", note }); }}>
              <label className="block text-sm">
                <span className="sr-only">{m.workshopNoteAdd}</span>
                <textarea className="min-h-24 w-full border border-line bg-raised px-3 py-2" placeholder={m.workshopNotePlaceholder} value={note} required minLength={2} maxLength={1000} onChange={(event) => setNote(event.target.value)} />
              </label>
              <button className="border border-line px-3 py-2 text-sm" type="submit" disabled={pending} aria-busy={pending}>{m.workshopNoteAdd}</button>
            </form>
          ) : null}
        </section>
        <section>
          <h2 className="text-xl font-medium">{m.workshopHistory}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {loaded.revisions.map((item) => (
              <li key={item.revision} className="flex flex-wrap items-center justify-between gap-3">
                <span>{item.revision}. {item.name}</span>
                {editing ? <button className="underline" type="button" disabled={pending} onClick={() => void act({ action: "restore", revision: item.revision })}>{m.workshopRestore}</button> : null}
              </li>
            ))}
          </ul>
          {loaded.manage ? (
            confirmDelete ? (
              <div className="mt-6 border border-danger p-3">
                <p>{m.workshopDeleteConfirm}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button className="border border-danger px-3 py-2 text-sm text-danger" type="button" disabled={pending} aria-busy={pending} onClick={() => void remove()}>{m.workshopDelete}</button>
                  <button className="border border-line px-3 py-2 text-sm" type="button" disabled={pending} onClick={() => setConfirmDelete(false)}>{m.workshopCancel}</button>
                </div>
              </div>
            ) : (
              <button className="mt-6 border border-danger px-3 py-2 text-sm text-danger" type="button" onClick={() => setConfirmDelete(true)}>
                {m.workshopDelete}
              </button>
            )
          ) : null}
        </section>
      </div>
    </div>
  );
}
