"use client";

import { useState } from "react";
import type { Messages } from "@/lib/i18n/en";

type ReviewRow = { id: string; assessment: boolean; coverage: number; plagiarism: boolean; similarity: number; match: string };

export function WeekTools({
  weekId,
  files,
  reviews,
  classScope,
  m,
}: {
  weekId: string;
  files: { id: string; name: string; scope: string }[];
  reviews: ReviewRow[];
  classScope?: boolean;
  m: Messages;
}) {
  const [note, setNote] = useState("");
  const [stars, setStars] = useState(5);
  const [status, setStatus] = useState("");
  const [invite, setInvite] = useState("");
  const [latest, setLatest] = useState<ReviewRow | null>(null);

  return (
    <div className="mt-10 space-y-8">
      <section>
        <h2 className="text-2xl font-medium">{m.upload}</h2>
        <p className="mt-2 text-sm text-soft">{m.uploadHint}</p>
        <form
          className="mt-4 flex flex-wrap items-center gap-3"
          onSubmit={async (event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            data.set("weekId", weekId);
            if (classScope) data.set("scope", "class");
            const response = await fetch("/api/files", { method: "POST", body: data });
            if (classScope) {
              setStatus(response.ok ? m.saved : m.notYet);
              if (response.ok) window.location.reload();
              return;
            }
            const body = (await response.json().catch(() => null)) as { review?: ReviewRow } | null;
            if (!response.ok || !body?.review) {
              setStatus(m.notYet);
              return;
            }
            setLatest(body.review);
            setStatus(m.reviewKept);
          }}
        >
          <input name="file" type="file" accept=".pdf,.txt,.md,.csv,.png,.jpg,.jpeg,.svg,.json,.docx" aria-label={m.upload} />
          <button className="border border-ink bg-ink px-4 py-2 text-sm text-paper" type="submit">{m.upload}</button>
        </form>
        {latest ? <ReviewLine review={latest} m={m} /> : null}
        <ul className="mt-4 space-y-2">
          {reviews.map((review) => (
            <li key={review.id} className="border border-line px-3 py-2">
              <ReviewLine review={review} m={m} />
            </li>
          ))}
        </ul>
        <ul className="mt-4 space-y-2">
          {files.filter((file) => file.scope === "class").map((file) => (
            <li key={file.id} className="flex flex-wrap items-center justify-between gap-3 border border-line px-3 py-2">
              <a className="underline" href={`/api/files/${file.id}`}>{file.name}</a>
              <span className="text-sm text-soft">{m.classFile}</span>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="text-2xl font-medium">{m.rateWeek}</h2>
        <form
          className="mt-4 space-y-3"
          onSubmit={async (event) => {
            event.preventDefault();
            const response = await fetch("/api/rating", {
              method: "POST",
              headers: { "content-type": "application/json", "x-keel": "1" },
              body: JSON.stringify({ weekId, stars, note }),
            });
            setStatus(response.ok ? m.saved : m.signInToSave);
          }}
        >
          <label className="block text-sm">
            {m.stars}
            <input className="ms-3 w-16 border border-line bg-paper px-2 py-1" type="number" min={1} max={5} value={stars} onChange={(event) => setStars(Number(event.target.value))} />
          </label>
          <textarea className="min-h-24 w-full border border-line bg-raised px-3 py-2" value={note} onChange={(event) => setNote(event.target.value)} aria-label={m.rateWeek} />
          <button className="border border-ink px-4 py-2 text-sm" type="submit">{m.rateWeek}</button>
        </form>
      </section>
      <section className="flex flex-wrap gap-3">
        <button
          className="border border-line px-4 py-2 text-sm"
          type="button"
          onClick={async () => {
            const response = await fetch("/api/invite", { method: "POST", headers: { "x-keel": "1" } });
            if (!response.ok) {
              setStatus(m.signInToSave);
              return;
            }
            const data = (await response.json()) as { url?: string };
            setInvite(data.url ?? "");
            if (data.url && navigator.share) await navigator.share({ url: data.url, title: "Keel" }).catch(() => undefined);
          }}
        >
          {m.inviteFriend}
        </button>
        <button
          className="border border-line px-4 py-2 text-sm"
          type="button"
          onClick={async () => {
            const url = `${window.location.origin}/term/${weekId}`;
            await navigator.clipboard.writeText(url);
            setInvite(url);
          }}
        >
          {m.shareWeek}
        </button>
      </section>
      {invite ? <p className="text-sm">{invite}</p> : null}
      {status ? <p className="border-s-2 border-copper ps-4" role="status">{status}</p> : null}
    </div>
  );
}

export function PublishDesk({ m }: { m: Messages }) {
  const [status, setStatus] = useState("");
  async function send(payload: Record<string, unknown>) {
    const response = await fetch("/api/teach", {
      method: "POST",
      headers: { "content-type": "application/json", "x-keel": "1" },
      body: JSON.stringify(payload),
    });
    setStatus(response.ok ? m.saved : m.notYet);
    if (response.ok) window.location.reload();
  }
  return (
    <div className="mt-8 grid gap-8 md:grid-cols-2">
      <form
        className="border border-line p-4"
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          void send({
            action: "course",
            title: data.get("title"),
            summary: data.get("summary"),
            status: data.get("status"),
            opensAt: data.get("opens") ? Date.parse(String(data.get("opens"))) : null,
            closesAt: data.get("closes") ? Date.parse(String(data.get("closes"))) : null,
          });
        }}
      >
        <h3 className="text-xl font-medium">{m.newCourse}</h3>
        <label className="mt-3 block text-sm">{m.workTitle}<input className="mt-1 w-full border border-line bg-paper px-3 py-2" name="title" required /></label>
        <label className="mt-3 block text-sm">{m.courseSummary}<textarea className="mt-1 min-h-24 w-full border border-line bg-paper px-3 py-2" name="summary" required /></label>
        <StatusFields m={m} />
        <button className="mt-3 border border-ink bg-ink px-4 py-2 text-sm text-paper" type="submit">{m.publish}</button>
      </form>
      <form
        className="border border-line p-4"
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          void send({
            action: "announce",
            title: data.get("title"),
            body: data.get("body"),
            status: data.get("status"),
            publishAt: data.get("opens") ? Date.parse(String(data.get("opens"))) : Date.now(),
          });
        }}
      >
        <h3 className="text-xl font-medium">{m.announcement}</h3>
        <label className="mt-3 block text-sm">{m.workTitle}<input className="mt-1 w-full border border-line bg-paper px-3 py-2" name="title" required /></label>
        <label className="mt-3 block text-sm">{m.announceBody}<textarea className="mt-1 min-h-24 w-full border border-line bg-paper px-3 py-2" name="body" required /></label>
        <StatusFields m={m} />
        <button className="mt-3 border border-ink bg-ink px-4 py-2 text-sm text-paper" type="submit">{m.publish}</button>
      </form>
      {status ? <p role="status">{status}</p> : null}
    </div>
  );
}

