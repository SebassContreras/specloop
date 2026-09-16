# 030 — dashboard-build-script — Design

## Approach

A single stdlib-only Python script, `skills/status/scripts/build_dashboard.py`,
absorbs everything `skills/status/SKILL.md`'s Phases 0-5 currently specify in
prose: read `planning/roadmap.md` and every spec's `tasks.md`, compute task
counts and eligibility, detect the five `Stage`/`Status` drift rules, read
`planning/fix/`, assemble the JSON contract, substitute it into
`skills/status/references/template.html` (escaping `</script` case-insensitively
wherever it appears in a string value), and write `planning/dashboard.html`.
`SKILL.md` no longer restates the algorithm — its job shrinks to running the
script and presenting its output as the Phase 3 chat summary.

Invocation: `python3 skills/status/scripts/build_dashboard.py`, no
arguments, run from the target repo's root (same cwd assumption the current
prose already makes reading `planning/roadmap.md` by relative path).
Determinism (byte-identical output across runs on unchanged input) is
guaranteed by explicitly sorting every file/spec listing the script builds
(alphabetical by `ID`, already the roadmap's natural order) and never
embedding a "generated at" timestamp or any other wall-clock value in the
written HTML. The script opens `planning/dashboard.html` explicitly with
`encoding="utf-8", newline="\n"` — Python's default `open()` can pick a
locale-dependent encoding and, on Windows, silently translates `\n` to
`\r\n`; either would break `planning/architecture.md`'s UTF-8-no-BOM rule
and/or this spec's own determinism guarantee.

## Deliverables

- New: `skills/status/scripts/build_dashboard.py`.
- Modified: `skills/status/SKILL.md` — Phases 0-5 replaced by an instruction
  to run the script and use its output.
- Modified: `skills/status/references/template.html` — its header-comment
  JSON schema description reduced to a pointer at `build_dashboard.py`
  rather than a duplicate schema description.

## Sequencing

Write and verify the script first, against this repo's own real data,
comparing its output to what the current prose algorithm produces today —
only then rewrite `SKILL.md`/`template.html` to depend on it, so the prose
being replaced stays available as the reference while the script is built.
