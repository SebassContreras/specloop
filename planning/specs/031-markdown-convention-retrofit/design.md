# 031 — markdown-convention-retrofit — Design

## Approach

Split by file type/directory so each unit of work is single-action and
independently verifiable, rather than one "fix the whole repo" pass:

1. A full remap to the canonical 7-header set, one per `requirements.md`
   still on the old/custom layout: `001`, `002`, `003`, `004`, `005`, `006`,
   `012`, `024`, `025` (nine files). Where a bullet is genuinely ambiguous
   between two canonical sections (e.g. could read as either `## Hard
   constraints` or `## Out of scope`), the more specific section wins —
   resolve and continue, don't stop to ask per-ambiguity.
2. A heading-case sweep across every spec's `design.md`.
3. A heading-case sweep across every spec's `tasks.md` (likely a no-op —
   verified, not assumed).
4. A heading-case + structure sweep across every `skills/*/SKILL.md` and
   `skills/start/references/question-bank.md`, re-running
   `node scripts/check-skill-consistency.mjs` at the end of that pass.
5. A heading-case sweep across root docs (`README.md`, `CONTRIBUTING.md`,
   `SECURITY.md`, `CHANGELOG.md`, `.github/PULL_REQUEST_TEMPLATE.md`).
6. A heading-case sweep across `planning/*.md` (`product.md`,
   `architecture.md`, `roadmap.md`, `handoff.md`, `styles.md`).
7. A full canonical-header retrofit of `examples/*`'s two example specs.
8. Final verification: consistency script passes, spot-check a sample of
   diffs for lost/invented meaning.

## Deliverables

No new files. Every `.md` file already named in `requirements.md`'s "What's
being built" section (every spec's `requirements.md`/`design.md`/`tasks.md`,
`skills/*/SKILL.md`, `skills/start/references/question-bank.md`, root docs,
`planning/*.md`, `examples/*`) mutates in place to the convention
`planning/styles.md`/`planning/architecture.md` already document
(`008`) — headers, heading case, structure only, never content/meaning.

## Sequencing

Groups 1-7 touch disjoint file sets (specs, `SKILL.md`s, root docs,
`planning/*.md`, `examples/*`) — no ordering required between them, safe to
batch in parallel. Group 8 (final verification) must run last, after every
other group finishes — it depends on all of them.

