# 034 — dashboard-github-pages — Design

## Approach

A GitHub Actions workflow (`.github/workflows/dashboard.yml`) triggered on
push to `main`, path-filtered to `planning/**` — broader than the two
examples in the acceptance criteria (`planning/roadmap.md`, any spec's
`tasks.md`), since the build script also reads every spec's `design.md`
(stub-detection for drift) and `planning/fix/*.md` (the fix log) — both feed
the dashboard's own output, so a push touching only those should still
redeploy. It runs `python3 skills/status/scripts/build_dashboard.py` (`030`)
from the repo root to regenerate `planning/dashboard.html` fresh, then
publishes it to GitHub Pages via the official Pages-from-Actions flow
(`actions/upload-pages-artifact` + `actions/deploy-pages`) — no `gh-pages`
branch, no manual copy step.

The build-script step runs before the artifact-upload/deploy steps, in the
same job, with no `continue-on-error`: a nonzero exit from
`build_dashboard.py` (it already exits `1` on any real failure — see
`030`) fails the job outright and GitHub Actions' default behavior skips
every later step, so `deploy-pages` never runs and the previously-published
site stays live untouched. No extra error-handling needed beyond correct
step ordering — this satisfies the acceptance criteria's "fails loudly, no
publish" requirement using the workflow's own default semantics.

## Deliverables

- `.github/workflows/dashboard.yml` (new) — checks out the repo, runs `030`'s
  script, stages `planning/dashboard.html` as `index.html` in the uploaded
  Pages artifact (a naming step Pages itself requires for a bare-URL root
  page — the committed `planning/dashboard.html` itself is untouched, still
  published byte-for-byte as generated), then deploys it.
- `README.md` (edited) — adds the public dashboard URL.

## Sequencing

No ordering beyond what `roadmap.md` already records (`009`, `026`, `030`, all
`done`). The workflow itself can be written and merged independently of the
`[human]` Settings step (`requirements.md`'s Owner split) — it just won't
deploy successfully (the `deploy-pages` step fails) until Pages is enabled
in Settings with source set to "GitHub Actions." No need to sequence the
human step first; a failed first run once merged is expected and fine.
