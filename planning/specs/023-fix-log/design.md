# 023 — fix-log — Design

Closed retroactively on 2026-09-05, same as `020`/`015`: written after the folder and
template existed, not before.

## Approach

`planning/fix/` mirrors `planning/specs/`'s *numbering* convention (`NNN-short-name`
folders) because that's a format developers in this repo already recognize — but not
its *content* shape. A spec is prospective (what to build, planned before it's built);
a fix is retrospective (something already went wrong, usually already corrected). Using
the same 3-file requirements/design/tasks pipeline for a one-paragraph correction would
be exactly the kind of ceremony `planning/architecture.md`'s Declined table already
argues against elsewhere in this repo (see the marketplace-listing and update-notifier
entries — proportionality to actual scale).

So each entry is one file: `planning/fix/NNN-short-name/report.md`, four fields
(`Scope`, `Found`, `Fix`, `Date`), no frontmatter, no status enum — a developer writes
it directly in an editor/terminal, no skill invocation needed.

Numbering is independent of `planning/specs/`'s sequence (fix entries and specs are
different things counted separately) — next `NNN` is `planning/fix/`'s own highest
existing entry + 1, starting from `001` since the folder starts empty.

## Deliverables

- `planning/fix/README.md` — convention + template + a filled-out example, so the
  first real entry has something concrete to copy from.
- `planning/architecture.md`'s Resolved section — the one-paragraph statement of why
  this is deliberately disconnected from `tasks.ts`/`roadmap.ts`.

## Sequencing

Single-file deliverable; no dependencies on any other spec.

## Open questions / deferred

- Whether a `fix-log` skill should eventually guide authoring one (structured Q&A
  instead of hand-writing) — explicitly out of scope for this pass; revisit only if
  hand-writing proves error-prone in practice.
- Whether `Scope` should ever accept more than one spec ID (a fix caused by the
  interaction of two specs) — not addressed; `—` and a single ID are the only two
  documented shapes today. A real multi-scope case can extend the template later.
