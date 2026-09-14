# 002 — stage-not-reset-on-done

## Scope

002

## Found

Live-verified during `018`'s delivery check (2026-09-13, `style-verify-fixture` under
OpenCode): `skills/loop/SKILL.md`'s Phase 2 roll-up step rolled a spec's `Status` up to
`done` correctly, but left its `Stage` cell at `looping` — `planning/roadmap.md` ended
up with `done | — | looping | 1` for the completed spec. `planning/architecture.md`'s
own `Stage` column definition says `—` once `done`, but the roll-up step's instructions
only ever said "write that status into the matching row," with no mention of `Stage` at
all — a real gap, not a one-off mistake by the harness running it (OpenCode followed the
skill text exactly as written).

## Status

resolved

## Fix

`skills/loop/SKILL.md` Phase 2: when the status being written is `done`, also write `—`
into that row's `Stage` cell in the same edit; every other status leaves `Stage`
untouched. `planning/architecture.md`'s `Stage` bullet updated to name `specloop:loop`
as the writer of this transition too, alongside its existing `looping` transition.

## Date

2026-09-13
