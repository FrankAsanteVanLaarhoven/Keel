# Keel — Development and Operation of Systems

> **An open academic programme where a learner goes from a first request to the cost of a live service: read, check, lab, capstone, and a twelve-week term on one record.**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FFrankAsanteVanLaarhoven%2FKeel)
[![Live class](https://img.shields.io/badge/Vercel-keelai--os.vercel.app-success?logo=vercel&style=for-the-badge)](https://keelai-os.vercel.app)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-blue?logo=github&style=for-the-badge)](https://github.com/FrankAsanteVanLaarhoven/Keel)
[![Tests](https://img.shields.io/badge/Tests-34%20Passing-emerald?style=for-the-badge)](tests/keel.test.ts)

- **Public class**: [https://keelai-os.vercel.app](https://keelai-os.vercel.app)
- **Source**: [https://github.com/FrankAsanteVanLaarhoven/Keel](https://github.com/FrankAsanteVanLaarhoven/Keel)

---

Keel is two programmes on one record, for staff and students.

**Systems for people** teaches tools, platforms, design, and the operational life of a system used by people who are not developers. Eleven cases, then the Harbor Market brief.

**Development and operation of systems** is taken in order:

1. **Ease.** The web and the internet: packets, IP, TCP, HTTP, and what a server does with one request.
2. **Practice.** Git and a shared host: small commits, a message that names the change, a green main branch, and secrets kept out.
3. **Operator.** Development and operations as one practice, automation, and the four DORA numbers: deployment frequency, lead time, change failure rate, and time to restore.
4. **Expert.** Cost, trust, and value: a shared paid account, FinOps, and model spend that has to change an outcome someone uses.

Each level is step by step. You read, answer a check, run a lab that shows what your choice would send, commit, or bill, and file an enterprise capstone. The same level opens on the Foundry board: the status request, the pipeline, the night alert, and the traffic surge. Points, marks, and the standing board count the labs, the capstones, and a finished Foundry challenge. The release brief opens when all four capstones are accepted.

Lessons, checks, and the Foundry can be read in industry wording, plain wording, or with abbreviations expanded. The choice stays in the browser. The interface is in eight languages, including Arabic, which reads right to left.

The cases are fictional. Keel teaches these foundations in its own words. Further reading, when a level names it, points at [DORA](https://dora.dev/), the [FinOps Foundation](https://www.finops.org/), and the [State of Tokenomics](https://www.tokeneconomics.com/state-of-tokenomics/).

## Twelve-week term

Each week stays locked until the week before it is accepted. Teachers see every try and every miss, and can publish, schedule, pause, or restore a week’s work. They can also publish courses and announcements.

A learner can rate a week, copy a link, invite a friend, and import the published calendar into Apple, Google, or Outlook. The calendar lists published work, deadlines, announcements, and class download names. It does not list student files.

The standing board lists the ten people with the most correct answers, and only when their wrong tries do not outnumber the correct ones. Email addresses stay off the board. The certificate and the closing survey open when all twelve weeks are accepted. The survey asks whether the term helped, why, what should be easier, how easy it was to use, and whether the learner would send a friend.

## Assessment files

A written file for a week is read on this server and then discarded. Keel keeps a hash and three flags: whether it reads as an assessment, how much of that week’s language it uses, and whether it matches another submission or the week brief. The words are not kept. Deleting the account removes those flags. Class files uploaded by a teacher stay available to download.

## A runnable service

A Foundry board that is wired as a service can be run on this machine. Sign in, choose **Run this service**, and open the status address it returns. **Download the service** saves the same project as files: `node server.js`, then [http://127.0.0.1:3970/status](http://127.0.0.1:3970/status). The status line does not carry a ledger key.

Learners do not connect a GitHub, CI, Docker, or cloud account from Keel. The lab shows the consequence of a choice. It does not deploy a customer system.

## Run

```bash
pnpm install
pnpm dev
```

Open [http://127.0.0.1:3960](http://127.0.0.1:3960).

```bash
pnpm test
pnpm typecheck
```

Node 22.5 or newer. The public class is [https://keelai-os.vercel.app](https://keelai-os.vercel.app).

Set `DATABASE_URL` to a PostgreSQL connection string and Keel keeps accounts, progress, review flags, and teacher files in that database, including across a restart of the public class. Without `DATABASE_URL`, Keel uses SQLite. On this machine that file is `.data/keel.db`. On a host with neither a database URL nor a durable disk, a restart clears the SQLite file.

Assessment text is read and then discarded in both places. A teacher’s class file is kept: on disk beside the SQLite file, or in PostgreSQL when `DATABASE_URL` is set.

## Accounts

Sign-in is [Better Auth](https://better-auth.com) on this server. Keel does not use a separate identity provider. Passphrases are hashed. The session cookie is HttpOnly and is used only to keep the session. Account rows live in the database described above.

Set `BETTER_AUTH_SECRET` in production (32 characters or more). Locally, if it is unset, Keel writes `.data/secret`. One designated address holds the super admin role. Any other request for that role is stored as a student.

A shared network can create 120 accounts an hour and sign in 120 times in fifteen minutes. Each email can try a passphrase five times in five minutes, so one passphrase cannot be guessed. A signed-in person can change the passphrase from the account page. If it is forgotten, the super admin sets a new one from the class book. The work stays, the old sessions end, and that person can sign in and change it. Keel does not send a reset email. The public database is on the free plan and may sleep when the class is idle. The first request waits and tries again. A daily check opens the record. It does not keep the database awake.

## Tutor and voice

The lesson can be read aloud on this device without sending audio anywhere.

When `OPENROUTER_API_KEY` or `OPEN_ROUTER_KEY` is set, the tutor uses OpenRouter (default model `x-ai/grok-4.7`, or `OPENROUTER_MODEL`). If `XAI_API_KEY` is set and the learner allows the live tutor, typed questions and speech can also go to xAI. Keys stay on the server. Audio is not written to disk. Without a key, or without consent, Keel answers locally and speaks on the device with the microphone off.

## Cache and records

Static files may be cached. `/api` responses are `private, no-store`. The service worker does not cache account, case, or session data.

The cases are fictional. Do not put real pupil, patient, or payment records into a note. The privacy statement is on `/data`.

## Licence

Frank Asante Van Laarhoven. Apache-2.0. See [LICENSE](LICENSE).

If you use this software, cite it with [CITATION.cff](CITATION.cff). A DOI is not attached.
