# 023 — fix-log — Design

Closed retroactively on 2026-09-05, same as `020`/`015`: written after the folder and
template existed, not before.

> **Amended by `027`, 2026-09-14**: `planning/fix/README.md` is gone and
> hand-authoring is no longer supported — `specloop:fix` is the sole way to add an
> entry, and its own `SKILL.md` is now the only place the format is documented. The
> "no skill invocation needed" line below is this spec's original, now-superseded
> reasoning — see `027`'s design for the current shape and why it changed.

## Approach

`planning/fix/` mirrors `planning/specs/`'s *numbering* convention (`NNN-short-name`
folders) because that's a format developers in this repo already recognize — but not
its *content* shape. A spec is prospective (what to build, planned before it's built);
a fix is retrospective (something already went wrong, usually already corrected). Using
the same 3-file requirements/design/tasks pipeline for a one-paragraph correction would
be exactly the kind of ceremony `planning/architecture.md`'s Declined table already
argues against elsewhere in this repo (see the marketplace-listing and update-notifier
entries — proportionality to actual scale).

So each entry is one flat file: `planning/fix/NNN-short-name.md`, four fields
(`Scope`, `Found`, `Fix`, `Date`), no frontmatter, no status enum — a developer writes
it directly in an editor/terminal, no skill invocation needed. (Tightened from an
initial `NNN-short-name/report.md` folder-per-entry shape to a flat file — see
`planning/fix/004-fix-log-flat-file`: a bare file was simpler for what's always a
single short record, with nothing else the folder would ever hold.)

Numbering is independent of `planning/specs/`'s sequence (fix entries and specs are
different things counted separately) — next `NNN` is `planning/fix/`'s own highest
existing entry + 1, starting from `001` since the folder starts empty.

## Deliverables

- `planning/fix/README.md` — convention + template + a filled-out example, so the
  first real entry has something concrete to copy from. (Removed by `027` once
  `skills/fix/SKILL.md` took over as the format's sole documentation.)
- `planning/architecture.md`'s Resolved section — the one-paragraph statement of why
  this is deliberately disconnected from `tasks.ts`/`roadmap.ts`.

## Sequencing

Single-file deliverable; no dependencies on any other spec.

## Open questions / deferred

- ~~Whether a `fix-log` skill should eventually guide authoring one~~ — resolved by
  `027`: yes, and it's now the only way.
- Whether `Scope` should ever accept more than one spec ID (a fix caused by the
  interaction of two specs) — not addressed; `—` and a single ID are the only two
  documented shapes today. A real multi-scope case can extend the template later.
