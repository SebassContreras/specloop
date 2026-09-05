# 002 — loop-orchestrator — Tasks

Status legend: `todo` · `in_progress` · `blocked` · `interrupted` · `done`
Owner: `agent` (loop-runnable) · `human` (skipped by the loop)

- [x] T001 [agent] [status:done] Create `framework/orchestrator/` skeleton: `package.json` (`bin.loop`), `tsconfig.json`, `bin/loop.cjs` shim
- [x] T002 [agent] [status:done] Implement `src/config.ts`: load/validate `.specloop/loop.config.json` (`workerCli`, `workerArgs`, `splitMode`, `logDir`)
- [x] T003 [agent] [status:done] Implement `src/roadmap.ts`: parse `planning/roadmap.md`'s table, pick next eligible spec (deps satisfied, or resume `in_progress`)
- [x] T004 [agent] [status:done] Implement `src/tasks.ts`: parse/write a spec's `tasks.md` (fixed `ID | Task | Status | Notes` contract), status transitions
      └─ Contract since extended with `Owner`, and the parser rewritten to split on unescaped pipes only — this very row is what exposed the gap.
- [x] T005 [agent] [status:done] Implement `src/worker.ts`: spawn the configured `workerCli` as a child process for one task
- [x] T006 [agent] [status:done] Implement `src/safeStop.ts`: stop-flag file, `SIGINT` handling, writes `interrupted` row + resume pointer + log
- [x] T007 [agent] [status:done] Implement `src/splitPane/none.ts`: sequential/inline execution mode (always-works fallback)
- [x] T008 [agent] [status:done] Implement `src/splitPane/windowsTerminal.ts` and `src/splitPane/tmux.ts`
- [x] T009 [agent] [status:done] Implement `src/cli.ts`: `loop run` / `loop stop` / `loop status` dispatch
- [x] T010 [agent] [status:done] Create `skills/loop-setup/SKILL.md`: guided Q&A (workerCli, splitMode), copy framework into `.specloop/orchestrator/`, write config, `pnpm install && pnpm link --global`
      └─ Frontmatter (`context: fork`, `background: false`) reverted by T19.
- [ ] T011 [human] [status:interrupted] Local test: `specloop:loop-setup` + `loop run` end-to-end against a target repo with a populated `tasks.md` (needs 003 to have run there first)
      └─ Needs a live interactive session plus Node/pnpm on the test machine. Resume: run `specloop:task-breakdown` on a target repo's first spec, then `specloop:loop-setup`, then `loop run`.
- [x] T012 [agent] [status:done] Configure ESLint (typescript-eslint recommended) + Prettier (single quotes) for `framework/orchestrator/`; reformat existing source
      └─ Verified: `pnpm run lint` clean, `pnpm run typecheck` clean, re-ran the `none`-mode smoke test after reformatting.
- [x] T013 [agent] [status:done] Fix Sonar S8786 (ReDoS-prone regex): rewrite `roadmap.ts`/`tasks.ts` row regexes to use non-overlapping `[^|]*` cells instead of lazy quantifiers butted against `\s*`
      └─ Verified with a 50k-char adversarial line — parses in ~1ms.
- [x] T014 [agent] [status:done] Scope `eslint.config.cjs`'s CommonJS-only rules/globals to `bin/**/*.cjs` + `eslint.config.cjs` (require()/module are intentional there, not in `src/`)
      └─ `pnpm exec eslint .` clean; `lint`/`format` scripts widened from `src` to the whole package.
- [x] T015 [agent] [status:done] Add `src/security.ts` (Sonar S4036): `assertSafePath()` refuses to spawn if `PATH` has a world-writable directory; wired into `worker.ts`, `windowsTerminal.ts`, `tmux.ts`
      └─ POSIX-only — see design.md's open questions for why Windows is skipped. Re-ran the `none`-mode smoke test on Windows after adding the platform guard.
- [x] T016 [agent] [status:done] Move Phase 0's refusal from scaffolding to execution: install the orchestrator regardless of backlog state, read any `loop.config.json` already written by `specloop:start`, and report what `loop run` would find instead of refusing
      └─ Objective 1b. The old gate gutted a freshly-scaffolded repo — the state 1b describes. Nothing in Phase 2 runs a task, and `loop run` already exits cleanly with "no remaining runnable tasks".
- [x] T017 [agent] [status:done] Add the `contextFiles` config field and warn when a non-`claude` worker CLI is chosen that `AGENTS.md` is its only auto-loaded context
      └─ Consumed by `014`.
- [x] T018 [agent] [status:done] Replace the single `workerCli`/`workerArgs` config fields with a `workers: {cli, args}[]` array; round-robin across them by task order (`worker.ts`'s `pickWorker`); thread the picked worker's index through `dispatchTask`/`runNone`/the split-pane launchers (as an extra `_run-task` arg, since a detached pane reloads config in its own process)
      └─ Surfaced by `001` T30's live interview run: the user wanted multiple worker CLIs (`claude` + `opencode`) and the config only supported one. Legacy single-CLI configs still load — normalized to a one-element array in `config.ts`. Verified: `pnpm exec tsc --noEmit` and `pnpm exec eslint src` both clean.
- [x] T019 [agent] [status:done] Remove `context: fork`/`background: false` from `skills/loop-setup/SKILL.md` — same defect as `001` T32: forking reloaded the whole skill fresh on every user reply instead of holding the guided Q&A loop
      └─ Also fixed in `001` (`start`), `003` (`task-breakdown`), `004` (`design-closing`).
