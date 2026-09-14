# 012 — spec-amend-skill

## What's being built

Today's pipeline is strictly one-directional: `requirements.md` → closed
`design.md` → populated `tasks.md`. There's no supported way to reopen a
closed `design.md` (or revise `requirements.md`) when requirements change
mid-implementation — a routine situation in real projects.

A new skill, `specloop:amend`, run against an existing spec:

- Lets the user revise `requirements.md` and/or reopen `design.md` for edits.
- If `tasks.md` is already populated and the requirements/design change is
  meaningful, flags the mismatch and offers to re-run `task-breakdown` rather
  than silently leaving stale tasks in place.

## Who/what it serves

Anyone who needs to revise a spec's requirements or reopen its design after
it's already closed.

## Hard constraints

- Explicit confirm step before touching either `requirements.md` or
  `design.md` — this edits already-"closed" artifacts, a higher bar than the
  forward-only skills (start/design-closing/task-breakdown), which only ever
  write into stub or in-progress files.
- Never auto-invoked — same deliberate-step rule as `specloop:loop-setup`.

## Acceptance criteria

- `specloop:amend` refuses outright when the target spec has any task
  `[status:in_progress]` in its `tasks.md`.
- An explicit confirm step gates any edit to `requirements.md` or `design.md`
  before either is touched.
- Revising `requirements.md` reuses `skills/start`'s Phase 7 Q&A by
  reference, and reopening `design.md` reuses `skills/design-closing`'s
  Phase 1 Q&A by reference — neither duplicates the upstream question text.
- When `tasks.md` already has real tasks and the requirements/design change
  is meaningful, the skill flags the mismatch and offers to re-run
  `specloop:task-breakdown`, never auto-triggering the re-run without asking.
- Verified live end-to-end against a throwaway fixture spec: the
  `in_progress` refusal, the confirm gate, a `requirements.md` revision, a
  `design.md` reopen, and the staleness check all passed with no
  fix-forward needed (`tasks.md` T004).

## Out of scope

- Changing `planning/roadmap.md`'s dependency graph as a side effect — if
  amending a spec changes its dependencies, that's a manual roadmap edit the
  user confirms separately, not something this skill infers and writes on
  its own.

## Dependencies

`001`, `003`, `004`.

## Owner split

(none stated)
