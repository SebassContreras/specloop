# 015 — roadmap-status-writer — Design

Closed retroactively on 2026-09-02: the parser and writer were implemented in the same
pass that rewrote `planning/architecture.md`'s fixed rules to assert them. Asserting a rule
the code doesn't honor is the defect that pass existed to remove, so shipping the two
together was deliberate — but it does mean this design was written after the code, not
before it. The remaining work (`Priority` column, `Stage` column, unit tests) is
unstarted and follows the normal order.

## Approach

Replace both exact-arity row regexes with one shared split-based parser, then give the
roadmap's `Status` column the single writer it never had.

The old `/^\|([^|]*)\|([^|]*)\|([^|]*)\|([^|]*)\|$/` in `roadmap.ts` and `tasks.ts`
matched 4-cell rows only. Adding a column made every row fail to match, and because
both parsers `continue` on a non-match, the failure surfaced as an empty task list —
i.e. `[loop] nothing eligible to run` — rather than an error. That made the "fixed
contract" un-extendable in practice.

Status roll-up is derived from `tasks.md`, not tracked separately, so the two can't
disagree. `human`-owned tasks are excluded from the roll-up: the loop can't act on
them, so a spec whose only remaining work is the user's shouldn't be held open — it's
reported separately instead.

## Deliverables

- `src/mdTable.ts` — `splitRow`, `isHeaderOrSeparator`, `sanitizeCell`, `withCells`.
- `src/roadmap.ts` — positional 4-cell read that ignores trailing columns;
  `writeSpecStatus`.
- `src/tasks.ts` — `Owner`-aware `TaskRow` (layout detected by whether cell 2 holds a
  valid owner, not by cell count, so extra trailing columns still parse);
  `nextRunnableTask` skips `human`; `pendingHumanTasks`; `allTasksSettled`;
  layout-preserving `writeTaskStatus`.
- `src/cli.ts` — `rollUpStatus`, the `writeSpecStatus` call on task exhaustion, the
  human-task report, and a `loop status` that flags roadmap/tasks disagreement instead
  of echoing the recorded cell.
- `src/config.ts` — `contextFiles` (consumed by `014`).

## Sequencing

`mdTable.ts` first; `roadmap.ts`/`tasks.ts` depend on it; `cli.ts` depends on both.

## Open questions / deferred

- Whether the `Stage` column belongs here or in `009-status-dashboard-skill` — both
  want to answer "which skill runs next". Decide before adding it; two writers of the
  same fact is what caused the priority split between row order and `## Priority: N`.
- ~~`sanitizeCell` replaces `|` with `/` rather than escaping it.~~ **Reversed.**
  Migrating this repo's own tables (`001` T28) hit two task rows that describe the
  `ID | Task | Status | Notes` contract itself — one already escaped as `\|`, one not.
  Both mis-parsed. So the splitter now splits on unescaped pipes only and unescapes
  each cell, and `sanitizeCell` escapes rather than substitutes (idempotently). The
  "parsing subtlety" this note wanted to avoid turned out to be mandatory: real content
  contains pipes, and markdown already defines how to escape them.
- ~~Whether an unparseable pipe row should warn rather than be skipped silently.~~
  **Implemented.** `toRow` now rejects any row whose status cell isn't a real
  `TaskStatus`, and `parseTasks` warns when a rejected row still looks like a task
  (`^T\d+$`). Returning such a row was the dangerous option: its bogus status is
  neither `done` nor runnable, so the loop skipped the task while the spec could never
  roll up to `done`. Header and separator rows are excluded by the same first-cell test
  as before, so they stay silent.
