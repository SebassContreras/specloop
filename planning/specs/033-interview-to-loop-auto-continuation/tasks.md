# 033 — interview-to-loop-auto-continuation — Tasks

Status legend: `todo` · `in_progress` · `blocked` · `interrupted` · `done`
Owner: `agent` (loop-runnable) · `human` (skipped by the loop)

- [ ] T001 [agent] [status:todo] Create `skills/advance/` skeleton + `SKILL.md` frontmatter (`name`/`description`/`when_to_use`)
- [ ] T002 [agent] [status:todo] Implement Phase 0: resolve eligible specs from `planning/roadmap.md` — `Stage: requirements` (needs design+task chain) or `Stage: design_closed` (needs task-breakdown only); refuse a spec whose `requirements.md` is still a stub
- [ ] T003 [agent] [status:todo] Implement the design-closing pass: derive Phase 1's 5 answers from the interview (`.specloop/interview.md`/`planning/product.md`/`planning/architecture.md`) instead of asking live, produce the real `design.md` draft, present it with yes/changes/defer
- [ ] T004 [agent] [status:todo] Implement the escape hatch for the design-closing pass: when a question can't be confidently derived, stop and ask that one specific question live instead of guessing
- [ ] T005 [agent] [status:todo] On yes: run design-closing's Phase 2 coverage gate against `requirements.md`, then write `design.md` and `design_closed` into `Stage` (touch only that cell)
- [ ] T006 [agent] [status:todo] Implement the task-breakdown pass immediately after a spec reaches `design_closed`: derive the draft task list from the now-closed design, present it with the same yes/changes/defer and escape hatch
- [ ] T007 [agent] [status:todo] On yes: write `tasks.md` and `tasks_ready` into `Stage`, per `003`'s own Phase 3/4 contract
- [ ] T008 [agent] [status:todo] Implement "defer": skip that spec's `Stage` entirely and continue with the rest of the batch
- [ ] T009 [agent] [status:todo] After the batch: report which specs reached `tasks_ready`, which were deferred, and which needed a live question — then stop; never chain into `specloop:loop`
- [ ] T010 [agent] [status:todo] Amend `skills/start/SKILL.md` Phase 7 to auto-chain into `specloop:advance` once the per-spec requirements Q&A ends
- [ ] T011 [agent] [status:todo] Amend `skills/design-closing/SKILL.md` Phase 3 to note the chaining exception for `specloop:advance`, while it stays the default stop for direct invocation
- [ ] T012 [agent] [status:todo] Verify: re-running `specloop:advance` after a batch with a deferred spec only reprocesses specs still short of `tasks_ready`, leaving already-closed ones untouched (using `Stage`, no new state field)
- [ ] T013 [human] [status:todo] Local end-to-end test: run `specloop:advance` against a fixture with 2+ freshly-seeded specs — confirm real drafts are shown (not a shortened synthesis), yes/changes/defer all work, a deferred spec is correctly picked up on a second run, `design-closing`/`task-breakdown` still work standalone afterward, and the loop is never auto-started
