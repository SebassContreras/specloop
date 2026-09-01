# 005 — open-source-release — Tasks

Status legend: `todo` · `in_progress` · `blocked` · `interrupted` · `done`

| ID | Task | Status | Notes |
|----|------|--------|-------|
| T1 | Secret/credential scan across tracked files | done | Clean — no matches for API keys, tokens, passwords, private keys. |
| T2 | Verify commit history has no Claude/AI attribution | done | Only commit (`Initial commit...`) already had its `Co-Authored-By: Claude` trailer amended out earlier this session. |
| T3 | Add root `LICENSE` (MIT) | done | |
| T4 | Add root `README.md` (public-facing: what/install/quickstart/license, links to `docs/`) | done | |
| T5 | Add `license`/`repository` fields to `.claude-plugin/plugin.json` | done | |
| T6 | Re-run `claude plugin validate .` after the manifest edit | done | Passed with the same pre-existing warning (root `CLAUDE.md` not loaded as plugin context — expected). |
| T7 | Flip GitHub repo visibility to public | todo | Deliberately left for the author to do when ready — out of scope for this pass. |
| T8 | Add root `CONTRIBUTING.md` (workflow pointer, local dev commands, status line) | done | Reversed from this spec's original out-of-scope call — added on direct request. |
