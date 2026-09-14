# 003 — design-closing-drops-style-decisions

## Scope

004

## Found

Found by inspection 2026-09-14, not a live run. `018` gives `planning/styles.md`
(detail) + `AGENTS.md`'s "Style" section (operative summary, with per-preference
strength — hard rule vs. soft default) sole ownership of style/color/theme
decisions, written only by `skills/start`'s Phase D capture.

`skills/design-closing/SKILL.md`'s Phase 2 never mentions `styles.md`. Its only
write-back path for a design decision (Q4: "does this settle any stack, tooling
or convention question?") is `planning/architecture.md`'s decision register plus
`AGENTS.md`'s "Stack & conventions" section. If a spec's design Q&A settles a
color/typography/theme choice after the initial capture — e.g. `026`'s dashboard
CSS decisions, or any later spec picking a palette `start` never asked about —
that decision has nowhere correct to land: "Stack & conventions" has no
hard-rule/soft-default distinction, so it would either get force-fit there
(losing strength) or dropped silently by whoever runs the skill.

## Status

open

## Fix

Not yet fixed. `skills/design-closing/SKILL.md` Phase 2 step 3 should route a
style/color/theme/typography decision to `planning/styles.md` + `AGENTS.md`'s
"Style" section (preserving hard/soft strength, per `018`'s model) instead of, or
in addition to, "Stack & conventions" — everything else (non-style stack/tooling
decisions) keeps its current path unchanged.

## Date

2026-09-14
