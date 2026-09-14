# 026 — dashboard-visual-enhancements — Tasks

Status legend: `todo` · `in_progress` · `blocked` · `interrupted` · `done`
Owner: `agent` (loop-runnable) · `human` (skipped by the loop)

- [x] T001 [agent] [status:done] `skills/status/SKILL.md` Phase 5.1: change `dependsOn` from a display string to a list of spec IDs (`["001", "003"]`, `[]` if none)
      └─ dependsOn now parsed from the roadmap's Depends on cell (comma-split, trimmed, empty/— -> []) instead of passed through as display text.
- [ ] T002 [agent] [status:in_progress] `skills/status/SKILL.md` Phase 5.1: add `nextEligible` (a boolean per spec), computed using the exact same eligibility rule Phase 1.1 already applies — no separate, possibly-diverging logic
- [ ] T003 [agent] [status:todo] `skills/status/SKILL.md` Phase 5.1: add `counts` per spec (`{todo, in_progress, blocked, interrupted, done}`) and one repo-wide `totals` object
- [ ] T004 [agent] [status:todo] `skills/status/references/template.html`: update the header comment documenting the JSON shape (`dependsOn` as a list, `nextEligible`, `counts`, `totals`)
- [ ] T005 [agent] [status:todo] `template.html`: add the KPI strip above the roadmap table (specs by status count, overall % tasks done, drift count)
- [ ] T006 [agent] [status:todo] `template.html`: add the overall (repo-wide) progress bar
- [ ] T007 [agent] [status:todo] `template.html`: add the per-spec progress bar, segmented by status proportion, same color family as the existing status badges
- [ ] T008 [agent] [status:todo] `template.html`: add per-task badges (task ID, owner, status) to the drill-down rows
- [ ] T009 [agent] [status:todo] `template.html`: add a Priority badge near each spec's task list (spec-level field, shown once per spec, not per task)
- [ ] T010 [agent] [status:todo] `template.html`: change `Depends on` from plain text to clickable badges that jump to/highlight the referenced spec's row
- [ ] T011 [agent] [status:todo] `template.html`: add a distinct visual treatment for the row where `nextEligible` is true
- [ ] T012 [agent] [status:todo] `template.html`: add client-side text and/or status filter/search over the roadmap table, pure inline JS, no new dependency
- [ ] T013 [agent] [status:todo] Sweep the rest of the repo for other mentions of the dashboard's JSON contract/capabilities that this spec makes stale (`planning/architecture.md`'s Status Skill bullet, `planning/product.md`, `README.md`, `CHANGELOG.md`) and update any that describe the old shape/capabilities — same alignment pass done when `009` closed and in `027` T005; leave `009`'s own `requirements.md`/`design.md`/`tasks.md` untouched as historical record
- [ ] T014 [agent] [status:todo] Acceptance verification: regenerate `planning/dashboard.html` via `specloop:status` against this repo's own real data, confirm all 7 items from `requirements.md` are visible and functional, and confirm nothing from `009`'s original behavior broke
