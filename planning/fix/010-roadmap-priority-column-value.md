# 010 — roadmap-priority-column-value

## Scope

015

## Found

GitHub issue #8 (filed 2026-09-15): during a design conversation, the user
questioned whether `planning/roadmap.md`'s `Priority` column (`015`) earns
its complexity — their own words: "tal vez la prioridad esta de mas y es
inecesaria, solo con dependencia y el propio orden de la spec basta" (maybe
Priority is redundant; dependency plus the spec's own row order might be
enough).

## Status

open

## Fix

Not yet fixed. `Priority` is a documented Fixed rule in
`planning/architecture.md` (`015`'s own section) — per `AGENTS.md`'s rule,
changing or removing it needs the user's explicit, dated go-ahead in the
same conversation as the edit, which this issue alone doesn't constitute.
Plan: revisit explicitly with the user whether row order + `Depends on`
alone can replace `Priority`'s tie-breaking role in `skills/loop`, then
either drop the column (editing the Fixed rule and backfilling every row)
or close this as "kept as-is" if the tie-break behavior still earns its
keep.

## Date

2026-09-15
