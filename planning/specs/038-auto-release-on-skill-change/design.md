# 038 — auto-release-on-skill-change — Design

## Approach

New `.github/workflows/auto-release.yml`, triggered by `push` to `main` with
`paths: skills/**`, plus `workflow_dispatch` with a `bump` choice (`auto`/`patch`/
`minor`/`major`). `concurrency: auto-release` serializes runs.

Job `version`: checks out `main` with full history. It fails if the two manifests'
versions differ. It collects every commit message since the last `v*` tag that
touched `skills/` (NUL-separated) and pipes them to `scripts/next-version.mjs
<current> <bump>`, which prints the next version. With `auto` and no such commit it
exits without releasing. If the tag already exists it fails. Otherwise it writes the
version into both manifests with `jq`, commits `chore(release): vX.Y.Z` as
`github-actions[bot]`, tags `vX.Y.Z`, and runs `git push --atomic origin HEAD:main
vX.Y.Z`.

Job `release`: `uses: ./.github/workflows/release-skills.yml` with `tag`.
`release-skills.yml` gains a `workflow_call` trigger with a `tag` input, checks out
that ref, and uses `TAG=${{ inputs.tag || github.ref_name }}` where it used
`GITHUB_REF_NAME`. Its own `push: tags: v*` trigger stays for a manual tag.

## Deliverables

- New: `.github/workflows/auto-release.yml`, `scripts/next-version.mjs`.
- Modified: `.github/workflows/release-skills.yml` (reusable), `CONTRIBUTING.md`
  (don't bump by hand; pull after a skills push), `CHANGELOG.md` preamble (versions
  are tagged automatically; this file stays per-spec).

## Sequencing

1. `next-version.mjs`, verified locally.
2. Make `release-skills.yml` reusable before `auto-release.yml` calls it.
3. Docs, then push. The push itself doesn't touch `skills/`, so the first release
   comes from a manual `workflow_dispatch` (`auto` → `v0.2.0`, from `feat(advance)`
   since `v0.1.0`).
