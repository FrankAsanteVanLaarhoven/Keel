"use client";

import { useState } from "react";
import type { Messages } from "@/lib/i18n/en";

export function PassphraseReset({ m }: { m: Messages }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  return (
    <form
      className="mt-8 max-w-xl space-y-4 border border-line p-4"
      onSubmit={async (event) => {
        event.preventDefault();
        if (password !== confirm) {
          setMessage(m.passphraseMismatch);
          return;
        }
        setPending(true);
        setMessage("");
        const response = await fetch("/api/admin/passphrase", {
          method: "POST",
          headers: { "content-type": "application/json", "x-keel": "1" },
          body: JSON.stringify({ email, password }),
        });
        setPending(false);
        if (response.status === 429) {
          setMessage(m.rateLimited);
          return;
        }
        if (response.status === 403) {
          setMessage(m.resetPassphraseDenied);
          return;
        }
        if (response.status === 404) {
          setMessage(m.authFailed);
          return;
        }
        if (!response.ok) {
          setMessage(response.status >= 500 ? m.waking : m.genericError);
          return;
        }
        setPassword("");
        setConfirm("");
        setMessage(m.resetPassphraseDone);
      }}
    >
      <h2 className="text-xl font-medium">{m.resetPassphrase}</h2>
      <p className="text-sm text-soft">{m.resetPassphraseHelp}</p>
      <label className="block">
        <span>{m.email}</span>
        <input className="mt-1 w-full border border-line bg-raised px-3 py-2" type="email" autoComplete="off" value={email} onChange={(event) => setEmail(event.target.value)} required />
      </label>
      <label className="block">
        <span>{m.newPassphrase}</span>
        <input className="mt-1 w-full border border-line bg-raised px-3 py-2" type="password" autoComplete="new-password" minLength={12} value={password} onChange={(event) => setPassword(event.target.value)} required />
        <span className="mt-1 block text-sm text-soft">{m.passphraseRule}</span>
      </label>
      <label className="block">
        <span>{m.confirmPassphrase}</span>
        <input className="mt-1 w-full border border-line bg-raised px-3 py-2" type="password" autoComplete="new-password" minLength={12} value={confirm} onChange={(event) => setConfirm(event.target.value)} required />
      </label>
      {message ? <p role="status">{message}</p> : null}
      <button className="border border-ink bg-ink px-4 py-2 text-sm text-paper disabled:opacity-40" type="submit" disabled={pending} aria-busy={pending}>
        {pending ? m.loading : m.resetPassphrase}
      </button>
    </form>
  );
}
