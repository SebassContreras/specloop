# 003 — task-breakdown-skill — Design

## Skill: `specloop:task-breakdown`

One skill, invoked as `/specloop:task-breakdown` or triggered by natural phrasing
("break spec NNN into tasks", "task-breakdown for X", "spec NNN's design is closed,
make the tasks") via its `description`/`when_to_use` frontmatter.

**Frontmatter:** `context: fork`, `background: false` — this is a propose-then-confirm
conversation (see Phase 2), not a single dispatch.

Unlike 001 and 004, this skill isn't gathering information only the user has — the
design already contains it. So the flow is **propose a draft, then confirm/edit**,
not one-question-per-field Q&A.

## Flow

### Phase 0 — Pick the spec + refuse if not ready

1. If the user named a spec, resolve it against `docs/roadmap.md`. Otherwise list
   rows with status `todo`/`in_progress` whose `design.md` has real content but whose
   `tasks.md` is still the header-only stub, and ask which one.
2. **Refuse and stop** if that spec's `design.md` is still the `TBD` stub — tell the
   user to close the design first (`specloop:design-closing`), never invent tasks
   from an unclosed design.

### Phase 1 — Draft the task list

Read `requirements.md`, `design.md`, and (if non-stub) `docs/architecture.md`. Draft
a task list applying this granularity rule (the "design.md question" 003's own
requirements deferred to here):

> A task is **single-action** (one coherent change — one file, one function, one
> config addition — not "implement the feature") and **verifiable** (there's an
> unambiguous way to tell it's done: a file exists, a check passes, a behavior is
> observable).

- Order tasks to match `design.md`'s stated sequencing/dependencies section, where
  present.
- Always include a final local-test/verification task if the design's "Local dev /
  testing" section (or equivalent) describes one.
- Number them `T1`, `T2`, … in order.

### Phase 2 — Confirm with the user

Present the drafted list (ID + description only, no status/notes yet) and ask the
user to approve, edit, add, or remove tasks. Iterate until they confirm — this is a
review loop, not a multi-question interrogation, so don't ask one question per task.

### Phase 3 — Write `tasks.md`

Replace the stub using the fixed contract from 001's design (`ID | Task | Status |
Notes`), every row starting `Status = todo`, `Notes` empty:

```markdown
# NNN — name — Tasks

Status legend: `todo` · `in_progress` · `blocked` · `interrupted` · `done`

| ID | Task | Status | Notes |
|----|------|--------|-------|
| T1 | ... | todo | |
```

### Phase 4 — Stop. Do not chain into the loop-orchestrator.

Tell the user `tasks.md` is populated and that spec 002's orchestrator (once built)
can pick it up whenever they're ready to run it. **Do not start executing tasks
here** — 003 only writes the table, running it is 002's job entirely.

## Style rules

- Same as 001/004: terse, structural. Never invent a task that isn't traceable back
  to something in `requirements.md`/`design.md`.
- Confirm the full list with the user before writing — don't write partial/unapproved
  tasks to disk.

## Local dev / testing

- `claude --plugin-dir ./specloop` against a target repo with a spec whose
  `design.md` is closed (once 004 exists and has been run on one), run
  `/specloop:task-breakdown`, verify the draft/confirm/write flow and the refusal
  path on a spec with a stub `design.md`.

## Open questions / deferred

- Whether task count should be capped (e.g. flag/split specs that draft an
  unreasonably long list) — not decided; revisit if this becomes a real problem in
  practice.
