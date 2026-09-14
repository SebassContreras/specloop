# 005 — open-source-release

## What's being built

- Repo needs a root-level `LICENSE` file (MIT) so it's legally usable/forkable once
  made public — currently private with no license.
- Repo needs a root-level `README.md` — GitHub renders this on the repo home page,
  not `CLAUDE.md` (that stays the internal entry point loaded by Claude Code, not a
  human-facing landing page). Covers: what the plugin does, install, quickstart
  (`/specloop:start`, etc.), pointer to `planning/` for deeper architecture, license.
- `plugin.json` should carry `license` and `repository` fields consistent with the
  new `LICENSE`/GitHub URL, since a public plugin's manifest is what people actually
  check before installing.
- Root-level `CONTRIBUTING.md`: spec-driven workflow pointer (roadmap/specs
  convention) + local dev commands + a status line (personal project, shared as-is,
  no SLA) — reversed from this spec's original "out of scope" call now that the
  author asked for it directly.

## Who/what it serves

Anyone who'd install or read the plugin once it's public (evaluating it via the
README, installing it, or forking it under the LICENSE), and the repo owner
preparing it for that public release.

## Hard constraints

- No secrets/credentials in tracked history before going public (checked: none
  found in current tracked files).
- No Claude/AI attribution anywhere in the commit history or authored content —
  already the author's standing rule (global `CLAUDE.md`); re-verified here as a
  release gate, not re-litigated.

## Acceptance criteria

- `LICENSE` exists at the repo root and is MIT.
- `README.md` exists at the repo root and covers: what the plugin does, install,
  quickstart, a pointer to `planning/`, and the license.
- `CONTRIBUTING.md` exists at the repo root and covers: the spec-driven workflow
  pointer, local dev commands, and a status line (personal project, shared as-is,
  no SLA).
- `plugin.json`'s `license` and `repository` fields are set and consistent with
  `LICENSE`/the GitHub URL.
- No secrets/credentials and no Claude/AI attribution anywhere in tracked history.

## Out of scope

- Formal governance docs beyond `CONTRIBUTING.md` (code of conduct, issue/PR
  templates) — still not needed for a personal project with no active external
  contributors; revisit only if that changes.
- Marketplace listing / `.claude-plugin/marketplace.json` — not needed for a plugin
  installed via `--plugin-dir` or a direct repo checkout; revisit if/when distributing
  through a plugin marketplace becomes a goal.

## Dependencies

`001` (per `planning/roadmap.md`'s `005` row).

## Owner split

Visibility change (private → public on GitHub) is **explicitly out of scope for
this pass** and is the author's own call, not agent work — author wants files
prepped first, will flip visibility separately when ready.
