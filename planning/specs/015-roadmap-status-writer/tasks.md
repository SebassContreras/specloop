# 015 — roadmap-status-writer — Tasks

Status legend: `todo` · `in_progress` · `blocked` · `interrupted` · `done`
Owner: `agent` (loop-runnable) · `human` (skipped by the loop)

| ID | Task | Owner | Status | Notes |
|----|------|-------|--------|-------|
| T1 | Add `src/mdTable.ts` with `splitRow`, `isHeaderOrSeparator`, `sanitizeCell`, `withCells` | agent | done | Split-based, so extending the table no longer breaks the parse — and no backtracking hazard. |
| T2 | Convert `roadmap.ts` to the positional parser, ignoring trailing columns | agent | done | Verified against a 5-column roadmap. |
| T3 | Add `roadmap.writeSpecStatus` | agent | done | The column had no writer at all before this. |
| T4 | Convert `tasks.ts` to `mdTable`, add the `Owner` column, keep 4-column tables parsing | agent | done | Layout detected by cell-2 content, not cell count. |
| T5 | Make `nextRunnableTask` skip `human` tasks; add `pendingHumanTasks`/`allTasksSettled` | agent | done | |
| T6 | Make `writeTaskStatus` preserve the `Owner` cell and sanitize notes | agent | done | A note containing `\|` or a newline silently corrupted the table before. |
| T7 | Add `rollUpStatus` to `cli.ts` and write the roadmap row when a spec's runnable tasks are exhausted | agent | done | This is the deadlock fix. |
| T8 | Report pending `human` tasks on task exhaustion | agent | done | |
| T9 | Make `loop status` derive from `tasks.md` and flag disagreement with the roadmap cell | agent | done | It previously echoed a hand-maintained cell as truth. |
| T10 | Add `contextFiles` to `LoopConfig` | agent | done | Inert until `014`. |
| T11 | Verify: `tsc --noEmit` and `eslint src` clean; round-trip both table layouts, a 5-column roadmap, a piped note, and dependency-eligibility after a status flip | agent | done | 16/16 checks passed against a scratch fixture. Not yet a committed test suite — that's T14. |
| T12 | Add the `Priority` column to the scaffolded roadmap template | agent | todo | Now safe: the parser tolerates it. |
| T13 | Retire the `## Priority: N` requirements-header convention in favour of the column | agent | todo | Present in `006`–`013`, absent from `001`–`005` and from the template. Two unsynchronised sources of the same fact. |
| T14 | Move T11's checks into `007-orchestrator-unit-tests` as real tests | agent | todo | Depends on `007`. |
| T15 | Decide whether `Stage` belongs here or in `009` | human | todo | See design's open questions. |
| T16 | Split rows on unescaped pipes only; unescape each cell; make `sanitizeCell` escape (idempotently) rather than substitute | agent | done | **Found by `001` T28's migration.** `002` T4 and `003` T6 describe the `ID \| Task \| Status \| Notes` contract in their own text; the naive splitter shredded both. Reverses a decision recorded in this spec's design. |
| T17 | Reject rows whose status cell isn't a real `TaskStatus`; warn when a rejected row still looks like a task | agent | done | Previously such a row was returned with a garbage status — neither `done` nor runnable, so the loop skipped the task while the spec could never roll up to `done`. Silent, and permanent. |
| T18 | Verify: escaped-pipe round trip, idempotent sanitize, malformed-row rejection, piped note survives a write | agent | done | 11/11 passed. Plus the full repo: 114 rows across 18 specs, 0 malformed-row warnings. |
