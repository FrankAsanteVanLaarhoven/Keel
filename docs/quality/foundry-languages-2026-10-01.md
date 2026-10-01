# Foundry modeling languages in one project

Date: 1 October 2026. Scope: one Foundry project can hold diagrams in UML 2, ERD, Dataflow, Flowchart, Mind map, C4, SysML, BPMN, and the AI design studio. This is a local change note. It is not a release-wide pass. The class on port 3960 was not rebuilt. The public host was not opened. The release certificate `docs/quality/release-2026-10-01.md` still stands for commit ed1478c and was not revised.

The drawing desk keeps the missions, the templates, the simulation, and the service runner. A language change updates the toolbox and the current diagram's language. Shapes already on that diagram stay, and the other diagrams stay. A saved project file keeps every diagram. An older file that has only the current canvas still opens on the current diagram.

UML 2 keeps the nine diagram kinds: Class, Use case, Sequence, Activity, Component, Deployment, State machine, Object, and Package. ERD and AI design stay as they were. Dataflow places the nine runnable services and a plain wire, so a client still shows milliseconds and requests per second and the wire can carry the live packets. Flowchart, Mind map, C4, SysML, and BPMN add drawing shapes. Those shapes are not runnable service types. The desk draws them with the glyphs already on the canvas. There is no XMI round-trip and no model check.

## Evidence

Checked in Chrome against `next dev` on http://127.0.0.1:3962 from `/Users/favl/workspace/keel`. Port 3960 was left as it was. `pnpm exec tsc --noEmit` exited 0 after the last edit. `pnpm exec eslint` on `components/foundry-lab.tsx`, `lib/foundry-board.ts`, and `tests/foundry-board.test.ts` exited 0 after that edit. `pnpm exec vitest run` with `DATABASE_URL` and the `POSTGRES_URL` variables unset: 55 passed, 1 skipped. The skipped file is `tests/postgres.test.ts`.

Chrome results:

- `/foundry` title `Interactive Systems Foundry · Keel`, one h1 `Foundry`. The language list is UML 2, ERD, Dataflow, Flowchart, Mind map, C4, SysML, BPMN, and AI design.
- A Class stayed on the canvas after the language changed to SysML. Block then drew `«block» Block` beside it. Neither shape showed milliseconds or requests per second. The UML diagram menu was absent while SysML was selected.
- New diagram started empty. The second diagram took an Entity and read `Diagram 2 ERD`. Returning to the first diagram showed `Diagram 1 SysML`, both class shapes, and no entity.
- Dataflow Client showed `20 ms` and `50 rps`. BPMN Task did not. At 390×844 the Foundry root and the page were 390px wide, and Task was on screen in the scrolling bar.
- Focusing Modeling language showed a solid 2px outline.
- `/foundry?studio=erd` opened on ERD with Crow's foot. `/foundry?studio=deploy` opened on UML 2, Deployment.
- Flowchart tools were Start, Process, Decision, Input, Document, End, and Flow. Mind map tools included Topic. C4 tools included Person and Container. Export wrote three diagrams, families `flowchart`, `mindmap`, and `c4`, and the open file restored `Diagram 1 Flowchart`, `Diagram 2 Mind map`, and `Diagram 3 C4` with the Start node. Switching that diagram to Dataflow left the Start node in place. A plain wire from Client to Gateway used protocol `HTTPS / Dataflow`.
- The exercised Chrome flows reported no app-owned console error and no page error.

## Checks for this change

| ID | Result | Evidence |
|---|---|---|
| Q01 | N/A | No domain was named. This check used the local dev server. The public host was not opened. |
| Q02 | PASS | Title `Interactive Systems Foundry · Keel`. The full-page view has one h1, Foundry. |
| Q03 | N/A | No new route and no metadata edit. The Foundry page stays on the existing noindex site. |
| Q04 | N/A | No new icon file. The tools reuse the existing icons. |
| Q05 | N/A | This change adds no share image. The release certificate still records the public share image as blocked on the preview host. |
| Q06 | N/A | No new canonical origin. The programme stays unlisted. |
| Q07 | N/A | No new social card. |
| Q08 | N/A | The 404 page was not changed. |
| Q09 | PASS | Adding a part and opening a project show a toast: Added Client, Added API Gateway, and Opened 3 diagrams. There is no new waiting state. |
| Q10 | PASS | The open failure sentence is unchanged. This pass exercised the success path: a three-diagram file opened and named each language. |
| Q11 | PASS | The Foundry view has one h1. |
| Q12 | PASS | Modeling language, UML diagram, Toolbox, and Working diagrams have accessible names. The language control took keyboard focus with a solid 2px outline. |
| Q13 | N/A | No sitemap was added. The existing robots rule still disallows `/`. |
| Q14 | PASS | The Chrome flows above reported no app-owned console error and no page error. |
| Q15 | PASS | `lib/foundry-board.ts` and `components/foundry-lab.tsx` contain no `console.log`. |
| Q16 | N/A | This was a dev server. No release artifact was built, so source maps were not published from this change. |
| Q17 | NOT RUN | No production bundle was measured, and no JavaScript budget is recorded. `next build` was not run, because the live class on port 3960 shares its build output with a production server. |
| Q18 | PASS | 1280×900 and 390×844 were exercised. At 390 the Foundry root and `scrollWidth` were 390. Task was visible in the scrolling toolbar. Desktop showed the language menu, the flowchart tools, and three diagram cards. |
| Q19 | PASS | The bar uses the existing paper, ink, copper, border, radius, and type scale. |
| Q20 | PASS | Language change, New diagram, Class, Block, Entity, Client, Task, Flowchart, Mind map, C4, Export, Open, the plain Client-to-Gateway wire, `/foundry?studio=erd`, and `/foundry?studio=deploy` all ran. The language control accepted keyboard focus. |

## Language icon bar

The language control is a horizontal row of icon buttons in this order: UML 2, ERD, Dataflow, Flowchart, Mind map, C4, SysML, BPMN, Wireframe, AWS, GCP, Azure, then AI design. The selected language uses the copper border and copper label. Wireframe draws a screen, navigation, heading, button, field, image, list, and a link. AWS, GCP, and Azure draw named service boxes for a sketch: compute, storage, network, and identity. Those boxes are drawings. A client added from Dataflow still shows milliseconds and requests per second.

Checked again in Chrome on http://127.0.0.1:3962. UML 2 started pressed. AWS placed an EC2 box marked `«EC2»` with no requests-per-second line. Switching to Wireframe left that box on the canvas and a Button could be added. GCP showed Cloud Storage and Cloud Run. Azure showed Blob storage and Entra ID. The Azure button took keyboard focus with a solid 2px outline. At 390px the page `scrollWidth` stayed 390, the language row scrolled sideways, and Azure was on screen. No app-owned console error. `pnpm exec tsc --noEmit` and eslint on the three modeling files exited 0. The foundry board tests passed. Q17 remains not run. The class on port 3960 was not rebuilt.

## Still open

The work is uncommitted in `/Users/favl/workspace/keel`. Port 3960 and https://keelai-os.vercel.app do not have it. Q17 remains not run. The header mission row still sits in one scrolling row, which the release certificate already records. The new notations reuse the existing glyphs, so a flowchart decision is the diamond already used for a UML decision, and a C4 person is the actor figure.
