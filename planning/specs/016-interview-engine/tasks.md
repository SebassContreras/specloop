# 016 — interview-engine — Tasks

Status legend: `todo` · `in_progress` · `blocked` · `interrupted` · `done`
Owner: `agent` (loop-runnable) · `human` (skipped by the loop)

- [x] T001 [agent] [status:done] Confirm the pre-existing engine (ledger, question-bank coverage, follow-up triggers, closing sweep, termination contract, skip protocol, downstream coverage gates, answer fan-out) is implemented and working
      └─ Evidenced by two live runs: `001` T030 and `001` T033's regression run.
- [x] T002 [agent] [status:done] Add the "help me decide" rule to `skills/start/SKILL.md`'s interview contract, applying to every phase rather than being special-cased per phase
- [x] T003 [agent] [status:done] Document the help-me-decide protocol in `skills/start/references/question-bank.md`, with researchable vs. non-researchable dimension examples
- [x] T004 [agent] [status:done] Record the help-me-decide summary, and the general "align every file when changing a cross-cutting mechanism" rule, in `planning/architecture.md`'s Fixed rules
- [x] T005 [agent] [status:done] Add `scripts/check-skill-consistency.mjs` group [12] verifying the protocol is documented consistently across `start`, `question-bank.md` and `architecture.md`
- [ ] T006 [human] [status:todo] Live verification: a "no sé" answer on a researchable dimension produces 3–5 reasoned options; the same on a non-researchable dimension produces a narrower follow-up instead of a fabricated list — needs an interactive session, same as `001` T033's regression run
