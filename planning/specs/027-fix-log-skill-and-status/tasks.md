# 027 — fix-log-skill-and-status — Tasks

Status legend: `todo` · `in_progress` · `blocked` · `interrupted` · `done`
Owner: `agent` (loop-runnable) · `human` (skipped by the loop)

- [x] T001 [agent] [status:done] Add `## Status` (enum `open`/`in_progress`/`resolved`/`wontfix`) to `planning/fix/README.md`'s convention, template and example
      └─ Superseded by T006: the README this task edited was deleted the same day, once `specloop:fix` existed.
- [x] T002 [agent] [status:done] Add an explicit `## Status` to all four existing entries: `resolved` for `001`, `002`, `004`; `open` for `003`
      └─ `001-language-field-format.md`, `002-stage-not-reset-on-done.md`, `004-fix-log-flat-file.md` already describe a completed fix; `003-design-closing-drops-style-decisions.md` still says "Not yet fixed".
- [x] T003 [agent] [status:done] Create `skills/fix/SKILL.md` (`specloop:fix`): computes next `NNN` from `planning/fix/*.md`, asks scope/found/status/fix in a short linear flow (no phases, no coverage gate), writes the entry with the template inlined in the skill itself
- [x] T004 [agent] [status:done] Update `skills/status/SKILL.md` Phase 4 to extract `status` per fix entry, and `references/template.html`'s documented JSON shape + table header/cell + detail panel to carry and show it
- [x] T005 [agent] [status:done] Add a "Fix Skill" bullet to `planning/architecture.md`'s Plugin components; add `027` to `planning/roadmap.md` and `CHANGELOG.md`
- [x] T006 [agent] [status:done] Decide hand-authoring is no longer a supported path (user call, 2026-09-14): delete `planning/fix/README.md`, update the root `README.md`'s `planning/fix/` line to name `specloop:fix`, and strip every dangling reference to the deleted file (`skills/fix/SKILL.md`, `skills/status/SKILL.md`, `023-fix-log`'s requirements/design, `planning/architecture.md`)
