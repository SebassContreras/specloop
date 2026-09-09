# 001 — scaffold-and-spec-skill — Tasks

Status legend: `todo` · `in_progress` · `blocked` · `interrupted` · `done`
Owner: `agent` (loop-runnable) · `human` (skipped by the loop)

- [x] T001 [agent] [status:done] Create plugin skeleton: `.claude-plugin/plugin.json`, `skills/start/`
- [x] T002 [agent] [status:done] Write `skills/start/SKILL.md` frontmatter (`context: fork`, `background: false`, `description`/`when_to_use` trigger phrasing)
      └─ Reverted by T32 — `context: fork` re-forks per user reply instead of holding the loop.
- [x] T003 [agent] [status:done] Implement Phase 1 (scaffold): detect existing structure, create `CLAUDE.md` + `planning/{product,architecture,roadmap}.md` skeletons when missing
      └─ Implemented as skill instructions in `SKILL.md` — a Skill's "implementation" is its instructions, not a script.
- [x] T004 [agent] [status:done] Implement Phase 2 (spec creation + requirements Q&A): next-NNN numbering, folder creation, one-question-at-a-time requirements.md fill, design.md/tasks.md stubs, roadmap.md row append
- [x] T005 [agent] [status:done] Implement Phase 3 (stack Q&A): first-run detection, guided questions into `planning/architecture.md`, skip/append logic on repeat runs
      └─ Removed by T16, restored and expanded by T19 — the status was stale in between, claiming a deleted implementation.
- [x] T006 [agent] [status:done] Implement `tasks.md` stub generation using the fixed table contract (ID / Task / Status / Notes)
- [x] T007 [agent] [status:done] Idempotency pass: safe re-entry on an already-scaffolded repo, no silent overwrite of non-stub content
      └─ Covered by Phase 0's detection + confirm-before-overwrite rule.
