# 005 — open-source-release — Tasks

Status legend: `todo` · `in_progress` · `blocked` · `interrupted` · `done`
Owner: `agent` (loop-runnable) · `human` (skipped by the loop)

- [x] T001 [agent] [status:done] Secret/credential scan across tracked files
      └─ Clean — no matches for API keys, tokens, passwords, private keys.
- [x] T002 [agent] [status:done] Verify commit history has no Claude/AI attribution
      └─ Only commit (`Initial commit...`) already had its `Co-Authored-By: Claude` trailer amended out earlier this session.
- [x] T003 [agent] [status:done] Add root `LICENSE` (MIT)
- [x] T004 [agent] [status:done] Add root `README.md` (public-facing: what/install/quickstart/license, links to `planning/`)
- [x] T005 [agent] [status:done] Add `license`/`repository` fields to `.claude-plugin/plugin.json`
- [x] T006 [agent] [status:done] Re-run `claude plugin validate .` after the manifest edit
      └─ Passed with the same pre-existing warning (root `CLAUDE.md` not loaded as plugin context — expected).
- [x] T007 [human] [status:done] Flip GitHub repo visibility to public
      └─ Done 2026-09-03 via `gh repo edit --visibility public`. Sole collaborator (`SebassContreras`), no branch protection on `main` — irrelevant while no one else has write access.
- [x] T008 [agent] [status:done] Add root `CONTRIBUTING.md` (workflow pointer, local dev commands, status line)
      └─ Reversed from this spec's original out-of-scope call — added on direct request.
