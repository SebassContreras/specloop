# 040 — pin-actions-by-sha — Requirements

Raised 2026-09-23: since `038`, a workflow pushes commits and tags to `main` with
`contents: write`. Every third-party action is referenced by a movable major tag
(`actions/checkout@v7`, ...), so a compromised tag would run with that token.

## What's being built

Every `uses:` of an external action in `.github/workflows/*.yml` pinned to a
full-length commit SHA, with the human-readable version kept as a trailing comment,
plus a way to keep those pins current.

## Who/what it serves

- The repo and its users: `auto-release.yml` writes to `main` and publishes the
  archive every install downloads (`036`/`038`).
- The maintainer — pins must not go stale silently.

## Hard constraints

- Full-length commit SHA only — the only immutable reference to an action
  _(standard: GitHub Docs, secure use reference — pin actions to a full-length
  commit SHA — https://docs.github.com/en/actions/reference/security/secure-use)_.
- Each pin carries its version as a comment (`# v7.0.1`) so a reader can see what it
  is.
- SHA pins lose Dependabot's vulnerability alerts for those actions; the update
  mechanism chosen must say how that gap is covered _(standard: GitHub Docs, secure
  use reference — Dependabot alerts only cover semver-referenced actions —
  https://docs.github.com/en/actions/reference/security/secure-use)_.
- Local reusable workflows (`uses: ./.github/workflows/...`) stay as they are.
- No behavior change: every workflow runs as before (`dashboard`, `auto-release`,
  `release-skills`).

## Acceptance criteria

- `grep -E 'uses: [^.]' .github/workflows/*.yml` shows only `@<40-hex>  # vX.Y.Z`
  references.
- Each pinned SHA matches its commented tag (checked against the action's repo).
- A mechanism keeps pins current (e.g. Dependabot version updates for the
  `github-actions` ecosystem), and is documented in `CONTRIBUTING.md`.
- `dashboard` and `auto-release` both succeed after the change (dispatch runs).

## Out of scope

- The repo/org policy that *requires* SHA pinning — optional, a Settings change.
- Signing or attesting the release archive (`038` out of scope, still is).

## Dependencies

`038` (auto-release — the write-capable workflow this protects), `034` (dashboard
workflow).

## Owner split

All `agent`, except enabling Dependabot or the SHA-pin policy in repo Settings if
that needs admin access (`human`).
