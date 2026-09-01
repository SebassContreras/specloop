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
| T9 | Implement Phase 2 (vision & tooling Q&A): goal + MVP questions written into `docs/product.md`, skip logic on repeat runs | done | |
| T10 | Wire Phase 2's MVP answer into Phase 3's first-spec naming suggestion | done | |
| T11 | Implement Phase 2's skill-suggestion step: propose relevant skills/plugins from the stated goal, confirm before installing anything, manual-instructions fallback if install isn't possible | done | |
| T12 | Re-verify Phase 0/idempotency logic and `tasks.md`/design.md phase numbering after the Phase 2 insertion | done | |
| T13 | Extend Phase 1 to scaffold `README.md` (stub) and `CONTRIBUTING.md` (real content) | done | |
| T14 | Extend Phase 2 with a license question (T4) and README finalization (T5) | done | |
