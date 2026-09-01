# 002 — loop-orchestrator — Tasks

Status legend: `todo` · `in_progress` · `blocked` · `interrupted` · `done`

| ID | Task | Status | Notes |
|----|------|--------|-------|
| T1 | Create `framework/orchestrator/` skeleton: `package.json` (`bin.loop`), `tsconfig.json`, `bin/loop.js` shim | done | |
| T2 | Implement `src/config.ts`: load/validate `.specloop/loop.config.json` (`workerCli`, `workerArgs`, `splitMode`, `logDir`) | done | |
| T3 | Implement `src/roadmap.ts`: parse `docs/roadmap.md`'s table, pick next eligible spec (deps satisfied, or resume `in_progress`) | done | |
| T4 | Implement `src/tasks.ts`: parse/write a spec's `tasks.md` (fixed `ID \| Task \| Status \| Notes` contract), status transitions | done | |
| T5 | Implement `src/worker.ts`: spawn the configured `workerCli` as a child process for one task | done | |
| T6 | Implement `src/safeStop.ts`: stop-flag file, `SIGINT` handling, writes `interrupted` row + resume pointer + log | done | |
| T7 | Implement `src/splitPane/none.ts`: sequential/inline execution mode (always-works fallback) | done | |
| T8 | Implement `src/splitPane/windowsTerminal.ts` and `src/splitPane/tmux.ts` | done | |
| T9 | Implement `src/cli.ts`: `loop run` / `loop stop` / `loop status` dispatch | done | |
| T10 | Create `skills/loop-setup/SKILL.md`: guided Q&A (workerCli, splitMode), copy framework into `.specloop/orchestrator/`, write config, `pnpm install && pnpm link --global` | done | |
| T11 | Local test: `specloop:loop-setup` + `loop run` end-to-end against a target repo with a populated `tasks.md` (needs 003 to have run there first) | interrupted | Needs a live interactive session plus Node/pnpm on the test machine. Resume: run `specloop:task-breakdown` on `test/sample-new-repo`'s `001-hello-cli`, then `specloop:loop-setup`, then `loop run`. |
