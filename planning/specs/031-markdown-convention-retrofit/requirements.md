# 031 — markdown-convention-retrofit

Raised 2026-09-14, right after `planning/fix/008-markdown-convention-undocumented`
documented the convention itself. The user explicitly asked to retrofit
every `.md` file, including already-`done` specs — a deliberate override of
this repo's usual "don't rewrite history" caution, confirmed in the same
conversation: that caution is about not erasing narrative/reasoning text
that records what happened and why, not about restructuring headers/
presentation, so it doesn't actually apply here.

## What's being built

A full pass over every `.md` file in the repo — every spec's
`requirements.md`/`design.md`/`tasks.md`, `skills/*/SKILL.md`,
`skills/start/references/question-bank.md`, root docs (`README.md`,
`CONTRIBUTING.md`, `SECURITY.md`, `CHANGELOG.md`,
`.github/PULL_REQUEST_TEMPLATE.md`), `planning/*.md` (`product.md`,
`architecture.md`, `roadmap.md`, `handoff.md`, `styles.md`), and
`examples/*` — brought into line with the convention `008` just documented:
sentence-case headings, the canonical header set for the file types that
have one (`requirements.md`/`design.md`/`tasks.md`), one complete idea per
section, no restating data another file already owns.

`planning/fix/*.md` is explicitly excluded — checked against all four rules
2026-09-14 (sentence-case headings, canonical headers never paraphrased,
each section a complete standalone idea, no restated owned data) and
already fully compliant, entry `001` through `008`. `skills/fix/SKILL.md`
has been the log's only writer since `023`/`027`, with a fixed template
that never drifted the way `requirements.md`'s did across many separate
skill revisions — nothing to retrofit there.

## Who/what it serves

Any future session or agent reading these files gets one predictable
structure regardless of which era a file was originally written in —
removes the temptation to invent yet another header variant when touching
an old spec, and eventually lets `scripts/check-skill-consistency.mjs` and
`skills/design-closing` drop their legacy-header tolerance once nothing on
disk still needs it.

## Hard constraints

- **Content and meaning must not change — only structure, headers, and
  heading case.** Every bullet's actual claim carries over intact; nothing
  invented to fill a canonical header that didn't have matching content,
  nothing dropped because it didn't fit neatly. A thin/empty section says
  so explicitly (e.g. "(none stated)", "not yet defined") rather than being
  silently omitted — same rule `skills/start` Phase 7 already applies to
  new specs.
- `requirements.md` files without the canonical 7-header set get remapped
  into it in full (`## What's being built` / `## Who/what it serves` /
  `## Hard constraints` / `## Acceptance criteria` / `## Out of scope` /
  `## Dependencies` / `## Owner split`).
- `design.md`'s canonical shape (`## Approach` / `## Deliverables` /
  `## Sequencing` / `## Open questions / deferred`) is a norm, not a rigid
  requirement — a `design.md` with a genuinely different content shape
  (e.g. `002`'s history-log sections, which exist for a stated reason) keeps
  its own section names, just in sentence case.
- `skills/*/SKILL.md` frontmatter (`name`/`description`/`when_to_use`)
  stays untouched — only body heading style and wording, and only in ways
  that don't change what the skill actually instructs. Re-run
  `node scripts/check-skill-consistency.mjs` after every `SKILL.md` edit;
  it must keep passing.
- Root docs and `planning/product.md`/`architecture.md`/`roadmap.md`/
  `handoff.md`/`styles.md` keep their own established section sets (none of
  them is one of the canonical machine-read file types) — the pass here is
  heading case, one-idea-per-section, and not duplicating owned data, not
  forcing them into the spec-file header shape.
- `examples/*`'s two example specs get retrofitted too — they're what a new
  user copies from first.
- `.specloop/interview.md` is explicitly excluded — a session-specific
  ledger with its own table shape, not one of the canonical types.

## Acceptance criteria

- [ ] Every `requirements.md` under `planning/specs/` uses the canonical
      7-header set, in the fixed order, with no section silently dropped.
- [ ] Every markdown heading across every swept file uses sentence case.
- [ ] `node scripts/check-skill-consistency.mjs` passes after the sweep.
- [ ] A spot-check across a sample of retrofitted files (`git diff` per
      file, not a skim) confirms no meaning was lost or invented.
- [ ] `examples/hello-cli-spec/*` and `examples/marketing-content-spec/*`
      also conform.

## Out of scope

- Any change to what a skill actually does or writes going forward —
  that's `008`'s fix, already applied. This spec is a content-structure
  retrofit of existing files only.
- Dropping `design-closing`'s/the consistency script's legacy-header
  tolerance — leave that dead-code cleanup for a later pass once this one
  is confirmed complete, not bundled in here.
- Rewriting historical narrative content (what happened, why a decision was
  made) — only structure/headers change, never the substance of a Declined
  row, a history section, or similar.

## Dependencies

None structurally, but follows `planning/fix/008-markdown-convention-undocumented`
in practice — the convention has to exist before files can be retrofitted
to it.

## Owner split

(none stated)
