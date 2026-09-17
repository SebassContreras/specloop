# 032 — automate-markdown-convention-check — Tasks

Status legend: `todo` · `in_progress` · `blocked` · `interrupted` · `done`
Owner: `agent` (loop-runnable) · `human` (skipped by the loop)

- [x] T001 [agent] [status:done] Create `scripts/shared/canonical-headers.mjs`, exporting the array of the 7 canonical requirements.md headers (single source of truth for both scripts)
      └─ verified against disk: 7 strings verbatim/in order, matches check-skill-consistency.mjs's inline array
- [x] T002 [agent] [status:done] Edit `scripts/check-skill-consistency.mjs`'s group `[2]` to import the header array from `scripts/shared/canonical-headers.mjs` instead of keeping its own inline copy
      └─ verified against disk + re-ran script myself: All checks passed, no other group affected
- [x] T003 [agent] [status:done] Create `scripts/check-markdown-conventions.mjs`: group 1 walks every `planning/specs/*/requirements.md` and asserts the 7 canonical headers (from the shared module) appear in order; group 2 scans every git-tracked `.md` file (`git ls-files -- '*.md'`) for sentence-case heading compliance — strip inline code spans, allow all-caps acronyms, use a curated proper-noun allowlist seeded from this repo's current compliant headings, and fail with a message naming the flagged word and suggesting it may be a legitimate proper noun missing from the allowlist. Same `ok`/`group` helper pattern and pass/fail format as the existing script
      └─ verified against disk + re-ran myself: All checks passed, 670 headings/124 files scanned, allowlist grep-derived not guessed
- [x] T004 [agent] [status:done] Add a checklist line to `.github/PULL_REQUEST_TEMPLATE.md`: run `node scripts/check-markdown-conventions.mjs` if any `.md` file changed
      └─ verified against disk: line added right after the existing check-skill-consistency.mjs line, same style
- [x] T005 [agent] [status:done] Verify `node scripts/check-skill-consistency.mjs` still passes after the shared-module refactor (T002 didn't break its existing groups)
      └─ verified directly by the orchestrating session itself, re-running the script after T002: All checks passed
- [x] T006 [agent] [status:done] Verify AC1-AC4: run `node scripts/check-markdown-conventions.mjs` against this repo's current state, confirm it passes cleanly with output matching the existing script's format; then, in a throwaway scratch fixture, introduce one requirements.md missing a canonical header and one Title-Case heading, confirm each fails with a clear message, then clean up the fixture
      └─ positive case verified earlier by the orchestrating session; negative-test fixture confirmed both failure modes with clear messages, fixture cleaned up, also confirmed the script's relative import resolves correctly regardless of invocation cwd
