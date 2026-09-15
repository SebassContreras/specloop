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

wontfix

## Fix

Kept as-is, decided 2026-09-15 (same conversation). Weighed row order +
`Depends on` as a replacement for `Priority`'s tie-breaking role in
`skills/loop` and rejected it: the roadmap table's row order currently
doubles as an ID/filing-order log (new specs just get appended at the
bottom, e.g. `032`/`033`), and making row order also carry execution
priority would force reordering rows — out of ID order — every time
priority changes, plus lose the explicit `—` ("order-independent," e.g.
`019`) signal that neither `Depends on` (hard constraints only) nor `Stage`
(pipeline phase only) can express. `Priority` stays as the documented Fixed
rule in `planning/architecture.md`; no code or doc changes needed.

## Date

2026-09-15
