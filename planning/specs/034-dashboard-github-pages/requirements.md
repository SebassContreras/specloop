# 034 — dashboard-github-pages

Raised 2026-09-16, after closing `028-clickable-roadmap-ids` (declined — see
`planning/architecture.md`'s Declined table) once it became clear the actual
need was a live-viewable dashboard, not a clickable roadmap. GitHub Pages is
free for public repos (this repo has been public since `005`).

## What's being built

Publishing `planning/dashboard.html` as a real, navigable page on GitHub
Pages — this repo only. No change to `skills/status`, `skills/loop`, or any
other plugin mechanism; not a capability other repos using the plugin gain
automatically.

## Who/what it serves

Anyone visiting the public `specloop` repo on GitHub who wants to see the
real roadmap state without cloning the repo or opening a local HTML file —
visitors and prospective contributors, the same audience `019-public-showcase`
targets for the README.

## Hard constraints

- Publishing runs via a GitHub Actions workflow (this repo's own
  `.github/workflows/`, not a plugin-shipped mechanism — same category as
  `README.md`/`CONTRIBUTING.md`, a project deliverable this repo's own
  roadmap decides, per `planning/architecture.md`'s Declined table entry on
  scaffolding CI into target repos) — no manual copy-to-`/docs` step.
- The workflow must call `030`'s `skills/status/scripts/build_dashboard.py`
  directly to regenerate `dashboard.html` fresh on every run, not duplicate
  the dashboard-generation logic in the workflow YAML or check in a
  possibly-stale committed copy. This is *why* this spec depends on `030` —
  a CI runner can't invoke an interactive Skill, only a deterministic
  script; `030` is what makes headless regeneration possible at all.
- No change to any plugin skill (`skills/status`, `skills/loop`, etc.) or to
  what gets scaffolded into a *target* repo — this is specloop's-own-repo
  infrastructure only.

## Acceptance criteria

- [ ] The repo's GitHub Pages URL shows the real, current dashboard.
- [ ] A push to `main` that changes `planning/roadmap.md` or any spec's
      `tasks.md` triggers the workflow, and the published site reflects the
      change with no manual step.
- [ ] The workflow fails loudly (clear error, no publish) if
      `build_dashboard.py` fails, rather than silently leaving the old
      version live.
- [ ] `README.md` links to the public dashboard URL.

## Out of scope

- Enabling this capability for target repos using the plugin — declined
  during design discussion; this is specloop's-own-repo infrastructure only,
  same boundary as `README.md`/`CONTRIBUTING.md`.
- A custom domain (`CNAME`) for the Pages URL — the default `github.io` URL,
  unless stated otherwise later.
- Any of `019-public-showcase`'s own scope (screenshots, architecture
  diagram, demo GIF, banner/logo) — `034` only adds the one dashboard-URL
  link to `README.md` called out in its own acceptance criteria, nothing
  else `019` owns.

## Dependencies

`009` (status-dashboard-skill), `026` (dashboard-visual-enhancements),
`030` (dashboard-build-script) — the workflow calls `030`'s
`build_dashboard.py` directly, so this spec can't close before `030` ships.

## Owner split

Enabling GitHub Pages in the repo's own Settings (requires admin access) is
`[human]` — an agent writes the workflow and everything else; the user flips
the actual Pages switch.
