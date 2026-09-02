# 006 — e2e-smoke-testing — Design

## Approach

Run the full specloop pipeline live, once, end-to-end against a disposable fixture
repo (`test/sample-new-repo/`), checked into this repo:

1. `specloop:start` on the fresh fixture repo → its first spec (e.g.
   `001-hello-cli`).
2. `specloop:design-closing` on that spec.
3. `specloop:task-breakdown` on that spec.
4. `specloop:loop-setup` against the resulting populated `tasks.md`.
5. `loop run` actually executing a task, including the docs the loop produces
   along the way.

Check the result at each stage against what the skill/orchestrator promises. Fix
bugs forward into whichever spec/skill they actually belong to as they're found
(not documented here and deferred). On any error during the run, delete
`test/sample-new-repo/` (and any `.specloop/` inside it) and restart the whole
sequence from `specloop:start` after the fix is applied — no partial patch-and-
continue.

Each stage's existing local-test task (001 T8, 002 T11, 003 T7, 004 T7) gets
flipped to `done`, pointing at this run, instead of being re-attempted in
isolation.

## Components / files touched

- `test/sample-new-repo/` — the fixture repo, checked in, including whatever
  `specloop:start` scaffolds (`CLAUDE.md`, `docs/`, first spec folder), that
  spec's closed `design.md`/populated `tasks.md`, and `.specloop/` (orchestrator
  copy + `loop.config.json`) once `loop-setup` runs.
- `docs/specs/001-.../tasks.md`, `002-.../tasks.md`, `003-.../tasks.md`,
  `004-.../tasks.md` — local-test tasks flipped to `done`.
- Whichever `skills/*/SKILL.md` or `framework/orchestrator/` files need fixes for
  bugs the live run surfaces.

## Sequencing / dependencies

Strict order: `start` → `design-closing` → `task-breakdown` → `loop-setup` →
`loop run`. Depends on 001-004 being usable as-is (per roadmap). On any failure:
fix the bug, delete the fixture repo entirely, restart the whole sequence from
`specloop:start` — never resume mid-pipeline against a partially-broken fixture.
