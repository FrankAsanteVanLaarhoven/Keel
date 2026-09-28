# Keel

Keel is a learning programme for staff and students. It is two programmes on one record.

**Systems for people** teaches tools, platforms, design, and the operational life of a system used by people who are not developers. Eleven cases, then the Harbor Market brief.

**Development and operation of systems** goes from a first request to the cost of a live service. Four levels, each taken in order:

1. Ease. The web and the internet: packets, IP, TCP, HTTP, and what a server does with one request.
2. Practice. Git and a shared host: small commits, a message that names the change, a green main branch, and secrets kept out.
3. Operator. Development and operations as one practice, automation, and the four DORA numbers: deployment frequency, lead time, change failure rate, and time to restore.
4. Expert. Cost, trust, and value: a shared paid account, FinOps, and model spend that has to change an outcome someone uses.

Each level is step by step. You read, answer a check, run a lab that shows what your choice would actually send or commit or bill, and file an enterprise capstone. The same level also opens on the Foundry board: the status request, the pipeline, the night alert, and the traffic surge. Points, marks, and the standing board count the labs, the capstones, and a finished Foundry challenge. The release brief opens when all four capstones are accepted.

The cases are fictional. Keel teaches these foundations in its own words. Further reading, when a level names it, points at [DORA](https://dora.dev/), the [FinOps Foundation](https://www.finops.org/), and the [State of Tokenomics](https://www.tokeneconomics.com/state-of-tokenomics/).

Frank Asante Van Laarhoven. Apache-2.0. See [LICENSE](LICENSE).

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

## AI Tutor and Voice

The lesson can be read aloud on this device without sending audio anywhere.

When `OPENROUTER_API_KEY` is configured (for example as a Vercel environment variable), all AI-capable features in Keel use OpenRouter (defaulting to `x-ai/grok-4.7`, or configured via `OPENROUTER_MODEL`).

If `XAI_API_KEY` is set and the learner allows the live tutor, speech and the current lesson can also go to xAI (`grok-4.7` for typed questions, the voice API for talk and speech). All keys stay securely on the server. Audio is not written to disk. Without keys, or without learner consent, Keel answers locally and speaks on-device with the microphone off.

## Cache

Static files may be cached. `/api` responses are `private, no-store`. The service worker does not cache account, case, or session data.

The cases are fictional. Do not put real pupil, patient, or payment records into a note.
