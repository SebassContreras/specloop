# 015 — roadmap-status-writer

## What's being built

**Largely implemented on 2026-09-02** alongside the `001` scope restoration, because
`planning/architecture.md`'s fixed rules were rewritten to assert both behaviours and
asserting a rule the code doesn't honor is the exact defect this pass set out to fix.
What remains is the `Priority`/`Stage` column and its tests.

Delivered:

- `src/mdTable.ts` — split-based row parsing shared by `roadmap.ts` and `tasks.ts`.
  The old exact-arity `/^\|([^|]*)\|…\|$/` matched 4-cell rows only, so adding any
  column made every row fail to parse, surfacing as "nothing eligible to run" rather
  than an error. Also carries `sanitizeCell` (worker log lines can contain `|` and
  newlines, either of which corrupts the table) and `withCells`.
- `roadmap.writeSpecStatus(cwd, specId, status)` — the roadmap's **only** `Status`
  writer. Nothing wrote that column before: a spec whose tasks were all finished
  stayed `in_progress`, `pickNextSpec` kept resuming it, and no `todo` row could ever
  become eligible because no dependency ever reached `done`. This repo's own roadmap
  sat in exactly that deadlock (6 `in_progress`, 0 `done`).
- `cli.ts` rolls task states up and writes the row when a spec's runnable tasks are
  exhausted; `loop status` now derives status from `tasks.md` and flags disagreement
  with the recorded cell instead of echoing it as truth.
- `tasks.ts` reads the `Owner` column, skips `human` tasks in `nextRunnableTask`, and
  preserves the column on write. Pre-`Owner` 4-column tables still parse, owner
  defaulting to `agent`.

Remaining:

- Move the round-trip checks written during this pass into `007-orchestrator-unit-tests`.
- Make `pickNextSpec` prefer the lower `Priority` number among multiple eligible
  `todo` rows, instead of first-in-file-order (`T019`).
- Give the deterministic `loop run` CLI path a `Stage` writer, so it sets `looping`
  on a spec the same way `skills/loop` already does directly (`T020`).

Decided 2026-09-12 (was open above): `Priority` is a **live, human-edited** ordering
number, not a historical record — edit it to reorder, no separate "build order" text
to keep in sync. `Stage` (`requirements` · `design_closed` · `tasks_ready` ·
`looping`) lives in `roadmap.md`, written by whichever pipeline skill completes that
transition, not by a shared module — `009-status-dashboard-skill` reads it rather than
owning a second copy of the same fact. See `design.md`'s resolved open question and
`planning/architecture.md`'s roadmap Fixed rules.

## Who/what it serves

The loop itself — without a `Status` writer it cannot advance past its first spec — and
any agent dropped into the repo trying to work out what's next.

## Hard constraints

- Backward compatible: pre-`Owner` 4-column `tasks.md` and 4-column roadmaps must keep
  parsing, since 13 specs in this repo are still in that shape.
- One writer only. If the orchestrator writes `Status`, no skill may also write it.
- A `human`-owned task must not hold a spec open — the loop can't act on it.
- Never silently truncate: an unparseable row must be visible, not skipped.

## Acceptance criteria

- A spec whose agent tasks are all `done` gets its roadmap row flipped to `done`, and a
  `todo` row depending on it becomes eligible on the next `loop run`. *(Verified
  2026-09-02.)*
- A roadmap row with a trailing 5th column still parses, and a status write preserves
  that cell. *(Verified 2026-09-02.)*
- A note containing `|` or a newline does not corrupt its table. *(Verified.)*
- `loop status` reports a disagreement between a roadmap cell and the spec's tasks.
- `Priority` exists as a column, and no `requirements.md` carries a `## Priority:`
  header any more.
- `roadmap.md` carries only the index table plus its column legends — no prose
  history, no separate ordering list. *(Done 2026-09-12 — the "Build order" section
  and the stale test-run/historical-Priority paragraphs were removed; anything not
  already duplicated in the relevant spec's own docs was ported there first.)*
- `Stage` exists as a column, written by each pipeline skill at its own transition.
  *(Done 2026-09-12 — `skills/start`/`design-closing`/`task-breakdown`/`loop` updated;
  the deterministic `loop run` CLI path is the tracked exception, `T020`.)*

## Out of scope

- Multi-spec parallelism (`planning/architecture.md`, "Still to define").
- The dashboard rendering itself (`009`).
- Amending/splitting/dropping specs (`012`).
