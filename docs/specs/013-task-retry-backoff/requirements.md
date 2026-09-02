# 013 — task-retry-backoff

## Priority: 8 (lowest)

## Requirements (draft — to be reviewed)

- Today a failed task (`worker.ts` reporting a non-zero exit) goes straight to
  `blocked` with no retry — no distinction between a transient failure (rate limit,
  network blip, timeout) and a real bug that needs human attention.
- Add a bounded retry (small fixed count, e.g. 1–2 attempts with a short backoff)
  before marking a task `blocked`, so a transient hiccup doesn't stop the backlog.
- Log retry attempts distinctly from a first-attempt failure, so the log/notes
  column still makes it obvious a task struggled even if it eventually succeeded.
- Exhausting retries still lands on `blocked` — this must not paper over real
  failures, only avoid treating every transient error as a stop condition.

## Out of scope

- Configurable retry counts/backoff curves per repo — start with one fixed,
  reasonable default in `.specloop/loop.config.json`'s shape; revisit if it proves
  too rigid in practice.
