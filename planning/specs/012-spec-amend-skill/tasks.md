# 012 — spec-amend-skill — Tasks

Status legend: `todo` · `in_progress` · `blocked` · `interrupted` · `done`
Owner: `agent` (loop-runnable) · `human` (skipped by the loop)

- [x] T001 [agent] [status:done] Create `skills/amend/SKILL.md` (`specloop:amend`): resolves the target spec, asks which artifact to revise, refuses if any task is `[status:in_progress]`, explicit confirm gate before touching a closed artifact, reuses `skills/start`'s Phase 7 Q&A by reference for a `requirements.md` revision and `skills/design-closing`'s Phase 1 Q&A by reference for a `design.md` reopen, and the staleness check offering to re-run `specloop:task-breakdown` when `tasks.md` already has real tasks — never auto-invoked, never auto-chains into `task-breakdown`
      └─ Verified against disk: 5 phases, matches design.md faithfully. See `.specloop/logs/012.log`.
- [x] T002 [agent] [status:done] Add an "Amend Skill" bullet to `planning/architecture.md`'s Plugin components
      └─ Narrowed mid-run: dropped the `CHANGELOG.md` entry from this task — `CHANGELOG.md`'s own rule is one entry per spec once `tasks.md` is fully `done`, not mid-run. Moved to T004. Verified against disk, see `.specloop/logs/012.log`.
- [x] T003 [agent] [status:done] Consistency sweep: `node scripts/check-skill-consistency.mjs` passes with `skills/amend/SKILL.md` added; grep the repo for any dangling "no amend skill exists" claim elsewhere
      └─ Script: all checks passed. Grep found one real stale claim (`planning/handoff.md:142`) — left for a separate full handoff.md refresh, not patched in isolation. See `.specloop/logs/012.log`.
- [x] T004 [agent] [status:done] Live-verify `specloop:amend` end-to-end against a throwaway fixture spec (local-only, gitignored `test/`) — confirm the `in_progress` refusal, the confirm gate, a `requirements.md` revision and a `design.md` reopen each reusing the correct upstream question text, and that the staleness check detects a populated `tasks.md` and offers to re-run `task-breakdown`. Fix-forward into `skills/amend/SKILL.md` if any behavior doesn't match what was designed. Once verification succeeds, add a `012-spec-amend-skill` entry to `CHANGELOG.md`'s Unreleased section (this is now genuinely the last task, matching its one-entry-per-fully-done-spec rule)
      └─ All 5 checks passed against `test/amend-verify-fixture/`, no fix-forward needed. CHANGELOG.md entry added and verified. See `.specloop/logs/012.log`.
