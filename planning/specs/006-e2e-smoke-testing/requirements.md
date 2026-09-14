# 006 — e2e-smoke-testing

## What's being built

Actually running the full specloop pipeline end-to-end at least once, for
real — every local-test task across `001`–`004` was `interrupted` with the
same note ("needs a live interactive session"), meaning nothing had been
validated by execution, only by reading.

A disposable fixture repo, `test/sample-new-repo/`, checked into this repo,
so the run is repeatable without hand-crafting a throwaway target each time.

The full path exercised in one pass:

1. `specloop:start` on a fresh repo → first spec (e.g. `001-hello-cli`).
2. `specloop:design-closing` on that spec.
3. `specloop:task-breakdown` on that spec.
4. `specloop:loop-setup` against the resulting populated `tasks.md`.
5. `loop run` actually executing a task.

## Who/what it serves

This spec is what actually validated `001`–`004`'s pipeline works for real,
by execution rather than just review — anyone relying on those skills'
local-test tasks meaning something, not just being marked reviewed.

## Hard constraints

- Real bugs the run surfaces (Q&A phrasing, file contracts, idempotency edge
  cases) that design-only review can't catch get fixed forward into the
  relevant spec/skill as found — not just documented here.

## Acceptance criteria

- The full pipeline (`start` → `design-closing` → `task-breakdown` →
  `loop-setup` → `loop run`) ran once end-to-end against the fixture repo.
- Each stage's existing local-test task (`001` T8, `002` T11, `003` T7,
  `004` T7) flipped to `done`, with a note pointing at this spec's run,
  instead of being re-attempted in isolation.
- Real bugs found during the run were fixed forward into the relevant
  spec/skill.
- The fixture repo (`test/sample-new-repo/`) is checked into this repo and
  reusable for a future run.

## Out of scope

- Automating this as a CI test — at the time this was written, that was
  expected to be covered by `007-orchestrator-unit-tests`/`008-ci-pipeline`;
  both were retired 2026-09-12 alongside the deterministic CLI they
  targeted, so this remains a manual, once-per-behavior-change smoke run
  plus the fixture it leaves behind for the next one, full stop.

## Dependencies

`001`, `002`, `003`, `004` (roadmap `006` row) — the full pipeline this spec
exercises end-to-end.

## Owner split

(none stated)
