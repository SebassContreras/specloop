# 010 — loop-auto-continue

## Priority: 5

## Requirements (draft — to be reviewed)

- `loop run` currently stops once the active spec has no remaining runnable tasks —
  it does not pick up the next eligible spec on its own, requiring a manual re-run.
  This undercuts the core promise ("a reliable loop that works through the backlog
  without constant supervision" — `docs/product.md`).
- `loop run` should re-check `docs/roadmap.md` for the next eligible spec (status
  `todo` with satisfied `Depends on`, or resume an `in_progress` one) once the
  current spec is exhausted, and continue automatically instead of exiting.
- Safe stop must still win immediately: the stop-flag check happens before starting
  the *next spec* too, not only before the next task within the current spec.
- Add an explicit opt-out (e.g. `loop run --once`) for anyone who wants today's
  single-spec-then-exit behavior.

## Out of scope

- True multi-spec parallelism (running two independent specs' tasks concurrently) —
  already flagged as "still to define" in `docs/architecture.md`; this spec is
  sequential auto-continuation only, not parallel execution.