function StatusFields({ m }: { m: Messages }) {
  return (
    <div className="mt-3 flex flex-wrap gap-3">
      <label className="text-sm">
        {m.workStatus}
        <select className="ms-2 border border-line bg-paper px-2 py-1" name="status" defaultValue="published">
          <option value="draft">{m.draft}</option>
          <option value="scheduled">{m.schedule}</option>
          <option value="published">{m.publish}</option>
          <option value="paused">{m.pause}</option>
        </select>
      </label>
      <label className="text-sm">{m.opens}<input className="ms-2 border border-line bg-paper px-2 py-1" name="opens" type="datetime-local" /></label>
      <label className="text-sm">{m.closes}<input className="ms-2 border border-line bg-paper px-2 py-1" name="closes" type="datetime-local" /></label>
    </div>
  );
}

export function TeachForms({
  work,
  m,
}: {
  work: { id: string; title: string; brief: string; status: string; opensAt: number | null; closesAt: number | null }[];
  m: Messages;
}) {
  const [status, setStatus] = useState("");
  return (
    <div className="mt-8 space-y-8">
      {work.map((item) => (
        <form
          key={item.id}
          className="border border-line p-4"
          onSubmit={async (event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            const opens = String(data.get("opens") ?? "");
            const closes = String(data.get("closes") ?? "");
            const response = await fetch("/api/teach", {
              method: "POST",
              headers: { "content-type": "application/json", "x-keel": "1" },
              body: JSON.stringify({
                id: item.id,
                title: data.get("title"),
                brief: data.get("brief"),
                status: data.get("status"),
                opensAt: opens ? Date.parse(opens) : null,
                closesAt: closes ? Date.parse(closes) : null,
              }),
            });
            setStatus(response.ok ? m.saved : m.notYet);
          }}
        >
          <p className="kicker">{item.id}</p>
          <label className="mt-3 block text-sm">
            {m.workTitle}
            <input className="mt-1 w-full border border-line bg-paper px-3 py-2" name="title" defaultValue={item.title} />
          </label>
          <label className="mt-3 block text-sm">
            {m.workBrief}
            <textarea className="mt-1 min-h-24 w-full border border-line bg-paper px-3 py-2" name="brief" defaultValue={item.brief} />
          </label>
          <div className="mt-3 flex flex-wrap gap-3">
            <label className="text-sm">
              {m.workStatus}
              <select className="ms-2 border border-line bg-paper px-2 py-1" name="status" defaultValue={item.status}>
                <option value="draft">{m.draft}</option>
                <option value="scheduled">{m.schedule}</option>
                <option value="published">{m.publish}</option>
                <option value="paused">{m.pause}</option>
              </select>
            </label>
            <label className="text-sm">
              {m.opens}
              <input className="ms-2 border border-line bg-paper px-2 py-1" name="opens" type="datetime-local" defaultValue={localValue(item.opensAt)} />
            </label>
            <label className="text-sm">
              {m.closes}
              <input className="ms-2 border border-line bg-paper px-2 py-1" name="closes" type="datetime-local" defaultValue={localValue(item.closesAt)} />
            </label>
          </div>
          <div className="mt-3 flex gap-3">
            <button className="border border-ink bg-ink px-4 py-2 text-sm text-paper" type="submit">{m.saveWork}</button>
            <button
              className="border border-line px-4 py-2 text-sm"
              type="button"
              onClick={async () => {
                await fetch("/api/teach", {
                  method: "POST",
                  headers: { "content-type": "application/json", "x-keel": "1" },
                  body: JSON.stringify({ action: "restore", id: item.id }),
                });
                window.location.reload();
              }}
            >
              {m.restoreWork}
            </button>
          </div>
        </form>
      ))}
      {status ? <p role="status">{status}</p> : null}
    </div>
  );
}

