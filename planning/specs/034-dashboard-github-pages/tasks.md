# 034 — dashboard-github-pages — Tasks

Status legend: `todo` · `in_progress` · `blocked` · `interrupted` · `done`
Owner: `agent` (loop-runnable) · `human` (skipped by the loop)

- [x] T001 [agent] [status:done] Write `.github/workflows/dashboard.yml`: triggered on `push` to `main`, path-filtered to `planning/**`; steps checkout the repo, run `python3 skills/status/scripts/build_dashboard.py`, stage `planning/dashboard.html` as `index.html` in a build directory, `actions/upload-pages-artifact` on that directory, then `actions/deploy-pages`; set `permissions: {contents: read, pages: write, id-token: write}` and a `concurrency` group to serialize deploys
      └─ verified against disk: build+deploy job split matches design exactly
- [x] T002 [agent] [status:done] Add the public GitHub Pages dashboard URL as a link in `README.md`
      └─ verified against disk: link added next to existing dashboard mention, nothing else touched
- [x] T003 [human] [status:done] Enable GitHub Pages in this repo's Settings, source = "GitHub Actions" (requires admin access)
- [x] T004 [agent] [status:done] Verify AC1/AC2: once T003 is done, push a real change touching `planning/roadmap.md` or a spec's `tasks.md`, confirm the workflow run succeeds in Actions and the published Pages URL reflects that change
      └─ run 35207654551: build 6s, deploy 4m8s, both green; sebasscontreras.github.io/specloop/ live, confirmed rendering the real dashboard
- [x] T005 [agent] [status:done] Verify AC3: run `build_dashboard.py` locally against a deliberately broken `planning/roadmap.md` fixture, confirm it exits nonzero; inspect `dashboard.yml` to confirm no `continue-on-error` and the build step precedes the deploy steps
      └─ exit code 1 confirmed, no continue-on-error, build precedes deploy, deploy needs:build