- [ ] T008 [human] [status:blocked] Local test: `claude --plugin-dir ./specloop` against a throwaway target repo, run `/specloop:start` end-to-end, verify all files/rows
      └─ Superseded by T30 (same run, new interview shape) and by T29 for the statically-checkable half. `claude plugin validate` passed (1 warning: root `CLAUDE.md` isn't loaded as plugin context — expected, it's specloop's own dogfooded docs, not shipped context). Full interactive Q&A run needs a live terminal session — can't be scripted end-to-end from here. Resume: run `claude --plugin-dir "C:\Users\scontreras\Documents\GitHub\specloop"` in a throwaway target repo and invoke `/specloop:start`.
- [x] T009 [agent] [status:done] Implement Phase 2 (vision & tooling Q&A): goal + MVP questions written into `planning/product.md`, skip logic on repeat runs
- [x] T010 [agent] [status:done] Wire Phase 2's MVP answer into Phase 3's first-spec naming suggestion
- [x] T011 [agent] [status:done] Implement Phase 2's skill-suggestion step: propose relevant skills/plugins from the stated goal, confirm before installing anything, manual-instructions fallback if install isn't possible
      └─ Reverted by T15, restored by T20 as its own phase keyed off the stack answers rather than the goal.
- [x] T012 [agent] [status:done] Re-verify Phase 0/idempotency logic and `tasks.md`/design.md phase numbering after the Phase 2 insertion
- [x] T013 [agent] [status:done] Extend Phase 1 to scaffold `README.md` (stub) and `CONTRIBUTING.md` (real content)
      └─ Superseded by T15 — reverted, out of scope.
- [x] T014 [agent] [status:done] Extend Phase 2 with a license question (T4) and README finalization (T5)
      └─ Superseded by T15 — reverted, out of scope.
- [x] T015 [agent] [status:done] Revert T11/T13/T14: drop README/CONTRIBUTING/LICENSE scaffolding and the bootstrap-time skill-install side-effect — out of scope per `planning/product.md`
      └─ **Partly undone by T19/T20.** The `README`/`CONTRIBUTING`/`LICENSE` half stands. The skill-recommendation half was a stated user objective and its removal was justified by citing a `planning/product.md` clause written in the same change — circular; see T18.
- [x] T016 [agent] [status:done] Replace the Phase 3 stack Q&A with roadmap seeding: propose tech/architecture/skill setup as the roadmap's first specs, confirm with the user, create them as ordinary spec entries instead of writing straight into `planning/architecture.md`
      └─ **Undone by T19.** Seeding was kept — it's now downstream of the restored Q&A and derives from recorded answers instead of inference — but it is not a substitute for asking.
- [x] T017 [agent] [status:done] Update `planning/product.md`/`planning/architecture.md` to match the narrowed scope
      └─ **Undone by T21.** This is the task that wrote the clause T15/T16 cited as their authority.
- [x] T018 [agent] [status:done] Record the scope-authority rule in `planning/architecture.md`: a Declined row may not overrule a stated user objective, and may not cite a `product.md` clause edited in the same change
      └─ The mechanism that produced T15–T17. Without this the same revert recurs.
- [x] T019 [agent] [status:done] Restore the technologies/architecture/tools Q&A as its own phase, running after the vision Q&A and before seeding, writing a decision register into `planning/architecture.md` and the operative form into `AGENTS.md`
      └─ Objective 3. Baseline recovered from `git show HEAD:skills/start/SKILL.md`, then branched per project type.
- [x] T020 [agent] [status:done] Restore skill recommendation as its own phase, positioned after T19 so it keys off the user's actual selections; confirm before install, manual fallback, and route anything uninstallable to the roadmap
      └─ Objective 4.
- [x] T021 [agent] [status:done] Rewrite `planning/product.md`/`planning/architecture.md` to describe all six objectives, and add `AGENTS.md`, project-type branching, the interview contract, the `Plan`-cell path invariant and the single-`Status`-writer rule to the fixed rules
- [x] T022 [agent] [status:done] Scaffold `AGENTS.md` as the single context source with `CLAUDE.md` as a thin `@AGENTS.md` import; add both to Phase 0's detection and to this skill's owned-file list
      └─ Objective 5. Required by CLI-agnosticism: `codex`/`opencode` read `AGENTS.md`, not `CLAUDE.md`.
- [x] T023 [agent] [status:done] Add the project-type classifier as the first interview question, persisted to `planning/product.md` and branched downstream
      └─ Objective 2. Engine in `016`, branches in `017`.
- [x] T024 [agent] [status:done] Add the styles/preferences phase and `planning/styles.md`, gated on a visual surface
      └─ Objective 6. Inert until `014` ships — see that spec.
- [x] T025 [agent] [status:done] Write `skills/start/references/question-bank.md` and the interview contract (ledger, follow-up triggers, skip protocol, closing sweep, no fixed question count)
      └─ Objective ★. Enforcement is `016`.
- [x] T026 [agent] [status:done] Scaffold the `.specloop/` loop folder's static files (`loop.config.json`, `logs/.gitkeep`, `.gitignore`) and add `.specloop/` to this skill's owned files
      └─ Objective 1b. `loop-setup` keeps the payload copy + install.
- [x] T027 [agent] [status:done] Add `## Acceptance criteria` to the requirements template, and the `Owner` column to the `tasks.md` template
      └─ Consumed by `task-breakdown` and by `015`'s parser.
- [x] T028 [agent] [status:done] Migrate this repo's own `tasks.md` files to the 5-column `Owner` layout
      └─ 13 files migrated; 114 rows across 18 specs now parse with 0 malformed-row warnings. Two rows (`002` T4, `003` T6) describe the pipe-delimited contract itself and exposed a parser gap — see `015` T16.
- [x] T029 [agent] [status:done] Add `scripts/check-skill-consistency.mjs` — mechanical cross-reference check over the four skills and the question bank
      └─ 38 checks. Verified it actually fails by re-introducing the `design-closing` header bug (caught, 2 failures) and deleting the styles phase (caught). Covers the statically-checkable half of T8: template agreement, objective coverage, owned-file scope, no-phantom-writer, question-bank completeness.
- [x] T030 [human] [status:done] Live interactive run of `/specloop:start` against a throwaway repo
      └─ Run 2026-09-09 against `test/ops-onboarding-repo/` (local-only, gitignored; script/results in its `NOTES.md`), a scripted operations/process persona (vendor onboarding at a logistics company) with planted edge cases. **Bearability: pass** — full arc from Phase 0 through Phase 6 and one spec's Phase E, one question at a time, stopped voluntarily at a natural boundary, no fatigue point. **Sweep convergence: pass, 5/5** — every phase (A, B, C, D, spec 001's own sweep) ended after exactly two consecutive "nothing new" rounds, never a third, never re-asked a settled dimension. **Follow-up triggers: pass, 2/2** — both planted vague answers ("el sistema" in `mvp`, "nuestro proceso de aprobación" in `current-state`) got an immediate follow-up, resolved back into the same ledger row. **Skip protocol: pass, 2/2** — both planted declines (`stakeholders`, `access`) recorded `skipped` with the user's exact reason quoted, not dropped or argued into an answer. **Visual-surface gate: pass** — "no" correctly skipped `palette`/`typography`/`density-mode`/`brand-refs` entirely. **Stop-anytime + handoff (T032): pass** — asked before stopping, wrote a correct `planning/handoff.md`. **Bonus, unplanned**: the whole run was answered in Spanish; `tone`'s language field correctly propagated to `.specloop/loop.config.json`'s `language` and every doc was written in Spanish — resolves the old 2026-09-02 handoff's "prompt is English-only, nothing consumes it" open item. Also stands as `017`'s deferred second non-software fixture (operations/process type-keyed `architecture.md` headers — Systems/Cadence/Handoffs — held up, no software-only question leaked in). **One real defect found**, tracked as T033 below: Phase E's `dependencies` and `owner-split` dimensions were never asked for the one spec drafted — not recorded in `.specloop/interview.md`, no section in `requirements.md`, despite "no dependencies" being confirmed verbally in chat.
- [x] T031 [human] [status:done] Decide the interview's escape hatch based on T30
      └─ Resolved during the `chef` live run: the user can stop at any point in plain language; before stopping the skill asks whether to write `planning/handoff.md`. Implemented in T32.
- [x] T032 [agent] [status:done] Remove `context: fork`/`background: false` from `skills/start/SKILL.md` (run inline instead — forking reloaded the whole skill fresh on every user reply, wasting tokens instead of holding the ask-wait-ask-next loop); add the stop-anytime + handoff-before-stopping rule to the interview contract, and add `planning/handoff.md` to this skill's owned files
      └─ Same defect and fix applied to `loop-setup`/`task-breakdown`/`design-closing` — see `002` T19, `003` T10, `004` T12.
- [ ] T033 [agent] [status:todo] Fix Phase E coverage: `skills/start/SKILL.md`'s per-spec requirements loop skips `dependencies` and `owner-split` (2 of the 7 `question-bank.md` Phase E dimensions) — found during T030's live run, where a spec's "no dependencies" was confirmed verbally but never written to `.specloop/interview.md` or `requirements.md`, and `owner-split` was never asked at all. Make sure all 7 dimensions get a ledger row every time, and add a `scripts/check-skill-consistency.mjs` check if the gap is structural (e.g. the phase's step list literally omits them) rather than a one-off skip.
