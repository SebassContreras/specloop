# 003 — task-breakdown-skill — Tasks

Status legend: `todo` · `in_progress` · `blocked` · `interrupted` · `done`

| ID | Task | Status | Notes |
|----|------|--------|-------|
| T1 | Create `skills/task-breakdown/` skeleton | done | |
| T2 | Write `SKILL.md` frontmatter (`context: fork`, `background: false`, `description`/`when_to_use` trigger phrasing) | done | |
| T3 | Implement Phase 0: spec resolution/listing, refusal check on stub `design.md` | done | Implemented as skill instructions in `SKILL.md`. |
| T4 | Implement Phase 1: draft task list from requirements/design using the single-action + verifiable granularity rule | done | |
| T5 | Implement Phase 2: present draft, confirm/edit loop with the user before writing anything | done | |
| T6 | Implement Phase 3: write `tasks.md` using the fixed `ID | Task | Status | Notes` contract, all rows `todo` | done | |
| T7 | Local test: run against a spec with a closed `design.md` and verify refusal on a spec with a stub `design.md` | interrupted | Needs a live interactive `claude --plugin-dir` session, and a target spec with a closed design (004 needs to run first). Resume once 004 has closed a design.md in a test repo. |
| T8 | Add the `Owner` column (`agent`/`human`) to the drafted list and the written table, and ask the user to correct any owner before writing | done | Keeps the loop from attempting work needing a credential, approval or live session. Parser side in `015`. |
| T9 | Restate the single-action rule in delivery-neutral terms and turn each acceptance criterion into a final verification task | done | `017`. |
