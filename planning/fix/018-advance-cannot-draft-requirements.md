# 018 — advance-cannot-draft-requirements

## Scope

033

## Found

In a target project whose project interview had finished, the seeded specs sat at
`Stage: —` with no `requirements.md`. `specloop:advance` refused them ("run
`specloop:start` first"), and `specloop:start` Phase 7 insisted on answering 7
questions per spec, one at a time — about 77 questions for 11 specs. When the user
said "no sé", "sigue solo" or "use industry standards", the agent still refused. The
Fixed rule "never infer a choice to close the dimension" had no exception, and the
help-me-decide protocol classes `what`/`serves` as non-researchable. The user had to
force the automatic close. A handoff whose resume line said "answer its requirements
questions one at a time" reinforced it. Side bug: rewriting a ledger answer (Spanish
to English) appended a second `001.what` row instead of replacing it.

## Status

resolved

## Fix

- **`skills/advance/SKILL.md`, new Phase 0.5:** drafts a seeded spec's
  `requirements.md` from the finished interview, `product.md`, `architecture.md`,
  `styles.md` and sibling specs.
  - **How it decides:** gaps are filled with the current industry standard,
    confirmed with a brief web search that cites a primary source. Every line not
    from the user is marked `_(standard: …)_`, `_(standard, unverified …)_` (no
    search tool), or `_(judgement, no standard)_`. It asks live only for facts no
    standard can decide.
  - **Approval:** it shows the full draft for yes/changes/defer and writes nothing
    before the user says yes. Ledger rows are replaced, never duplicated.
  - **Dependencies:** drafting isn't gated on `Depends on`; design/tasks still
    are. Specs with unfinished dependencies stop at `Stage: requirements` in a
    new report group.
  - **"Sigue solo":** applies to the whole run. Standard-answerable questions are
    decided rather than asked, and closing-sweep questions are skipped.
  - **Report:** new groups for refused specs and roadmap gaps. Every
    standard/judgement line is listed for review.
- **`skills/start`:** Phase 7 opens with a one-time choice between answering the
  requirements and letting advance draft them. The "never infer" rule names Phase
  0.5 as the one exception. A handoff names both resume paths.
- **Other files:** the Fixed rule in `planning/architecture.md` (user's go-ahead
  2026-09-23), `question-bank.md`, `product.md`, `roadmap.md`'s Stage legend,
  README, and the design-closing/amend/loop-setup refusal pointers. `status`
  suggests `advance` for a not-done spec at `Stage: —`.
- **Guard:** `scripts/check-skill-consistency.mjs` group [16].
- **Verification:** skill-architect evals in `test/advance-evals/` (local-only).
  Happy path, "sigue solo", no web search, no interview, changes loop, and
  routing all pass. The two that failed at first were re-run after the fix.

## Date

2026-09-23
