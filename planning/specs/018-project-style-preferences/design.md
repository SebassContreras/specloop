# 018 — project-style-preferences — Design

## Approach

Not built fresh — live-verified. All three parts requirements.md asks for already
existed, built as part of other specs' own work, and were never traced back to close
this spec:

- **Capture**: `skills/start/references/question-bank.md`'s Phase D (`visual-surface`
  gate, `palette`/`typography`/`density-mode`/`brand-refs`/`tone`/`accessibility`/
  `code-conventions`/`anti-preferences`/`preference-strength`) — written under `001`
  T024/T025.
- **Storage**: `skills/start/SKILL.md`'s Phase 5 (styles Q&A) — detail into
  `planning/styles.md`, operative summary with strength into `AGENTS.md`'s "Style"
  section — same commit as above.
- **Delivery**: `skills/loop/SKILL.md`'s Phase 3 names any existing `contextFiles`
  entry in the worker's prompt, and Phase 5 (start) writes `planning/styles.md` into
  `.specloop/loop.config.json`'s `contextFiles` — the generic mechanism is `014`'s.

This design records where each piece lives and closes the spec after a live run
confirmed the full chain (capture → storage → delivery → a worker actually honoring
the styles) — see `tasks.md` for what that run found, including two real gaps it
surfaced and their fixes (`planning/fix/001-language-field-format`,
`planning/fix/002-stage-not-reset-on-done`).

## Deliverables

- No new files in `skills/`. Two corrections: `skills/start/SKILL.md`'s Phase 6
  `language` field format, `skills/loop/SKILL.md`'s Phase 2 `Stage` reset on `done`.
- `requirements.md`'s AC #2 corrected to match the actual (correct) behavior: a
  no-visual-surface project still gets `planning/styles.md` for `tone`/
  `code-conventions`/`anti-preferences`, just skips the visual dimensions — it doesn't
  skip the file. Confirmed against a real prior fixture
  (`test/architecture-absent-fixture`), not guessed.

## Sequencing

None beyond what `roadmap.md` already records (`014`, `016`).

## Open questions / deferred

None — coverage gate passed against every acceptance criterion in `requirements.md`.
