"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import {
  cscWeeks,
  decomposeOrders,
  freshStudents,
  harborNotes,
  hashJoinPlan,
  innerLoans,
  junctionReady,
  leftLoans,
  matchTriples,
  orderLines,
  patrons,
  projectNames,
  quorumRead,
  retrieve,
  runSql,
  seekPath,
  selectClass,
  tiers,
  transfer,
  weekById,
  type Cell,
  type SqlTable,
  type WeekId,
} from "@/lib/csc1033";

const STORE = "keel.csc1033.v1";

type Saved = { passed: WeekId[]; tasks: string[] };

function emptySaved(): Saved {
  return { passed: [], tasks: [] };
}

function readSaved(): Saved {
  try {
    const raw = localStorage.getItem(STORE);
    if (!raw) return emptySaved();
    const parsed = JSON.parse(raw) as Partial<Saved>;
    const passed = Array.isArray(parsed.passed) ? parsed.passed.filter((id): id is WeekId => cscWeeks.some((week) => week.id === id)) : [];
    const tasks = Array.isArray(parsed.tasks) ? parsed.tasks.filter((id): id is string => typeof id === "string") : [];
    return { passed, tasks };
  } catch {
    return emptySaved();
  }
}

function writeSaved(saved: Saved) {
  localStorage.setItem(STORE, JSON.stringify(saved));
  window.dispatchEvent(new Event("keel-csc"));
}

function useCscSaved(): [Saved, (next: Saved) => void] {
  const mounted = useSyncExternalStore(
    (listener) => {
      window.addEventListener("keel-csc", listener);
      return () => window.removeEventListener("keel-csc", listener);
    },
    () => true,
    () => false,
  );
  const [override, setOverride] = useState<Saved | null>(null);
  const saved = override ?? (mounted ? readSaved() : emptySaved());
  return [saved, (next) => { writeSaved(next); setOverride(next); }];
}

export function CscListen({ weekId }: { weekId: WeekId }) {
  const week = weekById(weekId);
  const [note, setNote] = useState("");
  if (!week) return null;
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        className="rounded-full border border-line px-3 py-1.5 text-sm"
        onClick={() => {
          if (typeof window.speechSynthesis === "undefined") {
            setNote("This browser has no speech engine. The narration is written below.");
            return;
          }
          window.speechSynthesis.cancel();
          const utter = new SpeechSynthesisUtterance(week.narration);
          utter.lang = "en-GB";
          window.speechSynthesis.speak(utter);
          setNote("Playing the week narration.");
        }}
      >
        Listen to week {week.no} narration
      </button>
      {note ? <p className="text-sm text-soft">{note}</p> : null}
    </div>
  );
}

export function CscLadder() {
  const [saved] = useCscSaved();
  return (
    <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {tiers.map((tier) => {
        const proven = tier.weeks.every((id) => saved.passed.includes(id));
        return (
          <li key={tier.no} className="rounded-lg border border-line p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-soft">Tier {tier.no}</p>
            <p className="mt-1 font-medium">{tier.name}</p>
            <p className={`mt-3 text-sm ${proven ? "text-good" : "text-soft"}`}>{proven ? "Proven on this browser" : "Open the weeks and pass the check"}</p>
          </li>
        );
      })}
    </ol>
  );
}

