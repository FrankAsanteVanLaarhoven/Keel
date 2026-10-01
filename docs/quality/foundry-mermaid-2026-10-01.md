# Foundry Mermaid and sketch wireframes

Date: 1 October 2026. Scope: the Foundry desk can turn a short Mermaid description into shapes on the open sheet, and it can place a hand-drawn Harbor Library wireframe. This is a local change note. It is not a release-wide pass. The class on port 3960 was not rebuilt. The public host was not opened. The release certificate `docs/quality/release-2026-10-01.md` still stands for commit ed1478c and was not revised.

The parser runs in the browser. It reads `flowchart` or `graph`, `classDiagram`, `erDiagram`, and `sequenceDiagram`, including a fenced block. It places at most 12 shapes and 16 links from a description of at most 4,000 characters. Place a screen adds Library, Find a book, Card number, and Search, switches that sheet to Wireframe, and draws those shapes with a paper-colored sketch stroke. Sketch turns that stroke off and on. With Wireframe selected, the existing AI desk is the agent that can redraw a screen from a description. This pass did not call the class model. The desk does not fetch a remote Mermaid service, and it does not add a second model path.

## Evidence

Checked in Chrome against `next dev` on http://127.0.0.1:3965 from `/Users/favl/workspace/keel`. Port 3960 was left as it was and still answered `{"ok":true}` after the temporary server stopped. `pnpm exec tsc --noEmit` exited 0. `pnpm exec eslint --max-warnings 0` on the Foundry lab, the Mermaid panel, the parser, the sketch helper, and the Mermaid tests exited 0. `pnpm exec vitest run` with `DATABASE_URL` and the `POSTGRES_URL` variables unset: 74 passed, 1 skipped. The skipped file is `tests/postgres.test.ts`. The Vite ESM warning and the Better Auth “Invalid password” line in the existing passphrase test are the usual ones. SQLite’s experimental warning is the usual one.

Chrome on `/foundry`, signed out:

- Title `Interactive Systems Foundry · Keel`. One h1, `Foundry`. The open panel adds an h2, `Mermaid`.
- Insert example, then Draw from Mermaid, showed Reader, Library card, and On loan?, and the status `Drawn from Mermaid.`
- An empty description reported `Write a Mermaid diagram, then draw again.`
- Place a screen selected Wireframe and drew Library, Find a book, Card number, and Search. Each wireframe shape had the class `foundry-sketch` and a paper stroke `#f3e6d4`. Search sat inside the Library screen. The input and output ports kept a visible ring.
- Sketch turned the stroke off (`aria-pressed` false, no `foundry-sketch`) and back on.
- Tab from the description landed on Draw from Mermaid with a solid 2px outline.
- At 1280×900 the page and the Foundry root were 1280px wide. After placing a screen, the canvas was 219px tall and Library, Find a book, Card number, and Search were all inside it.
- At 768×1024 the page was 768px wide, the canvas was 305px tall, and the same four labels were inside it.
- At 390×844 the page and the Foundry root were 390px wide. Draw from Mermaid, Insert example, and Place a screen were each fully inside the panel. The canvas was 297px tall and the four labels were inside it.
- At 360×800 the same three buttons were fully inside the panel. No horizontal overflow on the widths above.
- The exercised Chrome flow reported no app-owned console error and no page error.

On a wide screen the tool row scrolls after 16rem, and the selected-shape inspector scrolls inside 14rem, so the canvas keeps enough height to show the screen.

## Checks for this change

| ID | Result | Evidence |
|---|---|---|
| Q01 | N/A | No domain was named. This check used the local dev server. The public host was not opened. |
| Q02 | PASS | Title `Interactive Systems Foundry · Keel`. One h1, Foundry. The panel heading is Mermaid. |
| Q03 | N/A | No metadata edit. The Foundry page stays on the existing noindex site. |
| Q04 | N/A | No icon file changed. |
| Q05 | N/A | No public share card was added. This is not a release. |
| Q06 | N/A | No indexable URL was added. |
| Q07 | N/A | No social card was added. |
| Q08 | N/A | No document route was added. |
| Q09 | PASS | Drawing is immediate. The status line reports `Drawn from Mermaid.` or the wireframe summary in the same action. |
| Q10 | PASS | An empty description says to write a diagram and draw again. An unknown header names the four diagrams the desk reads. |
| Q11 | PASS | One h1, Foundry. The panel uses an h2, Mermaid. |
| Q12 | PASS | The sketch stroke is decorative and hidden from the accessibility tree. The buttons have visible names. |
| Q13 | N/A | No sitemap or robots change. The class stays unlisted. |
| Q14 | PASS | The exercised Chrome flow reported no app-owned console error and no page error. |
| Q15 | PASS | The new parser, sketch helper, and panel have no `console.log`. |
| Q16 | N/A | No release build was produced. The check used `next dev`. |
| Q17 | NOT RUN | No JavaScript budget is recorded, and this note did not measure a production bundle. |
| Q18 | PASS | 1280×900, 768×1024, 390×844, and 360×800. Page width matched the viewport. The screen’s four labels fit in the canvas at 1280, 768, and 390. The three Mermaid actions fit in the panel at 390 and 360. |
| Q19 | PASS | The panel uses the same paper, ink, copper, radius, and 44px actions as the AI desk. |
| Q20 | PASS | Draw from Mermaid, Insert example, Place a screen, and Sketch all ran. Keyboard focus on Draw from Mermaid was a solid 2px outline. |

Release-ready: no. Q17 was not run, and this note does not replace the release certificate.
