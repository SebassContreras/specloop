# 029 — spec-worktree-isolation — Design

## Approach

No new mechanism, no code change. Closed by finding — during design-closing,
2026-09-17 — that the isolation this spec proposed isn't needed in practice:

- `skills/loop`'s Phase 2 already only batches tasks that share **no**
  file/section overlap — genuinely independent tasks (different files)
  already run as concurrent sub-agents today, in the one shared working
  tree, with no git-level collision possible: two agents never write the
  same file at the same time, so there's nothing for a worktree to isolate
  them from.
- Confirmed against a real project run (the user's own, outside this repo):
  three agents, each on its own task, ran concurrently without issue —
  exactly the case the existing file-overlap batching rule already covers.
- Worktree isolation would only have added value for the narrower case this
  spec's own "Who/what it serves" section named: two tasks that *do* touch
  the same file but could in theory still be parallelized if each had an
  isolated copy to merge back later. This spec's own hard constraints
  already flagged that this case is rarer than it looks (`026`'s own run:
  "most of a typical spec's tasks already share one or two files") and the
  real-world observation above reinforces that the common case — genuinely
  independent tasks — is already handled without it.
- The blocking hard constraint (how `planning/roadmap.md` writes reconcile
  across worktrees merging back independently) was never actually designed
  as a result — moot, since nothing is being built.

## Deliverables

None. No file changes.
