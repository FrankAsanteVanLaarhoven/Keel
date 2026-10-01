# Foundry UML tools

Date: 1 October 2026. Scope: the Foundry canvas can draw UML elements and relationships. This is not a release-wide pass of the 20 checks. The public host was not opened. The class on port 3960 was not rebuilt. This is not a StarUML clone: there is no XMI round-trip and no model check. The lab keeps its missions, templates, simulation, and service runner.

Pick a diagram and that diagram’s elements appear on the bar. The diagrams are Class, Use case, Sequence, Activity, Component, Deployment, State machine, Object, and Package. Every relationship is in the UML relation list: Association, Directed association, Aggregation, Composition, Generalization, Realization, Dependency, Include, Extend, Message, Return, Create, Destroy, Transition, Object flow, Assembly, Communication path, Deployment, Containment, Import, and Merge. Dataflow stays the architecture wire.

A class, interface, enumeration, data type, object, or state shows a stereotype and compartments. Attributes and operations are one entry per line. A selected wire can take a name, roles, and multiplicities. UML elements are drawing shapes. They are not runnable service parts. A board that still has a client, a gateway, and an application can run; a class on that board is ignored by the service.

New parts land beside the previous one when the canvas is wide, and below it when the window is narrow. The canvas scrolls to keep the selected part in view.

## Evidence

Checked in Chrome against `next dev` on http://127.0.0.1:3961 from `/Users/favl/workspace/keel`. Port 3960 was left as it was.

- `pnpm exec tsc --noEmit` exited 0.
- `pnpm exec eslint components/foundry-lab.tsx lib/foundry-board.ts tests/foundry-board.test.ts` exited 0 with no messages.
- `pnpm test` with `DATABASE_URL` and the `POSTGRES_URL` variables unset: 51 passed, 1 skipped. The skipped file is `tests/postgres.test.ts`. The README badge now says 51 passing.
- No `console.log` was added in the Foundry files. The exercised Chrome session reported no console error and no page error.
- Title was `Interactive Systems Foundry · Keel`. Full page had one h1, Foundry. After Exit full page the only h1 was Systems Architecture & Dataflow Lab.
- The UML diagram list had the nine diagrams. The relation list had Dataflow plus the 21 relationships. Each diagram’s element buttons were present when that diagram was selected.
- At 1280×900 a Class with stereotype entity, attributes `id: UUID` and `name: string`, and operation `save()` sat beside an Interface. A generalization joined them with a hollow triangle. The wire labels were `1 owner` and `*`. The page did not grow sideways (`scrollWidth` 1280).
- Two use cases joined by Include drew a dashed line labeled «include». A lifeline message to itself drew a filled arrow. Delete removed the lifeline and Undo put it back.
- Blank canvas, then Add a part set to Client, showed one service card with milliseconds and requests per second. Focus landed on the UML diagram list and, later, on the node name field.
- At 390×844 the Use case diagram offered Actor, Use case, and Boundary. Actor and Use case were connected. The canvas showed the use case and the line, and the panel read Connection: Actor → Use case. `scrollWidth` was 390. The UML diagram control was 31px tall.
- At 360×800 a State showed the internal line `entry / open`. `scrollWidth` was 360.
- With the properties open, a tall pair does not fit in the phone canvas at once. The drawing scrolls inside the canvas.

## Checks for this change

| ID | Result | Evidence |
|---|---|---|
| Q01 | N/A | No domain was named. This check used the local dev server. The public host was not opened. |
| Q02 | PASS | Chrome title was `Interactive Systems Foundry · Keel`. Full page had one h1, Foundry. |
| Q03 | N/A | The page description was not changed. |
| Q04 | N/A | No new icon file. The tools reuse the existing icons. |
| Q05 | N/A | No share image. |
| Q06 | N/A | No new canonical origin. |
| Q07 | N/A | No social card. |
| Q08 | N/A | The 404 page was not changed. |
| Q09 | N/A | Adding an element is immediate. No new waiting state. |
| Q10 | N/A | No new error message. Opening a bad file was not part of this change. |
| Q11 | PASS | One h1 in full page, and one h1 after leaving it. |
| Q12 | PASS | No new informative image. UML diagram, UML relation, Stereotype, Attributes, Operations, and the wire role and multiplicity fields have accessible names. |
| Q13 | N/A | Indexing was not changed. |
| Q14 | PASS | Chrome on the 3961 dev server reported no console error and no page error on the flow above. |
| Q15 | PASS | The Foundry files add no `console.log`. |
| Q16 | N/A | This was a dev server. Source maps were not published. |
| Q17 | NOT RUN | No production bundle was measured, and no budget is recorded. |
| Q18 | PASS | 1280×900, 390×844, and 360×800 were exercised. The page did not scroll sideways. A class diagram was drawn at desktop width. A use-case link and a state were drawn on the narrow widths. |
| Q19 | PASS | The bar and the properties use the existing paper, ink, copper, border, radius, and text sizes. |
| Q20 | PASS | The diagram list, the element buttons, the relation list, generalization, include, a self message, delete, undo, Blank canvas, and Add a part worked. The name field took keyboard focus. |
