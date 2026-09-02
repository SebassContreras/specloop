# 005 — open-source-release — Tasks

Status legend: `todo` · `in_progress` · `blocked` · `interrupted` · `done`
Owner: `agent` (loop-runnable) · `human` (skipped by the loop)

| ID | Task | Owner | Status | Notes |
|----|------|-------|--------|-------|
| T1 | Secret/credential scan across tracked files | agent | done | Clean — no matches for API keys, tokens, passwords, private keys. |
| T2 | Verify commit history has no Claude/AI attribution | agent | done | Only commit (`Initial commit...`) already had its `Co-Authored-By: Claude` trailer amended out earlier this session. |
| T3 | Add root `LICENSE` (MIT) | agent | done |  |
| T4 | Add root `README.md` (public-facing: what/install/quickstart/license, links to `docs/`) | agent | done |  |
| T5 | Add `license`/`repository` fields to `.claude-plugin/plugin.json` | agent | done |  |
| T6 | Re-run `claude plugin validate .` after the manifest edit | agent | done | Passed with the same pre-existing warning (root `CLAUDE.md` not loaded as plugin context — expected). |
| T7 | Flip GitHub repo visibility to public | human | todo | Deliberately left for the author to do when ready — out of scope for this pass. |
| T8 | Add root `CONTRIBUTING.md` (workflow pointer, local dev commands, status line) | agent | done | Reversed from this spec's original out-of-scope call — added on direct request. |
