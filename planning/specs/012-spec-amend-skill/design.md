# 012 — spec-amend-skill — Design

## Approach

A new, deliberately thin skill, `specloop:amend`, invoked against an
existing spec. It does not reinvent the design/task Q&A — it owns only what
today's forward-only skills don't: the confirmation gate before touching an
already-closed artifact, and detecting what downstream content goes stale
when an upstream one changes.

Flow:

1. Resolve the target spec (named by the user, or ask which one).
2. Ask which artifact to revise: `requirements.md`, `design.md`, or both.
3. **Refuse outright if the target spec has any task `[status:in_progress]`
   in its `tasks.md`** — the loop may be actively working it; amending
   underneath a running task risks a worker acting on now-stale
   requirements/design mid-execution. Tell the user to stop the loop first
   (safe-stop already marks in-flight tasks `interrupted`), then retry.
4. **Explicit confirm step** before touching anything — a higher bar than
   `start`/`design-closing`/`task-breakdown`, which only ever write into
   stub or in-progress files.
5. For a `requirements.md` revision: re-run the relevant dimension(s) of
   `skills/start`'s Phase 7 Q&A (by reference — reuse its question text and
   `requirements.md` template, don't duplicate it), asking only about the
   dimensions the user wants to change.
6. For a `design.md` reopen: re-run `skills/design-closing`'s Phase 1 Q&A
   (by reference, same reuse pattern), against the already-closed content
   instead of a `TBD` stub.
7. **Staleness check**: if `tasks.md` already has real tasks (not the
   header-only stub) and the requirements/design change is meaningful, flag
   the mismatch and offer to re-run `specloop:task-breakdown` — never
   silently leave stale tasks in place, never auto-trigger the re-run
   without asking.
8. Never auto-invoked — same deliberate-step rule as `specloop:loop-setup`.

## Deliverables

- `skills/amend/SKILL.md` — new, prose-only (no code), same pattern as
  every other skill in this repo.
- `planning/architecture.md`'s Plugin components section gains an entry for
  it, same as every existing skill (`Fix Skill`, `Status Skill`, etc.) —
  documentation footprint, not new mechanism.
- Runtime effect only, no other new files: when invoked, edits the target
  spec's own `requirements.md`/`design.md`/`tasks.md` and, if
  `task-breakdown` gets re-run as a result, that spec's `planning/roadmap.md`
  row (`Stage` only, same writer rule every other skill already follows).

