# 026 — dashboard-visual-enhancements

## What's being built

A round of visual/informational additions to the `009` dashboard
(`skills/status/references/template.html` + `skills/status/SKILL.md`), decided
after seeing `009`'s real output rendered against this repo's own data:

1. **Overall progress bar** — repo-wide task completion.
2. **Per-spec progress bar, segmented by status proportion** (done/in_progress/
   blocked/todo), not a single solid-color percentage — same color family as the
   existing status badges.
3. **Richer per-task rows in the drill-down**: a badge for the task ID, a badge
   for owner (`agent`/`human`), a badge for status — plus the spec's own
   `Priority` shown as a badge near that spec's task list (Priority is a
   spec-level field, not per-task — confirmed with the user).
4. **KPI strip** above the roadmap table: specs by status count, overall %
   tasks done, drift count — same numbers Phase 1/2 already compute.
5. **`Depends on` as clickable badges** that jump to/highlight the referenced
   spec's row, instead of plain text.
6. **Visual highlight for the "next eligible" spec** — the one `skills/loop`'s
   own eligibility rule (already computed in `skills/status` Phase 1.1) would
   pick up next.
7. **Filter/search** — client-side text and/or status filter over the roadmap
   table, for repos with many specs.

## Who/what it serves

Same audience as `009` — anyone wanting the project's state at a glance — now
with less reading required per glance as the spec count grows.

## Hard constraints

- Stays self-contained: no build step, no external CDN/library, no server —
  same constraint `009`'s `template.html` already holds itself to.
- The filter/search is pure client-side JS already embedded in the template —
  no new dependency.
- The "next eligible" highlight reuses `skills/status` Phase 1.1's existing
  eligibility calculation exactly — no separate, possibly-diverging logic.

## Acceptance criteria

- All 7 items above are visible and functional in a freshly-generated
  `planning/dashboard.html`.
- Re-running `specloop:status` after this still fully regenerates the dashboard
  with nothing from `009`'s original behavior broken.

## Out of scope

- Anything requiring a backend/server — already ruled out by `009`.
- Historical/trend charts — no historical data is stored, only the current
  snapshot.

## Dependencies

`009` (extends its template and `SKILL.md`; not a rewrite).

## Owner split

All `[agent]` — CSS/JS/template work, nothing needing the user's own hands.
