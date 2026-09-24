# Handoff — 2026-09-23

Point-in-time notes, restarted 2026-09-23. **Not a source of truth**:
`planning/roadmap.md` owns order and status, each spec's `tasks.md` owns the work,
`AGENTS.md`'s current-state paragraph summarizes what's shipped. Earlier handoffs
(2026-09-11 → 2026-09-21) are in `git log -- planning/handoff.md`; everything still
load-bearing from them is carried below. Branch: `main`, clean, no other branches.

## Shipped 2026-09-23

- **`planning/fix/018` — `advance` drafts missing requirements.** A real target
  project (marketing, 11 seeded specs) got stuck: `advance` refused specs without
  `requirements.md`, and `start` Phase 7 insisted on 7 questions per spec even after
  the user said "sigue solo". Fix: `skills/advance/SKILL.md` Phase 0.5 derives the
  7 sections from the interview, decides gaps by industry standard confirmed with a
  web search (primary sources), and marks every line the user didn't say
  (`_(standard: …)_` / `_(standard, unverified …)_` / `_(judgement, no standard)_`).
  It shows the full draft before any write. The Fixed rule "never infer" in
  `planning/architecture.md` names it as the one exception (user's go-ahead).
  `check-skill-consistency` group `[16]` guards it. Verified with 6
  skill-architect evals in `test/advance-evals/` (local-only, gitignored).
- **`038` — release workflow.** `auto-release.yml` bumps both manifests
  (Conventional Commits → semver, `scripts/next-version.mjs`), commits
  `chore(release)`, tags and publishes the `036` archive via the now-reusable
  `release-skills.yml`. First run: `v0.2.0`. Manual since 2026-09-24 (push trigger
  removed while testing is ongoing): `gh workflow run auto-release.yml`. `AGENTS.md`
  tells agents to suggest a run at 3+ unreleased `skills/` commits.
- **Actions on Node 24 majors** (`checkout@v7`, `setup-python@v7`,
  `upload-pages-artifact@v5`, `deploy-pages@v5`). The bot's `git push --atomic`
  with `checkout@v7` credentials was probed on a throwaway branch and worked;
  probe branches, tag and run deleted.

## Next

By `Priority` (see `planning/roadmap.md`): `037` (readme-onboarding,
`requirements`), then the three filed today, all `requirements`, ready for
`specloop:advance`:

- **`040` pin-actions-by-sha** — the auto-release workflow now writes to `main`
  with `contents: write`; pin third-party actions to full SHAs.
- **`039` advance-cross-harness-verification** — Phase 0.5 is verified under Claude
  Code only.
- **`041` advance-skill-split** — `skills/advance/SKILL.md` is 426 lines; move
  reference detail to `references/` before it passes 500.

Still open from before: `019` (public-showcase) `in_progress` — only `T005`, a demo of
the interactive skill, not a VHS tape; `009`'s `T012` `[human]` — open
`planning/dashboard.html` in a real browser.

## Traps

- **Pull after a release run.** The workflow adds a `chore(release)` commit to
  `main`; pushing without pulling gets rejected.
- **Never bump `version` by hand** in `.claude-plugin/*.json` — `auto-release.yml`
  owns it and fails loud if the two manifests disagree.
- **A tag or push made with `GITHUB_TOKEN` triggers no other workflow.** That's why
  `auto-release.yml` calls `release-skills.yml` directly; don't "simplify" it back to
  a tag trigger.
- **The releases API can list 0 assets for minutes after an upload.** Check
  `releases/latest/download/...` before concluding an upload failed.
- **Don't resurrect a standalone script/CLI for the loop** (tried twice, reversed
  twice), nor `splitMode`/`quota.ts`. The master is a chat session. See
  `planning/architecture.md`'s Declined table.
- **Skill text never says "Claude" for the master** — "your own harness" (`022`).
- **`skills/*/SKILL.md` edits go through `skill-architect`**, and a cross-cutting
  change gets a repo-wide grep sweep, not just the file it started in (`AGENTS.md`).

## Not verified — don't claim otherwise

- **`advance` Phase 0.5 outside Claude Code** — `039` owns this.
- **`skills/loop` as master outside Claude Code**: ran once under `agy`, up to the
  dispatch, then quota (HTTP 429). Codex CLI, Copilot CLI and Cursor as masters:
  never run. `{repoRoot}` substitution in the subprocess path: never exercised.
- **`skills/loop` genuine-failure → `blocked` and quota → ask the user**: stub-only.
  Roadmap-level `in_progress` resume: correct by inspection, never run.
- **The `claude`, `codex` and `opencode` worker subprocess forms** weren't re-run
  since 2026-09-12.

## Outside this repo — the target project behind `fix/018`

Its interview ledger still has two `001.what` rows (Spanish + English, the old
duplicate bug) — delete the Spanish one before `advance` runs. Its
`planning/handoff.md` says to answer requirements one by one; update it. Its roadmap
has no spec for drafting nor for GitHub/LinkedIn/Reddit publishing, so its
`done-when` (one post per channel per week) is unreachable — add them with
`specloop:start`. It needs plugin `0.2.0` (restart Claude Code after `claude plugin
update specloop@specloop`).
