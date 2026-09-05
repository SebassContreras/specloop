# 004 — design-closing-skill — Tasks

Status legend: `todo` · `in_progress` · `blocked` · `interrupted` · `done`
Owner: `agent` (loop-runnable) · `human` (skipped by the loop)

- [x] T001 [agent] [status:done] Create `skills/design-closing/` skeleton
- [x] T002 [agent] [status:done] Write `SKILL.md` frontmatter (`context: fork`, `background: false`, `description`/`when_to_use` trigger phrasing)
      └─ Reverted by T12 — see `001` T32.
- [x] T003 [agent] [status:done] Implement Phase 0: spec resolution/listing from `planning/roadmap.md`, refusal check on empty/stub `requirements.md`
      └─ Implemented as skill instructions in `SKILL.md` — a Skill's "implementation" is its instructions, not a script.
- [x] T004 [agent] [status:done] Implement Phase 1: one-question-at-a-time design Q&A (approach, components/files, sequencing, risks), write-as-you-go into `design.md`
- [x] T005 [agent] [status:done] Implement output shape: `Approach` / `Components / files touched` / optional `Open questions / deferred` sections
- [x] T006 [agent] [status:done] Implement Phase 2: stop after closing design, tell user 003 can run next, no auto-chaining
- [ ] T007 [human] [status:interrupted] Local test: run against `test/sample-new-repo`'s `001-hello-cli` (has real requirements) and verify refusal on a spec with stub requirements
      └─ Needs a live interactive `claude --plugin-dir` session — can't be scripted end-to-end from here. Resume: run against `test/sample-new-repo`, invoke `/specloop:design-closing`.
- [x] T008 [agent] [status:done] Fix the Phase 0 readiness gate: accept both the current 5-header requirements template and the older single `## Requirements` heading
      └─ Bug introduced 2026-09-02 — the gate keyed only on `## What's being built`, which 0 of this repo's 15 requirements files use (all 15 use `## Requirements`), so the skill refused on every spec in its own reference repo.
- [x] T009 [agent] [status:done] Generalize question 2 to "what does this create or change" with type-appropriate phrasing, and rename the output section to `## Deliverables`
      └─ `017`. Software gets files/modules; marketing gets assets/pages.
- [x] T010 [agent] [status:done] Add the Phase 2 coverage gate (refuse to close a design that leaves a requirement bullet or acceptance criterion unaddressed) and the closing sweep
      └─ `016`.
- [x] T011 [agent] [status:done] Append settled stack/convention decisions to `planning/architecture.md` and `AGENTS.md` on close
      └─ This is the writer `skills/start` already promised existed and nothing delivered — `architecture.md` was otherwise a permanent TBD stub.
- [x] T012 [agent] [status:done] Remove `context: fork`/`background: false` from `SKILL.md` — same defect as `001` T32: forking reloaded the whole skill fresh on every user reply instead of holding the guided Q&A loop
      └─ Also fixed in `001`, `002`, `003`.
