# 001 — scaffold-and-spec-skill — Tasks

Status legend: `todo` · `in_progress` · `blocked` · `interrupted` · `done`

| ID | Task | Status | Notes |
|----|------|--------|-------|
| T1 | Create plugin skeleton: `.claude-plugin/plugin.json`, `skills/start/` | done | |
| T2 | Write `skills/start/SKILL.md` frontmatter (`context: fork`, `background: false`, `description`/`when_to_use` trigger phrasing) | done | |
| T3 | Implement Phase 1 (scaffold): detect existing structure, create `CLAUDE.md` + `docs/{product,architecture,roadmap}.md` skeletons when missing | done | Implemented as skill instructions in `SKILL.md` — a Skill's "implementation" is its instructions, not a script. |
| T4 | Implement Phase 2 (spec creation + requirements Q&A): next-NNN numbering, folder creation, one-question-at-a-time requirements.md fill, design.md/tasks.md stubs, roadmap.md row append | done | |
| T5 | Implement Phase 3 (stack Q&A): first-run detection, guided questions into `docs/architecture.md`, skip/append logic on repeat runs | done | |
| T6 | Implement `tasks.md` stub generation using the fixed table contract (ID / Task / Status / Notes) | done | |
| T7 | Idempotency pass: safe re-entry on an already-scaffolded repo, no silent overwrite of non-stub content | done | Covered by Phase 0's detection + confirm-before-overwrite rule. |
| T8 | Local test: `claude --plugin-dir ./specloop` against a throwaway target repo, run `/specloop:start` end-to-end, verify all files/rows | interrupted | `claude plugin validate` passed (1 warning: root `CLAUDE.md` isn't loaded as plugin context — expected, it's specloop's own dogfooded docs, not shipped context). Full interactive Q&A run needs a live terminal session — can't be scripted end-to-end from here. Resume: run `claude --plugin-dir "C:\Users\scontreras\Documents\GitHub\specloop"` in a throwaway target repo and invoke `/specloop:start`. |
