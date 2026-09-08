# 022 — cross-agent-skill-compat — Tasks

Status legend: `todo` · `in_progress` · `blocked` · `interrupted` · `done`
Owner: `agent` (loop-runnable) · `human` (skipped by the loop)

- [ ] T001 [human] [status:todo] Cursor: install specloop's skills, confirm discovery of `skills/<name>/SKILL.md`, confirm auto-trigger from a natural-language request matching a skill's `description` (unmodified frontmatter), confirm the harness tolerates the `when_to_use` key, and run `/specloop:start` far enough to confirm the one-question-at-a-time write-as-you-go loop survives a full phase. Record pass/fail per `design.md`'s audit matrix.
- [ ] T002 [human] [status:todo] Same four checks as T001, for Codex CLI.
- [ ] T003 [human] [status:todo] Same four checks as T001, for OpenCode.
- [ ] T004 [agent] [status:blocked] Blocked on T001-T003. Record each harness's `when_to_use` tolerance result; if any harness chokes on it, trim `when_to_use` from that harness's read path or decide a frontmatter-tolerant alternative — don't leave a known-broken key in place.
- [x] T005 [agent] [status:done] Document the install path for a harness that doesn't read `.claude-plugin/plugin.json`: point it at (or copy `skills/` into) its own skills-scan directory — `.agents/skills/` as the vendor-neutral default, `.opencode/skills/` and `.claude/skills/` named as equivalent aliases. Add to `README.md`'s `## Install` section.
- [x] T006 [agent] [status:done] Generalize the skill-recommendation step off "Claude Code skills/plugins": `skills/start/SKILL.md` Phase 4 step 1, `skills/start/references/question-bank.md`'s Phase C `helper-skills` row, and `README.md`'s Quickstart line 62 phrasing.
- [x] T007 [agent] [status:done] Extend `scripts/check-skill-consistency.mjs` with a check that `skills/start/SKILL.md`'s helper-skills step no longer hardcodes "Claude Code" (the `.claude-plugin/plugin.json` / `claude --plugin-dir` distribution mentions elsewhere in the file are fine and excluded).
- [ ] T008 [agent] [status:blocked] Blocked on T001-T003. Update `planning/architecture.md`'s Container section from "unaudited" to naming exactly which harnesses were verified and how (per `requirements.md`'s acceptance criteria); update `planning/roadmap.md`'s `022` row to `done` once this and T004 land.
