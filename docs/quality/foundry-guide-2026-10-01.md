# Foundry guide

Date: 1 October 2026. Scope: Foundry has a guide at `/foundry/guide`, opened from the Guide control on the desk. The guide covers the project, the diagrams on the language row, the check, the command line, the local extensions, and the MCP desk. This is a local change note. It is not a release-wide pass. The class on port 3960 was not rebuilt. The public host was not opened. The release certificate `docs/quality/release-2026-10-01.md` still stands for commit ed1478c and was not revised.

The guide names the people it is written for: a small team sharing one drawing, a person who sketches code from a model, and a class. Harbor Library stays fictional. It states the bounds in place: the page is the class build, UML 2 is the drawing set and not a certificate, the desk does not update itself, it leaves the MacBook Touch Bar alone, and an extension stays in this browser.

Sheets the desk does not keep as their own menu are described on the nearest sheet. Communication, timing, and interaction overview point at Sequence, State machine, or Activity. Information flow points at SysML item flow and Dataflow. A profile is a stereotype on the selected shape. Composite structure stays on the Class sheet. SysML keeps requirement, block, port, and constraint on one sheet. Azure and AI design are included because they are on the language row.

## Evidence

Checked in Chrome against `next dev` on http://127.0.0.1:3967 from `/Users/favl/workspace/keel`. Port 3960 was left as it was and still answered `{"ok":true}` after the temporary server stopped. `pnpm exec tsc --noEmit` exited 0. `pnpm exec eslint --max-warnings 0` on the guide page, the guide module, the lab, and the guide test exited 0. `pnpm exec vitest run` with `DATABASE_URL` and the `POSTGRES_URL` variables unset: 92 passed, 1 skipped. The skipped file is `tests/postgres.test.ts`. Two of the passing tests are in `tests/foundry-guide.test.ts`. The Vite ESM warning, the SQLite experimental warning, and the Better Auth “Invalid password” line in the existing passphrase test are the usual ones.

Chrome, signed out:

- `/foundry/guide` title `Foundry guide · Keel`. One visible h1, `Foundry guide`.
- The contents link for the command line moved the CLI section below the header. The section names the local `foundry-cli` command.
- The page text did not contain StarUML or XMI. The Touch Bar and extension-registry headings were present.
- Back to Foundry opened the desk. Guide on the desk returned to the guide. At 390 the Guide control was 44px tall and inside the page.
- At 1280×900, 768×1024, 390×844, and 360×800 the guide page width matched the viewport. Back to Foundry was 44px tall and inside the page.
- On the desk, at 1280 the canvas was 451px tall, at 768 it was 537px, at 390 it was 529px, and at 360 it was 485px. Guide was 44px tall and inside the page at each of those widths.
- The exercised Chrome flow reported no app-owned console error and no page error.

## Checks for this change

| ID | Result | Evidence |
|---|---|---|
| Q01 | N/A | No domain was named. This check used the local dev server. The public host was not opened. |
| Q02 | PASS | Title is Foundry guide · Keel. One visible h1, Foundry guide. The desk h1 stays Foundry. |
| Q03 | PASS | The guide description says how to draw, check, sketch, and extend a Foundry project. The page is noindex. It does not name a person or a class record. |
| Q04 | N/A | No icon file changed. |
| Q05 | N/A | No public share card was added. The page is noindex. This is not a release. |
| Q06 | N/A | The page sets a relative canonical of `/foundry/guide` and robots noindex, matching the private class. No production domain was named. |
| Q07 | N/A | No social card was added. The page is noindex. |
| Q08 | N/A | No document route for unknown paths was added. `/foundry/guide` is a known page. |
| Q09 | N/A | The guide is a document. It does not start a pending request. |
| Q10 | N/A | No new error sentence. The guide repeats the existing open, check, extension, and MCP sentences. |
| Q11 | PASS | One h1. Chapters are h2. Topics are h3. The contents list is a navigation list, not a second set of headings. |
| Q12 | PASS | Guide and Back to Foundry are named links. The contents links use the topic names. No new image. |
| Q13 | N/A | No sitemap change. robots still disallows the whole class. The guide page is noindex. |
| Q14 | PASS | The exercised Chrome flow reported no app-owned console error and no page error. |
| Q15 | PASS | The guide page and the guide module have no `console.log`. The lab change is a link. |
| Q16 | N/A | No release build was produced. The check used `next dev`. |
| Q17 | NOT RUN | No JavaScript budget is recorded, and this note did not measure a production bundle. |
| Q18 | PASS | Guide page at 1280, 768, 390, and 360. Desk Guide control at 1280, 768, 390, and 360. Page width matched the viewport. The canvas stayed above 128px. |
| Q19 | PASS | The page uses the existing ink, line, and type scale. Guide uses the same toolbar button size as Modeling. |
| Q20 | PASS | A contents link opened the command-line section. Back to Foundry opened the desk. Guide returned to the guide. The page has the skip target `content`. |

Release-ready: no. Q17 was not run, and this note does not replace the release certificate.
