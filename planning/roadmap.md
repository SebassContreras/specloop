# Roadmap

Index of every spec — status, dependencies, pipeline stage, and priority. Read this
table first; nothing else in this repo should be needed to get oriented on "where are
we, what's next."

| ID  | Plan                      | Status      | Depends on         | Stage        | Priority |
| --- | ------------------------- | ----------- | ------------------ | ------------ | -------- |
| 001 | scaffold-and-spec-skill   | done        | —                  | —            | 1        |
| 002 | loop-orchestrator         | done        | 001, 003           | —            | —        |
| 003 | task-breakdown-skill      | done        | 001, 004           | —            | —        |
| 004 | design-closing-skill      | done        | 001                | —            | —        |
| 005 | open-source-release       | done        | 001                | —            | —        |
| 006 | e2e-smoke-testing         | done        | 001, 002, 003, 004 | —            | 7        |
| 009 | status-dashboard-skill    | done        | 001                | —            | 10       |
| 012 | spec-amend-skill          | todo        | 001, 003, 004      | requirements | 13       |
| 014 | worker-context-injection  | done        | 002                | —            | 2        |
| 015 | roadmap-status-writer     | done        | 002                | —            | 3        |
| 016 | interview-engine          | done        | 001                | —            | 4        |
| 017 | project-type-genericity   | done        | 001, 016           | —            | 5        |
| 018 | project-style-preferences | done        | 014, 016           | —            | 6        |
| 019 | public-showcase           | done        | 001, 005           | —            | —        |
| 020 | checklist-task-format     | done        | 002, 003           | —            | 15       |
| 022 | cross-agent-skill-compat  | done        | 001                | —            | 17       |
| 023 | fix-log                   | done        | —                  | —            | 18       |
| 024 | loop-skill-verification   | done        | 002                | —            | 8        |
| 025 | master-handoff            | todo        | 002                | requirements | —        |
| 026 | dashboard-visual-enhancements | todo    | 009                | looping | 11            |
| 027 | fix-log-skill-and-status  | done        | 023, 009           | —            | 19       |

`007` (orchestrator-unit-tests), `008` (ci-pipeline), `010` (loop-auto-continue),
`011` (windows-path-safety), `013` (task-retry-backoff) and `021`
(harness-worker-backend) were retired 2026-09-12, never past `requirements.md`: all
six existed only for the deterministic `loop run` CLI (`framework/orchestrator/`),
which was eliminated the same day in favor of `skills/loop` — the interactive
session — as the only way to run the loop. See `planning/handoff.md` and
`planning/architecture.md`'s Declined table.

`Status`: `todo` · `in_progress` · `blocked` · `interrupted` · `done`. Written only by
`skills/loop` (rolled up from each spec's own `tasks.md` — see its Phase 2) — never
hand-edit it. `specloop:status` (`009`) gives back the standalone read-only check
`loop status` used to be, plus a `Stage`/`Status` drift check nothing had before.

`Stage`: `requirements` · `design_closed` · `tasks_ready` · `looping` — which skill a
spec needs next, so nobody has to open its files to find out. `—` once `done`, or for
a spec never tracked through the pipeline (`001`–`005`, foundational, predate this
column). Unlike `Status`, no single writer: each pipeline skill sets it once, at its
own transition (`specloop:start` → `requirements`, `specloop:design-closing` →
`design_closed`, `specloop:task-breakdown` → `tasks_ready`, `specloop:loop`/`loop-setup`
→ `looping`).

`Priority`: a live, human-edited ordering number — lower runs first among specs
`Depends on` doesn't already force an order. Edit the number directly to reorder; no
separate list to keep in sync. `—` means the spec predates this convention (`001`–`005`)
or was deliberately left unranked as order-independent of everything else (`019`).
`skills/loop` breaks ties on it when more than one spec is eligible.
