/**
 * The 7 canonical `requirements.md` headers, in order.
 *
 * Single source of truth for `scripts/check-skill-consistency.mjs` (group [2]) and
 * `scripts/check-markdown-conventions.mjs` — both import this instead of keeping their
 * own inline copy, so they can't silently drift on what "canonical" means. See
 * `planning/specs/032-automate-markdown-convention-check/design.md`.
 */
export const CANONICAL_HEADERS = [
  "## What's being built",
  '## Who/what it serves',
  '## Hard constraints',
  '## Acceptance criteria',
  '## Out of scope',
  '## Dependencies',
  '## Owner split',
];
