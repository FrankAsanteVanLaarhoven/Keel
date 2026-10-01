# Foundry help

Date: 1 October 2026. Scope: a short Foundry help page at `/foundry/help`, a Help link on the desk toolbar beside Guide, and a Help link on the guide page. The page indexes the guide, the sample drawings the desk already opens, the extension calls, the drawing file, Class, and the Apache-2.0 grant. This is a local change note. It is not a release-wide pass. The class on port 3960 was not rebuilt. The public host was not opened. The release certificate `docs/quality/release-2026-10-01.md` still stands for commit ed1478c and was not revised. Earlier Foundry notes were left as they were.

Keel is licensed under Apache-2.0 to Frank Asante Van Laarhoven. The grant is the LICENSE file. The page says the grant has no key, no activation step, no device count, and no floating seat, and that the desk does not open a license manager. Documentation is the Foundry guide. The page you load is the class build, and loading it again is how a new build arrives. The desk does not keep an archive of older copies. Questions go to Class at `/teach`. The desk has no forum and no support inbox. A guest sees the existing closed class book: “The class book is for a teacher or the super admin.” plus the existing sign-in link. Samples are the seven mission links (`/foundry?challenge=…`) and the Template menu names, including Harbor Library domain. Place a screen, in Commands, drops the Harbor Library wireframe. Extension calls are `keel.tool` and `keel.command`, kept in this browser under `keel.foundry.extensions.v1`. Export JSON writes `specVersion` `2.0-keel-foundry`. The page text does not contain StarUML, XMI, or a mailto link.

## Evidence

Checked in Chrome against `next dev` on http://127.0.0.1:3968 from `/Users/favl/workspace/keel`. That server was stopped after the check. Port 3960 was left as it was and still answered `{"ok":true}`. `pnpm exec tsc --noEmit` exited 0. `pnpm exec eslint --max-warnings 0` on the help module, the help page, the guide page, the guide copy, the lab, and `tests/foundry-help.test.ts` exited 0. `pnpm exec vitest run` with `DATABASE_URL` and the `POSTGRES_URL` variables set to empty strings: 99 passed, 1 skipped. The skipped file is `tests/postgres.test.ts`. Two of the passing tests are in `tests/foundry-help.test.ts`. The Vite ESM warning, the SQLite experimental warning, and the Better Auth “Invalid password” lines in the existing passphrase test are the usual ones.

Chrome, signed out:

- Help title `Foundry help · Keel`. One h1, `Foundry help`. Description names the guide, a sample drawing, and the Apache-2.0 grant, and says there is no license key. Canonical `/foundry/help`. Robots noindex.
- Guide from that page: title `Foundry guide · Keel`, one h1 `Foundry guide`, and `#ext-start` contains `keel.tool`.
- Class from that page: url `/teach`, title `Class book · Keel`, one h1 `Class book`, and the closed sentence. The first script looked too early and matched the existing “Opening this page” skeleton. A second check waited for the Class book heading and passed. The content sign-in link on that page measured 22px tall (left 20, right 71, top 514) at 390px. It is the existing underline link and was left as it is. The page did not overflow.
- Each mission link opened its drawing. Markers: Untrusted Client, Clinic Reception, Developer Laptop, 10:00 AM Crowd, Night Courier App, Payments Desk. The freeform lab opened as Full Systems Architecture Lab.
- At 1280, 768, 390, and 360 the help page did not overflow. The Status Request link was 44px tall and inside the width (360 and 390: left 20, right 169; 1280: left 276, right 425). Guide, sample, and Class links on the help page were 44px.
- On the guide, Help and Back to Foundry were 44px and the page did not overflow. At 360, Help was left 168, right 204, top 567. At 390, Help was left 168, top 543. At 1280, Help was left 424, top 282.
- On the desk, with Modeling closed, Help was 44px and inside the page after it was scrolled into view. Canvas height was 451 at 1280×900, 537 at 768×1024, 529 at 390×844, and 485 at 360×800. At 360, Help was left 257, right 305, top 254, inside an 800px-tall page. Clicking it returned the Foundry help heading. The root did not overflow.
- The exercised Chrome flow reported no app-owned console error and no page error.

## Checks for this change

| ID | Result | Evidence |
|---|---|---|
| Q01 | N/A | No domain was named. This check used the local dev server. The public host was not opened. |
| Q02 | PASS | Help title is Foundry help · Keel. Guide title is Foundry guide · Keel. Class title is Class book · Keel. One visible h1 on each. |
| Q03 | PASS | The help description names the guide, a sample drawing, and the Apache-2.0 grant, and says there is no license key. The page is noindex. |
| Q04 | N/A | No icon file changed. |
| Q05 | N/A | No public share card was added. This is not a release. |
| Q06 | N/A | Help uses the relative canonical `/foundry/help` and robots noindex. No production domain was named. |
| Q07 | N/A | No social card was added. |
| Q08 | N/A | No document route for unknown paths was added. The route change used the existing “Opening this page” status, then the destination painted. |
| Q09 | N/A | The help page does not start its own request. |
| Q10 | N/A | This page has no form. A guest who opens Class sees the existing closed class book and its sign-in link. |
| Q11 | PASS | Help has one h1 and h2 sections. Guide and Class each kept one h1. |
| Q12 | PASS | Help, Guide, Class, and the sample links are named links. No new image. |
| Q13 | N/A | No sitemap change. robots still disallows the whole class. |
| Q14 | PASS | The exercised Chrome flow reported no app-owned console error and no page error. |
| Q15 | PASS | The help module, the help page, and the lab change have no `console.log`. |
| Q16 | N/A | This was `next dev`, not a release build. Source maps were not published. |
| Q17 | NOT RUN | No bundle was measured. No JavaScript budget is recorded. |
| Q18 | PASS | At 1280, 768, 390, and 360 the help page did not overflow and its links were 44px and on screen. Desk Help was 44px and on screen, and the canvas stayed above 128px with Modeling closed. The existing Class sign-in link measured 22px and was left unchanged. |
| Q19 | PASS | Help uses the existing paper, ink, line, and copper controls, the same toolbar link as Guide, and the same page measure as the guide (`max-w-3xl px-5 pb-28 pt-12`). |
| Q20 | PASS | Help opens from the desk and from the guide. The guide, each mission link, and Class open from the help page. Class shows the closed book for a signed-out visitor. |

Release-ready: no. Q17 was not run, and the public host was not part of this check.
