# 002 — loop-orchestrator — Tasks

Status legend: `todo` · `in_progress` · `blocked` · `interrupted` · `done`

| ID | Task | Status | Notes |
|----|------|--------|-------|
| T1 | Create `framework/orchestrator/` skeleton: `package.json` (`bin.loop`), `tsconfig.json`, `bin/loop.cjs` shim | done | |
| T2 | Implement `src/config.ts`: load/validate `.specloop/loop.config.json` (`workerCli`, `workerArgs`, `splitMode`, `logDir`) | done | |
| T3 | Implement `src/roadmap.ts`: parse `docs/roadmap.md`'s table, pick next eligible spec (deps satisfied, or resume `in_progress`) | done | |
| T4 | Implement `src/tasks.ts`: parse/write a spec's `tasks.md` (fixed `ID \| Task \| Status \| Notes` contract), status transitions | done | |
| T5 | Implement `src/worker.ts`: spawn the configured `workerCli` as a child process for one task | done | |
| T6 | Implement `src/safeStop.ts`: stop-flag file, `SIGINT` handling, writes `interrupted` row + resume pointer + log | done | |
| T7 | Implement `src/splitPane/none.ts`: sequential/inline execution mode (always-works fallback) | done | |
| T8 | Implement `src/splitPane/windowsTerminal.ts` and `src/splitPane/tmux.ts` | done | |
| T9 | Implement `src/cli.ts`: `loop run` / `loop stop` / `loop status` dispatch | done | |
| T10 | Create `skills/loop-setup/SKILL.md`: guided Q&A (workerCli, splitMode), copy framework into `.specloop/orchestrator/`, write config, `pnpm install && pnpm link --global` | done | |
| T11 | Local test: `specloop:loop-setup` + `loop run` end-to-end against a target repo with a populated `tasks.md` (needs 003 to have run there first) | interrupted | Needs a live interactive session plus Node/pnpm on the test machine. Resume: run `specloop:task-breakdown` on a target repo's first spec, then `specloop:loop-setup`, then `loop run`. |
| T12 | Configure ESLint (typescript-eslint recommended) + Prettier (single quotes) for `framework/orchestrator/`; reformat existing source | done | Verified: `pnpm run lint` clean, `pnpm run typecheck` clean, re-ran the `none`-mode smoke test after reformatting. |
| T13 | Fix Sonar S8786 (ReDoS-prone regex): rewrite `roadmap.ts`/`tasks.ts` row regexes to use non-overlapping `[^\|]*` cells instead of lazy quantifiers butted against `\s*` | done | Verified with a 50k-char adversarial line — parses in ~1ms. |
| T14 | Scope `eslint.config.cjs`'s CommonJS-only rules/globals to `bin/**/*.cjs` + `eslint.config.cjs` (require()/module are intentional there, not in `src/`) | done | `pnpm exec eslint .` clean; `lint`/`format` scripts widened from `src` to the whole package. |
| T15 | Add `src/security.ts` (Sonar S4036): `assertSafePath()` refuses to spawn if `PATH` has a world-writable directory; wired into `worker.ts`, `windowsTerminal.ts`, `tmux.ts` | done | POSIX-only — see design.md's open questions for why Windows is skipped. Re-ran the `none`-mode smoke test on Windows after adding the platform guard. |
