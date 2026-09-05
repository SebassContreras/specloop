# 015 — roadmap-status-writer — Tasks

Status legend: `todo` · `in_progress` · `blocked` · `interrupted` · `done`
Owner: `agent` (loop-runnable) · `human` (skipped by the loop)

- [x] T001 [agent] [status:done] Add `src/mdTable.ts` with `splitRow`, `isHeaderOrSeparator`, `sanitizeCell`, `withCells`
      └─ Split-based, so extending the table no longer breaks the parse — and no backtracking hazard.
- [x] T002 [agent] [status:done] Convert `roadmap.ts` to the positional parser, ignoring trailing columns
      └─ Verified against a 5-column roadmap.
- [x] T003 [agent] [status:done] Add `roadmap.writeSpecStatus`
      └─ The column had no writer at all before this.
- [x] T004 [agent] [status:done] Convert `tasks.ts` to `mdTable`, add the `Owner` column, keep 4-column tables parsing
      └─ Layout detected by cell-2 content, not cell count.
- [x] T005 [agent] [status:done] Make `nextRunnableTask` skip `human` tasks; add `pendingHumanTasks`/`allTasksSettled`
- [x] T006 [agent] [status:done] Make `writeTaskStatus` preserve the `Owner` cell and sanitize notes
      └─ A note containing `|` or a newline silently corrupted the table before.
- [x] T007 [agent] [status:done] Add `rollUpStatus` to `cli.ts` and write the roadmap row when a spec's runnable tasks are exhausted
      └─ This is the deadlock fix.
- [x] T008 [agent] [status:done] Report pending `human` tasks on task exhaustion
- [x] T009 [agent] [status:done] Make `loop status` derive from `tasks.md` and flag disagreement with the roadmap cell
      └─ It previously echoed a hand-maintained cell as truth.
- [x] T010 [agent] [status:done] Add `contextFiles` to `LoopConfig`
      └─ Inert until `014`.
- [x] T011 [agent] [status:done] Verify: `tsc --noEmit` and `eslint src` clean; round-trip both table layouts, a 5-column roadmap, a piped note, and dependency-eligibility after a status flip
      └─ 16/16 checks passed against a scratch fixture. Not yet a committed test suite — that's T14.
- [ ] T012 [agent] [status:todo] Add the `Priority` column to the scaffolded roadmap template
      └─ Now safe: the parser tolerates it.
- [ ] T013 [agent] [status:todo] Retire the `## Priority: N` requirements-header convention in favour of the column
      └─ Present in `006`–`013`, absent from `001`–`005` and from the template. Two unsynchronised sources of the same fact.
- [ ] T014 [agent] [status:todo] Move T11's checks into `007-orchestrator-unit-tests` as real tests
      └─ Depends on `007`.
- [ ] T015 [human] [status:todo] Decide whether `Stage` belongs here or in `009`
      └─ See design's open questions.
- [x] T016 [agent] [status:done] Split rows on unescaped pipes only; unescape each cell; make `sanitizeCell` escape (idempotently) rather than substitute
      └─ **Found by `001` T28's migration.** `002` T4 and `003` T6 describe the `ID | Task | Status | Notes` contract in their own text; the naive splitter shredded both. Reverses a decision recorded in this spec's design.
- [x] T017 [agent] [status:done] Reject rows whose status cell isn't a real `TaskStatus`; warn when a rejected row still looks like a task
      └─ Previously such a row was returned with a garbage status — neither `done` nor runnable, so the loop skipped the task while the spec could never roll up to `done`. Silent, and permanent.
- [x] T018 [agent] [status:done] Verify: escaped-pipe round trip, idempotent sanitize, malformed-row rejection, piped note survives a write
      └─ 11/11 passed. Plus the full repo: 114 rows across 18 specs, 0 malformed-row warnings.
