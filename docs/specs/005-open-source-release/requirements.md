# 005 — open-source-release

## Requirements (draft — to be reviewed)

- Repo needs a root-level `LICENSE` file (MIT) so it's legally usable/forkable once
  made public — currently private with no license.
- Repo needs a root-level `README.md` — GitHub renders this on the repo home page,
  not `CLAUDE.md` (that stays the internal entry point loaded by Claude Code, not a
  human-facing landing page). Covers: what the plugin does, install, quickstart
  (`/specloop:start`, etc.), pointer to `docs/` for deeper architecture, license.
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

## Out of scope

- `CONTRIBUTING.md` / formal governance docs — this stays a personal project shared
  as-is; no PR/issue SLA implied. Revisit only if external contributions actually
  start showing up.
- Marketplace listing / `.claude-plugin/marketplace.json` — not needed for a plugin
  installed via `--plugin-dir` or a direct repo checkout; revisit if/when distributing
  through a plugin marketplace becomes a goal.
