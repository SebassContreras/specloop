# 007 — github-issue-fix-log-mirror

## Scope

027

## Found

GitHub issue #5 ("Fix log tracker") was created as a manually-maintained
checklist mirroring `planning/fix/`'s entries, to be hand-updated every time
a fix's `## Status` changes. That's a second source of truth for the same
information at the same granularity — exactly what `AGENTS.md`'s "Rules for
agents" already warns against ("check whether an existing mechanism already
covers the same need... avoid a second source of truth that can drift from
the first"). `planning/fix/*.md` files are already individually browsable on
GitHub under `planning/fix/`, so the mirror added sync overhead without
adding reach.

## Status

resolved

## Fix

Closed and deleted issue #5. `planning/fix/*.md` remains the sole list —
each entry is its own file, already viewable directly on GitHub. `028`
(clickable-roadmap-ids) will make browsing them easier without a duplicate
tracker.

## Date

2026-09-14
