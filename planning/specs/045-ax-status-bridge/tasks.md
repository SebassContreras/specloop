# 045 — ax-status-bridge — Tasks

Status legend: `todo` · `in_progress` · `blocked` · `interrupted` · `done`
Owner: `agent` (loop-runnable) · `human` (skipped by the loop)

- [ ] T001 [agent] [status:todo] Create `skills/loop/scripts/append_event.py` stdlib helper appending `jsonl` with `ts`/`specId`/`taskId`/`event`/`harness`/`stage`/`status` (master-only)
- [ ] T002 [agent] [status:todo] Wire `skills/loop/SKILL.md` Phase 3 step 4 to call helper per task outcome before roadmap roll-up, preserving native async vs subprocess handling
- [ ] T003 [agent] [status:todo] Add suspend-resume marker handling to `skills/loop/SKILL.md` Phase 2 entry (check `.specloop/suspend`, flip `in_progress`→`interrupted`, log `suspended`, offer resume)
- [ ] T004 [agent] [status:todo] Extend `skills/status/scripts/build_dashboard.py` to read `events.jsonl` tail + suspend state into dashboard JSON `bridge` field (no wall-clock in main HTML)
- [ ] T005 [agent] [status:todo] Update `skills/status/references/template.html` to render bridge strip only when `bridge` present, no new server/watcher
- [ ] T006 [agent] [status:todo] Add `scripts/check-skill-consistency.mjs` group 18 asserting bridge never writes `roadmap.md`/`tasks.md` and append is master-only
- [ ] T007 [agent] [status:todo] Update `planning/architecture.md` Fixed rules (safe-stop + new suspend marker) and Resolved (third helper) with scope note (bounded helper, no standalone process)
- [ ] T008 [human] [status:todo] Manual verify suspend-resume under `claude` native + `agy` subprocess — suspend marker stops batch, resume re-queues `interrupted` via Phase 1
