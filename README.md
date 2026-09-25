# Keel

Keel is a private learning programme for staff and students. It teaches how to build and run systems for people who are not developers: tools, platforms, design, and the operational life of a system.

Frank Asante Van Laarhoven.

## Run

```bash
pnpm install
pnpm dev
```

Open http://127.0.0.1:3960.

```bash
pnpm test
pnpm typecheck
```

## Accounts

Sign-in is [Better Auth](https://better-auth.com), on this server, with SQLite in `.data/`. Passphrases are hashed by Better Auth. The session cookie is HttpOnly. Keel does not use a hosted identity service, so account data is not sent to one.

Set `BETTER_AUTH_SECRET` in production (32 characters or more). Locally, if it is unset, Keel writes `.data/secret`.

## Voice

The lesson can be read aloud on this device without sending audio anywhere.

If `XAI_API_KEY` is set and the learner allows the live tutor, speech and the current lesson go to xAI (`grok-4.7` for typed questions, the voice API for talk and speech). The key stays on the server. A live talk session uses a short-lived token. Audio is not written to disk.

## Cache

Static files may be cached. `/api` responses are `private, no-store`. The service worker does not cache account, case, or session data.

The cases are fictional. Do not put real pupil, patient, or payment records into a note.
