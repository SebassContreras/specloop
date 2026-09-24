# 044 — declarative-export-manifests — Tasks

Status legend: `todo` · `in_progress` · `blocked` · `interrupted` · `done`
Owner: `agent` (loop-runnable) · `human` (skipped by the loop)

- [ ] T001 [agent] [status:todo] Create `skills/export/scripts/generate_ax_manifests.py` reusing `build_dashboard.py` parsers (stdlib-only, deterministic, `utf-8 \n`, probe `python3` then `python`)
- [ ] T002 [agent] [status:todo] Implement ax manifest emitter (per-spec JSON + `index.json`, `dependsOn`/`priority`/`stage`/`counts`/`tasks`, no `generatedAt`, `</script` escape)
- [ ] T003 [agent] [status:todo] Apply lean capability degradation (8KB check → `references/` pointer, `tools:` mapping table from `035` T003) without full adapter layer
- [ ] T004 [agent] [status:todo] Add `scripts/check-manifests.mjs` using `git ls-files` to fail on drift or non-deterministic output
- [ ] T005 [agent] [status:todo] Add thin `skills/export/SKILL.md` wrapper if needed to run generator (else generator runs standalone like `build_dashboard.py`)
- [ ] T006 [agent] [status:todo] Extract shared parser or guard against drift between `build_dashboard.py` and new generator (assert identical regexes)
- [ ] T007 [agent] [status:todo] Update `planning/architecture.md` Resolved and `README.md` docs for second stdlib helper, preserving Fixed rule about bounded helper
- [ ] T008 [human] [status:todo] Verify determinism on `test/status-verify-fixture/` — two runs `sha256` identical, no wall-clock, and `ax apply --dry-run` on generated index
