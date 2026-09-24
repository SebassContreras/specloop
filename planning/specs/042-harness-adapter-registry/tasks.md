# 042 — harness-adapter-registry — Tasks

Status legend: `todo` · `in_progress` · `blocked` · `interrupted` · `done`
Owner: `agent` (loop-runnable) · `human` (skipped by the loop)

- [ ] T001 [agent] [status:todo] Create `skills/shared/harness-registry.json` v1 with 6 verified entries (`claude`, `codex`, `opencode`, `copilot`, `cursor-agent`, `agy`) including `args`, `scanPaths` from `022` matrix and `nativeSubagent` where applicable, version field
- [ ] T002 [agent] [status:todo] Add `skills/shared/resolve_harness.py` stdlib-only helper resolving `cli → args/scanPaths/nativeSubagent`, `--help` no-op, deterministic `sort_keys`, `CLAUDE_PLUGIN_ROOT` fallback probe mirroring `skills/status`
- [ ] T003 [agent] [status:todo] Rewrite `skills/loop/SKILL.md` Phase 3 to resolve worker via registry helper, keep `{repoRoot}` substitution and native-subagent-first priority text
- [ ] T004 [agent] [status:todo] Rewrite `skills/loop-setup/SKILL.md` Phase 1 worker-cli Q&A to read registry and only ask headless flag for unknown `cli`, preserve `AGENTS.md` contextFiles note
- [ ] T005 [agent] [status:todo] Update `skills/start/references/question-bank.md` Phase C `worker-cli` row to point at registry file, not `loop-setup/SKILL.md` prose
- [ ] T006 [agent] [status:todo] Extend `scripts/check-skill-consistency.mjs` group 16 to fail if hardcoded args map remains outside registry or registry drifts from `README.md` matrix
- [ ] T007 [agent] [status:todo] Sweep `README.md` Install one-liners and `planning/architecture.md` Container/Resolved for stale hardcoded wording; add Resolved entry for single-registry Fixed rule (grep cross-cutting per Fixed rule)
- [ ] T008 [human] [status:todo] Manual verify `loop-setup` under `claude` + `agy` resolves correct args and dispatch succeeds (native vs subprocess)
