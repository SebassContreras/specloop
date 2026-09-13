# 009 — status-dashboard-skill — Tasks

Status legend: `todo` · `in_progress` · `blocked` · `interrupted` · `done`
Owner: `agent` (loop-runnable) · `human` (skipped by the loop)

- [x] T001 [agent] [status:done] Scaffold `skills/status/SKILL.md` — frontmatter (`name: status`, `description`, `when_to_use`), a read-only status/dashboard skill
      └─ Frontmatter + `# specloop: status` heading written, matching `loop-setup`'s style. Verified on disk.
- [x] T002 [agent] [status:done] Phase 0: read `planning/roadmap.md` and every listed spec's `tasks.md`, reusing `skills/loop`'s exact parsing contract (positional columns, checkbox/status grammar) — no new grammar invented
      └─ Read-only statement + Phase 0 section added, reusing skills/loop's contract verbatim. Verified on disk.
- [x] T003 [agent] [status:done] Phase 1: compute active spec(s), task counts by status, `blocked`/`interrupted` rows, and the next-suggested-action derived from `Stage` per the fixed pipeline order
      └─ Adds a Stage→next-skill lookup table. Verified on disk.
- [x] T004 [agent] [status:done] Phase 2: `Stage`/`Status` drift detection rule (e.g. `tasks_ready` with `tasks.md` still the stub; `done` with `Stage` not `—`)
      └─ 5 concrete rules, incl. the exact `fix/002` bug. Verified on disk.
- [x] T005 [agent] [status:done] Phase 3: print the chat/terminal summary from T003/T004's data
      └─ Fixed 5-part order; prints every run regardless of the HTML dashboard. Verified on disk.
- [x] T006 [agent] [status:done] Create `skills/status/references/template.html` — fixed, self-contained (inline CSS, no build, no CDN) template with placeholders for the roadmap table, per-spec drill-down, and fix-log panel
      └─ Single-occurrence `__DASHBOARD_DATA_JSON__` placeholder, JSON contract documented inline. Verified.
- [x] T007 [agent] [status:done] Phase 4: read every `planning/fix/NNN-name/report.md` if the folder exists (title/`Scope`/`Date` + `Found`/`Fix` for drill-down); empty/omitted panel if the folder doesn't exist, never an error
      └─ Output field names confirmed matching T006's template.html fixes[] shape. Verified on disk.
- [x] T008 [agent] [status:done] Phase 5: substitute the gathered data into `template.html` and write/overwrite `planning/dashboard.html` in the target repo; must succeed without `.specloop/loop.config.json` existing (never reads that file)
      └─ Full overwrite every run, </script-escaped substitution. Verified on disk.
- [x] T009 [agent] [status:done] Verify AC1+AC3: run `specloop:status` twice against a throwaway multi-spec fixture; confirm both runs produce the chat summary + dashboard, and the second run carries no stale content from the first
      └─ `test/status-verify-fixture/`, 7 specs. Both hold. Independently re-verified the JSON myself.
- [x] T010 [agent] [status:done] Verify AC2: confirm the dashboard visually distinguishes every status and that a deliberately-introduced `Stage`/`Status` drift produces a visible dashboard warning
      └─ Browser unavailable in this environment; verified programmatically (CSS + renderer logic) instead. See note in the design if a visual/browser pass is still wanted later.
- [x] T011 [agent] [status:done] Verify AC4: run `specloop:status` against a fixture with no `.specloop/loop.config.json`; confirm it still succeeds
      └─ Covered by T009's run — `status-verify-fixture/` never had `.specloop/loop.config.json`; both runs succeeded identically.
- [ ] T012 [human] [status:todo] Open the generated `planning/dashboard.html` in a real browser from a `file://` path; confirm it renders correctly and the drill-down interactions actually work
