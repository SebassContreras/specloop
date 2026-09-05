# 003 — task-breakdown-skill — Tasks

Status legend: `todo` · `in_progress` · `blocked` · `interrupted` · `done`
Owner: `agent` (loop-runnable) · `human` (skipped by the loop)

- [x] T001 [agent] [status:done] Create `skills/task-breakdown/` skeleton
- [x] T002 [agent] [status:done] Write `SKILL.md` frontmatter (`context: fork`, `background: false`, `description`/`when_to_use` trigger phrasing)
      └─ Reverted by T10 — see `001` T32.
- [x] T003 [agent] [status:done] Implement Phase 0: spec resolution/listing, refusal check on stub `design.md`
      └─ Implemented as skill instructions in `SKILL.md`.
- [x] T004 [agent] [status:done] Implement Phase 1: draft task list from requirements/design using the single-action + verifiable granularity rule
- [x] T005 [agent] [status:done] Implement Phase 2: present draft, confirm/edit loop with the user before writing anything
- [x] T006 [agent] [status:done] Implement Phase 3: write `tasks.md` using the fixed `ID | Task | Status | Notes` contract, all rows `todo`
      └─ Column contract since extended with `Owner` — see T8.
- [ ] T007 [human] [status:interrupted] Local test: run against a spec with a closed `design.md` and verify refusal on a spec with a stub `design.md`
      └─ Needs a live interactive `claude --plugin-dir` session, and a target spec with a closed design (004 needs to run first). Resume once 004 has closed a design.md in a test repo.
- [x] T008 [agent] [status:done] Add the `Owner` column (`agent`/`human`) to the drafted list and the written table, and ask the user to correct any owner before writing
      └─ Keeps the loop from attempting work needing a credential, approval or live session. Parser side in `015`.
- [x] T009 [agent] [status:done] Restate the single-action rule in delivery-neutral terms and turn each acceptance criterion into a final verification task
      └─ `017`.
- [x] T010 [agent] [status:done] Remove `context: fork`/`background: false` from `SKILL.md` — same defect as `001` T32: forking reloaded the whole skill fresh on every user reply instead of holding the propose/confirm loop
      └─ Also fixed in `001`, `002`, `004`.
