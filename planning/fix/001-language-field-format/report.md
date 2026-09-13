# 001 — language-field-format

## Scope

018

## Found

`skills/start/SKILL.md`'s Phase 6 never specified a format for `.specloop/loop.config.json`'s
`language` field — just "the working language from the tone dimension." Two live-verified
fixtures picked different formats for the same dimension: `test/architecture-absent-fixture`
wrote `"language": "Spanish"` (spelled-out, English name of the language), while
`style-verify-fixture` (018's live verification, 2026-09-13) wrote `"language": "es"`
(a two-letter code). Both satisfy `skills/loop`'s Phase 3 consumption of the field (it's
just interpolated into a sentence), so neither was ever caught as wrong — they'd just
read differently to a human or another tool comparing two projects' configs.

## Fix

Researched the industry standard before picking one (not guessed): BCP 47 is the
modern standard for language tags in software (what `Intl`/most JS tooling reads),
built on ISO 639-1 two-letter codes for the plain-language case with no region/script
subtag needed. Encoding: RFC 8259 requires JSON to be UTF-8 and says a BOM MUST NOT be
added, which we extend as a general rule to every scaffolded file, not just JSON.

Changed `skills/start/SKILL.md`'s Phase 6 `loop.config.json` template and prose to
require the lowercase BCP 47 / ISO 639-1 code (`"es"`, not `"Spanish"`), and added a
`planning/architecture.md` Fixed rule generalizing this to any future coded field a
skill writes (not just `language`) plus the UTF-8-no-BOM rule for every scaffolded
file. Existing fixtures under `test/` were left as-is (gitignored, local-only,
disposable) — the fix is in the skill text new runs read, not a retroactive edit of
old fixture output.

## Date

2026-09-13
