# 013 — pages-source-defaulted-to-legacy-branch

## Scope

034

## Found

Enabling GitHub Pages in repo Settings (034's T003, done manually by the
user) defaulted the source to "Deploy from a branch" (`main` → `/docs`)
instead of "GitHub Actions" — the GitHub UI's own default when nothing
else is picked, not something 034's task text called out explicitly. This
didn't break the actual published site: `actions/deploy-pages@v4` still
published successfully via the `dashboard.yml` workflow's own Actions-based
deployment (confirmed live). But GitHub separately auto-injects a legacy
Jekyll build (`pages-build-deployment`, not a workflow file in this repo)
whenever the branch-based source is set, and that build failed on every
push since Pages was first enabled — this repo has no `docs/` folder —
showing as a real, if harmless, red X in the Actions tab on every push.

## Status

resolved

## Fix

`gh api -X PUT repos/SebassContreras/specloop/pages -f "build_type=workflow"`
— switched the Pages source to "GitHub Actions" directly via the API.
Confirmed via a follow-up `GET` that `build_type` is now `"workflow"`. The
legacy Jekyll build no longer fires on push.

## Date

2026-09-17
