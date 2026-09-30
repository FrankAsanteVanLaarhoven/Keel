# Class voice and the twelve weeks

Date: 30 September 2026. Scope: public wording on the header, the class record, the foundry review, and the term. This is not a release-wide pass of the 20 checks.

The header control now says how terms are written: field terms, everyday language, or the term and its meaning. The class record shows people, accepted work, average points, and recorded events from this class. It no longer states a Lighthouse score, a contrast badge, or the name of an internal checklist. The foundry review states the risk, why it matters, and what to change. The twelve weeks are separate choices. The current week is marked. A later week stays closed until the one before it is accepted, and a teacher can pause a week.

## Evidence

- `pnpm typecheck` exited 0.
- `pnpm test` with `DATABASE_URL` and `POSTGRES_URL` unset: 37 passed, 1 skipped.
- No browser was opened. Phone layout, the console, and keyboard focus were not checked.

## Checks for this change

| ID | Result | Evidence |
|---|---|---|
| Q01 | N/A | No domain was named. |
| Q02 | PASS | The class record title is the page title. The term title is unchanged. |
| Q03 | PASS | The class record description is the same sentence as the page, and the page is `noindex`. |
| Q04 | N/A | Icons were not part of this change. |
| Q05 | N/A | No new share page. |
| Q06 | N/A | These pages stay unlisted. |
| Q07 | N/A | No social card was added. |
| Q08 | N/A | The 404 page was not changed. |
| Q09 | N/A | The class record reads numbers already stored. There is no new wait. |
| Q10 | N/A | No new error path. A closed week says it opens when the previous week is accepted, or that it is paused. |
| Q11 | PASS | The class record and the term each keep one primary heading. |
| Q12 | PASS | The term control uses the accessible name for how terms are written. No new informative image. |
| Q13 | N/A | The app stays unlisted. |
| Q14 | NOT RUN | No browser console was captured. |
| Q15 | PASS | This change adds no `console.log`. |
| Q16 | N/A | Source-map settings were not changed. |
| Q17 | NOT RUN | No bundle budget is recorded. The invented charts were removed from the class record. |
| Q18 | NOT RUN | The weeks use a grid that becomes one column on a narrow screen. 360px was not opened. |
| Q19 | NOT RUN | The new blocks use the existing border, type, and color classes. Spacing was not inspected on a screen. |
| Q20 | NOT RUN | Week links and the closed state were not clicked, and keyboard focus was not checked. |
