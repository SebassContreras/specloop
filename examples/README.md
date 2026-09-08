# Examples

Worked references for what specloop's guided Q&A actually produces — read these
before running a skill for the first time, or when a `SKILL.md` phase description
isn't concrete enough on its own.

- [`hello-cli-spec/`](hello-cli-spec/) — one complete spec (`requirements.md` →
  closed `design.md` → populated `tasks.md`) for a toy "hello CLI" feature, shown
  at every stage of the pipeline `specloop:start` → `specloop:design-closing` →
  `specloop:task-breakdown` produces. Read it top to bottom to see the fixed
  contracts (`Approach` / `Components / files touched` / `Open questions` in
  `design.md`; the checkbox/owner/status checklist in `tasks.md`) filled with
  real, small content instead of the placeholders `SKILL.md` describes in prose.
- [`marketing-content-spec/`](marketing-content-spec/) — the same pipeline for a
  **non-software** target project (a toy product-launch announcement), showing the
  `B-marketing-content` question-bank branch's output: `Deliverables` phrased as
  assets/approvals rather than files, and `human`-owned tasks for anything needing a
  live publish action, a contractor, or a Legal sign-off. Built alongside a
  local-only scriptable fixture from the same persona (untracked — `test/` is
  gitignored; `017-project-type-genericity`).
- [`loop.config.sample.json`](loop.config.sample.json) — an annotated example of
  the `.specloop/loop.config.json` file `specloop:loop-setup` writes into a
  target repo.

## What this is not

- Not a test fixture — `planning/specs/006-e2e-smoke-testing/` owns the scriptable/
  interactive fixture used to actually exercise the skills end-to-end
  (`test/sample-new-repo/`, once that spec builds it). This directory is
  documentation, read by humans, not consumed by any test.
- Not a template to copy verbatim — every field here reflects one specific,
  intentionally small example project. Real specs should still go through the
  guided Q&A so the content matches your actual repo, not this one.
