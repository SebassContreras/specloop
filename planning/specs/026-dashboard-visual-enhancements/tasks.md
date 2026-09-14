# 026 — dashboard-visual-enhancements — Tasks

Status legend: `todo` · `in_progress` · `blocked` · `interrupted` · `done`
Owner: `agent` (loop-runnable) · `human` (skipped by the loop)

- [x] T001 [agent] [status:done] `skills/status/SKILL.md` Phase 5.1: change `dependsOn` from a display string to a list of spec IDs (`["001", "003"]`, `[]` if none)
      └─ dependsOn now parsed from the roadmap's Depends on cell (comma-split, trimmed, empty/— -> []) instead of passed through as display text.
- [x] T002 [agent] [status:done] `skills/status/SKILL.md` Phase 5.1: add `nextEligible` (a boolean per spec), computed using the exact same eligibility rule Phase 1.1 already applies — no separate, possibly-diverging logic
      └─ Added as its own bullet next to dependsOn, reusing Phase 1.1's computation directly — true for at most one spec.
- [x] T003 [agent] [status:done] `skills/status/SKILL.md` Phase 5.1: add `counts` per spec (`{todo, in_progress, blocked, interrupted, done}`) and one repo-wide `totals` object
      └─ Both reuse Phase 1.2's already-computed counts, no recounting. totals sits top-level alongside generatedAt/specs.
- [x] T004 [agent] [status:done] `skills/status/references/template.html`: update the header comment documenting the JSON shape (`dependsOn` as a list, `nextEligible`, `counts`, `totals`)
      └─ Example object and notes list both updated; scoped to the header comment only, ran in parallel with T005.
- [x] T005 [agent] [status:done] `template.html`: add the KPI strip above the roadmap table (specs by status count, overall % tasks done, drift count)
      └─ New .kpi-strip CSS, #kpi-section/#kpi-strip markup above the roadmap table, renderKpiStrip() wired into main(). Ran in parallel with T004; JS syntax and single-placeholder verified independently.
- [x] T006 [agent] [status:done] `template.html`: add the overall (repo-wide) progress bar
      └─ renderOverallProgress(totals), placed inside #kpi-section below the KPI strip. Reads directly from top-level totals, no recomputation.
- [x] T007 [agent] [status:done] `template.html`: add the per-spec progress bar, segmented by status proportion, same color family as the existing status badges
      └─ New "Progress" column (buildSpecProgressBar, flex-grow segments by counts, same --status-*-fg tokens); table colSpan bumped 7->8 in both the empty-state and detail rows.
- [x] T008 [agent] [status:done] `template.html`: add per-task badges (task ID, owner, status) to the drill-down rows
      └─ New .badge-neutral CSS + neutralBadge() JS for ID/owner; status badge reused statusBadge() (already existed).
- [x] T009 [agent] [status:done] `template.html`: add a Priority badge near each spec's task list (spec-level field, shown once per spec, not per task)
      └─ New .detail-meta div above buildTaskTable's output, reuses neutralBadge() for spec.priority.
- [x] T010 [agent] [status:done] `template.html`: change `Depends on` from plain text to clickable badges that jump to/highlight the referenced spec's row
      └─ buildDependsOnCell() + jumpToSpecRow() (scrollIntoView + row-highlight-pulse CSS animation); mainRow.id="spec-row-<id>" added; badge click stops propagation so it doesn't also toggle the row.
- [x] T011 [agent] [status:done] `template.html`: add a distinct visual treatment for the row where `nextEligible` is true
      └─ Redo confirmed: only var(--link) (3px left border) + existing neutralBadge("Next up") — no new token, no new hex value. First attempt (new violet color family) was reverted.
- [x] T012 [agent] [status:done] `template.html`: add client-side text and/or status filter/search over the roadmap table, pure inline JS, no new dependency
      └─ Search input (id/plan substring) + status dropdown, filterRoadmap()/initRoadmapFilters(), toggles .filtered-out on paired spec-row/detail-row. Only existing tokens used (audited: 40 hex literals total, matches original palette exactly).
- [x] T013 [agent] [status:done] Sweep the rest of the repo for other mentions of the dashboard's JSON contract/capabilities that this spec makes stale (`planning/architecture.md`'s Status Skill bullet, `planning/product.md`, `README.md`, `CHANGELOG.md`) and update any that describe the old shape/capabilities — same alignment pass done when `009` closed and in `027` T005; leave `009`'s own `requirements.md`/`design.md`/`tasks.md` untouched as historical record
      └─ Repo-wide grep + the 4 named targets checked: all already generic (report *what*, not rendering mechanics), none went stale. No edits needed — verified via git status that nothing outside 026's own SKILL.md/template.html changed.
- [x] T014 [agent] [status:done] Acceptance verification: regenerate `planning/dashboard.html` via `specloop:status` against this repo's own real data, confirm all 7 items from `requirements.md` are visible and functional, and confirm nothing from `009`'s original behavior broke
      └─ Ran Phases 0-5 for real (21 specs, 213 tasks, 6 fix entries). All 7 items verified present/wired; item 6 (next-eligible highlight) correctly implemented but inert this run since nothing is currently eligible (026's own T014 was in_progress, not todo). JSON/escaping/BOM independently re-verified.
