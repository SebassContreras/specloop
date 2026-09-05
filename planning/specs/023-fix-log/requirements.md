# 023 — fix-log

## Priority: 6

## What's being built

**Implemented 2026-09-05**, in the same pass it was decided, same as `020`/`015`
before it. A `planning/fix/` folder, parallel in *spirit* to `planning/specs/`
(numbered entries, terse structural writing) but not in *shape* — no requirements/
design/tasks pipeline, because a fix report isn't a feature to be built, it's a record
of something already wrong and (usually) already corrected.

A developer working in a terminal — no guided Q&A skill, no interview — creates
`planning/fix/NNN-short-name/report.md` by hand whenever they find something a spec
got wrong, naming:

- **Scope** — which spec (by ID) generated the defect. `—` if it predates any spec or
  isn't attributable to one.
- **Found** — what was actually wrong.
- **Fix** — what changed to correct it (or "not yet fixed" if only logged so far).
- **Date**.

Delivered:

- `planning/fix/README.md` — the convention, the `report.md` template, and the
  numbering rule (next `NNN` = highest existing `planning/fix/` entry + 1, independent
  of `planning/specs/`'s own numbering — the two sequences don't share a namespace).
- `planning/architecture.md`'s Resolved section documents the convention and why it's
  deliberately *not* wired into the loop/roadmap.
- `planning/roadmap.md` and `CHANGELOG.md` record this spec.

## Who/what it serves

A developer (human, at a terminal) who finds something wrong after the fact and wants
to leave a record of it and its correction — without needing to open a guided skill,
and without the record being mistaken for a loop-runnable task.

## Hard constraints

- **Nothing in `framework/orchestrator/` reads `planning/fix/`.** It is not
  loop-runnable, not roadmap-tracked, and must never gain a `Status` column the
  orchestrator is expected to roll up — that's what `tasks.md` is for. Keeping the two
  separate is the point: a fix report is retrospective, a task is prospective.
- **`Scope` names a spec ID, not free text**, so a fix can always be traced back to
  what produced it — `—` is the only accepted "no spec" value, not an empty field.
- No guided skill authors this in this pass — hand-written only. A skill may be added
  later if the format proves worth automating, but that's new scope, not implied here.

## Acceptance criteria

- `planning/fix/README.md` exists, documents the format, and gives a filled-out
  example.
- The numbering rule is stated precisely enough that two developers working
  independently wouldn't collide on the same `NNN`.
- `planning/architecture.md` states, in one place, why this folder is deliberately
  disconnected from the loop/roadmap machinery.

## Out of scope

- A skill that guides authoring a fix report — hand-written only, for now.
- Any mechanism that feeds a fix report back into a spec's `tasks.md` automatically.
- Retroactively writing `planning/fix/` entries for defects found and fixed before this
  spec existed (e.g. `002` T13's malformed row, found during `020`'s migration) — the
  folder starts empty; backfilling history isn't the point.