function ReviewLine({ review, m }: { review: ReviewRow; m: Messages }) {
  const verdict = !review.assessment
    ? m.reviewNotAssessment
    : review.plagiarism
      ? review.match === "brief"
        ? m.reviewBrief
        : m.reviewPlagiarism
      : m.reviewClear;
  return (
    <p className="text-sm">
      {verdict} <span className="num text-soft">{m.reviewCoverage} {review.coverage}</span>
      {review.plagiarism ? <span className="num ms-3 text-soft">{review.similarity}</span> : null}
    </p>
  );
}

function localValue(stamp: number | null): string {
  if (!stamp) return "";
  const date = new Date(stamp);
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function SurveyForm({ m }: { m: Messages }) {
  const [status, setStatus] = useState("");
  return (
    <form
      className="mt-8 space-y-4"
      onSubmit={async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const response = await fetch("/api/survey", {
          method: "POST",
          headers: { "content-type": "application/json", "x-keel": "1" },
          body: JSON.stringify({
            helped: data.get("helped") === "yes",
            why: data.get("why"),
            better: data.get("better"),
            ease: Number(data.get("ease")),
            recommend: data.get("recommend") === "yes",
          }),
        });
        setStatus(response.ok ? m.saved : response.status === 403 ? m.weekLocked : m.notYet);
      }}
    >
      <fieldset>
        <legend>{m.surveyHelped}</legend>
        <label className="mt-2 block"><input type="radio" name="helped" value="yes" required /> {m.yes}</label>
        <label className="block"><input type="radio" name="helped" value="no" /> {m.no}</label>
      </fieldset>
      <label className="block">
        {m.surveyWhy}
        <textarea className="mt-1 min-h-28 w-full border border-line bg-raised px-3 py-2" name="why" required minLength={20} />
      </label>
      <label className="block">
        {m.surveyBetter}
        <textarea className="mt-1 min-h-28 w-full border border-line bg-raised px-3 py-2" name="better" required minLength={20} />
      </label>
      <label className="block">
        {m.surveyEase}
        <input className="ms-3 w-16 border border-line bg-paper px-2 py-1" name="ease" type="number" min={1} max={5} defaultValue={4} required />
      </label>
      <fieldset>
        <legend>{m.surveyRecommend}</legend>
        <label className="mt-2 block"><input type="radio" name="recommend" value="yes" required /> {m.yes}</label>
        <label className="block"><input type="radio" name="recommend" value="no" /> {m.no}</label>
      </fieldset>
      <button className="border border-ink bg-ink px-4 py-2 text-sm text-paper" type="submit">{m.saveWork}</button>
      {status ? <p role="status">{status}</p> : null}
    </form>
  );
}
