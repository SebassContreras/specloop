# 005 — open-source-release

## Requirements (draft — to be reviewed)

- Repo needs a root-level `LICENSE` file (MIT) so it's legally usable/forkable once
  made public — currently private with no license.
- Repo needs a root-level `README.md` — GitHub renders this on the repo home page,
  not `CLAUDE.md` (that stays the internal entry point loaded by Claude Code, not a
  human-facing landing page). Covers: what the plugin does, install, quickstart
  (`/specloop:start`, etc.), pointer to `planning/` for deeper architecture, license.
- No secrets/credentials in tracked history before going public (checked: none
  found in current tracked files).
- No Claude/AI attribution anywhere in the commit history or authored content —
  already the author's standing rule (global `CLAUDE.md`); re-verified here as a
  release gate, not re-litigated.
- `plugin.json` should carry `license` and `repository` fields consistent with the
  new `LICENSE`/GitHub URL, since a public plugin's manifest is what people actually
  check before installing.
- Visibility change (private → public on GitHub) is **explicitly out of scope for
  this pass** — author wants files prepped first, will flip visibility separately
  when ready.
- Root-level `CONTRIBUTING.md`: spec-driven workflow pointer (roadmap/specs
  convention) + local dev commands + a status line (personal project, shared as-is,
  no SLA) — reversed from this spec's original "out of scope" call now that the
  author asked for it directly.

## Out of scope

- Formal governance docs beyond `CONTRIBUTING.md` (code of conduct, issue/PR
  templates) — still not needed for a personal project with no active external
  contributors; revisit only if that changes.
- Marketplace listing / `.claude-plugin/marketplace.json` — not needed for a plugin
  installed via `--plugin-dir` or a direct repo checkout; revisit if/when distributing
  through a plugin marketplace becomes a goal.
