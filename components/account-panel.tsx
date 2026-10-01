"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import type { Messages } from "@/lib/i18n/en";
import { designatedAdminEmail } from "@/lib/security";
import { useKeel } from "./keel-context";

export function AuthPanel({ mode, m }: { mode: "in" | "up"; m: Messages }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"student" | "staff" | "super_admin">("student");
  const designated = email.trim().toLowerCase() === designatedAdminEmail;
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
            const status = result.error.status ?? 0;
            const code = `${result.error.code ?? ""} ${result.error.message ?? ""}`.toLowerCase();
            setError(status === 429 ? m.rateLimited : status >= 500 ? m.waking : mode === "up" && code.includes("exist") ? m.emailTaken : mode === "in" ? m.authFailed : m.signupFailed);
            setPending(false);
            return;
          }
          if (mode === "up") {
            await fetch("/api/profile", {
              method: "POST",
              headers: { "content-type": "application/json", "x-keel": "1" },
              body: JSON.stringify({ displayName: name, role: designated ? "super_admin" : role }),
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
            <select
              className="mt-1 w-full border border-line bg-raised px-3 py-2"
              value={designated ? "super_admin" : role === "super_admin" ? "student" : role}
              onChange={(event) => setRole(event.target.value as "student" | "staff")}
              disabled={designated}
            >
              {designated ? <option value="super_admin">Super Admin</option> : null}
              <option value="student">{m.roleStudent}</option>
              <option value="staff">{m.roleStaff}</option>
            </select>
          </Field>
        ) : null}
        {error ? <p role="alert">{error}</p> : null}
        <button className="border border-ink bg-ink px-4 py-2 text-sm text-paper disabled:opacity-40" disabled={pending} aria-busy={pending} type="submit">
          {pending ? m.accountWait : mode === "in" ? m.signIn : m.create}
        </button>
      </form>
      <p className="mt-6 text-sm">
        <Link className="underline" href={mode === "in" ? "/sign-up" : "/sign-in"}>{mode === "in" ? m.needAccount : m.haveAccount}</Link>
      </p>
      {mode === "in" ? (
        <p className="mt-4 text-sm text-soft">
          <span className="block font-medium text-ink">{m.forgotPassphrase}</span>
          {m.forgotHelp}
        </p>
      ) : null}
    </div>
  );
}

export function AccountPanel({ m }: { m: Messages }) {
  const { me, refresh } = useKeel();
  if (!me) {
    return (
      <div className="mx-auto max-w-xl px-5 py-16">
        <h1 className="text-4xl font-medium tracking-tight">{m.accountTitle}</h1>
        <p className="mt-3 text-soft">{m.loading}</p>
      </div>
    );
  }
  if (!me.signedIn) {
    return (
      <div className="mx-auto max-w-xl px-5 py-16">
        <h1 className="text-4xl font-medium tracking-tight">{m.accountTitle}</h1>
        <p className="mt-6">
          <Link className="underline" href="/sign-in">{m.signIn}</Link>
        </p>
      </div>
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
          <select
            className="mt-1 w-full border border-line bg-raised px-3 py-2"
            value={me.email?.toLowerCase() === designatedAdminEmail ? "super_admin" : role === "super_admin" ? "staff" : role}
            onChange={(event) => setRole(event.target.value as "student" | "staff")}
            disabled={me.email?.toLowerCase() === designatedAdminEmail}
          >
            {me.email?.toLowerCase() === designatedAdminEmail ? <option value="super_admin">Super Admin</option> : null}
            <option value="student">{m.roleStudent}</option>
            <option value="staff">{m.roleStaff}</option>
          </select>
        </Field>
        <button className="border border-ink px-4 py-2 text-sm" type="submit">{m.save}</button>
        {message ? <p role="status">{message}</p> : null}
      </form>
      <p className="mt-6 text-sm">
        {m.voiceConsent}: {me.consent ? m.voiceOn : m.voiceOff}
      </p>
      <ChangePassphrase m={m} />
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

function ChangePassphrase({ m }: { m: Messages }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  return (
    <form
      className="mt-10 space-y-4 border-t border-line pt-6"
      onSubmit={async (event) => {
        event.preventDefault();
        if (next !== confirm) {
          setMessage(m.passphraseMismatch);
          return;
        }
        setPending(true);
        setMessage("");
        const result = await authClient.changePassword({ currentPassword: current, newPassword: next, revokeOtherSessions: true });
        setPending(false);
        if (result.error) {
          const status = result.error.status ?? 0;
          setMessage(status === 429 ? m.rateLimited : status >= 500 ? m.waking : m.authFailed);
          return;
        }
        setCurrent("");
        setNext("");
        setConfirm("");
        setMessage(m.passphraseChanged);
      }}
    >
      <h2 className="text-xl">{m.changePassphrase}</h2>
      <p className="text-sm text-soft">{m.changePassphraseHelp}</p>
      <Field label={m.currentPassphrase}>
        <input className="mt-1 w-full border border-line bg-raised px-3 py-2" type="password" autoComplete="current-password" value={current} onChange={(event) => setCurrent(event.target.value)} required />
      </Field>
      <Field label={m.newPassphrase} hint={m.passphraseRule}>
        <input className="mt-1 w-full border border-line bg-raised px-3 py-2" type="password" autoComplete="new-password" minLength={12} value={next} onChange={(event) => setNext(event.target.value)} required />
      </Field>
      <Field label={m.confirmPassphrase}>
        <input className="mt-1 w-full border border-line bg-raised px-3 py-2" type="password" autoComplete="new-password" minLength={12} value={confirm} onChange={(event) => setConfirm(event.target.value)} required />
      </Field>
      {message ? <p role="status">{message}</p> : null}
      <button className="border border-ink px-4 py-2 text-sm disabled:opacity-40" type="submit" disabled={pending} aria-busy={pending}>
        {pending ? m.loading : m.changePassphrase}
      </button>
    </form>
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
