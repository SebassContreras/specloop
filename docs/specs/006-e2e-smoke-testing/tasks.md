# 006 — e2e-smoke-testing — Tasks

Status legend: `todo` · `in_progress` · `blocked` · `interrupted` · `done`

| ID | Task | Status | Notes |
|----|------|--------|-------|
| T1 | Scaffold the fixture: run `specloop:start` end-to-end against a fresh `test/sample-new-repo/`, producing its first spec's `requirements.md` | done | Ran Phases 1-4 (scaffold, vision/tooling Q&A, first spec `001-hello-cli` + requirements.md, stack Q&A). First pass hit the bug fixed in T6 (requirements.md header mismatch); fixture rebuilt from scratch after the fix per the no-partial-patch rule. Goal/MVP/spec-name/stack answered live with the user; skill suggestions and license defaulted per user direction ("continue, don't ask"). **Stale, and the fixture directory is already empty.** It first went stale on `001`'s scope revert (T15/T16), and the 2026-09-02 restoration (T19–T27) changed the interview again — it now runs 8 phases including a project-type classifier, a branched tech Q&A, skill recommendation, styles, and `AGENTS.md`/`.specloop/` scaffolding. Notably, the stack Q&A this run *did* exercise is back, so the original run was closer to current behavior than the revert left it. Per this spec's no-partial-patch rule, restart from `specloop:start` on the next 006 pass — and add a non-software fixture alongside the CLI one (`017`), since the generality claim is otherwise untested. |
| T2 | Close the fixture's first spec design: run `specloop:design-closing` on it | in_progress | |
| T3 | Break the fixture's first spec into tasks: run `specloop:task-breakdown` on it | todo | |
| T4 | Wire up the orchestrator: run `specloop:loop-setup` against the fixture repo | todo | |
| T5 | Execute the loop: run `loop run`, confirm it completes at least one task including the docs it produces | todo | |
| T6 | Fix-forward any bugs found in T1-T5 into the owning skill/orchestrator file(s), deleting and restarting the fixture from T1 after each fix | in_progress | Fix 1: `design-closing`'s Phase 0 refusal check hardcoded a `## Requirements` header `start` never produced/specified — `start` had no requirements.md template at all. Added the template to `start/SKILL.md`, made `design-closing/SKILL.md`'s check reference the same real headers. |
| T7 | Flip 001 T8, 002 T11, 003 T7, 004 T7 to `done`, each noting this run | todo | |
