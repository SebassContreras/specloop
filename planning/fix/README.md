# Fix log

A flat, hand-authored log for anything a developer finds wrong after the fact —
parallel in spirit to `planning/specs/` (numbered entries, terse structural writing),
not in shape. A spec is prospective (what to build); a fix report is retrospective
(something already went wrong, usually already corrected).

**Nothing in `framework/orchestrator/` reads this folder.** It is not loop-runnable and
not roadmap-tracked — see `planning/architecture.md` and `023-fix-log`'s design for why.
No skill authors this; write it directly in an editor or terminal.

## Convention

One folder per entry: `planning/fix/NNN-short-name/report.md`. `NNN` is this folder's
own highest existing entry + 1 (starts at `001`) — independent of `planning/specs/`'s
numbering; the two sequences don't share a namespace.

## Template

```markdown
# NNN — short-name

## Scope

Which spec (by ID, e.g. `020`) generated this. `—` if it predates any spec or isn't
attributable to one.

## Found

What was actually wrong.

## Fix

What changed to correct it. "Not yet fixed" if only logged so far.

## Date

YYYY-MM-DD
```

## Example

```markdown
# 001 — malformed-legacy-row

## Scope

002

## Found

`002`'s `tasks.md` had a stray 4-column row (`T13`, missing its `Owner` cell) inside an
otherwise 5-column table — a naive uniform-column migration would have misread its
`Status` cell as `Owner`.

## Fix

Migration script updated to detect owner-column presence per row
(`cells.length >= 5 && isOwner(cells[2])`), mirroring the original parser's own
per-row detection, instead of assuming one column count for the whole file.

## Date

2026-09-05
```
