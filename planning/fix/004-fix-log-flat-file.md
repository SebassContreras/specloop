# 004 — fix-log-flat-file

## Scope

023

## Found

`023-fix-log` shipped each entry as a folder holding one file
(`planning/fix/NNN-short-name/report.md`) — directory nesting for what's always a
single short record with four fields and nothing else that folder would ever hold.
The user found this unnecessary after seeing entry `003` get created that way.

## Status

resolved

## Fix

Convention tightened to one flat file per entry: `planning/fix/NNN-short-name.md`.
Migrated the three existing entries (`001-language-field-format`,
`002-stage-not-reset-on-done`, `003-design-closing-drops-style-decisions`) from their
`NNN-name/report.md` shape to `NNN-name.md`, and updated every place that documented or
read the old shape: `planning/fix/README.md`'s convention/template/example,
`023-fix-log`'s `requirements.md`/`design.md`, `planning/architecture.md`'s Resolved
entry for `planning/fix/`, and `skills/status/SKILL.md`'s Phase 4 (which listed
`NNN-name` subfolders and read each one's `report.md` — now lists `NNN-name.md` files
directly, skipping `README.md`).

## Date

2026-09-14
