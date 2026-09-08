# 017 — project-type-genericity — Tasks

Status legend: `todo` · `in_progress` · `blocked` · `interrupted` · `done`
Owner: `agent` (loop-runnable) · `human` (skipped by the loop)

- [x] T001 [agent] [status:done] Add concrete per-type `planning/architecture.md` header templates to `skills/start/SKILL.md` Phase 1, and fix the stale "Phase 4 fills it" reference
- [x] T002 [agent] [status:done] Add the all-`human`-backlog check to `skills/loop-setup/SKILL.md` Phase 0, before the worker-CLI question
- [x] T003 [agent] [status:done] Add `examples/marketing-content-spec/` (requirements/design/tasks), and list it in `examples/README.md`
- [x] T004 [agent] [status:done] Build `test/sample-marketing-repo/`: run the scaffold + Phase 2/3 Q&A + roadmap seeding + first-spec requirements against a declared fictional marketing persona
- [x] T005 [agent] [status:done] Close that fixture's first spec design (`specloop:design-closing`) and break it into tasks (`specloop:task-breakdown`)
- [x] T006 [agent] [status:done] Write `test/sample-marketing-repo/NOTES.md` stating the persona and what this fixture does/doesn't prove
- [x] T007 [agent] [status:done] Flip `006` T011 to `done`, pointing at this fixture
- [x] T008 [agent] [status:done] Verify acceptance criteria: no software dimension appears anywhere in the fixture's `.specloop/interview.md`; `planning/architecture.md` headers match the marketing template
      └─ The "runs with `planning/architecture.md` absent" criterion is verified by code reading only, not a live fixture run against a literally-absent file: `design-closing`/`task-breakdown` Phase 0 already gate on "if they have real content" (conditional, not required) rather than refusing on absence. `test/sample-marketing-repo` itself has a populated `architecture.md`, so it doesn't exercise the absent case directly. Flagged rather than silently claimed — a real absent-file fixture pass is one line item, not done here.
