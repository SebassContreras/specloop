# 011 — parallel-spec-start-duplicate

## Scope

029

## Found

GitHub issue #11 (filed 2026-09-15): independent specs with no `Depends on`
between them are still only started one at a time (with a sub-agent) when
the loop begins — only the first ever gets one. This is the same gap `029`
(spec-worktree-isolation) already tracks: the loop currently serializes work
that doesn't strictly need to be, and `029` is deferred pending an unresolved
`planning/roadmap.md` merge-conflict question before it can be designed
further.

## Status

resolved

## Fix

Closed issue #11 as a duplicate of an already-filed mechanism rather than
opening a second spec for the same need. Added its evidence (independent
specs starting serially, not just same-file contention) to `029`'s "Who/what
it serves" section.

## Date

2026-09-15
