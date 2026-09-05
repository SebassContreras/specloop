# 006 — e2e-smoke-testing — Tasks

Status legend: `todo` · `in_progress` · `blocked` · `interrupted` · `done`
Owner: `agent` (loop-runnable) · `human` (skipped by the loop)

- [x] T001 [agent] [status:done] Scaffold the fixture: run `specloop:start` end-to-end against a fresh `test/sample-new-repo/`, producing its first spec's `requirements.md`
      └─ Ran Phases 1-4 (scaffold, vision/tooling Q&A, first spec `001-hello-cli` + requirements.md, stack Q&A). First pass hit the bug fixed in T6 (requirements.md header mismatch); fixture rebuilt from scratch after the fix per the no-partial-patch rule. Goal/MVP/spec-name/stack answered live with the user; skill suggestions and license defaulted per user direction ("continue, don't ask"). **Stale, and the fixture directory is already empty.** It first went stale on `001`'s scope revert (T15/T16), and the 2026-09-02 restoration (T19–T27) changed the interview again — it now runs 8 phases including a project-type classifier, a branched tech Q&A, skill recommendation, styles, and `AGENTS.md`/`.specloop/` scaffolding. Notably, the stack Q&A this run *did* exercise is back, so the original run was closer to current behavior than the revert left it. Per this spec's no-partial-patch rule, restart from `specloop:start` on the next 006 pass — and add a non-software fixture alongside the CLI one (`017`), since the generality claim is otherwise untested.
- [ ] T002 [agent] [status:blocked] Close the fixture's first spec design: run `specloop:design-closing` on it
      └─ Superseded by T10, which consolidates the whole live pipeline into one run. The fixture these referred to no longer exists.
- [ ] T003 [agent] [status:blocked] Break the fixture's first spec into tasks: run `specloop:task-breakdown` on it
      └─ Superseded by T10, which consolidates the whole live pipeline into one run. The fixture these referred to no longer exists.
- [ ] T004 [agent] [status:blocked] Wire up the orchestrator: run `specloop:loop-setup` against the fixture repo
      └─ Superseded by T10, which consolidates the whole live pipeline into one run. The fixture these referred to no longer exists.
- [ ] T005 [agent] [status:blocked] Execute the loop: run `loop run`, confirm it completes at least one task including the docs it produces
      └─ Superseded by T10, which consolidates the whole live pipeline into one run. The fixture these referred to no longer exists.
- [ ] T006 [agent] [status:blocked] Fix-forward any bugs found in T1-T5 into the owning skill/orchestrator file(s), deleting and restarting the fixture from T1 after each fix
      └─ Fix 1: `design-closing`'s Phase 0 refusal check hardcoded a `## Requirements` header `start` never produced/specified — `start` had no requirements.md template at all. Added the template to `start/SKILL.md`, made `design-closing/SKILL.md`'s check reference the same real headers. Superseded by T10, which consolidates the whole live pipeline into one run. The fixture these referred to no longer exists.
- [ ] T007 [agent] [status:blocked] Flip 001 T8, 002 T11, 003 T7, 004 T7 to `done`, each noting this run
      └─ Superseded by T10, which consolidates the whole live pipeline into one run. The fixture these referred to no longer exists.
- [x] T008 [agent] [status:done] Orchestrator end-to-end run against a fixture repo with a stub worker CLI
      └─ Owned by `014` T9 — see that spec for the 17 behaviours verified (prompt contents, context filtering, human-task skip, status roll-up, chain advance, failing worker, safe stop, resume, log naming, `loop status`). Two real bugs found and fixed: unprefixed logs colliding across specs, and an undiagnosable config parse error.
- [x] T009 [agent] [status:done] Skill cross-reference check (`scripts/check-skill-consistency.mjs`)
      └─ Owned by `001` T29. Replaces the statically-checkable part of the four `interrupted` local-test tasks.
- [ ] T010 [human] [status:todo] Live interactive pipeline run: `/specloop:start` -> `design-closing` -> `task-breakdown` -> `loop-setup` -> `loop run` with a real worker CLI
      └─ The remaining gap, and genuinely human-only: the interview elicits the user's answers, and a real worker CLI *honoring* the prompt is not something a stub can establish. `014` T9 proves the briefing is delivered and correct; this proves a model acts on it. Supersedes `001` T8, `002` T11, `003` T7, `004` T7 — flip those once it runs.
- [ ] T011 [agent] [status:todo] Add a non-software fixture alongside the CLI one
      └─ `017`. Without it the project-type generality claim stays untested — which is how it broke the first time.
- [ ] T012 [human] [status:todo] Split-pane backends (`windowsTerminal`/`tmux`) end-to-end
      └─ They detach, so the master cannot observe the outcome; needs a real interactive terminal on each OS.
