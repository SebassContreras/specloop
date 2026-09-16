# 030 — dashboard-build-script — Tasks

Status legend: `todo` · `in_progress` · `blocked` · `interrupted` · `done`
Owner: `agent` (loop-runnable) · `human` (skipped by the loop)

- [ ] T001 [agent] [status:todo] Write `skills/status/scripts/build_dashboard.py`: read `planning/roadmap.md` and every spec's `tasks.md`, compute task counts and eligibility, detect the five `Stage`/`Status` drift rules, read `planning/fix/`, assemble the JSON contract, substitute it into `skills/status/references/template.html` (escaping `</script` case-insensitively), and write `planning/dashboard.html`. No arguments; runs from the repo root; sorts every listing explicitly and embeds no timestamp for determinism; opens the output with `encoding="utf-8", newline="\n"`; standard library only, no `pip install`.
- [ ] T002 [agent] [status:todo] Verify the script's output against this repo's own real data, comparing it to what `SKILL.md`'s current Phase 0-5 prose algorithm produces today — same JSON shape, same escaping, and the same results for all five drift rules and the eligibility rule.
- [ ] T003 [agent] [status:todo] Verify determinism: run the script twice against unchanged input files and confirm byte-identical `dashboard.html` output.
- [ ] T004 [agent] [status:todo] Verify the failure path: with `python3` deliberately unavailable (renamed off `PATH` in a throwaway local fixture), confirm `specloop:status` fails with a clear, explicit error naming the missing dependency — no silent fallback, no cryptic stack trace.
- [ ] T005 [agent] [status:todo] Rewrite `skills/status/SKILL.md`: replace Phases 0-5 with an instruction to run the script and present its output as the Phase 3 chat summary — no parallel prose description of the algorithm remains.
- [ ] T006 [agent] [status:todo] Update `skills/status/references/template.html`'s header comment: reduce the JSON schema description to a pointer at `build_dashboard.py` instead of a duplicate schema description.
