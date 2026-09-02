# 007 — orchestrator-unit-tests

## Priority: 2

## Requirements (draft — to be reviewed)

- Add a test runner to `framework/orchestrator/` — no automated tests exist today,
  only manual smoke tests plus `lint`/`typecheck`/`format:check`.
- Priority coverage, highest risk first:
  - `roadmap.ts` / `tasks.ts` — Markdown table parsing. Already had a real bug here
    (Sonar S8786 ReDoS-prone regex, fixed in 002 T13) — exactly the class of
    regression unit tests exist to catch.
  - `safeStop.ts` — data-loss-critical: must never lose or mis-flip an in-progress
    task's status on stop.
  - `config.ts` — load/validate `.specloop/loop.config.json`, including malformed/
    missing-field cases.
- Wire a `test` script into `framework/orchestrator/package.json` alongside the
  existing `lint`/`typecheck`/`format:check`/`format` scripts.
- Test tool choice must fit the existing stack: TypeScript run via `tsx`, ESM/
  CommonJS mix already in place — pick something that doesn't need a build step.

## Out of scope

- Testing `splitPane/windowsTerminal.ts` / `tmux.ts`'s actual process-spawning —
  needs a real terminal, not worth mocking deeply. Cover only the pure logic they
  call into (e.g. command construction).
- Wiring this into CI — that's `008-ci-pipeline`.
