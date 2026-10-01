# Foundry local sketches

Date: 1 October 2026. Scope: the modeling desk can sketch PHP, JavaScript, TypeScript, Ruby, SQL, and GraphQL from the open drawing, a Java attribute also gets a getter and a setter, and Commands can list a shape's lines, remove a shape that has no line, and copy a shape's name. This is a local change note. It is not a release-wide pass. The class on port 3960 was not rebuilt. The public host was not opened. The release certificate `docs/quality/release-2026-10-01.md` still stands for commit ed1478c and was not revised.

The diagram languages, Mermaid, markdown notes, and the Java, C#, C++, and Python sketches were already on the desk. They were not rebuilt. The new sketches are local text. SQL writes one `CREATE TABLE` from the shape name and its attributes. It does not write foreign keys. GraphQL writes type fields. It does not write resolvers. The desk does not install an extension from the web, and it does not read a source file back into the drawing. The page does not name a modeling product, and it does not offer XMI.

Left out on purpose: a downloadable extension store, install and submit, download counts, author credits, XMI, git or live sharing, a code-editor link, Liquibase, Spring, JPA, Hibernate, reverse engineering, protobuf, Django, OpenAPI, a React CRUD app, a finite-state generator, PeeWee, UUID tags, a pixel-ratio control, an align tool, and a second PHP or TypeScript generator.

## Evidence

Checked in Chrome against `next dev` on http://127.0.0.1:3967 from `/Users/favl/workspace/keel`. Port 3960 was left as it was and still answered `{"ok":true}` after the temporary server stopped. `pnpm exec tsc --noEmit` exited 0. `pnpm exec eslint --max-warnings 0` on the lab, the modeling panel, `lib/foundry-model.ts`, the model test, and `scripts/foundry-cli.mjs` exited 0. `pnpm exec vitest run` with `DATABASE_URL` and the `POSTGRES_URL` variables unset: 90 passed, 1 skipped. The skipped file is `tests/postgres.test.ts`. `tests/foundry-model.test.ts` has 7 tests, including a line `Reader to Card (borrows)` and an unconnected shape named Spare. The Vite ESM warning, the SQLite experimental warning, and the Better Auth “Invalid password” line in the existing passphrase test are the usual ones.

Chrome on `/foundry`, signed out, two passes:

- Title `Interactive Systems Foundry · Keel`. One visible h1, `Foundry`.
- Place a screen put the Harbor Library wireframe on the sheet. Unconnected listed Remove Library, Remove Find a book, Remove Card number, and Remove Search. Remove Search took that shape off the list.
- Find a book was selected from Commands. Relationships then showed `Find a book has no line.` The wireframe has no links, so that sentence is the on-screen result. The unit test covers a real labeled line.
- Copy name showed a status toast that included `Find a book`. The clipboard contents were not read back.
- The language list offered java, cs, cpp, py, php, js, ts, ruby, sql, and graphql. Sketch code for PHP showed `<?php` and `class Library` in the modeling preview.
- The unfiltered command list included Sketch Java through Sketch SQL. Sketch GraphQL was not in that first list. Searching GraphQL found Sketch GraphQL, and the preview contained `type Library` and `type FindABook`.
- The page text did not contain StarUML or XMI.
- At 1280×900 the root and the page were 1280px wide, the canvas was 128px tall, and Commands was 44px tall and inside the page.
- At 768×1024 the root and the page were 768px wide, the canvas was 128px tall, and Commands was 44px tall.
- At 390×844 the root and the page were 390px wide, the canvas was 145px tall, and Commands was 44px tall and inside the page.
- At 360×800 the root and the page were 360px wide, the canvas was 128px tall, and Commands was 44px tall and inside the page.
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
| Q09 | N/A | Sketching and the desk lists update in the open panel. No new pending request was added. |
| Q10 | N/A | No new error sentence. An empty sheet still says to draw a shape and sketch again. A missing selection still says to select a shape. |
| Q11 | PASS | One visible h1, Foundry. |
| Q12 | N/A | No new image. Commands, Relationships, Unconnected, Copy name, and Remove keep visible names. |
| Q13 | N/A | No sitemap or robots change. The class stays unlisted. |
| Q14 | PASS | The exercised Chrome flow reported no app-owned console error and no page error. |
| Q15 | PASS | The touched desk files were linted with `--max-warnings 0`. The CLI still prints its result with `console.log`. The lab change did not add one. |
| Q16 | N/A | No release build was produced. The check used `next dev`. |
| Q17 | NOT RUN | No JavaScript budget is recorded, and this note did not measure a production bundle. |
| Q18 | PASS | 1280, 768, 390, and 360. Page width matched the viewport. The canvas stayed at least 128px. Commands was inside the page and 44px tall. |
| Q19 | PASS | The new rows use the existing paper, ink, line, and copper classes. The modeling panel height was not increased. |
| Q20 | PASS | Place a screen, Unconnected, Remove Search, Relationships, Copy name, the PHP sketch, and the GraphQL search all completed. |

Release-ready: no. Q17 was not run, and this note does not replace the release certificate.
