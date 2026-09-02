# 012 — spec-amend-skill

## Priority: 7

## Requirements (draft — to be reviewed)

- Today's pipeline is strictly one-directional: `requirements.md` → closed
  `design.md` → populated `tasks.md`. There's no supported way to reopen a closed
  `design.md` (or revise `requirements.md`) when requirements change mid-
  implementation — a routine situation in real projects.
- New skill, `specloop:amend`, run against an existing spec:
  - Lets the user revise `requirements.md` and/or reopen `design.md` for edits.
  - Explicit confirm step before touching either — this edits already-"closed"
    artifacts, a higher bar than the forward-only skills (start/design-closing/
    task-breakdown), which only ever write into stub or in-progress files.
  - If `tasks.md` is already populated and the requirements/design change is
    meaningful, flag the mismatch and offer to re-run `task-breakdown` rather than
    silently leaving stale tasks in place.
- Never auto-invoked — same deliberate-step rule as `specloop:loop-setup`.

## Out of scope

- Changing `docs/roadmap.md`'s dependency graph as a side effect — if amending a
  spec changes its dependencies, that's a manual roadmap edit the user confirms
  separately, not something this skill infers and writes on its own.
