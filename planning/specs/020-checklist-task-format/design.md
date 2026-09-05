# 020 — checklist-task-format — Design

Closed retroactively on 2026-09-05, same as `015`: the grammar and parser were
implemented in the same pass that decided them, because shipping a doc-only decision
with no code behind it is exactly what `CLAUDE.md`'s "don't assert a rule the code
doesn't honor" rule exists to prevent.

## Approach

Replace the pipe-table `tasks.md` with a GFM checkbox list carrying explicit tags,
keeping every state the old table carried:

```markdown
- [ ] T001 [agent] [status:todo] Scaffold DB schema
- [ ] T002 [agent] [status:blocked] Wire up auth
      └─ blocked: waiting on API key
- [x] T003 [human] [status:done] Buy domain name
```

The checkbox alone can't carry 5 states, so it's cosmetic (`done` vs. not) and the
`[status:...]` tag is the actual source of truth — the same relationship the old
table had between its own cosmetic-vs-authoritative cells, just line-based instead of
column-based. A task line is recognized purely by its start (`- [ ]`/`- [x]` at column
0); a note is an indented continuation line matching `^\s{2,}└─\s?...` directly below.
Nothing about identifying either depends on counting delimiters inside their text,
which is what made the old table breakable by a stray unescaped `|` (`002` T4, `003`
T6 in the old format both described the table contract in their own text and exposed
that exact gap — see `015`'s design).

`writeTaskStatus` finds the task's line by re-parsing (not by a cached line number,
since another task's status flip earlier in the same run could have inserted/removed a
note line above it and shifted every later index), then does an in-place substring
replace of the checkbox char and the `[status:...]` tag, and inserts/replaces/removes
only the note line — everything else on the task's own line is left alone.

## Deliverables

- `src/checklist.ts` — `parseChecklistLine`, `renderTaskLine`, `renderNoteLine`,
  `sanitizeNote`. Pure functions, no file I/O — `tasks.ts` owns reading/writing.
- `src/tasks.ts` — rewritten `TaskRow` (`lineIndex`/`noteLineIndex` replacing
  `statusIndex`/`cells`), `parseTasks`, `writeTaskStatus`. `nextRunnableTask`,
  `pendingHumanTasks`, `allTasksSettled`, `tasksPath` unchanged (they only ever
  consumed the stable `{id, owner, status, notes}` fields).
- Migration: a one-off script (not shipped — scratch, deleted after the run) that read
  each old table with the same per-row owner-detection logic the old `toRow` used
  (`cells.length >= 5 && isOwner(cells[2])`), so a stray legacy 4-column row within an
  otherwise 5-column file (found in `002` T13) migrated correctly instead of
  misreading its `Status` cell as `Owner`.
- `skills/task-breakdown/SKILL.md`, `skills/start/SKILL.md` — authoring templates
  updated to the new grammar.
- `planning/architecture.md` — new Fixed rule + two Declined rows.
- `planning/handoff.md` — the stale "escape pipes" trap replaced with the new one
  (never indent a task line), and the stale roadmap-status grep command fixed.

## Sequencing

`checklist.ts` first (pure, no dependents yet); `tasks.ts` depends on it; the
migration depends on `tasks.ts`'s new `parseTasks` existing to verify against (though
the migration script itself doesn't import it — it re-derives the old table's
semantics directly from the pre-migration text, so it can run before `tasks.ts` changes
and be verified against it after).

## Open questions / deferred

- Whether `roadmap.md` should ever gain a similar treatment. **Declined for now** — see
  `planning/architecture.md`: spec-kit has no central index to borrow from, and a
  status-across-many-specs index is what a table is actually good at.
- Whether task IDs should carry a `[P]` (parallelizable) tag like spec-kit's. **Not
  added** — specloop has no parallel-task execution model yet (`planning/
  architecture.md`, "Still to define": multi-spec parallelism). Adding the tag with
  nothing consuming it would be exactly the "asserts a rule the code doesn't honor"
  defect this repo has already been burned by once.
