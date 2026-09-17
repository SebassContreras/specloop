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
- Scans headings for sentence-case compliance across **every `.md` file
  tracked by git in the repo** (`git ls-files -- '*.md'`, not a hand-picked
  list of categories) — any Claude-facing agent file (`SKILL.md`, `AGENTS.md`,
  `CLAUDE.md`) or doc should follow the same heading pattern, and a
  git-tracked enumeration also naturally excludes untracked/gitignored
  cruft (e.g. a leftover `node_modules/` under `framework/orchestrator/`)
  without a manual exclude-list to maintain. **Broadened 2026-09-17** from
  the original filing's enumerated category list (specs, `skills/*/SKILL.md`,
  root docs, `planning/*.md`, `AGENTS.md`/`CLAUDE.md`) during design-closing,
  at the user's explicit direction, to close that gap outright rather than
  enumerate categories that can miss a new one later.

## Who/what it serves

Anyone hand-editing a spec's `requirements.md` or a skill file after `031`'s
retrofit — the check catches drift (a missing header, a re-introduced
Title-Case heading) that today only a human happens to notice.

**Scoped to this repo (`specloop`) only, same as `check-skill-consistency.mjs`**
— a contributor-maintenance script under `scripts/`, not a plugin-shipped
mechanism. It never runs against, or gets scaffolded into, a target repo
that installs the plugin; nobody using `specloop` as a plugin is affected
by or even aware of it. Invoked manually (`node
scripts/check-markdown-conventions.mjs`), same voluntary, non-hooked
pattern as the existing script — never forced on anyone. Clarified
2026-09-17 during design-closing, at the user's explicit question.

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
- [ ] Running the check fails with a clear message when any git-tracked
      `.md` file in the repo has a non-sentence-case heading.
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
