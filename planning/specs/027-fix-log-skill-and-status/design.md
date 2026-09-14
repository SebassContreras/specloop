# 027 — fix-log-skill-and-status — Design

Closed retroactively on 2026-09-14, same as `023`/`026`: written after the format
change and skill existed, not before.

## Approach

Add one more required header to the existing four-field template — `## Status`,
directly after `## Found` and before `## Fix` (reading order: what was found, how
serious/settled it is, then what actually changed) — value one of `open` /
`in_progress` / `resolved` / `wontfix`. `## Fix` keeps describing *what changed*;
`## Status` now carries *whether it's done*, so nothing downstream needs to
string-match `"Not yet fixed"` inside prose again.

`skills/fix/SKILL.md` is a short, linear flow (not a phased Q&A), and — once it
existed — the *only* way to add an entry; hand-authoring is dropped, matching how a
spec file is never hand-started either:

1. List `planning/fix/*.md`, take the highest `NNN`, add one.
2. Ask, one at a time: which spec caused this (`—` if none), what was found, current
   status, and — only if status isn't `open` — what changed to fix it.
3. Write `planning/fix/NNN-short-name.md` in one shot from the answers, matching the
   template inlined in the skill's own text — the skill is now the format's sole
   documentation, so `planning/fix/README.md` is deleted rather than kept as a
   second, driftable copy of the same template.
4. Tell the user the entry number and path. Nothing else — no roadmap edit, no
   `Stage` write, no chaining into another skill.

`skills/status/SKILL.md` Phase 4 gains one more extracted field (`status`, the
trimmed text under `## Status`) alongside the existing four. `references/
template.html`'s documented JSON shape and `renderFixLog`/`buildFixDetail` gain a
plain `Status` column/line — no new visual treatment (badges, color-coding) beyond
what already exists for other plain text fields; that's `026`'s territory if ever
wanted.

## Deliverables

- `planning/fix/001-language-field-format.md`, `002-stage-not-reset-on-done.md`,
  `004-fix-log-flat-file.md` — `## Status: resolved` added (all three already
  describe a completed fix). `003-design-closing-drops-style-decisions.md` —
  `## Status: open` (still "Not yet fixed").
- `skills/fix/SKILL.md` — new skill, `specloop:fix`, the template's sole home.
- `planning/fix/README.md` — **deleted**: once the skill carried the template,
  keeping a second copy in a file nothing enforces sync on was the actual
  ceremony `023` was trying to avoid, just moved rather than removed.
- `README.md` (repo root) — its `planning/fix/` line now names `specloop:fix`
  instead of "hand-authored," same treatment `planning/specs/` gets for its own
  skill-written files.
- `skills/status/SKILL.md` — Phase 4 extraction gains `status`; drops its dangling
  reference to the now-deleted README.
- `skills/status/references/template.html` — JSON shape comment, table header/cell,
  and detail panel gain `status`.
- `planning/architecture.md` — Plugin components gains a "Fix Skill" bullet; the
  `023` bullet drops "hand-authored" from its description.

## Sequencing

The `## Status` field and the skill land together — the skill is what writes it
from now on, so there's no intermediate state where `## Status` exists but nothing
produces it consistently. Migrate the four existing entries next (same shape the
skill now produces), then `skills/status` (reads that shape), then delete the
README and fix every reference to it last, once nothing still points at it.

## Open questions / deferred

- Whether `specloop:fix` should also support *editing* an existing entry's `##
  Status` (e.g. flipping `open` → `resolved` later without hand-editing the file) —
  not addressed this pass; today that's still a direct edit, same as any other field.
  Revisit if that proves error-prone too.
