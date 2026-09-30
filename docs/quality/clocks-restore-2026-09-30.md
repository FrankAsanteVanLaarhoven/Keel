# World clock restore

Date: 30 September 2026. Scope: a country taken off the world clock stays in the add list, under the name that was on the clock. This is not a release-wide pass of the 20 checks.

Removing London, New York, Lagos, Tokyo, or Local used to put that place back under only the country name, such as United Kingdom or Nigeria. The clock row still said London, so the removed place looked missing. The add list now keeps every country that is not showing. Those five starter clocks, when they are not showing, stay at the top. The label is the name from the clock, and the country when the two differ: London, United Kingdom. New York, United States. Eight remains the maximum. The row is still the city and the time. There is still one dropdown and no remove mark on each clock. The list stays in local storage on this device.

## Evidence

- `pnpm typecheck` exited 0.
- `pnpm exec eslint` on `components/shell.tsx`, `lib/clocks.ts`, and `tests/keel.test.ts` exited 0.
- `pnpm test` with `DATABASE_URL` and the `POSTGRES_URL` variables unset: 37 passed, 1 skipped. The skipped file is `tests/postgres.test.ts`.
- The world clock test checks that Europe/London can be stored again after it was left out, that a removed starter clock is first in the add list, that every catalog place is either showing or addable, and that the menu label keeps London beside United Kingdom.

## Checks for this change

| ID | Result | Evidence |
|---|---|---|
| Q01 | N/A | No domain was named. The class stays on the existing host. |
| Q02 | N/A | No new document. Page titles were not changed. |
| Q03 | N/A | No new indexable page. |
| Q04 | N/A | Icons were not part of this change. |
| Q05 | N/A | No new share page. |
| Q06 | N/A | No new indexable URL. |
| Q07 | N/A | No social card was added. |
| Q08 | N/A | The 404 page was not changed. |
| Q09 | N/A | Adding a removed country back is immediate on this device. There is no server wait. |
| Q10 | N/A | No new error sentence. |
| Q11 | N/A | No new page heading. |
| Q12 | PASS | The dropdown keeps the accessible name "Add or remove". A removed clock's option uses the name from the row and the country. It was not opened in a browser. |
| Q13 | N/A | Clocks are not a public document. The app stays unlisted. |
| Q14 | NOT RUN | No browser console was captured. |
| Q15 | PASS | The clock files add no `console.log`. |
| Q16 | N/A | Source-map settings were not changed. |
| Q17 | NOT RUN | No bundle budget is recorded for this change. |
| Q18 | NOT RUN | 360px, tablet, and desktop were not opened. |
| Q19 | NOT RUN | The dropdown uses the existing select classes. Spacing was not inspected on a screen. |
| Q20 | NOT RUN | Choosing a removed country again was not clicked, and keyboard focus was not checked. |
