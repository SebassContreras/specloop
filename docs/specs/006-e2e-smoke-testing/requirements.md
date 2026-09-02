# 006 — e2e-smoke-testing

## Priority: 1 (highest)

## Requirements (draft — to be reviewed)

- Goal: actually run the full specloop pipeline end-to-end at least once, for real —
  every local-test task across 001–004 is currently `interrupted` with the same
  note ("needs a live interactive session"), meaning nothing has been validated by
  execution, only by reading.
- Needs a disposable fixture repo, `test/sample-new-repo/`, checked into this repo,
  so the run is repeatable without hand-crafting a throwaway target each time.
- Full path to exercise in one pass:
  1. `specloop:start` on a fresh repo → first spec (e.g. `001-hello-cli`).
  2. `specloop:design-closing` on that spec.
  3. `specloop:task-breakdown` on that spec.
  4. `specloop:loop-setup` against the resulting populated `tasks.md`.
  5. `loop run` actually executing a task.
- Each stage's existing local-test task (001 T8, 002 T11, 003 T7, 004 T7) gets
  flipped to `done` with a note pointing at this spec's run, instead of being
  re-attempted in isolation.
- Surfaces real bugs the design-only review can't catch (Q&A phrasing, file
  contracts, idempotency edge cases) — fix-forward into the relevant spec/skill as
  found, don't just document them here.

## Out of scope

- Automating this as a CI test — that's covered by `007-orchestrator-unit-tests` /
  `008-ci-pipeline`. This spec is a manual, once-per-behavior-change smoke run plus
  the fixture it leaves behind for the next one.
