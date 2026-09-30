"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Messages } from "@/lib/i18n/en";

type PageItem = {
  id: string;
  title: string;
  status: "draft" | "published";
  ownerName: string;
  mine: boolean;
  updatedAt: number;
};

export function WorkshopList({ m }: { m: Messages }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [pages, setPages] = useState<PageItem[] | null>(null);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const response = await fetch("/api/workshop", { headers: { "x-keel": "1" } });
      if (cancelled) return;
      if (!response.ok) {
        setMessage(response.status === 503 ? m.waking : response.status === 401 ? m.workshopSignIn : m.genericError);
        setPages([]);
        return;
      }
      const body = (await response.json()) as { pages: PageItem[] };
      setPages(body.pages);
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [m]);

  return (
    <div className="mx-auto max-w-3xl px-5 pb-28 pt-12">
      <p className="kicker">{m.workshop}</p>
      <h1 className="mt-3 text-4xl font-medium tracking-tight">{m.workshopTitle}</h1>
      <p className="mt-4 max-w-2xl leading-7">{m.workshopDeck}</p>
      <p className="mt-3 max-w-2xl text-sm text-soft">{m.workshopHelp}</p>
      <form
        className="mt-8 flex flex-col gap-3 sm:flex-row"
        onSubmit={async (event) => {
          event.preventDefault();
          setPending(true);
          setMessage("");
          const response = await fetch("/api/workshop", {
            method: "POST",
            headers: { "content-type": "application/json", "x-keel": "1" },
            body: JSON.stringify({ title }),
          });
          setPending(false);
          if (!response.ok) {
            setMessage(response.status === 503 ? m.waking : response.status === 429 ? m.rateLimited : m.genericError);
            return;
          }
          const created = (await response.json()) as { id: string };
          router.push(`/workshop/${created.id}`);
        }}
      >
        <label className="block flex-1">
          <span className="sr-only">{m.workshopPageTitle}</span>
          <input
            className="w-full border border-line bg-raised px-3 py-2"
            value={title}
            minLength={2}
            maxLength={80}
            required
            autoComplete="off"
            onChange={(event) => setTitle(event.target.value)}
          />
        </label>
        <button className="border border-ink bg-ink px-4 py-2 text-sm text-paper disabled:opacity-40" type="submit" disabled={pending} aria-busy={pending}>
          {pending ? m.loading : m.workshopNew}
        </button>
      </form>
      {message ? <p role="alert" className="mt-4">{message}</p> : null}
      {pages === null ? <p className="mt-8" role="status">{m.loading}</p> : null}
      {pages && pages.length === 0 && !message ? <p className="mt-8 text-soft">{m.workshopEmpty}</p> : null}
      {pages && pages.length > 0 ? (
        <ul className="mt-8 divide-y divide-line border-y border-line">
          {pages.map((page) => (
            <li key={page.id}>
              <Link className="flex flex-wrap items-baseline justify-between gap-3 py-3" href={`/workshop/${page.id}`}>
                <span className="text-lg">{page.title}</span>
                <span className="text-sm text-soft">{page.status === "published" ? m.workshopPublished : m.workshopDraft} · {page.ownerName}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
