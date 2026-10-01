# Foundry MCP desk

Date: 1 October 2026. Scope: the Foundry desk can draw a diagram, suggest a next step, and sketch code through an MCP server on this class. This is a local change note. It is not a release-wide pass. The class on port 3960 was not rebuilt. The public host was not opened. The release certificate `docs/quality/release-2026-10-01.md` still stands for commit ed1478c and was not revised.

The server is `POST /api/foundry/mcp`. It speaks MCP `2025-06-18` and `2025-03-26` over one JSON-RPC message. `GET` returns 405 because the desk does not keep a server stream. A browser `Origin` that is not this class is refused. A client with no `Origin`, such as a local MCP client, may call the same tools. Each call carries the open sheet. The server does not store the sheet.

The tools are `list_desk`, `suggest_diagram`, `generate_diagram`, and `generate_code`. Draw diagram writes shapes onto the open sheet. Suggest reads the sheet. Sketch code returns TypeScript or SQL the learner can read. The sketch is not run. The tools do not reach GitHub, CI, Docker, or a cloud account.

Without a signed-in session, or without the live tutor allowed, the desk answers from the sheet. A signed-in learner who allowed the live tutor can receive a drawing or a code sketch from the class model. That call uses the existing server path and the model id `grok-4.7` documented at https://docs.x.ai on 1 October 2026. The key stays on the server. A model reply that does not fit the desk, or that asks for a deploy step, is set aside and the sheet uses the desk sketch. This is not a draw.io MCP product, and it does not validate a model or exchange XMI.

## Evidence

Checked in Chrome against `next dev` on http://127.0.0.1:3964 from `/Users/favl/workspace/keel`. Port 3960 was left as it was. `pnpm exec tsc --noEmit` exited 0. `pnpm exec eslint --max-warnings 0` on the MCP library, the route, the desk panel, the Foundry lab, and the MCP tests exited 0. `pnpm exec vitest run` with `DATABASE_URL` and the `POSTGRES_URL` variables unset: 64 passed, 1 skipped. The skipped file is `tests/postgres.test.ts`. After the last panel spacing edit, eslint on the panel and `tests/foundry-mcp.test.ts` passed again. The Vite ESM warning and the Better Auth “Invalid password” line in the existing passphrase test are the usual ones. SQLite’s experimental warning is the usual one.

`curl` against http://127.0.0.1:3964/api/foundry/mcp: `GET` returned 405. A post from `https://evil.example` returned 403, `This desk only answers this class.` An initialize post from this host returned protocol `2025-06-18` and server name `keel-foundry`. A signed-out `generate_diagram` for `Card and Loan` returned `Added 2 shapes. Added 1 link. Answered on this desk.` with two `uml-class` shapes. The browser check was signed out, so it did not call the class model. The model path was checked in `tests/foundry-mcp.test.ts` with a stand-in reply.

Chrome on `/foundry`:

- Title `Interactive Systems Foundry · Keel`. One h1, `Foundry`. The panel adds an h2, `AI desk`.
- With the MCP response held, the button read `Drawing…`, then the sheet reported `Added 2 shapes` and `Answered on this desk`. The canvas showed `Loan`.
- Suggest reported `The selection is Loan.` Sketch code showed `export type Card` and `export type Loan`.
- An empty description reported `Describe the diagram, then draw again.`
- Tab from the description field landed on Draw diagram with a solid 2px outline.
- At 1280×900 the page and the Foundry root were 1280px wide. Draw diagram was inside the panel. The canvas was 226px tall and a second draw added `Shelf` and `Copy`.
- At 390×844 the page and the Foundry root were 390px wide. Draw diagram was inside the panel. The panel was 176px tall and the canvas was 345px tall. The same draw added the shapes. No horizontal overflow.
- The exercised Chrome flow reported no app-owned console error and no page error.

## Checks for this change

| ID | Result | Evidence |
|---|---|---|
| Q01 | N/A | No domain was named. This check used the local dev server. The public host was not opened. |
| Q02 | PASS | Title `Interactive Systems Foundry · Keel`. One h1, Foundry. |
| Q03 | N/A | No metadata edit. The Foundry page stays on the existing noindex site. |
| Q04 | N/A | No icon file changed. |
| Q05 | N/A | No public share card was added. This is not a release. |
| Q06 | N/A | No indexable URL was added. |
| Q07 | N/A | No social card was added. |
| Q08 | N/A | No document route was changed. The MCP route is a JSON endpoint, and `GET` returns 405. |
| Q09 | PASS | The draw button read `Drawing…` while the request was held, then reported `Added 2 shapes`. |
| Q10 | PASS | An empty description said `Describe the diagram, then draw again.` A foreign origin said `This desk only answers this class.` A model reply that does not fit falls back to the desk sketch. |
| Q11 | PASS | One h1, Foundry. The panel heading is an h2, AI desk. |
| Q12 | PASS | The description field has a visible label. Draw diagram, Suggest, and Sketch code are named buttons. Suggestions are labeled. |
| Q13 | N/A | No public discovery URL was added. The programme stays noindex. |
| Q14 | PASS | Chrome on the signed-out draw, suggest, and code flow reported no app-owned console error. |
| Q15 | PASS | The new desk files have no `console.log`. The existing service log in `lib/runpack.ts` was left as it was. |
| Q16 | N/A | This was not a release build, and no source map was published. |
| Q17 | NOT RUN | No JavaScript budget is recorded. The route bundle was not measured. |
| Q18 | PASS | At 390×844 the page was 390px wide, Draw diagram was on screen, the canvas was 345px, and the draw completed. At 1280×900 the draw completed with the button on screen. |
| Q19 | PASS | The panel uses the existing line, paper, raised, ink, and copper classes, `rounded-lg`, `text-xs`, and `min-h-11`. |
| Q20 | PASS | Draw diagram, Suggest, and Sketch code completed. The empty-description alert names the next step. Keyboard focus reached Draw diagram with a solid 2px outline. |

## Still open

The work is uncommitted. The class on port 3960 and https://keelai-os.vercel.app do not have this desk. Q17 was not run. The header mission row still scrolls. A signed-in model answer was not exercised in Chrome. The release certificate was not revised.
