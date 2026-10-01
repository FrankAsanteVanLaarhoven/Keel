# Foundry markdown and same-browser share

Date: 1 October 2026. Scope: the Foundry documentation field, the workshop markdown view, and the HTML notes now read a table, a task list, strikethrough, an ordered list, and an https link. Modeling has a Share control that follows a room name across Foundry tabs in this browser. This is a local change note. It is not a release-wide pass. The class on port 3960 was not rebuilt. The public host was not opened. The release certificate `docs/quality/release-2026-10-01.md` still stands for commit ed1478c and was not revised.

Share uses `BroadcastChannel` on `keel.foundry.liveshare.v1`. A room name such as harbor is normalized in the browser. A joining tab sends hello and does not publish an empty sheet. The other tab answers with its drawing. The drawing does not leave this browser. The desk does not download a share tool, and it does not reach GitHub. A script tag and a `javascript:` link stay text in the preview and in the HTML download.

## Evidence

Checked in Chrome against `next dev` on http://127.0.0.1:3967 from `/Users/favl/workspace/keel`. Port 3960 was left as it was and still answered `{"ok":true}` after the temporary server stopped. `pnpm exec tsc --noEmit` exited 0. `pnpm exec eslint --max-warnings 0` on the lab, the modeling panel, the markdown view, the markdown parser, the model notes, the share module, the guide, the guide page, and the new test exited 0. `pnpm exec vitest run` with `DATABASE_URL` and the `POSTGRES_URL` variables set to empty strings: 97 passed, 1 skipped. The skipped file is `tests/postgres.test.ts`. Five of the passing tests are in `tests/foundry-markdown.test.ts`. The Vite ESM warning, the SQLite experimental warning, and the Better Auth “Invalid password” line in the existing passphrase test are the usual ones.

Chrome, signed out, two tabs in one browser:

- A short room name, `ab`, showed “Use a room name such as harbor, then share again.” Share stayed off.
- Room `harbor` turned Share on. The status said “Sharing harbor in this browser.” The Share button was pressed.
- The first tab placed a screen. The second tab then turned Share on for `harbor` and showed Find a book and Card number. The first tab still showed that screen.
- On the selected shape, Preview showed a table, a checked disabled task, an unchecked disabled task, an ordered list, and strikethrough. The preview had no `script` element and no `javascript:` link. The script tag remained visible as text.
- The guide title was `Foundry guide · Keel`. One visible h1, `Foundry guide`. The Live share section moved below the header. Its text says the drawing does not leave this browser. The page text did not contain StarUML or XMI.
- At 1280×900, 768×1024, 390×844, and 360×800, with Modeling open and a shape selected, the page width matched the viewport. The canvas height was 128, 128, 145, and 128. Share was 44px tall and inside the viewport at each width. On the guide, at 390 the Back to Foundry link was 44px tall and inside the page. At 390 and 360 the guide page did not overflow.
- The exercised Chrome flow reported no app-owned console error and no page error.

## Checks for this change

| ID | Result | Evidence |
|---|---|---|
| Q01 | N/A | No domain was named. This check used the local dev server. The public host was not opened. |
| Q02 | PASS | The desk title is Interactive Systems Foundry · Keel. The guide title is Foundry guide · Keel. One visible h1 on each view. |
| Q03 | PASS | The guide description is unchanged and the page is noindex. The new copy does not name a person or a class record. |
| Q04 | N/A | No icon file changed. |
| Q05 | N/A | No public share card was added. This is not a release. |
| Q06 | N/A | The guide keeps its relative canonical `/foundry/guide` and robots noindex. No production domain was named. |
| Q07 | N/A | No social card was added. |
| Q08 | N/A | No document route for unknown paths was added. |
| Q09 | N/A | Share does not start a request. The room status appears with the click. |
| Q10 | PASS | Room `ab` says to use a name such as harbor, then share again. Share stays off. |
| Q11 | PASS | The desk h1 stays Foundry. The guide has one h1. Live share is an h3 in the user guide. |
| Q12 | PASS | Share is a named button. The room field has a label. Preview tasks use Checked and Unchecked. No new image. |
| Q13 | N/A | No sitemap change. robots still disallows the whole class. |
| Q14 | PASS | The exercised Chrome flow reported no app-owned console error and no page error. |
| Q15 | PASS | The share module, the markdown parser, and the lab have no `console.log`. |
| Q16 | N/A | This was `next dev`, not a release build. Source maps were not published. |
| Q17 | NOT RUN | No bundle was measured. No JavaScript budget is recorded. |
| Q18 | PASS | At 1280, 768, 390, and 360 the canvas stayed at least 128px, Share was 44px and on screen, and the guide did not overflow. |
| Q19 | PASS | Share uses the existing paper, ink, line, and copper controls and sits in the Modeling panel. |
| Q20 | PASS | A bad room is refused. Two tabs in one browser share a screen. Preview shows the table, the tasks, and the strikethrough. The guide section opens from its contents link. |

Release-ready: no. Q17 was not run, and the public host was not part of this check.
