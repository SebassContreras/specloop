---
name: task-breakdown
description: >
  Breaks a spec's closed design.md into a populated tasks.md — drafts a list of
  single-action, verifiable tasks, confirms it with the user, then writes the fixed
  checkbox/owner/status checklist.
when_to_use: >
  Use when a spec's design.md has real content and its tasks.md is still empty.
  Trigger on phrasing like "break spec NNN into tasks", "task-breakdown for X",
  "spec NNN's design is closed, make the tasks". Refuses to run on a spec whose
  design.md is still a TBD stub.
---

# specloop: task-breakdown

You are running the specloop task-breakdown flow **inside the target repo**. This
skill drafts tasks from information the design already contains, then confirms with
the user — it is **not** a one-question-per-field Q&A like `specloop:start` or
`specloop:design-closing`.

## Phase 0 — Pick the spec + refuse if not ready

1. If the user named a spec, resolve it against `planning/roadmap.md`. Otherwise read
   `planning/roadmap.md`, find rows with status `todo`/`in_progress` whose `design.md`
   has real content but whose `tasks.md` is still the header-only stub, and ask which
   one.
2. **Refuse and stop** if that spec's `design.md` is still the `TBD` stub. Tell the
   user to close the design first via `specloop:design-closing` — never invent tasks
   from an unclosed design.

## Phase 1 — Draft the task list

Read that spec's `requirements.md`, `design.md`, `planning/product.md` (for the project
type), and (if they have real content) `AGENTS.md` and `planning/architecture.md`. Draft a
numbered list (`T1`, `T2`, …) applying this rule:

> A task is **single-action** (one coherent deliverable or change — one file, one
> asset, one decision, one config addition — not "implement the feature") and
> **verifiable** (there's an unambiguous way to tell it's done).

"Single-action" is delivery-neutral: for software it's typically one file or function;
for a marketing project one asset, page or approval; for operations one runbook step or
access grant; for research one source acquired or analysis run. Don't force software
phrasing onto a project that isn't software.

- Order tasks to follow `design.md`'s sequencing/dependencies, where it states any.
- **Assign each task an `Owner`: `agent` or `human`.** `human` is for anything needing
  a credential, an approval, a purchase, a physical act, or a live interactive session
  — the loop skips these rather than attempting them. Use `requirements.md`'s
  `owner-split`/`automatability` answers where they exist; ask the user when unsure.
- Turn each `## Acceptance criteria` statement into a final verification task, so a
  spec's own definition of done is executable rather than prose.
- Every task must trace back to something actually stated in `requirements.md` or
  `design.md` — never invent scope that isn't there.

## Phase 2 — Confirm with the user

Show the drafted list (ID + description + owner, no status/notes yet) in one message
and ask the user to approve it or tell you what to add/remove/reorder — including any
`Owner` you got wrong. Then ask once: **"anything in this design that no task covers?"**
Iterate until they confirm. Don't write anything to disk before confirmation.

## Phase 3 — Write `tasks.md`

Replace the stub with the fixed contract, every task starting `todo` (unchecked box,
no note line):

```markdown
# NNN — name — Tasks

Status legend: `todo` · `in_progress` · `blocked` · `interrupted` · `done`
Owner: `agent` (loop-runnable) · `human` (skipped by the loop)

- [ ] T001 [agent] [status:todo] <task>
```

IDs are zero-padded (`T001`, `T002`, …). A task line is identified only by starting
at column 0 with `- [ ]`/`- [x]` — never indent one, or the loop will read it as a
note continuation instead of a task. A note, once a task has one, is an indented
continuation line directly below it: `      └─ <note text>`.

## Phase 4 — Stop. Do not start executing tasks.

Tell the user `tasks.md` is populated and ready for spec 002's loop-orchestrator
whenever they choose to run it, and name any `human` tasks that the loop will skip and
they'll need to do themselves. **Do not begin executing any task** — running the list
is entirely the orchestrator's job, not this skill's.

## Style rules

- Terse and structural, matching specloop's own `planning/*.md` — no filler prose.
- Never invent a task that isn't traceable back to `requirements.md`/`design.md`.
- Confirm the full list with the user before writing it to disk.
- Don't mark a task `agent` that an agent can't actually do unattended.
