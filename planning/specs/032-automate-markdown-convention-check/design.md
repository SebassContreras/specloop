# 032 — automate-markdown-convention-check — Design

## Approach

A new sibling script, `scripts/check-markdown-conventions.mjs`, same plain
Node/ESM pattern as `scripts/check-skill-consistency.mjs` (`ok`/`group`
helpers, same pass/fail console format, `process.exit(failed === 0 ? 0 : 1)`)
— kept separate rather than added as a group inside the existing script,
since it checks a distinct concern (markdown structural/case conventions
repo-wide) from that script's actual scope (skills agreeing with each
other and with what's on disk).

The sentence-case heading scan enumerates its file set via `git ls-files --
'*.md'` (shelled out via `node:child_process`) rather than a hand-picked
list of directories/categories — every file git actually tracks, no more,
no less. This also sidesteps a real hazard found while designing this:
`framework/orchestrator/node_modules/` — leftover, untracked local build
output from before the deterministic CLI's retirement — holds hundreds of
vendored `README.md`/`CHANGELOG.md` files that a hand-rolled filesystem
walk would wrongly scan (and fail against). `git ls-files` never sees it,
so no exclude-list is needed for that or any other gitignored path.

The script has two independent check groups. The first: for every
`planning/specs/*/requirements.md`, read the file, find every `^## ` line,
and assert the resulting sequence is exactly the 7 canonical headers in
order (`What's being built`, `Who/what it serves`, `Hard constraints`,
`Acceptance criteria`, `Out of scope`, `Dependencies`, `Owner split`). A
file missing a header, or with them out of order, fails with the specific
header name(s) at fault.

That 7-header array is extracted into a new shared constant module,
`scripts/shared/canonical-headers.mjs`, imported by both this new script
and `scripts/check-skill-consistency.mjs` (edited to import it instead of
keeping its own inline array in group `[2]`) — so the two scripts can't
silently drift on what "canonical" means.

## Deliverables

- `scripts/check-markdown-conventions.mjs` (new).
- `scripts/shared/canonical-headers.mjs` (new) — the 7-header array, single
  source of truth for both scripts.
- `scripts/check-skill-consistency.mjs` (edited) — group `[2]` imports the
  header array from the new shared module instead of its own inline copy.
- `.github/PULL_REQUEST_TEMPLATE.md` (edited) — a new checklist line: run
  the new script whenever any `.md` file changed (broader than the existing
  `check-skill-consistency.mjs` line, which only fires on a `SKILL.md`
  change).

## Heading-case detection rule

`planning/styles.md`'s rule ("capitalize only the first word and proper
nouns") isn't mechanically checkable by a naive regex without heavy
false-positives across this repo's real headings (`GitHub`, `Pages`,
`Actions`, `Claude`, `Python`, `AGENTS.md`, ...). Per heading:

1. Strip inline code spans (backtick-delimited, e.g. `` `AGENTS.md` ``) —
   never evaluated for internal casing, treated as opaque tokens.
2. A fully-uppercase word (2+ letters — `ID`, `URL`, `CLI`, `CI`) is always
   allowed, as an acronym.
3. A small curated allowlist of proper nouns/product names, embedded as a
   constant in the script and seeded by scanning this repo's own
   already-compliant headings (post-`031`) — not invented ahead of time.
4. Any other word after the first that starts with a capital letter is a
   violation.

The allowlist is static, so a genuinely new proper noun not yet in it (e.g.
a heading introducing a product name never seen before in this repo) will
false-positive until someone adds it. Mitigated, not solved: the failure
message for this specific check names the flagged word and says it may be
a legitimate proper noun missing from the allowlist — pointing at the
script's allowlist constant to update — rather than stating flatly that
the heading is wrong.

## Sequencing

No ordering beyond `031` already being `done` (it defines the canonical
7-header set and already brought the repo into compliance). The two check
groups (canonical headers on `planning/specs/*/requirements.md`;
sentence-case headings across every git-tracked `.md`) are independent of
each other and can run in either order within the script.
