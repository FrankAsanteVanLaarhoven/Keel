"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { UML_TOOLS } from "@/lib/foundry-board";
import {
  EXTENSION_EXAMPLE,
  EXTENSION_STORE,
  compileCommands,
  compileDialogs,
  compileKeys,
  compileMenus,
  compileTools,
  extensionDraftError,
  extensionSurfaceError,
  parseExtensionStore,
  readDiagramPatch,
  type AcceptedPatch,
  type DiagramSnapshot,
  type ExtensionCommand,
  type ExtensionDialog,
  type ExtensionKey,
  type ExtensionKeyItem,
  type ExtensionMenu,
  type ExtensionMenuItem,
  type ExtensionRecord,
  type ExtensionTool,
} from "@/lib/foundry-extensions";

type LoadNote = { tone: "ok" | "error" | "wait"; text: string };
type Loaded = {
  tools: ExtensionTool[];
  commands: { name: string }[];
  menus: ExtensionMenu[];
  keys: ExtensionKey[];
  dialogs: ExtensionDialog[];
  note: LoadNote;
};
type Ask = { title: string; label: string; command: ExtensionCommand };

function pack(note: LoadNote, extra?: Partial<Loaded>): Loaded {
  return { tools: [], commands: [], menus: [], keys: [], dialogs: [], note, ...extra };
}

const EMPTY_LOADED: Loaded = pack({ tone: "wait", text: "" });
const DRAW_AND_SERVICE = [
  "client", "gateway", "auth", "compute", "cache", "database", "queue", "ci", "telemetry",
  "text", "box", "ellipse", "diamond", "cylinder", "cloud", "note",
];

const EMPTY_RECORDS: ExtensionRecord[] = [];
let storeRaw: string | null = null;
let storeItems: ExtensionRecord[] = EMPTY_RECORDS;
const storeListeners = new Set<() => void>();

function readStore(): ExtensionRecord[] {
  const raw = localStorage.getItem(EXTENSION_STORE);
  if (raw === storeRaw) return storeItems;
  storeRaw = raw;
  storeItems = parseExtensionStore(raw);
  return storeItems;
}

function writeRecords(items: ExtensionRecord[]) {
  const raw = JSON.stringify({ items });
  localStorage.setItem(EXTENSION_STORE, raw);
  storeRaw = raw;
  storeItems = items;
  for (const listener of storeListeners) listener();
}

