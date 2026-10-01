# Foundry modeling desk

Date: 1 October 2026. Scope: the Foundry desk can find a shape, run a command, check a sheet when it is opened or saved, switch the canvas between light and dark, preview markdown notes, download HTML notes and an SVG, and print the diagram at A4 or Letter. A local command reads the same JSON. This is a local change note. It is not a release-wide pass. The class on port 3960 was not rebuilt. The public host was not opened. The release certificate `docs/quality/release-2026-10-01.md` still stands for commit ed1478c and was not revised.

The drawing stays a JSON file. Check looks for a blank name, a repeated name, two shapes that share an id, and a link whose end is missing. A loop back to the same shape is allowed. The check is scheduled off the open, export, and Check actions and does not refuse the file. Code sketches for Java, C#, C++, and Python are local text, not a compiler, and they do not download an extension. HTML notes are a download, not an upload. Print uses the browser with an A4 or Letter page size. There is no PDF library and no updater. This page is the class build: open it in a browser on Windows, macOS, or Linux, and load it again to use the build that is running. The command is `node --experimental-strip-types scripts/foundry-cli.mjs drawing.json --code java`, with `--html`, `--svg`, and `--check`.

## Evidence

Checked in Chrome against `next dev` on http://127.0.0.1:3966 from `/Users/favl/workspace/keel`. Port 3960 was left as it was. `pnpm exec tsc --noEmit` exited 0. `pnpm exec eslint --max-warnings 0` on the Foundry lab, the modeling desk, the extension host, the AI desk, the Mermaid panel, the model library, the model tests, and `scripts/foundry-cli.mjs` exited 0. `pnpm exec vitest run` with `DATABASE_URL` and the `POSTGRES_URL` variables unset: 80 passed, 1 skipped. The skipped file is `tests/postgres.test.ts`. The Vite ESM warning and the Better Auth “Invalid password” line in the existing passphrase test are the usual ones. SQLite’s experimental warning is the usual one.

Chrome on `/foundry`, signed out, dark color scheme:

- Title includes Foundry and Keel (`Interactive Systems Foundry · Keel`). One visible h1, `Foundry`. The open panel adds an h2, `Modeling`.
- Commands, then Place a screen, drew Library, Find a book, Card number, and Search, and selected Wireframe.
- Commands, then Search, selected that shape. The name field read Search.
- A note of `# Harbor`, a script tag, and a `javascript:` link previewed the heading as text. The preview contained no script element and no `javascript:` link.
- Check on the named sheet reported `Checked. No notes.` Clearing the name reported `1 note.` and `A shape on Diagram 1 has no name. Give it a name, then check again.`
- New diagram, then Commands for Diagram 1, returned to the sheet that holds Library.
- Light set the page theme and the canvas to light. The canvas background was `rgb(246, 240, 230)` and the sketch stroke was `#1c1916`. Dark put the canvas back and the stroke was `#f3e6d4`.
- HTML notes downloaded a file that named Search and the Foundry notes line, with no raw script tag and no `javascript:` link.
- Letter set `data-foundry-page` on the desk and on the document, and Print recorded `letter`.
- Control+F left the command dialog closed. Control+Shift+F and Control+K opened it. Escape closed it.
- Blank canvas, from the dialog, removed Library.
- At 1280×900 the page and the Foundry root were 1280px wide. With Modeling open, the canvas was 305px tall and the four labels were on the sheet. Check sat inside the page.
- At 768×1024 the page was 768px wide and the canvas was 391px tall.
- At 390×844 the page and the root were 390px wide. The canvas was 383px tall. Check was fully inside the page.
- At 360×800 the page and the root were 360px wide. The canvas was 339px tall. Check was fully inside the page. No horizontal overflow on these widths.
- In print layout the language row and the Modeling panel were hidden and the canvas stayed visible.
- Focus on Check was `:focus-visible` with a solid outline.
- The exercised Chrome flow reported no app-owned console error and no page error.

The tool row still scrolls after 16rem, and the modeling panel scrolls inside 9rem on a phone and 12rem on a wider screen, so the canvas stays above the 8rem floor.

## Checks for this change

| ID | Result | Evidence |
|---|---|---|
| Q01 | N/A | No domain was named. This check used the local dev server. The public host was not opened. |
| Q02 | PASS | Title includes Foundry and Keel. One visible h1, Foundry. The panel heading is Modeling. |
| Q03 | N/A | No metadata edit. The Foundry page stays on the existing noindex site. |
| Q04 | N/A | No icon file changed. |
| Q05 | N/A | No public share card was added. This is not a release. |
| Q06 | N/A | No indexable URL was added. |
| Q07 | N/A | No social card was added. |
| Q08 | N/A | No document route was added. |
| Q09 | PASS | Check shows `Checking this sheet…` and then `Checked. No notes.` or `1 note.` The open and the export are not held back. |
| Q10 | PASS | A blank name says to give the shape a name and check again. A file that is not a drawing keeps the existing open error. The command exits 2 for a bad file and 1 when a note is found. |
| Q11 | PASS | One visible h1, Foundry. The panel uses an h2, Modeling. A note heading is previewed below that. |
| Q12 | PASS | The new actions have visible names. The find field is named Find a command or shape. The sketch stroke stays decorative. |
| Q13 | N/A | No sitemap or robots change. The class stays unlisted. |
| Q14 | PASS | The exercised Chrome flow reported no app-owned console error and no page error. |
| Q15 | PASS | The lab, the modeling desk, and the model library have no `console.log`. The command prints its artifact on purpose. |
| Q16 | N/A | No release build was produced. The check used `next dev`. |
| Q17 | NOT RUN | No JavaScript budget is recorded, and this note did not measure a production bundle. |
| Q18 | PASS | 1280×900 canvas 305px, 768×1024 canvas 391px, 390×844 canvas 383px, 360×800 canvas 339px. Page width matched the viewport. Check was inside the page at each width. |
| Q19 | PASS | The panel uses the same paper, ink, copper, radius, and 44px actions as the Mermaid desk. Light and dark stay on the existing theme store. |
| Q20 | PASS | Place a screen, Search, Check, HTML notes, Print, Light, Dark, Diagram 1, and Blank canvas ran. Control+K and Control+Shift+F opened the dialog. Control+F did not. Focus on Check was a visible outline. |

Release-ready: no. Q17 was not run, and this note does not replace the release certificate.
