# Pipeline delivery

Date: 1 October 2026. Scope: a pipeline delivery on the class record is one write, health can see the pipeline tables, and a signed-in request can land the orders sample, deliver it, and keep it on that account. This is not a release-wide pass of the 20 checks.

A delivery writes the output, the run, and the build together. If a write fails, none of that delivery remains. A duplicate name returns the name error instead of a server failure. Creating a branch copies its transforms in the same write. Opening the orders sample lands both files and the transform in the same write. Removing a transform removes its runs in the same write.

The rows are still written by the class records. The stored engine name is records. The Spark batch job and the Flink streaming job are compiled with the build and do not run. A second delivery of an unchanged branch is recorded as current and does not write a new dataset version.

Health opens the class record and reads the pipeline branch table. An empty table is healthy. A missing table is not.

The pipeline stays with the signed-in account. Another account does not see it. A branch that has not landed a file still reads that file from its base branch. The account export includes the pipeline. Deleting the account removes it.

## Evidence

- `pnpm typecheck` exited 0.
- `pnpm exec eslint` on the pipeline files, the health route, and the test exited 0.
- `pnpm test` with `DATABASE_URL` and the `POSTGRES_URL` variables unset: 40 passed, 1 skipped. The skipped file is `tests/postgres.test.ts`.
- The new record test starts a delivery, stops it, and finds no branch left behind. A repeated branch name is a unique violation. The build index is present in the local record.
- The new request test signs in two throwaway accounts. It rejects a signed-out read, opens the orders sample, rejects a second sample, delivers with engine records, checks the compiled jobs say they wait for a worker, delivers again as current without a new version, rejects a duplicate branch name, reads the orders dataset from the base branch, hides that dataset from the second account, includes it in the export, and removes it with the account. The accounts were deleted after the test.

## Checks for this change

| ID | Result | Evidence |
|---|---|---|
| Q01 | N/A | No domain was named. The class stays on the existing host. |
| Q02 | PASS | The pipeline title was not changed. It was not opened in a browser. |
| Q03 | PASS | The description and noindex setting were not changed. No dataset is in the description. |
| Q04 | N/A | Icons were not part of this change. |
| Q05 | N/A | No share image. |
| Q06 | N/A | The page stays private and noindex. No public canonical was added. |
| Q07 | N/A | No social card. |
| Q08 | N/A | The 404 page was not changed. |
| Q09 | NOT RUN | The opening sentence was not opened in a browser. |
| Q10 | PASS | A duplicate sample and a duplicate branch return the name error. A stopped delivery leaves no branch. The sentences were not opened in a browser. |
| Q11 | PASS | The pipeline page still has one h1. It was not opened in a browser. |
| Q12 | PASS | No new image or icon-only control. The build status uses the existing current, delivered, and stopped sentences. |
| Q13 | PASS | The route stays noindex. Pipeline rows are not a public document. |
| Q14 | NOT RUN | No browser console was captured. |
| Q15 | PASS | These files add no `console.log`. |
| Q16 | N/A | Source maps stay off. `productionBrowserSourceMaps` was already false and was not changed. |
| Q17 | NOT RUN | No bundle budget is recorded for this change. |
| Q18 | NOT RUN | 360px, tablet, and desktop were not opened. |
| Q19 | NOT RUN | Spacing was not inspected on a screen. The page uses the existing classes. |
| Q20 | NOT RUN | The signed-in form was not clicked. Keyboard focus was not checked. The request test called the route directly. |