function Grid({ columns, rows }: { columns: string[]; rows: Cell[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="mt-3 w-full min-w-[32rem] border-collapse text-sm">
        <caption className="sr-only">Result</caption>
        <thead>
          <tr className="border-b border-line text-left text-soft">
            {columns.map((column) => <th key={column} className="py-2 pe-4 font-medium">{column}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-b border-line">
              {row.map((cell, cellIndex) => <td key={cellIndex} className="py-2 pe-4">{cell === null ? "NULL" : String(cell)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CscWeekLab({ weekId, part = "all" }: { weekId: WeekId; part?: "all" | "tasks" | "lab" }) {
  const week = weekById(weekId);
  const [saved, setSaved] = useCscSaved();
  const [picked, setPicked] = useState<number | null>(null);
  const [sql, setSql] = useState("SELECT * FROM Students WHERE Class = '10A'");
  const [tables, setTables] = useState<SqlTable[]>(() => freshStudents());
  const [sqlNote, setSqlNote] = useState("");
  const [sqlColumns, setSqlColumns] = useState<string[]>([]);
  const [sqlRows, setSqlRows] = useState<Cell[][]>([]);
  const [algebra, setAlgebra] = useState<string>("");
  const [algebraRows, setAlgebraRows] = useState<Cell[][]>([]);
  const [algebraCols, setAlgebraCols] = useState<string[]>([]);
  const [joinRows, setJoinRows] = useState<Cell[][]>([]);
  const [joinCols, setJoinCols] = useState<string[]>([]);
  const [plan, setPlan] = useState<string[]>([]);
  const [split, setSplit] = useState(false);
  const [key, setKey] = useState("72");
  const [hops, setHops] = useState<string[]>([]);
  const [seekNote, setSeekNote] = useState("");
  const [crash, setCrash] = useState(false);
  const [balances, setBalances] = useState({ a: 1000, b: 250 });
  const [acidNote, setAcidNote] = useState("");
  const [query, setQuery] = useState("borrow books");
  const [hits, setHits] = useState<string[]>([]);
  const [pattern, setPattern] = useState({ s: "*", p: "copyOf", o: "work:ledger" });
  const [triples, setTriples] = useState<string[]>([]);
  const [up, setUp] = useState(3);
  const [quorumNote, setQuorumNote] = useState("");
  const [junction, setJunction] = useState("");
  const [studentFk, setStudentFk] = useState(false);
  const [bookFk, setBookFk] = useState(false);
  const [junctionNote, setJunctionNote] = useState("");
  const [rule, setRule] = useState("");
  const [ruleNote, setRuleNote] = useState("");
  const [view, setView] = useState<"table" | "json" | "bytes">("table");

  if (!week) return null;

  function toggleTask(task: string) {
    const id = `${weekId}:${task}`;
    const tasks = saved.tasks.includes(id) ? saved.tasks.filter((item) => item !== id) : [...saved.tasks, id];
    const next = { ...saved, tasks };
    setSaved(next);
  }

  function pass() {
    if (saved.passed.includes(weekId)) return;
    setSaved({ ...saved, passed: [...saved.passed, weekId] });
  }

  const payload = [
    { StudentID: 101, Name: "Alex Mercer", Age: 21, Enrolled: true },
    { StudentID: 102, Name: "Elena Rostova", Age: 24, Enrolled: true },
  ];
  const json = JSON.stringify(payload, null, 2);
  const bytes = Array.from(new TextEncoder().encode(json)).slice(0, 48).map((byte) => byte.toString(16).padStart(2, "0")).join(" ");

  return (
    <div className="mt-10 space-y-10">
      {part !== "lab" ? <section className="border-t border-line pt-8">
        <h2 className="text-2xl font-medium">Weekly activities</h2>
        <ul className="mt-4 max-w-3xl space-y-3">
          {week.prelecture.map((task) => {
            const id = `${week.id}:${task}`;
            return (
              <li key={task}>
                <label className="flex items-start gap-3 leading-7">
                  <input className="mt-1" type="checkbox" checked={saved.tasks.includes(id)} onChange={() => toggleTask(task)} />
                  <span>{task}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </section> : null}

      {part !== "tasks" ? <><section className="border-t border-line pt-8">
        <h2 className="text-2xl font-medium">{week.capstoneTitle}</h2>
        <p className="mt-3 max-w-3xl leading-8">{week.capstone}</p>
        <p className="mt-3">
          <Link className="text-sm underline decoration-line underline-offset-4" href={week.foundry}>Open this on the Foundry canvas</Link>
        </p>

        {week.studio === "inspect" ? (
          <div className="mt-4">
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Payload view">
              {(["table", "json", "bytes"] as const).map((item) => (
                <button key={item} type="button" role="tab" aria-selected={view === item} onClick={() => setView(item)} className={`rounded-full border px-3 py-1.5 text-sm ${view === item ? "border-copper bg-copper text-raised" : "border-line"}`}>
                  {item === "table" ? "Structured table" : item === "json" ? "JSON document" : "Raw bytes"}
                </button>
              ))}
            </div>
            {view === "table" ? <Grid columns={["StudentID", "Name", "Age", "Enrolled"]} rows={payload.map((row) => [row.StudentID, row.Name, row.Age, row.Enrolled ? "TRUE" : "FALSE"])} /> : null}
            {view === "json" ? <pre className="mt-4 overflow-x-auto rounded-lg border border-line bg-raised p-4 text-sm">{json}</pre> : null}
            {view === "bytes" ? <p className="mt-4 break-all rounded-lg border border-line bg-raised p-4 font-mono text-sm">{bytes}</p> : null}
          </div>
        ) : null}

        {week.studio === "erd" ? (
          <div className="mt-4 space-y-4">
            <div className="grid gap-4 lg:grid-cols-3">
              <article className="rounded-lg border border-line p-4">
                <h3 className="border-b border-line pb-2 font-medium">Students (entity)</h3>
                <p className="mt-3 text-sm">StudentID · PK</p>
                <p className="text-sm">Name</p>
              </article>
              <article className="rounded-lg border border-copper p-4">
                <h3 className="border-b border-line pb-2 font-medium">Loans (junction)</h3>
                <p className="mt-3 text-sm">LoanID · PK</p>
                <p className="text-sm">StudentID · FK</p>
                <p className="text-sm">BookID · FK</p>
              </article>
              <article className="rounded-lg border border-line p-4">
                <h3 className="border-b border-line pb-2 font-medium">Books (entity)</h3>
                <p className="mt-3 text-sm">BookID · PK</p>
                <p className="text-sm">Title</p>
              </article>
            </div>
            <fieldset className="max-w-xl space-y-2">
              <legend className="text-sm font-medium">Which table is the junction?</legend>
              {["Students", "Loans", "Books"].map((name) => (
                <label key={name} className="flex items-center gap-2 text-sm">
                  <input type="radio" name="junction" checked={junction === name} onChange={() => setJunction(name)} />
                  {name}
                </label>
              ))}
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={studentFk} onChange={(event) => setStudentFk(event.target.checked)} /> StudentID in Loans points at Students</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={bookFk} onChange={(event) => setBookFk(event.target.checked)} /> BookID in Loans points at Books</label>
              <button
                type="button"
                className="rounded border border-line px-3 py-1.5 text-sm"
                onClick={() => {
                  const ready = junctionReady({ junction, studentFk, bookFk });
                  setJunctionNote(ready ? "The junction holds one loan row and both foreign keys." : "Loans is the bridge. Both foreign keys have to be marked.");
                  if (ready) pass();
                }}
              >
                Check the junction
              </button>
              {junctionNote ? <p className="text-sm">{junctionNote}</p> : null}
            </fieldset>
          </div>
        ) : null}

        {week.studio === "algebra" ? (
          <div className="mt-4 space-y-3">
            <div className="flex flex-wrap gap-2">
              <button type="button" className="rounded-full border border-line px-3 py-1.5 text-sm" onClick={() => { const rows = selectClass(patrons, "10A"); setAlgebraCols(["StudentID", "Name", "Class"]); setAlgebraRows(rows.map((row) => [row.StudentID, row.Name, row.Class])); setAlgebra("Selection keeps the 10A patrons."); }}>Selection σ Class = 10A</button>
              <button type="button" className="rounded-full border border-line px-3 py-1.5 text-sm" onClick={() => { const rows = projectNames(patrons); setAlgebraCols(["StudentID", "Name"]); setAlgebraRows(rows.map((row) => [row.StudentID, row.Name])); setAlgebra("Projection keeps StudentID and Name."); }}>Projection π StudentID, Name</button>
            </div>
            {algebra ? <p className="text-sm">{algebra}</p> : null}
            {algebraCols.length ? <Grid columns={algebraCols} rows={algebraRows} /> : null}
          </div>
        ) : null}

        {week.studio === "sql" ? (
          <form className="mt-4 space-y-3" onSubmit={(event) => {
            event.preventDefault();
            const result = runSql(sql, tables);
            setSqlNote(result.message);
            setSqlColumns(result.columns);
            setSqlRows(result.rows);
            if (result.ok) setTables(result.tables);
          }}>
            <label htmlFor="csc-sql" className="text-sm font-medium">Statement</label>
            <textarea id="csc-sql" value={sql} onChange={(event) => setSql(event.target.value)} rows={3} className="mt-1 w-full rounded-lg border border-line bg-paper p-3 font-mono text-sm" />
            <button type="submit" className="rounded border border-copper bg-copper px-3 py-1.5 text-sm text-raised">Execute</button>
            {sqlNote ? <p className="text-sm">{sqlNote}</p> : null}
            {sqlColumns.length ? <Grid columns={sqlColumns} rows={sqlRows} /> : null}
          </form>
        ) : null}

        {week.studio === "join" ? (
          <div className="mt-4 space-y-3">
            <div className="flex flex-wrap gap-2">
              <button type="button" className="rounded-full border border-line px-3 py-1.5 text-sm" onClick={() => { const rows = innerLoans(); setJoinCols(["Name", "LoanID", "BookID"]); setJoinRows(rows.map((row) => [row.Name, row.LoanID, row.BookID])); setPlan([]); }}>Students ⋈ Loans (inner)</button>
              <button type="button" className="rounded-full border border-line px-3 py-1.5 text-sm" onClick={() => { const rows = leftLoans(); setJoinCols(["Name", "LoanID", "BookID"]); setJoinRows(rows.map((row) => [row.Name, row.LoanID, row.BookID])); setPlan([]); }}>Students ⟕ Loans (left)</button>
              <button type="button" className="rounded-full border border-line px-3 py-1.5 text-sm" onClick={() => setPlan(hashJoinPlan())}>Hash join plan</button>
            </div>
            {joinCols.length ? <Grid columns={joinCols} rows={joinRows} /> : null}
            {plan.length ? <ol className="list-decimal space-y-1 ps-5 text-sm">{plan.map((step) => <li key={step}>{step}</li>)}</ol> : null}
          </div>
        ) : null}

        {week.studio === "norm" ? (
          <div className="mt-4 space-y-3">
            <Grid columns={["orderId", "customer", "city", "sku"]} rows={orderLines.map((line) => [line.orderId, line.customer, line.city, line.sku])} />
            <button type="button" className="rounded border border-line px-3 py-1.5 text-sm" onClick={() => setSplit(true)}>Decompose to 3NF</button>
            {split ? (
              <div className="grid gap-4 lg:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium">Customer</h3>
                  <Grid columns={["customer", "city"]} rows={decomposeOrders(orderLines).customers.map((row) => [row.customer, row.city])} />
                </div>
                <div>
                  <h3 className="text-sm font-medium">Order line</h3>
                  <Grid columns={["orderId", "customer", "sku"]} rows={decomposeOrders(orderLines).orders.map((row) => [row.orderId, row.customer, row.sku])} />
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        {week.studio === "btree" ? (
          <form className="mt-4 space-y-3" onSubmit={(event) => {
            event.preventDefault();
            const value = Number(key);
            if (!Number.isFinite(value)) { setSeekNote("Enter a whole number key."); setHops([]); return; }
            const path = seekPath(value);
            setHops(path.hops);
            setSeekNote(`${path.seeks} page reads on this sketch. A scan of ${path.scans.toLocaleString("en-GB")} rows would read every row.`);
          }}>
            <label htmlFor="btree-key" className="text-sm font-medium">Key</label>
            <input id="btree-key" value={key} onChange={(event) => setKey(event.target.value)} className="ms-3 w-24 rounded border border-line bg-paper px-2 py-1 text-sm" />
            <button type="submit" className="ms-3 rounded border border-line px-3 py-1.5 text-sm">Seek</button>
            {hops.length ? <ol className="list-decimal ps-5 text-sm">{hops.map((hop) => <li key={hop}>{hop}</li>)}</ol> : null}
            {seekNote ? <p className="text-sm">{seekNote}</p> : null}
          </form>
        ) : null}

        {week.studio === "acid" ? (
          <div className="mt-4 space-y-3">
            <div className="grid gap-4 sm:grid-cols-2">
              <p className="rounded-lg border border-line p-4">Account A <span className="mt-2 block text-2xl">£{balances.a}</span></p>
              <p className="rounded-lg border border-line p-4">Account B <span className="mt-2 block text-2xl">£{balances.b}</span></p>
            </div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={crash} onChange={(event) => setCrash(event.target.checked)} /> Simulate a crash during the transfer</label>
            <button type="button" className="rounded border border-copper bg-copper px-3 py-1.5 text-sm text-raised" onClick={() => {
              const result = transfer(balances.a, balances.b, 200, crash);
              setBalances({ a: result.a, b: result.b });
              setAcidNote(result.note);
            }}>Execute transfer (£200)</button>
            {acidNote ? <p className="text-sm">{acidNote}</p> : null}
          </div>
        ) : null}

        {week.studio === "ir" ? (
          <form className="mt-4 space-y-3" onSubmit={(event) => { event.preventDefault(); setHits(retrieve(query).map((note) => `${note.id} ${note.title}`)); }}>
            <label htmlFor="ir-query" className="text-sm font-medium">Query</label>
            <input id="ir-query" value={query} onChange={(event) => setQuery(event.target.value)} className="ms-3 w-64 max-w-full rounded border border-line bg-paper px-2 py-1 text-sm" />
            <button type="submit" className="ms-3 rounded border border-line px-3 py-1.5 text-sm">Search</button>
            <ul className="text-sm">{harborNotes.map((note) => <li key={note.id}>{note.id} · {note.title}</li>)}</ul>
            <p className="text-sm">{hits.length ? `Matches: ${hits.join(", ")}` : "No match yet."}</p>
          </form>
        ) : null}

        {week.studio === "rdf" ? (
          <form className="mt-4 space-y-3" onSubmit={(event) => {
            event.preventDefault();
            const found = matchTriples(pattern);
            setTriples(found.map((triple) => `${triple.s} ${triple.p} ${triple.o}`));
          }}>
            <div className="flex flex-wrap gap-2">
              <label className="text-sm">Subject <input aria-label="Subject" value={pattern.s} onChange={(event) => setPattern({ ...pattern, s: event.target.value })} className="ms-2 rounded border border-line bg-paper px-2 py-1" /></label>
              <label className="text-sm">Predicate <input aria-label="Predicate" value={pattern.p} onChange={(event) => setPattern({ ...pattern, p: event.target.value })} className="ms-2 rounded border border-line bg-paper px-2 py-1" /></label>
              <label className="text-sm">Object <input aria-label="Object" value={pattern.o} onChange={(event) => setPattern({ ...pattern, o: event.target.value })} className="ms-2 rounded border border-line bg-paper px-2 py-1" /></label>
            </div>
            <button type="submit" className="rounded border border-line px-3 py-1.5 text-sm">Match</button>
            <ul className="text-sm">{triples.map((triple) => <li key={triple}>{triple}</li>)}</ul>
          </form>
        ) : null}

        {week.studio === "quorum" ? (
          <form className="mt-4 space-y-3" onSubmit={(event) => { event.preventDefault(); setQuorumNote(quorumRead(up).note); }}>
            <label htmlFor="nodes-up" className="text-sm font-medium">Copies answering</label>
            <input id="nodes-up" type="number" min={0} max={3} value={up} onChange={(event) => setUp(Number(event.target.value))} className="ms-3 w-16 rounded border border-line bg-paper px-2 py-1 text-sm" />
            <button type="submit" className="ms-3 rounded border border-line px-3 py-1.5 text-sm">Read</button>
            {quorumNote ? <p className="text-sm">{quorumNote}</p> : null}
          </form>
        ) : null}

        {week.studio === "ethics" ? (
          <fieldset className="mt-4 max-w-3xl space-y-2">
            <legend className="text-sm font-medium">Which rule do you write down before training?</legend>
            {[
              ["tonight", "Train tonight on the live loan export."],
              ["purpose", "State the purpose, and let a patron remove their rows before training."],
              ["shorten", "Shorten the names, then train."],
              ["later", "Train first and decide the purpose if the accuracy looks high."],
            ].map(([id, label]) => (
              <label key={id} className="flex items-start gap-2 text-sm leading-6">
                <input type="radio" name="rule" checked={rule === id} onChange={() => setRule(id)} />
                <span>{label}</span>
              </label>
            ))}
            <button type="button" className="rounded border border-line px-3 py-1.5 text-sm" onClick={() => {
              const ready = rule === "purpose";
              setRuleNote(ready ? "That rule is the one this week records." : "The purpose has to be stated, and a patron has to be able to step out before training.");
              if (ready) pass();
            }}>Record the rule</button>
            {ruleNote ? <p className="text-sm">{ruleNote}</p> : null}
          </fieldset>
        ) : null}
      </section>

      <section className="border-t border-line pt-8">
        <h2 className="text-2xl font-medium">Week {week.no} mastery check</h2>
        <p className="mt-2 text-sm text-soft">A correct answer is recorded on this browser.</p>
        <p className="mt-4 max-w-3xl font-medium">{week.checkPrompt}</p>
        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          {week.checkOptions.map((option, index) => {
            const letter = String.fromCharCode(65 + index);
            const chosen = picked === index;
            return (
              <li key={option}>
                <button
                  type="button"
                  onClick={() => { setPicked(index); if (index === week.checkAnswer) pass(); }}
                  className={`h-full w-full rounded-lg border px-3 py-3 text-left text-sm leading-6 ${chosen ? "border-copper" : "border-line"}`}
                >
                  <span className="me-2 font-medium">{letter}</span>{option}
                </button>
              </li>
            );
          })}
        </ul>
        {picked !== null ? (
          <p className="mt-4 max-w-3xl text-sm leading-6">
            {picked === week.checkAnswer
              ? "Recorded. That answer matches the definition used this week."
              : `The fitting answer is ${String.fromCharCode(65 + week.checkAnswer)}. ${week.checkOptions[week.checkAnswer]}`}
          </p>
        ) : null}
        {saved.passed.includes(week.id) ? <p className="mt-2 text-sm text-good">This week is on your ladder.</p> : null}
      </section></> : null}
    </div>
  );
}