function subscribeRecords(listener: () => void) {
  storeListeners.add(listener);
  const onStorage = () => {
    readStore();
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    storeListeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function useExtensionRecords(): [ExtensionRecord[], (next: ExtensionRecord[]) => void] {
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);
  const stored = useSyncExternalStore(subscribeRecords, readStore, () => EMPTY_RECORDS);
  return [mounted ? stored : EMPTY_RECORDS, writeRecords];
}

function allowedTypes(extra: readonly string[]): Set<string> {
  return new Set<string>([...DRAW_AND_SERVICE, ...UML_TOOLS.map((tool) => tool.type), ...extra]);
}

export function FoundryExtensions({
  open,
  readDiagram,
  applyPatch,
  onTools,
  onCommands,
  onMenus,
  onKeys,
  runExtensionRef,
}: {
  open: boolean;
  readDiagram: () => DiagramSnapshot;
  applyPatch: (patch: AcceptedPatch) => void;
  onTools: (tools: ExtensionTool[]) => void;
  onCommands: (commands: ExtensionCommand[]) => void;
  onMenus: (menus: ExtensionMenuItem[]) => void;
  onKeys: (keys: ExtensionKeyItem[]) => void;
  runExtensionRef: { current: (command: ExtensionCommand, answer?: string) => void };
}) {
  const [records, setRecords] = useExtensionRecords();
  const [draftId, setDraftId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [source, setSource] = useState("");
  const [draftNote, setDraftNote] = useState("");
  const [loaded, setLoaded] = useState<Record<string, Loaded>>({});
  const [frameKey, setFrameKey] = useState(0);
  const [running, setRunning] = useState("");
  const [ask, setAsk] = useState<Ask | null>(null);
  const [askValue, setAskValue] = useState("");
  const frameRef = useRef<HTMLIFrameElement>(null);
  const recordsRef = useRef(records);
  const loadedRef = useRef(loaded);
  const onToolsRef = useRef(onTools);
  const onCommandsRef = useRef(onCommands);
  const onMenusRef = useRef(onMenus);
  const onKeysRef = useRef(onKeys);
  const applyPatchRef = useRef(applyPatch);
  const readDiagramRef = useRef(readDiagram);
  const skipRef = useRef<Map<string, string>>(new Map());
  const timers = useRef<Map<string, number>>(new Map());
  const waiters = useRef<Map<string, (result: { patch?: unknown; error?: string }) => void>>(new Map());
  const frameReady = useRef(false);
  const onMessageRef = useRef<(event: MessageEvent) => void>(() => {});

  useEffect(() => {
    recordsRef.current = records;
    loadedRef.current = loaded;
    onToolsRef.current = onTools;
    onCommandsRef.current = onCommands;
    onMenusRef.current = onMenus;
    onKeysRef.current = onKeys;
    applyPatchRef.current = applyPatch;
    readDiagramRef.current = readDiagram;
    runExtensionRef.current = runCommand;
  });

  function publish(nextRecords: ExtensionRecord[], nextLoaded: Record<string, Loaded>) {
    const seen = new Set<string>();
    const tools: ExtensionTool[] = [];
    for (const record of nextRecords) {
      if (!record.enabled) continue;
      for (const tool of nextLoaded[record.id]?.tools ?? []) {
        if (seen.has(tool.id)) continue;
        seen.add(tool.id);
        tools.push(tool);
      }
    }
    onToolsRef.current(tools);
    const commands: ExtensionCommand[] = [];
    for (const record of nextRecords) {
      if (!record.enabled) continue;
      (nextLoaded[record.id]?.commands ?? []).forEach((command, index) => {
        commands.push({ extensionId: record.id, index, name: command.name });
      });
    }
    onCommandsRef.current(commands);
    const menus: ExtensionMenuItem[] = [];
    const keys: ExtensionKeyItem[] = [];
    for (const record of nextRecords) {
      if (!record.enabled) continue;
      const item = nextLoaded[record.id];
      const named = (item?.commands ?? []).map((command, index) => ({ extensionId: record.id, index, name: command.name }));
      for (const menu of item?.menus ?? []) {
        const command = named.find((entry) => entry.name === menu.command);
        if (command) menus.push({ name: menu.name, command });
      }
      for (const key of item?.keys ?? []) {
        const command = named.find((entry) => entry.name === key.command);
        if (command) keys.push({ chord: key.chord, command });
      }
    }
    onMenusRef.current(menus);
    onKeysRef.current(keys);
  }

  function remember(next: Record<string, Loaded>) {
    loadedRef.current = next;
    setLoaded(next);
    publish(recordsRef.current, next);
  }

  function clearTimer(id: string) {
    const timer = timers.current.get(id);
    if (timer) window.clearTimeout(timer);
    timers.current.delete(id);
  }

  function sendLoads() {
    const frame = frameRef.current?.contentWindow;
    if (!frame || !frameReady.current) return;
    const active = recordsRef.current.filter((record) => record.enabled);
    let next = { ...loadedRef.current };
    for (const record of active) {
      if (skipRef.current.get(record.id) === record.source) {
        next = {
          ...next,
          [record.id]: pack({ tone: "error", text: "The script did not finish. Look for a loop, then save again." }),
        };
        continue;
      }
      clearTimer(record.id);
      const extensionId = record.id;
      const script = record.source;
      timers.current.set(extensionId, window.setTimeout(() => {
        skipRef.current.set(extensionId, script);
        frameReady.current = false;
        setFrameKey((key) => key + 1);
        remember({
          ...loadedRef.current,
          [extensionId]: pack({ tone: "error", text: "The script did not finish. Look for a loop, then save again." }),
        });
      }, 1500));
      frame.postMessage({ source: "keel-host", type: "load", extensionId, script }, "*");
    }
    const enabled = new Set(active.map((record) => record.id));
    for (const id of Object.keys(next)) {
      if (!enabled.has(id)) next = { ...next, [id]: EMPTY_LOADED };
    }
    remember(next);
  }

  useEffect(() => {
    onMessageRef.current = (event: MessageEvent) => {
    if (event.origin !== "null") return;
    if (event.source !== frameRef.current?.contentWindow) return;
    const data = event.data as {
      source?: string;
      type?: string;
      extensionId?: string;
      requestId?: string;
      tools?: unknown;
      commands?: unknown;
      menus?: unknown;
      keys?: unknown;
      dialogs?: unknown;
      message?: string;
      patch?: unknown;
      error?: string;
    } | null;
    if (!data || data.source !== "keel-extension") return;
    if (data.type === "ready") {
      frameReady.current = true;
      sendLoads();
      return;
    }
    if (data.type === "loaded" || data.type === "failed") {
      const id = data.extensionId ?? "";
      clearTimer(id);
      const record = recordsRef.current.find((item) => item.id === id);
      if (!record) return;
      let nextLoaded: Loaded;
      if (data.type === "failed") {
        nextLoaded = pack({ tone: "error", text: `${data.message || "The script stopped."} Fix it and save again.` });
      } else {
        const taken = new Set<string>();
        for (const item of recordsRef.current) {
          if (item.id === id || !item.enabled) continue;
          for (const tool of loadedRef.current[item.id]?.tools ?? []) taken.add(tool.id);
        }
        const tools = compileTools(data.tools, taken);
        const commands = compileCommands(data.commands);
        const menus = compileMenus(data.menus);
        const keys = compileKeys(data.keys);
        const dialogs = compileDialogs(data.dialogs);
        const surface = extensionSurfaceError(commands.commands, menus.menus, keys.keys, dialogs.dialogs);
        const problem = tools.error || commands.error || menus.error || keys.error || dialogs.error || surface;
        if (problem) {
          nextLoaded = pack({ tone: "error", text: problem });
        } else if (tools.tools.length === 0 && commands.commands.length === 0) {
          nextLoaded = pack({ tone: "error", text: "Add a keel.tool or a keel.command, then save again." });
        } else {
          const count = tools.tools.length + commands.commands.length + menus.menus.length + keys.keys.length + dialogs.dialogs.length;
          nextLoaded = pack(
            { tone: "ok", text: `${record.name} added ${count} ${count === 1 ? "change" : "changes"} to the desk.` },
            { tools: tools.tools, commands: commands.commands, menus: menus.menus, keys: keys.keys, dialogs: dialogs.dialogs },
          );
        }
      }
      remember({ ...loadedRef.current, [id]: nextLoaded });
      return;
    }
    if (data.type === "result" && data.requestId) {
      const waiter = waiters.current.get(data.requestId);
      waiters.current.delete(data.requestId);
      waiter?.({ patch: data.patch, error: data.error });
    }
    };
  });

  useEffect(() => {
    const onMessage = (event: MessageEvent) => onMessageRef.current(event);
    const pending = timers.current;
    window.addEventListener("message", onMessage);
    frameReady.current = false;
    frameRef.current?.contentWindow?.postMessage({ source: "keel-host", type: "hello" }, "*");
    return () => {
      window.removeEventListener("message", onMessage);
      for (const timer of pending.values()) window.clearTimeout(timer);
      pending.clear();
    };
  }, [frameKey]);

  useEffect(() => {
    frameRef.current?.contentWindow?.postMessage({ source: "keel-host", type: "hello" }, "*");
  }, [records, frameKey]);

  function saveDraft() {
    const problem = extensionDraftError(name, source, records.length, draftId !== null);
    if (problem) {
      setDraftNote(problem);
      return;
    }
    const cleanName = name.trim().slice(0, 40);
    const cleanSource = source.slice(0, 20_000);
    const id = draftId ?? `ext-${crypto.randomUUID().slice(0, 8)}`;
    skipRef.current.delete(id);
    const next = draftId
      ? records.map((record) => record.id === draftId ? { ...record, name: cleanName, source: cleanSource, enabled: true } : record)
      : [...records, { id, name: cleanName, source: cleanSource, enabled: true }];
    setRecords(next);
    setDraftId(id);
    setDraftNote("");
    remember({ ...loadedRef.current, [id]: pack({ tone: "wait", text: "Reading the script…" }) });
  }

  function runCommand(command: ExtensionCommand, answer?: string) {
    const frame = frameRef.current?.contentWindow;
    if (!frame || running) return;
    const requestId = crypto.randomUUID();
    const diagram = readDiagramRef.current();
    if (answer !== undefined) diagram.answer = answer.slice(0, 200);
    const nodeIds = new Set(diagram.nodes.map((node) => node.id));
    const connectionIds = new Set(diagram.connections.map((link) => link.id));
    const extra = loadedRef.current[command.extensionId]?.tools.map((tool) => tool.id) ?? [];
    setRunning(requestId);
    const timer = window.setTimeout(() => {
      if (!waiters.current.has(requestId)) return;
      waiters.current.delete(requestId);
      setRunning("");
      const current = loadedRef.current[command.extensionId] ?? EMPTY_LOADED;
      remember({
        ...loadedRef.current,
        [command.extensionId]: { ...current, note: { tone: "error", text: "The command did not finish. Look for a loop, then save again." } },
      });
    }, 1500);
    waiters.current.set(requestId, (result) => {
      window.clearTimeout(timer);
      setRunning("");
      const current = loadedRef.current[command.extensionId] ?? EMPTY_LOADED;
      if (result.error) {
        remember({
          ...loadedRef.current,
          [command.extensionId]: { ...current, note: { tone: "error", text: `${result.error} Change the script and save again.` } },
        });
        return;
      }
      const read = readDiagramPatch(result.patch, allowedTypes(extra), nodeIds, connectionIds);
      if ("error" in read) {
        remember({ ...loadedRef.current, [command.extensionId]: { ...current, note: { tone: "error", text: read.error } } });
        return;
      }
      applyPatchRef.current(read);
      remember({ ...loadedRef.current, [command.extensionId]: { ...loadedRef.current[command.extensionId], note: { tone: "ok", text: read.summary } } });
    });
    frame.postMessage({
      source: "keel-host",
      type: "run",
      requestId,
      extensionId: command.extensionId,
      index: command.index,
      diagram,
    }, "*");
  }

  const commands: ExtensionCommand[] = records.flatMap((record) => {
    if (!record.enabled) return [];
    return (loaded[record.id]?.commands ?? []).map((command, index) => ({
      extensionId: record.id,
      index,
      name: command.name,
    }));
  });
  const menus: ExtensionMenuItem[] = records.flatMap((record) => {
    if (!record.enabled) return [];
    const named = commands.filter((command) => command.extensionId === record.id);
    return (loaded[record.id]?.menus ?? []).flatMap((menu) => {
      const command = named.find((entry) => entry.name === menu.command);
      return command ? [{ name: menu.name, command }] : [];
    });
  });
  const dialogs: { title: string; label: string; command: ExtensionCommand }[] = records.flatMap((record) => {
    if (!record.enabled) return [];
    const named = commands.filter((command) => command.extensionId === record.id);
    return (loaded[record.id]?.dialogs ?? []).flatMap((dialog) => {
      const command = named.find((entry) => entry.name === dialog.command);
      return command ? [{ title: dialog.title, label: dialog.label, command }] : [];
    });
  });

  return (
    <>
      <iframe
        key={frameKey}
        ref={frameRef}
        title="Extension runner"
        sandbox="allow-scripts"
        src="/foundry-extension-frame"
        referrerPolicy="no-referrer"
        tabIndex={-1}
        aria-hidden="true"
        className="foundry-print-hide pointer-events-none absolute h-px w-px overflow-hidden border-0 opacity-0"
        onLoad={() => {
          frameReady.current = false;
          frameRef.current?.contentWindow?.postMessage({ source: "keel-host", type: "hello" }, "*");
        }}
      />
      <section className={`foundry-print-hide shrink-0 overflow-auto rounded-xl border border-line bg-raised px-3 py-2 ${open ? "max-h-40 md:max-h-52" : "hidden"}`} aria-label="Extensions" data-foundry-extensions="">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-ink">Extensions</h2>
          <button
            type="button"
            className="min-h-11 rounded-lg border border-line bg-paper px-2.5 py-1.5 text-xs font-semibold text-ink hover:border-copper"
            onClick={() => {
              setDraftId(null);
              setName("");
              setSource("");
              setDraftNote("");
            }}
          >
            New extension
          </button>
        </div>
        <p className="mt-1 text-xs text-soft">A script can add shapes, commands, a menu, a key, and a dialog. It runs in its own frame and can change the open diagram. It is not loaded from the web.</p>
        {records.length > 0 ? (
          <ul className="mt-2 flex flex-col gap-1">
            {records.map((record) => {
              const note = loaded[record.id]?.note;
              return (
                <li key={record.id} className="flex flex-wrap items-center gap-2">
                  <label className="flex min-h-11 items-center gap-2 text-xs font-semibold text-ink">
                    <input
                      type="checkbox"
                      checked={record.enabled}
                      aria-label={`Turn on ${record.name}`}
                      onChange={(event) => {
                        const enabled = event.target.checked;
                        if (enabled) skipRef.current.delete(record.id);
                        const next = records.map((item) => item.id === record.id ? { ...item, enabled } : item);
                        setRecords(next);
                        recordsRef.current = next;
                        if (!enabled) {
                          remember({ ...loadedRef.current, [record.id]: EMPTY_LOADED });
                          return;
                        }
                        remember({ ...loadedRef.current, [record.id]: pack({ tone: "wait", text: "Reading the script…" }) });
                      }}
                    />
                    {record.name}
                  </label>
                  <button type="button" className="min-h-11 rounded-lg border border-line bg-paper px-2.5 text-xs font-semibold text-ink" onClick={() => { setDraftId(record.id); setName(record.name); setSource(record.source); setDraftNote(""); }}>Edit</button>
                  <button
                    type="button"
                    className="min-h-11 rounded-lg border border-line bg-paper px-2.5 text-xs font-semibold text-ink hover:border-danger hover:text-danger"
                    aria-label={`Delete ${record.name}`}
                    onClick={() => {
                      const next = records.filter((item) => item.id !== record.id);
                      setRecords(next);
                      recordsRef.current = next;
                      if (draftId === record.id) {
                        setDraftId(null);
                        setName("");
                        setSource("");
                      }
                      const following = { ...loadedRef.current };
                      delete following[record.id];
                      remember(following);
                    }}
                  >
                    Delete
                  </button>
                  {note?.text ? <p role={note.tone === "error" ? "alert" : "status"} className={`text-xs ${note.tone === "error" ? "text-danger" : "text-soft"}`}>{note.text}</p> : null}
                </li>
              );
            })}
          </ul>
        ) : null}
        {commands.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-1" aria-label="Extension commands">
            {commands.map((command) => (
              <button
                key={`${command.extensionId}-${command.index}`}
                type="button"
                disabled={running !== ""}
                aria-busy={running !== ""}
                className="min-h-11 rounded-lg border border-line bg-paper px-2.5 text-xs font-semibold text-ink hover:border-copper disabled:opacity-40"
                onClick={() => runCommand(command)}
              >
                {command.name}
              </button>
            ))}
          </div>
        ) : null}
        {menus.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-1" role="menu" aria-label="Extension menu">
            {menus.map((menu) => (
              <button
                key={`${menu.command.extensionId}-${menu.name}`}
                type="button"
                role="menuitem"
                disabled={running !== ""}
                className="min-h-11 rounded-lg border border-line bg-paper px-2.5 text-xs font-semibold text-ink hover:border-copper disabled:opacity-40"
                onClick={() => runCommand(menu.command)}
              >
                {menu.name}
              </button>
            ))}
          </div>
        ) : null}
        {dialogs.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-1" aria-label="Extension dialogs">
            {dialogs.map((dialog) => (
              <button
                key={`${dialog.command.extensionId}-${dialog.title}`}
                type="button"
                disabled={running !== ""}
                className="min-h-11 rounded-lg border border-line bg-paper px-2.5 text-xs font-semibold text-ink hover:border-copper disabled:opacity-40"
                onClick={() => {
                  setAsk(dialog);
                  setAskValue("");
                }}
              >
                {dialog.title}
              </button>
            ))}
          </div>
        ) : null}
        {ask ? (
          <form
            className="mt-2 grid gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              const command = ask.command;
              const value = askValue;
              setAsk(null);
              setAskValue("");
              runCommand(command, value);
            }}
          >
            <p className="text-xs font-semibold text-ink">{ask.title}</p>
            <label className="text-xs font-semibold text-ink" htmlFor="extension-answer">{ask.label}</label>
            <input id="extension-answer" value={askValue} onChange={(event) => setAskValue(event.target.value)} className="min-h-11 rounded-lg border border-line bg-paper px-2 text-xs font-semibold text-ink" />
            <div className="flex flex-wrap gap-2">
              <button type="submit" className="min-h-11 rounded-lg border border-copper bg-copper px-2.5 text-xs font-semibold text-raised">Apply</button>
              <button type="button" className="min-h-11 rounded-lg border border-line bg-paper px-2.5 text-xs font-semibold text-ink" onClick={() => setAsk(null)}>Cancel</button>
            </div>
          </form>
        ) : null}
        <div className="mt-2 grid gap-2">
          <label className="text-xs font-semibold text-ink" htmlFor="extension-name">Name</label>
          <input id="extension-name" value={name} onChange={(event) => setName(event.target.value)} className="min-h-11 rounded-lg border border-line bg-paper px-2 text-xs font-semibold text-ink" />
          <label className="text-xs font-semibold text-ink" htmlFor="extension-script">Script</label>
          <textarea id="extension-script" value={source} onChange={(event) => setSource(event.target.value)} spellCheck={false} rows={8} className="w-full rounded-lg border border-line bg-paper px-2 py-1.5 font-mono text-xs text-ink" />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="min-h-11 rounded-lg border border-line bg-paper px-2.5 text-xs font-semibold text-ink hover:border-copper"
              onClick={() => {
                setSource(EXTENSION_EXAMPLE);
                setName((current) => current.trim() || "Stamp notes");
                setDraftNote("");
              }}
            >
              Insert example
            </button>
            <button type="button" className="min-h-11 rounded-lg border border-copper bg-copper px-2.5 text-xs font-semibold text-raised" onClick={saveDraft}>Save extension</button>
          </div>
          {draftNote ? <p role="alert" className="text-xs text-danger">{draftNote}</p> : null}
          <details className="text-xs text-soft">
            <summary className="min-h-11 cursor-pointer font-semibold text-ink">How a script talks to the desk</summary>
            <p className="mt-1">Call keel.tool with an id such as x-stamp, a name, languages such as uml or *, and a glyph such as class, art, action, or actor. Call keel.command with a name and a function. The function receives the diagram and returns updateNodes, addNodes, deleteNodes, addConnections, or deleteConnections. keel.menu and keel.dialog name that command. keel.key uses a chord such as alt+s. A dialog puts the typed text on diagram.answer.</p>
          </details>
        </div>
      </section>
    </>
  );
}
