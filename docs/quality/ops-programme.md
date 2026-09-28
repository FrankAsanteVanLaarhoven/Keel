# Operations programme

Date: 2026-09-28
Tree: /Users/favl/workspace/keel
Environment: next dev, http://127.0.0.1:3961
Classification: private local learning app
Viewports: 390, 768, 1280 in headless Chrome
Commands: pnpm typecheck, pnpm test, headless Chrome on /ops, /ops/web, /ops/git, /ops/finops, /ops/brief, /ops/missing, and /

| Check | Result | Evidence |
|---|---|---|
| Q01 Production domain | N/A | Local programme. No public host is part of this change. |
| Q02 Page titles | PASS | /ops title is "Development and operation of systems — Keel". A lesson title is "The web and the internet — Keel". French git is "Git et l'historique partagé — Keel". |
| Q03 Meta descriptions | PASS | Catalogue, lesson, and release brief set a description from the programme text. No account content. |
| Q04 Favicon | PASS | Layout still points at /icon.svg. This change did not replace it. |
| Q05 Open Graph image | N/A | Private local app. No public share card is part of this change. |
| Q06 Canonical URL | N/A | No approved public origin. |
| Q07 Social previews | N/A | Private local app. |
| Q08 Custom 404 | PASS | GET /ops/missing returned 404 and the existing recovery page. |
| Q09 Loading states | PASS | Submit switches to "Loading" while the grade request is in flight. |
| Q10 Error messages | PASS | A wrong capstone says what to look at and stays on the form. A leaked key is shown in the lab preview before it is recorded. Rate limit copy is the existing message. |
| Q11 Heading structure | PASS | One h1 on the catalogue, each lesson, and the release brief. |
| Q12 Alternative text | PASS | Diagrams are text figures with captions. Icon-only controls are not used; move buttons say Move up and Move down. |
| Q13 Sitemap and indexing | N/A | Private local app. No sitemap was added. |
| Q14 Console errors | PASS | Exercised flows reported no console error or uncaught exception. |
| Q15 Debug output | PASS | No console.log added. eslint on the changed files passed. |
| Q16 Source maps | NOT RUN | No release build in this pass. |
| Q17 JavaScript and performance | NOT RUN | No recorded bundle budget, and no release build in this pass. |
| Q18 Mobile layout | PASS | Overflow was 0 at 390, 768, and 1280 on the catalogue, the web lesson, the cost lesson, and the release brief. The web lesson was completed at 1280, and the same lesson rendered at 390. |
| Q19 Consistent spacing | PASS | New screens use the existing paper, line, ink, and copper styles. |
| Q20 Working controls | PASS | Read, check, run, and submit were used on the web lesson. A leaked response and a clean 200 were both run. A wrong capstone was explained and a right one was accepted for a guest. Later steps stay disabled until the earlier step is accepted. |

Known gap: points are kept only after sign-in. A guest can finish a level and see the result, and the standing board does not keep it.

Release-ready claim: not a public release.
