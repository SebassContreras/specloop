# 028 — clickable-roadmap-ids

Raised 2026-09-14 as GitHub issue #3 (`Roadmap: hacer el ID clicable hacia su
carpeta`); filed here and the issue closed once this spec existed.

## What's being built

`planning/roadmap.md`'s `ID` column becomes a Markdown link to the spec's
folder — `[001](./specs/001-scaffold-and-spec-skill/)` instead of plain
`001` — so a GFM viewer (GitHub included) opens the folder on click instead
of the reader building the path by hand. Same convention applies wherever a
`planning/fix/NNN-*.md` entry is referenced from prose elsewhere (e.g. a
handoff note, an issue) — link to `./fix/NNN-name.md`.

## Who/what it serves

Anyone browsing `planning/roadmap.md` on GitHub (or another GFM viewer)
without a local clone open — mainly the user, checking status from a phone
or browser.

## Hard constraints

- `Plan` must stay byte-identical to the post-`NNN-` folder-name segment —
  the link must not touch that invariant.
- `skills/loop/SKILL.md`'s and `skills/status/SKILL.md`'s roadmap-row
  parsers (both read `ID`/`Plan` positionally) must tolerate `[NNN](path)`
  in the `ID` cell and extract the bare number — verify against the actual
  post-change table, not assumed.
- `skills/start/SKILL.md`'s Phase 6 (seeding) and Phase 7 (new spec) must
  write new rows already in linked form.
- Retrofit every existing row in the same change — a half-migrated table
  (some rows linked, some plain) is worse than today's all-plain table.

## Acceptance criteria

- [ ] Every row in `planning/roadmap.md`'s `ID` column is a working relative
      link to its spec folder; opening it in GitHub's file viewer lands on
      that folder.
- [ ] `skills/loop`'s and `skills/status`'s roadmap parsers correctly read
      both `ID` and `Plan` from a linked row.
- [ ] A spec seeded by `skills/start` (Phase 6 or 7) gets a linked `ID` cell
      from the start, not plain text needing a later pass.
- [ ] `Plan` remains byte-identical to the folder-name segment for every row
      (spot-checked after the retrofit).

## Out of scope

- Adding `planning/fix/` as a new roadmap column — the fix log stays
  disconnected from the loop/roadmap machinery (`023`'s hard constraint).
  The link convention only applies where a fix entry is already being cited
  in prose, not a structural change to the roadmap table.
- Any change to `Status`/`Stage`/`Priority` semantics.

## Dependencies

`001` (owns `planning/roadmap.md`'s row format and the skill that writes new
rows).

## Owner split

(none stated)
