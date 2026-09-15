# 032 — automate-markdown-convention-check

Raised 2026-09-14 as GitHub issue #6 (`Automate the markdown-convention check
(extend check-skill-consistency.mjs)`), right after `031` closed; filed here
and the issue closed once this spec existed. Deferred — not designed yet, no
coding.

## What's being built

Extend `scripts/check-skill-consistency.mjs` (or add a small sibling script —
same plain Node/ESM, no-build-step constraint the repo already holds) with a
new check group that:

- Walks every `planning/specs/*/requirements.md` and asserts the canonical 7
  headers (`What's being built`, `Who/what it serves`, `Hard constraints`,
  `Acceptance criteria`, `Out of scope`, `Dependencies`, `Owner split`) appear,
  in order, with none missing.
- Scans headings repo-wide — specs, `skills/*/SKILL.md`, root docs,
  `planning/*.md`, **including `AGENTS.md`/`CLAUDE.md`** — for sentence-case
  compliance.

## Who/what it serves

Anyone hand-editing a spec's `requirements.md` or a skill file after `031`'s
retrofit — the check catches drift (a missing header, a re-introduced
Title-Case heading) that today only a human happens to notice.

## Hard constraints

- Same invocation pattern as the existing script: a deliberate, human/agent
  -triggered check (`node scripts/check-skill-consistency.mjs` or equivalent),
  not a Claude-Code-specific git hook — a hook would break cross-harness
  parity (`planning/architecture.md`'s Container section: skills target the
  open Agent Skills format, not Claude-Code-only).
- No new ADR-style mechanism — `planning/architecture.md`'s Fixed rules +
  Declined table already serve that function; a separate ADR folder would be
  a second source of truth for the same kind of record.
- `031` itself never audited `AGENTS.md`/`CLAUDE.md` for the heading-case
  sweep (they turned out to already be compliant on manual inspection, but the
  omission was real — see `planning/fix/008-markdown-convention-undocumented`
  for the related gap). This spec's scan must cover both files so that kind of
  gap can't recur silently.

## Acceptance criteria

- [ ] Running the check fails with a clear message when a
      `planning/specs/*/requirements.md` is missing one of the 7 canonical
      headers, or has them out of order.
- [ ] Running the check fails with a clear message when any scanned file
      (specs, `skills/*/SKILL.md`, root docs, `planning/*.md`, `AGENTS.md`,
      `CLAUDE.md`) has a non-sentence-case heading.
- [ ] The check passes cleanly against this repo's current state (post-`031`)
      with zero fixes needed.
- [ ] Invocation and output style match the existing
      `check-skill-consistency.mjs` groups (same pass/fail format).

## Out of scope

- Auto-fixing violations — this check only reports; `031`'s hand-guided
  retrofit pattern stays the correction path for actual violations.
- A git hook or CI pipeline wiring it in automatically — no CI exists in this
  repo today (see `planning/architecture.md`'s Declined table on standalone
  processes/scripts as orchestration).

## Dependencies

`031` (markdown-convention-retrofit) — this extends the check the retrofit
left unautomated, and the canonical header set it defines.

## Owner split

(none stated)
