# 004 — design-closing-skill — Tasks

Status legend: `todo` · `in_progress` · `blocked` · `interrupted` · `done`

| ID | Task | Status | Notes |
|----|------|--------|-------|
| T1 | Create `skills/design-closing/` skeleton | done | |
| T2 | Write `SKILL.md` frontmatter (`context: fork`, `background: false`, `description`/`when_to_use` trigger phrasing) | done | |
| T3 | Implement Phase 0: spec resolution/listing from `docs/roadmap.md`, refusal check on empty/stub `requirements.md` | done | Implemented as skill instructions in `SKILL.md` — a Skill's "implementation" is its instructions, not a script. |
| T4 | Implement Phase 1: one-question-at-a-time design Q&A (approach, components/files, sequencing, risks), write-as-you-go into `design.md` | done | |
| T5 | Implement output shape: `Approach` / `Components / files touched` / optional `Open questions / deferred` sections | done | |
| T6 | Implement Phase 2: stop after closing design, tell user 003 can run next, no auto-chaining | done | |
| T7 | Local test: run against `test/sample-new-repo`'s `001-hello-cli` (has real requirements) and verify refusal on a spec with stub requirements | interrupted | Needs a live interactive `claude --plugin-dir` session — can't be scripted end-to-end from here. Resume: run against `test/sample-new-repo`, invoke `/specloop:design-closing`. |
