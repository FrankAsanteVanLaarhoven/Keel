# Foundry JavaScript extensions

Date: 1 October 2026. Scope: the Foundry desk can run a script the person writes in this browser. The script can add shapes to the toolbox and commands that read and change the open diagram. This is a local change note. It is not a release-wide pass. The class on port 3960 was not rebuilt. The public host was not opened. The release certificate `docs/quality/release-2026-10-01.md` still stands for commit ed1478c and was not revised.

A script calls `keel.tool` and `keel.command`. It runs in a framed page at `/foundry-extension-frame`, sandboxed so it does not share the page origin. That frame’s own policy is `default-src 'none'` with inline script and `unsafe-eval` only, and `frame-ancestors 'self'`. The site policy on the rest of Keel is unchanged. The frame is excluded from the site proxy so the site policy is not copied onto it. A script can change the open diagram. It does not receive the class sign-in, and the frame policy blocks its network. Scripts stay in this browser under `keel.foundry.extensions.v1`. Opening a saved drawing does not run a script that was stored in the file.

An extension shape id looks like `x-stamp` and is at most 18 characters. Those shapes are drawings. They do not show milliseconds or requests per second, and they are not runnable service types. The example adds a Stamp shape on UML 2, Flowchart, and ERD, and a command named Number shapes. There is no plug-in store and no remote script address.

## Evidence

Checked in Chrome against `next dev` on http://127.0.0.1:3963 from `/Users/favl/workspace/keel`. Port 3960 was left as it was. `pnpm exec tsc --noEmit` exited 0 after the last edit. `pnpm exec eslint` on the Foundry lab, the extension host, the frame route, the proxy, the extension library, and the extension tests exited 0. `pnpm exec vitest run` with `DATABASE_URL` and the `POSTGRES_URL` variables unset: 60 passed, 1 skipped. The skipped file is `tests/postgres.test.ts`. The Vite ESM warning and the Better Auth “Invalid password” line in the existing passphrase test are the usual ones. SQLite’s experimental warning is the usual one.

`curl -sI http://127.0.0.1:3963/foundry-extension-frame` returned 200, `content-type: text/html; charset=utf-8`, `cache-control: no-store`, and `content-security-policy: default-src 'none'; script-src 'unsafe-inline' 'unsafe-eval'; frame-ancestors 'self'`.

Chrome on `/foundry`:

- Title `Interactive Systems Foundry · Keel`. One h1, `Foundry`. The Extensions panel adds an h2, `Extensions`.
- Insert example filled the name `Stamp notes`. Save reported `Stamp notes added 2 changes to the desk.` Stamp appeared on the UML toolbox. Placing it drew `«stamp» Stamp` with no requests-per-second line. Number shapes changed that label to `1. Stamp`.
- AWS hid the Stamp tool and left the shape on the diagram. UML 2 showed Stamp again.
- A script saved as `keel.tool({` reported `Unexpected end of input Fix it and save again.`
- Tabbing to Save extension drew a solid 2px outline.
- At 390×844 the Foundry root and the page were 390px wide. The language row scrolled and Azure was on screen. The extension panel was 160px tall and the canvas remained 128px tall. The stamp stayed in the inspector as `1. Stamp`.
- The exercised Chrome flow reported no app-owned console error and no page error.

## Checks for this change

| ID | Result | Evidence |
|---|---|---|
| Q01 | N/A | No domain was named. This check used the local dev server. The public host was not opened. |
| Q02 | PASS | Title `Interactive Systems Foundry · Keel`. One h1, Foundry. The runner frame’s title is Extension runner. |
| Q03 | N/A | No metadata edit. The Foundry page stays on the existing noindex site. The runner frame has no description because it is not a page in the class. |
| Q04 | N/A | No icon file changed. |
| Q05 | N/A | No public share card was added. This is not a release. |
| Q06 | N/A | No indexable URL was added. |
| Q07 | N/A | No social card was added. |
| Q08 | N/A | No document route was changed. The runner frame is a real response on purpose. |
| Q09 | PASS | Save ended on the status `Stamp notes added 2 changes to the desk.` The host shows `Reading the script…` until the frame answers. |
| Q10 | PASS | A broken script said `Unexpected end of input Fix it and save again.` An empty name or an unknown shape is refused with the next step before it is stored. |
| Q11 | PASS | One h1, Foundry. The panel’s heading is an h2, Extensions. |
| Q12 | PASS | The runner frame is titled and `aria-hidden`. Extension buttons, the name field, and the script field have visible or accessible names. |
| Q13 | N/A | No sitemap change. The site already disallows `/`. The runner frame is not a discovery page. |
| Q14 | PASS | The Chrome flow above reported no app-owned console error and no page error. |
| Q15 | PASS | The new extension files contain no `console.log`. |
| Q16 | N/A | No release build was made. `productionBrowserSourceMaps` remains false. |
| Q17 | NOT RUN | No JavaScript budget is recorded. The bundle was not measured. |
| Q18 | PASS | At 1280×900 the script, Save extension, and the stamp on the canvas were on screen. At 390×844 the page stayed 390px wide, the panel scrolled inside 160px, and the canvas stayed 128px tall. |
| Q19 | PASS | The panel uses the paper, ink, copper, border, and radius already on the Foundry toolbar. |
| Q20 | PASS | Insert example, Save extension, Stamp, Number shapes, the language row, and the broken-script alert all ran. Keyboard focus on Save extension was a solid 2px outline. |

## Still open

The work is uncommitted in `/Users/favl/workspace/keel`. Port 3960 and https://keelai-os.vercel.app do not have it. Q17 remains not run. The header mission row still sits in one scrolling row, which the release certificate already records. Closing Extensions gives the canvas its usual height back. An extension shape uses a glyph the desk already draws.
