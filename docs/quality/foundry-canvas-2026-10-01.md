# Foundry full-page canvas

Date: 1 October 2026. Scope: the Foundry lab opens across the page, starts empty, and the drawing can be created, changed, and removed without a size cap. This is not a release-wide pass of the 20 checks. https://keelai-os.vercel.app was not opened. This is not a draw.io or Lucid clone. The lab keeps its missions, templates, simulation, and service runner, and adds the drawing tools listed below.

The page opens with the canvas covering the window, including the class header. Exit full page puts the class heading and the architecture toolbox back. Freeform starts with no parts. Blank canvas clears the current drawing and returns to that empty board. A saved JSON file can be opened, and a file that is not a Foundry drawing says so.

Cards keep the short name. A longer meaning stays on the card’s title, not in the card body. Shapes are text, box, ellipse, diamond, cylinder, cloud, and note. They are not runnable service parts. Wires can be a curve, an elbow, or a straight line. The board grows past the parts, scrolls, and can be zoomed or fitted. Snap is a 20px grid. Undo and redo cover the drawing edits.

Tools on the bar: Select / Move, Hand, Connect Arrow, Cut Wire, Text, Box, Ellipse, Diamond, Cylinder, Cloud, Note, Undo, Redo, Copy, Delete, Snap, Front, Back, connector style, zoom in, 100%, zoom out, Fit, Auto-Layout, Add a part, templates, Clear, Blank canvas, Open, Parts, and Full page or Exit full page. Parts opens the architecture toolbox, telemetry, and fault injection over the canvas. There is no multi-select align.

On a narrow window the mission chips stay on one line and scroll sideways. The tool bar scrolls inside a fixed height so the canvas keeps most of the screen.

## Evidence

Checked in Chrome against `next dev` on http://127.0.0.1:3961 from `/Users/favl/workspace/keel`. The class on port 3960 was left running and was not rebuilt for this note.

- `pnpm exec tsc --noEmit` exited 0.
- `pnpm exec eslint components/foundry-lab.tsx lib/foundry-board.ts tests/foundry-board.test.ts` exited 0 with no messages.
- `pnpm test` with `DATABASE_URL` and the `POSTGRES_URL` variables unset: 46 passed, 1 skipped. The skipped file is `tests/postgres.test.ts`. The README badge now says 46 passing.
- No `console.log` was added in the Foundry files. The exercised Chrome session reported no console error, no console warning, and no page error.
- Title was `Interactive Systems Foundry · Keel`. Full page had one h1, Foundry. After Exit full page the only h1 was Systems Architecture & Dataflow Lab, and the toolbox heading was present.
- The overlay covered the window: top 0 and the full viewport height at 1280×900, 390×844, and 360×800. A point on the class header hit the Foundry layer. The page did not grow sideways (`scrollWidth` matched the viewport).
- Canvas viewport: 665×1262 at 1280×900, 611×372 at 390×844, 567×342 at 360×800.
- Harbor Market places PostgreSQL Ledger at x 890. Fit brought that card inside the canvas. At 100% the board’s scroll width was 1600 against a 1262px canvas, and scrolling reached the ledger. The card text was the short name, `35 ms`, and `20 rps`, not a glossary paragraph.
- Blank canvas removed the Harbor parts. Box added a shape, the name became Storefront, and the resize handle grew it from 160×90 to 260×160. A client and an app were connected with one wire. Changing the connector to straight replaced the curve. Latency accepted 25000 with no max. Role accepted Desk. Delete removed the shape and Undo put it back. Backspace deleted a selected box and Command-Z restored it.
- Parts set the toolbox to open (`aria-pressed` true, the toolbox heading had a layout box). The architecture list, telemetry, and fault injection were visible over the canvas.
- Opening `{"nope":true}` showed: That file is not a Foundry drawing. Open a JSON file saved from this lab.
- At 390×844 the Freeform chip was one line, 30×251. Blank canvas could be scrolled into view inside the tool bar.

## Checks for this change

| ID | Result | Evidence |
|---|---|---|
| Q01 | N/A | No domain was named. The local class stays on 127.0.0.1. The public host was not opened. |
| Q02 | PASS | Chrome title was `Interactive Systems Foundry · Keel`. Full page had one h1, Foundry. |
| Q03 | N/A | The page description was not changed. |
| Q04 | N/A | No new icon file. The tools reuse the existing icons. |
| Q05 | N/A | No share image. |
| Q06 | N/A | No new canonical origin. |
| Q07 | N/A | No social card. |
| Q08 | N/A | The 404 page was not changed. |
| Q09 | N/A | Opening a drawing is immediate. No new waiting state. |
| Q10 | PASS | A file that is not a Foundry drawing says that, and says to open a JSON file saved from this lab. |
| Q11 | PASS | One h1 in full page, and one h1 after leaving it. |
| Q12 | PASS | No new informative image. Resize, Zoom in, Zoom out, Connector style, and Open a Foundry drawing have accessible names. |
| Q13 | N/A | Indexing was not changed. |
| Q14 | PASS | The Chrome session on 3961 reported no console error, no console warning, and no page error. This was the dev server, not a production build. |
| Q15 | PASS | The Foundry files add no `console.log`. |
| Q16 | N/A | Source maps were not changed. |
| Q17 | NOT RUN | No production bundle was measured, and no budget is recorded. |
| Q18 | PASS | 1280×900, 390×844, and 360×800 were exercised. The canvas stayed the main surface and the page did not scroll sideways. Blank canvas, a shape, a wire, fit, and scroll were used at desktop width. |
| Q19 | PASS | The bar uses the existing paper, ink, copper, border, radius, and text sizes. |
| Q20 | PASS | Blank canvas, the shape tools, Fit, Parts, Exit full page, delete, and undo worked. Backspace and Command-Z deleted and restored a box. |
