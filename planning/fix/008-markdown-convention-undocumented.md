# 008 — markdown-convention-undocumented

## Scope

018

## Found

No file in the repo documented a convention for how `.md` files should be
structured or written. In practice this drifted: comparing every spec's
`requirements.md` shows at least 4-5 different header-set "eras" (a plain
`## Requirements` block in the oldest specs, a couple of one-off custom
layouts, and the current 7-header canonical set that only stabilized around
`009`/`026`), with no single place naming the canonical set or the heading
style. `planning/styles.md`'s `## Code conventions` (from `018`) covered
naming/comments/commits/scripts but never markdown document structure
itself, even though it's the established place for this kind of rule.

## Status

resolved

## Fix

Added markdown-convention rules to `planning/styles.md`'s `## Code
conventions` (sentence-case headings, never paraphrase a canonical header,
one complete idea per section, don't restate what another file already
owns — researched against current industry practice: `llms.txt`/`AGENTS.md`
conventions and LLM-context chunking guidance). Added a collected index of
the four canonical header sets (`requirements.md`/`design.md`/`tasks.md`/
`planning/fix/NNN-*.md`) to `planning/architecture.md`'s Fixed rules, as a
lookup index — each skill's own text stays the source of truth for writing
its file type. Retrofitting existing files to match is tracked separately
as `031-markdown-convention-retrofit`, not part of this fix.

## Date

2026-09-14
