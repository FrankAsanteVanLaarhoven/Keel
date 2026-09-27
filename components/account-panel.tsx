"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import type { Messages } from "@/lib/i18n/en";
import { useKeel } from "./keel-context";

export function AuthPanel({ mode, m }: { mode: "in" | "up"; m: Messages }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"student" | "staff" | "super_admin">("student");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const router = useRouter();

  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <h1 className="text-4xl font-medium tracking-tight">{mode === "in" ? m.signInTitle : m.signUpTitle}</h1>
      <p className="mt-4">{mode === "in" ? m.signInDeck : m.signUpDeck}</p>
      <form
        className="mt-8 space-y-4"
        onSubmit={async (event) => {
          event.preventDefault();
          setPending(true);
          setError("");
          const result = mode === "in"
            ? await authClient.signIn.email({ email, password })
            : await authClient.signUp.email({ email, password, name });
          if (result.error) {
            const code = `${result.error.code ?? ""} ${result.error.message ?? ""}`.toLowerCase();
            setError(mode === "up" && code.includes("exist") ? m.emailTaken : mode === "in" ? m.authFailed : m.signupFailed);
            setPending(false);
            return;
          }
          if (mode === "up") {
            await fetch("/api/profile", {
              method: "POST",
              headers: { "content-type": "application/json", "x-keel": "1" },
              body: JSON.stringify({ displayName: name, role }),
            });
          }
          router.push("/course");
          router.refresh();
        }}
      >
        {mode === "up" ? (
          <Field label={m.displayName} hint={m.nameRule}>
            <input className="mt-1 w-full border border-line bg-raised px-3 py-2" value={name} autoComplete="name" onChange={(event) => setName(event.target.value)} required minLength={2} maxLength={40} />
          </Field>
        ) : null}
        <Field label={m.email}>
          <input className="mt-1 w-full border border-line bg-raised px-3 py-2" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </Field>
        <Field label={m.passphrase} hint={m.passphraseRule}>
          <input className="mt-1 w-full border border-line bg-raised px-3 py-2" type={show ? "text" : "password"} autoComplete={mode === "up" ? "new-password" : "current-password"} value={password} minLength={12} onChange={(event) => setPassword(event.target.value)} required />
          <button className="mt-2 text-sm underline" type="button" onClick={() => setShow((value) => !value)}>{show ? m.hidePass : m.showPass}</button>
        </Field>
        {mode === "up" ? (
          <Field label={m.staffOrStudent}>
            <select className="mt-1 w-full border border-line bg-raised px-3 py-2" value={role} onChange={(event) => setRole(event.target.value as "student" | "staff" | "super_admin")}>
              <option value="student">{m.roleStudent}</option>
              <option value="staff">{m.roleStaff}</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </Field>
        ) : null}
        {error ? <p role="alert">{error}</p> : null}
        <button className="border border-ink bg-ink px-4 py-2 text-sm text-paper disabled:opacity-40" disabled={pending} type="submit">
          {pending ? m.loading : mode === "in" ? m.signIn : m.create}
        </button>
      </form>
      <p className="mt-6 text-sm">
        <Link className="underline" href={mode === "in" ? "/sign-up" : "/sign-in"}>{mode === "in" ? m.needAccount : m.haveAccount}</Link>
      </p>
    </div>
  );
}

export function AccountPanel({ m }: { m: Messages }) {
  const { me, refresh } = useKeel();
  if (!me) return <p className="px-5 py-16">{m.loading}</p>;
  if (!me.signedIn) {
    return (
      <p className="px-5 py-16">
        <Link className="underline" href="/sign-in">{m.signIn}</Link>
      </p>
    );
  }
  return <AccountForm m={m} me={me} refresh={refresh} />;
}

function AccountForm({ m, me, refresh }: { m: Messages; me: NonNullable<ReturnType<typeof useKeel>["me"]>; refresh: () => Promise<void> }) {
  const router = useRouter();
  const [name, setName] = useState(me.name ?? "");
  const [role, setRole] = useState<"student" | "staff" | "super_admin">(me.role ?? "student");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  return (
    <div className="mx-auto max-w-xl px-5 py-12">
      <h1 className="text-4xl font-medium tracking-tight">{m.accountTitle}</h1>
      <p className="mt-3 text-soft">{me.email}</p>
      {(me.role === "super_admin" || me.role === "staff") && (
        <div className="mt-6 border border-copper/40 bg-copper/5 p-4">
          <p className="kicker text-copper">Privileged Access Granted</p>
          <p className="mt-1 text-sm font-medium text-ink">
            You hold {me.role === "super_admin" ? "Super Admin" : "Staff Teacher"} evaluation permissions.
          </p>
          <p className="mt-1 text-xs text-soft">
            Audit student practical outcomes, inspect submitted architectural decisions, and manually override scores.
          </p>
          <Link
            href="/admin"
            className="mt-3 inline-block border border-ink bg-ink px-4 py-2 text-xs font-medium text-paper"
          >
            Open Teacher Evaluation Portal →
          </Link>
        </div>
      )}
      <form
        className="mt-8 space-y-4"
        onSubmit={async (event) => {
          event.preventDefault();
          const response = await fetch("/api/profile", {
            method: "POST",
            headers: { "content-type": "application/json", "x-keel": "1" },
            body: JSON.stringify({ displayName: name, role }),
          });
          setMessage(response.ok ? m.savedName : m.genericError);
          await refresh();
        }}
      >
        <Field label={m.displayName} hint={m.displayHelp}>
          <input className="mt-1 w-full border border-line bg-raised px-3 py-2" value={name} onChange={(event) => setName(event.target.value)} />
        </Field>
        <Field label={m.role}>
          <select className="mt-1 w-full border border-line bg-raised px-3 py-2" value={role} onChange={(event) => setRole(event.target.value as "student" | "staff" | "super_admin")}>
            <option value="student">{m.roleStudent}</option>
            <option value="staff">{m.roleStaff}</option>
            <option value="super_admin">Super Admin (Master Answers & Evaluation)</option>
          </select>
        </Field>
        <button className="border border-ink px-4 py-2 text-sm" type="submit">{m.save}</button>
        {message ? <p role="status">{message}</p> : null}
      </form>
      <p className="mt-6 text-sm">
        {m.voiceConsent}: {me.consent ? m.voiceOn : m.voiceOff}
      </p>
      <p className="mt-8">
        <a className="underline" href="/api/account/export">{m.exportLabel}</a>
      </p>
      <p className="mt-2 text-sm text-soft">{m.exportHelp}</p>
      <form
        className="mt-10 border-t border-line pt-6"
        onSubmit={async (event) => {
          event.preventDefault();
          const result = await authClient.deleteUser({ password });
          if (result.error) {
            setMessage(m.authFailed);
            return;
          }
          router.push("/");
          router.refresh();
        }}
      >
        <h2 className="text-xl">{m.deleteAccount}</h2>
        <p className="mt-2 text-sm text-soft">{m.deleteHelp} {m.danger}</p>
        <input className="mt-3 w-full border border-line bg-raised px-3 py-2" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} />
        <button className="mt-3 border border-danger px-4 py-2 text-sm text-danger" type="submit">{m.deleteConfirm}</button>
      </form>
      <button
        className="mt-8 text-sm underline"
        type="button"
        onClick={async () => {
          await authClient.signOut();
          router.push("/");
          router.refresh();
        }}
      >
        {m.signOut}
      </button>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span>{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-sm text-soft">{hint}</span> : null}
    </label>
  );
}
