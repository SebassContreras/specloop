---
name: task-breakdown
description: >
  Breaks a spec's closed design.md into a populated tasks.md — drafts a list of
  single-action, verifiable tasks, confirms it with the user, then writes the fixed
  ID/Task/Status/Notes table.
when_to_use: >
  Use when a spec's design.md has real content and its tasks.md is still empty.
  Trigger on phrasing like "break spec NNN into tasks", "task-breakdown for X",
  "spec NNN's design is closed, make the tasks". Refuses to run on a spec whose
  design.md is still a TBD stub.
context: fork
background: false
---

# specloop: task-breakdown

You are running the specloop task-breakdown flow **inside the target repo**. This
skill drafts tasks from information the design already contains, then confirms with
the user — it is **not** a one-question-per-field Q&A like `specloop:start` or
`specloop:design-closing`.

## Phase 0 — Pick the spec + refuse if not ready

1. If the user named a spec, resolve it against `docs/roadmap.md`. Otherwise read
   `docs/roadmap.md`, find rows with status `todo`/`in_progress` whose `design.md`
   has real content but whose `tasks.md` is still the header-only stub, and ask which
   one.
2. **Refuse and stop** if that spec's `design.md` is still the `TBD` stub. Tell the
   user to close the design first via `specloop:design-closing` — never invent tasks
   from an unclosed design.

## Phase 1 — Draft the task list

Read that spec's `requirements.md`, `design.md`, and (if it exists and has real
content) `docs/architecture.md`. Draft a numbered list (`T1`, `T2`, …) applying this
rule:

> A task is **single-action** (one coherent change — one file, one function, one
> config addition — not "implement the feature") and **verifiable** (there's an
> unambiguous way to tell it's done).

- Order tasks to follow `design.md`'s sequencing/dependencies, where it states any.
- If `design.md` describes a local-test/verification step, include it as a final
  task.
- Every task must trace back to something actually stated in `requirements.md` or
  `design.md` — never invent scope that isn't there.

## Phase 2 — Confirm with the user

Show the drafted list (ID + description, no status/notes yet) in one message and ask
the user to approve it or tell you what to add/remove/reorder. Iterate on their
feedback until they confirm. Don't write anything to disk before confirmation.

## Phase 3 — Write `tasks.md`

Replace the stub with the fixed contract, every row starting `todo` with an empty
`Notes` column:

```markdown
# NNN — name — Tasks

Status legend: `todo` · `in_progress` · `blocked` · `interrupted` · `done`

| ID | Task | Status | Notes |
|----|------|--------|-------|
| T1 | <task> | todo | |
```

## Phase 4 — Stop. Do not start executing tasks.

Tell the user `tasks.md` is populated and ready for spec 002's loop-orchestrator
whenever they choose to run it. **Do not begin executing any task** — running the
list is entirely the orchestrator's job, not this skill's.

## Style rules

- Terse and structural, matching specloop's own `docs/*.md` — no filler prose.
- Never invent a task that isn't traceable back to `requirements.md`/`design.md`.
- Confirm the full list with the user before writing it to disk.
