# Foundry sheets, SQL keys, and local extension controls

Date: 1 October 2026. Scope: Timing, Interaction overview, Information flow, and Profile as UML diagrams on the Foundry desk. A SQL sketch adds a foreign key when one shape links to another. An extension kept in this browser can add a menu item, an Alt chord, and a one-field dialog. This is a local change note. It is not a release-wide pass. The class on port 3960 was not rebuilt. The public host was not opened. The release certificate `docs/quality/release-2026-10-01.md` still stands for commit ed1478c and was not revised. Earlier Foundry notes were left as they were.

Choose UML 2, then Timing, Interaction overview, Information flow, or Profile. Timing has Lifeline, State, Duration, Tick, Message, and Time constraint. Interaction overview has Initial, Action, Interaction, Decision, Fork, Final, and Transition. Information flow has Class, Actor, Information, Item flow, and Dependency. Profile has Profile, Stereotype, Metaclass, Extension, and Import.

A SQL sketch still writes `CREATE TABLE` as local text. A link adds `FOREIGN KEY … REFERENCES … (id)`. The sketch is not a database server. Java, C#, C++, Python, PHP, JavaScript, TypeScript, Ruby, and GraphQL stay local text as well.

`keel.menu` adds a name to Menu on the desk. `keel.key` accepts a chord such as `alt+s`. `keel.dialog` opens one field and puts the text on `diagram.answer`. The script stays in this browser under `keel.foundry.extensions.v1`. The desk does not install a script from the web. Students do not connect a GitHub, CI, Docker, or cloud account from Keel. The lab still shows the consequence of a choice.

## Evidence

Checked in Chrome against `next dev` on http://127.0.0.1:3968 from `/Users/favl/workspace/keel`. Port 3960 was left as it was and still answered `{"ok":true}`. `pnpm exec tsc --noEmit` exited 0. `pnpm exec eslint --max-warnings 0` on the board, the model, the MCP sketch, the guide, the extension library, the extension panel, the lab, and the touched tests exited 0. `pnpm exec vitest run` with `DATABASE_URL` and the `POSTGRES_URL` variables set to empty strings: 99 passed, 1 skipped. The skipped file is `tests/postgres.test.ts`. The Vite ESM warning, the SQLite experimental warning, and the Better Auth “Invalid password” lines in the existing passphrase test are the usual ones.

Chrome, signed out:

- The UML diagram list includes Timing, Interaction overview, Information flow, and Profile. Each toolbox showed the names above. Clicking Duration reported Added Duration.
- The guide says to choose each of those four diagrams. It names `keel.menu`, `alt+s`, `diagram.answer`, and a foreign key.
- An extension saved in the page added Menu. Menu was 44px tall. Its dialog renamed the selected Class to Harbor and the panel reported Updated 1 shape.
- With that panel open, the root did not overflow at 1280, 768, 390, or 360. Canvas height was 128 at 1280, 128 at 768, 129 at 390, and 128 at 360. At 360 the Menu control started below the 800px viewport because the toolbar scrolls. A Timing toolbox button, after the toolbar was scrolled, sat inside the page at top 268. That button is 30px tall, the same size as the other toolbox buttons.
- The exercised Chrome flow reported no app-owned console error and no page error.

## Checks for this change

| ID | Result | Evidence |
|---|---|---|
| Q01 | N/A | No domain was named. This check used the local dev server. The public host was not opened. |
| Q02 | PASS | The desk h1 stays Foundry. The guide h1 stays Foundry guide. |
| Q03 | PASS | The guide names the four diagrams, the foreign key, the menu, the chord, and the dialog field. |
| Q04 | N/A | No icon file changed. |
| Q05 | N/A | No public share card was added. This is not a release. |
| Q06 | N/A | No canonical URL was added. |
| Q07 | N/A | No social card was added. |
| Q08 | N/A | No document route for unknown paths was added. |
| Q09 | N/A | Choosing a diagram and saving a local script do not start a network request. |
| Q10 | PASS | A key chord that is not Alt plus one letter is refused. A menu that names a missing command is refused. |
| Q11 | PASS | The desk keeps one h1. The new diagrams are toolbox groups, not extra page headings. |
| Q12 | PASS | Menu is a named button. The dialog field has a label. Toolbox buttons keep their existing names. No new image. |
| Q13 | N/A | No sitemap change. robots still disallows the whole class. |
| Q14 | PASS | The exercised Chrome flow reported no app-owned console error and no page error. |
| Q15 | PASS | The new board, sketch, and extension code has no `console.log`. |
| Q16 | N/A | This was `next dev`, not a release build. Source maps were not published. |
| Q17 | NOT RUN | No bundle was measured. No JavaScript budget is recorded. |
| Q18 | PASS | At 1280, 768, 390, and 360 the desk did not overflow and the canvas stayed at least 128px with the extension panel open. Menu is 44px. The toolbar scrolls, and a toolbox button is 30px, as the other toolbox buttons are. |
| Q19 | PASS | The new sheets use the existing paper, ink, line, and copper toolbox. Menu uses the same toolbar button as Extensions. |
| Q20 | PASS | Each new diagram shows its tools. Duration can be added. A saved extension opens Menu, accepts a dialog value, and renames the selected shape. |

Release-ready: no. Q17 was not run, and the public host was not part of this check.
