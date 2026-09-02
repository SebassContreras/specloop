# 001 — scaffold-and-spec-skill — Tasks

Status legend: `todo` · `in_progress` · `blocked` · `interrupted` · `done`

| ID | Task | Status | Notes |
|----|------|--------|-------|
| T1 | Create plugin skeleton: `.claude-plugin/plugin.json`, `skills/start/` | done | |
| T2 | Write `skills/start/SKILL.md` frontmatter (`context: fork`, `background: false`, `description`/`when_to_use` trigger phrasing) | done | |
| T3 | Implement Phase 1 (scaffold): detect existing structure, create `CLAUDE.md` + `docs/{product,architecture,roadmap}.md` skeletons when missing | done | Implemented as skill instructions in `SKILL.md` — a Skill's "implementation" is its instructions, not a script. |
| T4 | Implement Phase 2 (spec creation + requirements Q&A): next-NNN numbering, folder creation, one-question-at-a-time requirements.md fill, design.md/tasks.md stubs, roadmap.md row append | done | |
| T5 | Implement Phase 3 (stack Q&A): first-run detection, guided questions into `docs/architecture.md`, skip/append logic on repeat runs | done | Removed by T16, restored and expanded by T19 — the status was stale in between, claiming a deleted implementation. |
| T6 | Implement `tasks.md` stub generation using the fixed table contract (ID / Task / Status / Notes) | done | |
| T7 | Idempotency pass: safe re-entry on an already-scaffolded repo, no silent overwrite of non-stub content | done | Covered by Phase 0's detection + confirm-before-overwrite rule. |
| T8 | Local test: `claude --plugin-dir ./specloop` against a throwaway target repo, run `/specloop:start` end-to-end, verify all files/rows | interrupted | `claude plugin validate` passed (1 warning: root `CLAUDE.md` isn't loaded as plugin context — expected, it's specloop's own dogfooded docs, not shipped context). Full interactive Q&A run needs a live terminal session — can't be scripted end-to-end from here. Resume: run `claude --plugin-dir "C:\Users\scontreras\Documents\GitHub\specloop"` in a throwaway target repo and invoke `/specloop:start`. |
| T9 | Implement Phase 2 (vision & tooling Q&A): goal + MVP questions written into `docs/product.md`, skip logic on repeat runs | done | |
| T10 | Wire Phase 2's MVP answer into Phase 3's first-spec naming suggestion | done | |
| T11 | Implement Phase 2's skill-suggestion step: propose relevant skills/plugins from the stated goal, confirm before installing anything, manual-instructions fallback if install isn't possible | done | Reverted by T15, restored by T20 as its own phase keyed off the stack answers rather than the goal. |
| T12 | Re-verify Phase 0/idempotency logic and `tasks.md`/design.md phase numbering after the Phase 2 insertion | done | |
| T13 | Extend Phase 1 to scaffold `README.md` (stub) and `CONTRIBUTING.md` (real content) | done | Superseded by T15 — reverted, out of scope. |
| T14 | Extend Phase 2 with a license question (T4) and README finalization (T5) | done | Superseded by T15 — reverted, out of scope. |
| T15 | Revert T11/T13/T14: drop README/CONTRIBUTING/LICENSE scaffolding and the bootstrap-time skill-install side-effect — out of scope per `docs/product.md` | done | **Partly undone by T19/T20.** The `README`/`CONTRIBUTING`/`LICENSE` half stands. The skill-recommendation half was a stated user objective and its removal was justified by citing a `docs/product.md` clause written in the same change — circular; see T18. |
| T16 | Replace the Phase 3 stack Q&A with roadmap seeding: propose tech/architecture/skill setup as the roadmap's first specs, confirm with the user, create them as ordinary spec entries instead of writing straight into `docs/architecture.md` | done | **Undone by T19.** Seeding was kept — it's now downstream of the restored Q&A and derives from recorded answers instead of inference — but it is not a substitute for asking. |
| T17 | Update `docs/product.md`/`docs/architecture.md` to match the narrowed scope | done | **Undone by T21.** This is the task that wrote the clause T15/T16 cited as their authority. |
| T18 | Record the scope-authority rule in `docs/architecture.md`: a Declined row may not overrule a stated user objective, and may not cite a `product.md` clause edited in the same change | done | The mechanism that produced T15–T17. Without this the same revert recurs. |
| T19 | Restore the technologies/architecture/tools Q&A as its own phase, running after the vision Q&A and before seeding, writing a decision register into `docs/architecture.md` and the operative form into `AGENTS.md` | done | Objective 3. Baseline recovered from `git show HEAD:skills/start/SKILL.md`, then branched per project type. |
| T20 | Restore skill recommendation as its own phase, positioned after T19 so it keys off the user's actual selections; confirm before install, manual fallback, and route anything uninstallable to the roadmap | done | Objective 4. |
| T21 | Rewrite `docs/product.md`/`docs/architecture.md` to describe all six objectives, and add `AGENTS.md`, project-type branching, the interview contract, the `Plan`-cell path invariant and the single-`Status`-writer rule to the fixed rules | done | |
| T22 | Scaffold `AGENTS.md` as the single context source with `CLAUDE.md` as a thin `@AGENTS.md` import; add both to Phase 0's detection and to this skill's owned-file list | done | Objective 5. Required by CLI-agnosticism: `codex`/`opencode` read `AGENTS.md`, not `CLAUDE.md`. |
| T23 | Add the project-type classifier as the first interview question, persisted to `docs/product.md` and branched downstream | done | Objective 2. Engine in `016`, branches in `017`. |
| T24 | Add the styles/preferences phase and `docs/styles.md`, gated on a visual surface | done | Objective 6. Inert until `014` ships — see that spec. |
| T25 | Write `skills/start/references/question-bank.md` and the interview contract (ledger, follow-up triggers, skip protocol, closing sweep, no fixed question count) | done | Objective ★. Enforcement is `016`. |
| T26 | Scaffold the `.specloop/` loop folder's static files (`loop.config.json`, `logs/.gitkeep`, `.gitignore`) and add `.specloop/` to this skill's owned files | done | Objective 1b. `loop-setup` keeps the payload copy + install. |
| T27 | Add `## Acceptance criteria` to the requirements template, and the `Owner` column to the `tasks.md` template | done | Consumed by `task-breakdown` and by `015`'s parser. |
| T28 | Migrate this repo's own 13 `tasks.md` files to the 5-column `Owner` layout | todo | Dogfooding gap: the skills now write 5 columns while this repo's tables are 4. Harmless — `015`'s parser reads both — but the reference layout should match what it tells others to write. |
| T29 | Re-run the end-to-end local test (T8) against a throwaway repo now that the interview has changed shape | todo | Depends on T28 being decided either way; owned jointly with `006`. |
