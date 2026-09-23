# 038 — auto-release-on-skill-change — Requirements

Raised 2026-09-23: `planning/fix/018` landed on `main`, but release installs
(`install.sh`/`install.ps1` → `releases/latest`) kept serving `v0.1.0`, and
marketplace installs saw no new `version`. Every skill change must ship without a
manual tag.

## What's being built

A GitHub Actions workflow that, on every push to `main` touching `skills/**`, bumps
the plugin version, commits it, tags it, and publishes the `036` release archive for
that tag. No manual version bump or tag.

## Who/what it serves

- Users installing through the release (`install.sh`/`install.ps1`, `--version latest`)
  — they get the current skills.
- Users installing through the Claude Code/Copilot marketplace — the manifest
  `version` changes, so an update is visible.
- The maintainer — no release chore after a skill edit.

## Hard constraints

- `version` stays identical in `.claude-plugin/plugin.json` and the
  `.claude-plugin/marketplace.json` entry (`CONTRIBUTING.md`); the workflow fails
  loud if they disagree instead of picking one.
- Bump level from Conventional Commits (`AGENTS.md` style), over the commits since
  the last tag that touched `skills/`: breaking (`type!:` / `BREAKING CHANGE`) →
  major, `feat` → minor, anything else → patch. Below `1.0.0` breaking → minor
  _(standard: Semantic Versioning 2.0.0 §4, major version zero —
  https://semver.org/#spec-item-4; Conventional Commits 1.0.0 —
  https://www.conventionalcommits.org/en/v1.0.0/)_.
- Reuse `036`'s `release-skills.yml` for the archive — one build path, not two. A tag
  pushed with `GITHUB_TOKEN` doesn't trigger other workflows, so it's called as a
  reusable workflow _(standard: GitHub Docs, triggering a workflow from a workflow —
  https://docs.github.com/en/actions/using-workflows/triggering-a-workflow#triggering-a-workflow-from-a-workflow)_.
- No loop: the bump commit touches only `.claude-plugin/*.json`, outside the
  `skills/**` path filter.
- Runs serialized (one release at a time); the bump commit and tag are pushed
  atomically, so a race fails loud rather than half-releasing.
- Repo-only tooling, never scaffolded to a target repo (same boundary as `030`/`032`).

## Acceptance criteria

- A push to `main` touching `skills/` produces a `chore(release): vX.Y.Z` commit, tag
  `vX.Y.Z`, and a GitHub Release with `specloop-skills.tar.gz` + `.sha256`.
- Both manifests carry `X.Y.Z` after the run.
- A push not touching `skills/` produces no release.
- `scripts/next-version.mjs` returns patch/minor/major per the rules above.
- A manual `workflow_dispatch` can force a bump level.

## Out of scope

- Rewriting `CHANGELOG.md` per release — it stays one entry per finished spec; each
  release's notes are GitHub's generated notes.
- Signing or provenance attestations for the archive.

## Dependencies

`036` (release workflow, installers, marketplace manifests).

## Owner split

All `agent`.
