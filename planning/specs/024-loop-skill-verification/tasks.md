# 024 — loop-skill-verification — Tasks

Status legend: `todo` · `in_progress` · `blocked` · `interrupted` · `done`
Owner: `agent` (loop-runnable) · `human` (skipped by the loop)

- [ ] T001 [agent] [status:todo] Build the fixture repo skeleton under `test/` (gitignored): `AGENTS.md`, `planning/architecture.md`, `planning/styles.md`, `planning/roadmap.md` with at least one spec mixing `[agent]`/`[human]` tasks, one all-`[human]` spec, and two eligible `todo` rows with different `Priority` numbers
      └─ See `design.md`'s "Approach". Don't hand-write `.specloop/loop.config.json` here — T003 writes it live via `specloop:loop-setup`.
- [ ] T002 [agent] [status:todo] Write the stub worker script: appends received argv + full prompt to a file, then exits success, exits non-zero with a plain error, or exits non-zero with usage-limit-shaped wording, selected by an env var/arg
- [ ] T003 [human] [status:todo] Live run: `specloop:loop-setup` against the fixture
      └─ Confirm: the all-`human` spec is flagged before the worker-CLI question; `workers`/`logDir`/`contextFiles` land correctly in `.specloop/loop.config.json`; a legacy single-`workerCli` fixture variant is read as a one-element `workers` array per `skills/loop`'s Phase 0 (test this shape once, separately, if time allows — not blocking).
- [ ] T004 [human] [status:todo] Live run: `specloop:loop` against the fixture, cycling the stub through all three exit modes across several tasks, then telling it to stop mid-task
      └─ Watch for, and note the actual result of, every bullet in `requirements.md`'s "What's being verified" list — eligibility/priority-tiebreak, grammar read/write, human-skip, prompt contents (task+spec naming, requirements/design pointer, existing-only contextFiles, language line only when set, do-not-touch-status instruction), status rollup + roadmap write, `Stage` write on first pick, blocked-on-genuine-failure, ask-on-quota-suspicion, safe-stop report.
- [ ] T005 [human] [status:todo] Write the full observed-result table (see `design.md`'s template) as a note here, and fix forward in `skills/loop`/`skills/loop-setup` anything that didn't match the skill's own stated rule
- [ ] T006 [human] [status:todo] Re-run just the affected step(s) for anything fixed in T005 to confirm the fix; flip this spec `done` once every bullet has a matching observed result
