---
name: fix
description: >
  The only supported way to log a new entry in planning/fix/ (023-fix-log) —
  computes the next NNN, asks a short set of questions, writes the file.
  Not a guided interview: no phases, no coverage gate. There is no README to
  read first; this skill is the format's sole documentation.
when_to_use: >
  Use when the user wants to log something found wrong after the fact and
  its correction, or update whether one is resolved. Trigger on phrasing
  like "log a fix for X", "add a fix entry", "record this correction",
  "/specloop:fix". Never invoked automatically by another skill or by the
  loop — always a deliberate, one-off step.
---

# specloop: fix

You are logging one entry in `planning/fix/` **inside the target repo**. This is a
quick-capture flow, not a guided design/requirements interview — ask the four
questions below and write the file. No phases, no re-reading the answers back for
confirmation beyond showing the final file.

## Step 1 — Compute the next NNN

List `planning/fix/*.md`. Take the highest existing `NNN` prefix and add 1 (start at
`001` if the folder is empty or doesn't exist yet — create it if needed). Computing
it here instead of asking the user avoids the exact collision risk hand-authoring
used to carry, back when entries could be written outside this skill.

## Step 2 — Ask, one at a time

1. **Scope** — "Which spec caused this, by ID? Say `—` if it predates any spec or
   isn't attributable to one." Reject free text that isn't a spec ID or `—` — check
   it against `planning/roadmap.md` if unsure.
2. **Found** — "What was actually wrong?"
3. **Status** — "Is this `open` (not started), `in_progress`, `resolved`, or
   `wontfix`?" Accept only those four values.
4. **Fix** — If `Status` is `open`, this can be a one-liner like "Not yet fixed" or a
   short plan; otherwise ask "What changed to correct it?" and expect a real answer —
   never invent one.

Also ask for a **short-name** (kebab-case, a few words) to build the filename if the
user hasn't already implied one from the scope/found answers.

## Step 3 — Write the file

Write `planning/fix/NNN-short-name.md` in one shot, matching this template exactly
— it's the only place this format is documented, so any future change to it must
land here, not in a separate doc:

```markdown
# NNN — short-name

## Scope

<answer 1>

## Found

<answer 2>

## Status

<answer 3>

## Fix

<answer 4>

## Date

<today, YYYY-MM-DD>
```

## Step 4 — Stop

Tell the user the entry number and file path. Do not edit `planning/roadmap.md`,
`planning/architecture.md`, or any spec's files — this log is deliberately
disconnected from the loop/roadmap machinery (`023-fix-log`'s hard constraint). Do
not chain into any other skill.

## Style rules

- Keep it terse and structural, matching every other file in `planning/fix/` — no
  filler prose.
- Never fabricate a `Found`/`Fix` detail the user hasn't actually stated.
- `Status` is a fixed enum — `open` / `in_progress` / `resolved` / `wontfix` — never
  free text.
