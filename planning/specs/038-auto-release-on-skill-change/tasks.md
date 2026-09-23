# 038 — auto-release-on-skill-change — Tasks

Status legend: `todo` · `in_progress` · `blocked` · `interrupted` · `done`
Owner: `agent` (loop-runnable) · `human` (skipped by the loop)

- [x] T001 [agent] [status:done] Write `scripts/next-version.mjs` (Conventional Commits → semver, 0.x rule, forced level, input validation)
      └─ Verified locally: fix→0.1.1, feat→0.2.0, breaking 0.x→0.2.0, breaking 1.x→2.0.0, feat 1.x→1.3.0, forced patch, bad version/level rejected; real range v0.1.0..HEAD → 0.2.0.
- [x] T002 [agent] [status:done] Make `.github/workflows/release-skills.yml` callable via `workflow_call` with a `tag` input
      └─ Tag push trigger kept; checkout ref and `TAG` fall back to the pushed tag.
- [x] T003 [agent] [status:done] Write `.github/workflows/auto-release.yml` (path filter, dispatch, concurrency, manifest-agreement check, bump, atomic push, reusable release call)
      └─ YAML parses; both `jq` edits diffed locally (only the `version` line changes).
- [x] T004 [agent] [status:done] Update `CONTRIBUTING.md` and the `CHANGELOG.md` preamble
- [ ] T005 [agent] [status:todo] Verify on GitHub: dispatch `auto-release` → `v0.2.0` commit, tag, release with both assets; manifests at `0.2.0`
