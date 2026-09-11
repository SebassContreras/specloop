# 007 — orchestrator-unit-tests

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

- Testing `skills/loop/SKILL.md` (the interactive orchestrator) — it's
  instructions for an agent, not code; nothing to unit-test.
- Wiring this into CI — that's `008-ci-pipeline`.

## Note

Two things changed shape since this spec was drafted, both 2026-09-11:
`splitPane/` (`windowsTerminal.ts`/`tmux.ts`) no longer exists — reverted to a
single sequential in-process execution model (`002` T023); and `quota.ts`/
`promptForWorkerSwitch` (briefly added as `002` T024, a regex-based
quota-exhaustion prompt in `cli.ts`) were removed again in `002` T025 — that
judgement call now lives only in `skills/loop`, not in this package. Anyone
picking this spec up after that date won't find any of those files;
`pickNextSpec`/`recoverStaleTasks` (see `002`'s tasks.md T011/T021 notes) are
the signatures worth writing tests against instead.
