# 026 — dashboard-visual-enhancements — Design

## Approach

Extend the existing JSON contract `009` already established, rather than adding a
second data structure alongside it:

- `dependsOn` changes from a single display string to a list of spec IDs
  (`["001", "003"]`, `[]` if none) — the renderer builds one clickable badge per
  entry instead of printing the string.
- A new per-spec boolean, `nextEligible`, computed in Phase 5 using the exact
  same rule `skills/status`'s Phase 1.1 already applies (lowest `Priority`
  `todo` row, dependencies satisfied, at least one runnable task; or the
  `in_progress` row if one exists) — the renderer uses it to add a distinct
  visual treatment to that one row, nothing else re-derives eligibility
  client-side.
- Per-spec and repo-wide task counts (already computed in Phase 1.2) get carried
  into the JSON too (`counts: {todo, in_progress, blocked, interrupted, done}`
  per spec, plus one repo-wide `totals` object) so the KPI strip and progress
  bars render from data already computed server-side, not re-counted in JS.

Everything else (per-task badges, filter/search) is presentation over data the
JSON already carries (task `id`/`owner`/`status`, spec `priority`) — no further
schema change needed for those.

## Deliverables

All edits land in the same two files `009` already created — no new files:

- `skills/status/SKILL.md` — Phase 5's JSON-assembly step gains `dependsOn` as a
  list, `nextEligible`, and the `counts`/`totals` objects.
- `skills/status/references/template.html` — CSS + renderer JS gain: the KPI
  strip, the overall and per-spec segmented progress bars, per-task ID/owner/
  status badges plus a per-spec Priority badge near its task list, clickable
  `dependsOn` badges, the `nextEligible` visual treatment, and the client-side
  filter/search.

## Sequencing

The JSON contract extension (`dependsOn` list, `nextEligible`, `counts`/`totals`)
comes first — every visual addition below it reads from those fields, so
nothing downstream can be built or tested against the old shape.

The filter/search stays plain inline JS operating on the already-rendered DOM
(hiding/showing rows) — no new library, same self-contained/no-CDN/no-build
constraint the rest of `template.html` already holds itself to. Phase 5's
existing full-regeneration behavior (`009`) is untouched: this only grows what
goes into the JSON blob, not how or when it's written.
