# 032 — automate-markdown-convention-check — Tasks

Status legend: `todo` · `in_progress` · `blocked` · `interrupted` · `done`
Owner: `agent` (loop-runnable) · `human` (skipped by the loop)

- [ ] T001 [agent] [status:todo] Create `scripts/shared/canonical-headers.mjs`, exporting the array of the 7 canonical requirements.md headers (single source of truth for both scripts)
- [ ] T002 [agent] [status:todo] Edit `scripts/check-skill-consistency.mjs`'s group `[2]` to import the header array from `scripts/shared/canonical-headers.mjs` instead of keeping its own inline copy
- [ ] T003 [agent] [status:todo] Create `scripts/check-markdown-conventions.mjs`: group 1 walks every `planning/specs/*/requirements.md` and asserts the 7 canonical headers (from the shared module) appear in order; group 2 scans every git-tracked `.md` file (`git ls-files -- '*.md'`) for sentence-case heading compliance — strip inline code spans, allow all-caps acronyms, use a curated proper-noun allowlist seeded from this repo's current compliant headings, and fail with a message naming the flagged word and suggesting it may be a legitimate proper noun missing from the allowlist. Same `ok`/`group` helper pattern and pass/fail format as the existing script
- [ ] T004 [agent] [status:todo] Add a checklist line to `.github/PULL_REQUEST_TEMPLATE.md`: run `node scripts/check-markdown-conventions.mjs` if any `.md` file changed
- [ ] T005 [agent] [status:todo] Verify `node scripts/check-skill-consistency.mjs` still passes after the shared-module refactor (T002 didn't break its existing groups)
- [ ] T006 [agent] [status:todo] Verify AC1-AC4: run `node scripts/check-markdown-conventions.mjs` against this repo's current state, confirm it passes cleanly with output matching the existing script's format; then, in a throwaway scratch fixture, introduce one requirements.md missing a canonical header and one Title-Case heading, confirm each fails with a clear message, then clean up the fixture
