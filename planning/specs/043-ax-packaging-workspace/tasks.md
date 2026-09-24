# 043 — ax-packaging-workspace — Tasks

Status legend: `todo` · `in_progress` · `blocked` · `interrupted` · `done`
Owner: `agent` (loop-runnable) · `human` (skipped by the loop)

- [ ] T001 [agent] [status:todo] Fetch and record `ax` registry/workspace schema from `google/ax` docs and Antigravity codelab (raw URLs ledger like `035` T001)
- [ ] T002 [agent] [status:todo] Create `ax` workspace/marketplace JSON(s) with `source:"./"` and version from `.claude-plugin/plugin.json`, validated via `python -m json.tool` or `agy` validator
- [ ] T003 [agent] [status:todo] Update `.github/workflows/release-skills.yml` tar list to include new manifest(s) deterministically with `sha256` (no timestamp, sorted)
- [ ] T004 [agent] [status:todo] Update `README.md` Install table to add `ax`/`agy` marketplace row and note scarce checkout equivalent if found, preserving `022` one-liners
- [ ] T005 [agent] [status:todo] Update `CONTRIBUTING.md` validation guidance for `ax` manifest(s) and `.gitignore` for local archive
- [ ] T006 [agent] [status:todo] Update `planning/architecture.md` Declined row `marketplace.json listing` with `Superseded by 043 (2026-09-24, user go-ahead)` preserving trace
- [ ] T007 [agent] [status:todo] Add or extend `scripts/check-skill-consistency.mjs` guard to assert new marketplace JSON points at `./` and version matches `plugin.json`
- [ ] T008 [human] [status:todo] Manual verify `ax`/`agy` marketplace add + install in empty fixture brings 9 skills without `planning/`
