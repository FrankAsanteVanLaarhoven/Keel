# Foundry drawing structure

Date: 1 October 2026. Scope: the Foundry drawing file and the lesson catalog now live in `lib/foundry-drawing.ts`, and the old architect tutor does not call the server while the full-page desk is open. This is a local change note. It is not a release-wide pass. The class on port 3960 was not rebuilt. The public host was not opened. The release certificate `docs/quality/release-2026-10-01.md` still stands for commit ed1478c and was not revised.

The canvas component dropped from 4481 lines to 3944. The drawing module is 566 lines. It holds the shape and link types, the JSON read and write, the six lessons plus freeform, and the practice templates. Lesson checks share one wire test. A client wired straight to a database still fails the security lesson. The status lesson still fails if that wire runs in either direction. Opening a file, exporting JSON, checking a sheet, and sketching code use the same module the canvas uses.

The old architect panel remains for the page that is not full screen. On the full-page desk, which is how Foundry opens, editing the drawing does not call `/api/foundry/analyze`. Leaving full page, with that panel open, still calls it. The AI desk is unchanged.

## Evidence

Checked in Chrome against `next dev` on http://127.0.0.1:3967 from `/Users/favl/workspace/keel`. Port 3960 was left as it was and still answered `{"ok":true}` after the temporary server stopped. `pnpm exec tsc --noEmit` exited 0. `pnpm exec eslint --max-warnings 0` on the lab, the drawing module, and the touched tests exited 0. `pnpm exec vitest run` with `DATABASE_URL` and the `POSTGRES_URL` variables unset: 89 passed, 1 skipped. The skipped file is `tests/postgres.test.ts`. Nine of the passing tests are new in `tests/foundry-drawing.test.ts`. The Vite ESM warning, the SQLite experimental warning, and the Better Auth “Invalid password” line in the existing passphrase test are the usual ones.

Chrome on `/foundry`, signed out:

- Title `Interactive Systems Foundry · Keel`. One visible h1, `Foundry`.
- For the first 1.2 seconds on the full-page desk, the browser sent no request to `/api/foundry/analyze`.
- Commands opened the dialog. Escape closed it.
- At 1280×900 the page and the Foundry root were 1280px wide.
- Exit full page showed Hide AI Architect, and the browser then sent one request to `/api/foundry/analyze`.
- Full page again at 390×844: the root was 390px wide, the page did not scroll sideways, and Commands was 44px tall and inside the page.
- At 768×1024 and at 360×800 the root matched the viewport, the page did not scroll sideways, the h1 was Foundry, and Commands was 44px tall and inside the page.
- The exercised Chrome flow reported no app-owned console error and no page error.

## Checks for this change

| ID | Result | Evidence |
|---|---|---|
| Q01 | N/A | No domain was named. This check used the local dev server. The public host was not opened. |
| Q02 | PASS | Title includes Foundry and Keel. One visible h1, Foundry. |
| Q03 | N/A | No metadata edit. The Foundry page stays on the existing noindex site. |
| Q04 | N/A | No icon file changed. |
| Q05 | N/A | No public share card was added. This is not a release. |
| Q06 | N/A | No indexable URL was added. |
| Q07 | N/A | No social card was added. |
| Q08 | N/A | No document route was added. |
| Q09 | N/A | No new pending control. The architect call is skipped on the full-page desk and still runs when that panel is open. |
| Q10 | N/A | No new error sentence. An unknown shape is still dropped on open, and the lesson failures are the same checks. |
| Q11 | PASS | One visible h1, Foundry. |
| Q12 | N/A | No new image or icon-only control. Commands keeps its visible name. |
| Q13 | N/A | No sitemap or robots change. The class stays unlisted. |
| Q14 | PASS | The exercised Chrome flow reported no app-owned console error and no page error. |
| Q15 | PASS | `lib/foundry-drawing.ts` has no `console.log`. The lab change did not add one. |
| Q16 | N/A | No release build was produced. The check used `next dev`. |
| Q17 | NOT RUN | No JavaScript budget is recorded, and this note did not measure a production bundle. |
| Q18 | PASS | 1280, 768, 390, and 360. Page width matched the viewport. Commands was inside the page and 44px tall at 768, 390, and 360. |
| Q19 | PASS | No spacing, type, color, or radius change. The desk still uses the existing paper, ink, and copper classes. |
| Q20 | PASS | Commands opened and Escape closed it. Exit full page showed the architect panel. Full page returned to the desk. |

Release-ready: no. Q17 was not run, and this note does not replace the release certificate.
