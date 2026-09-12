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
| 007 | orchestrator-unit-tests   | todo        | 002                | requirements | 8        |
| 008 | ci-pipeline               | todo        | 007                | requirements | 9        |
| 009 | status-dashboard-skill    | todo        | 001                | requirements | 10       |
| 010 | loop-auto-continue        | todo        | 002                | requirements | 11       |
| 011 | windows-path-safety       | todo        | 002                | requirements | 12       |
| 012 | spec-amend-skill          | todo        | 001, 003, 004      | requirements | 13       |
| 013 | task-retry-backoff        | todo        | 002                | requirements | 14       |
| 014 | worker-context-injection  | in_progress | 002                | looping      | 2        |
| 015 | roadmap-status-writer     | in_progress | 002                | looping      | 3        |
| 016 | interview-engine          | done        | 001                | —            | 4        |
| 017 | project-type-genericity   | done        | 001, 016           | —            | 5        |
| 018 | project-style-preferences | todo        | 014, 016           | requirements | 6        |
| 019 | public-showcase           | in_progress | 001, 005           | looping      | —        |
| 020 | checklist-task-format     | done        | 002, 003           | —            | 15       |
| 021 | harness-worker-backend    | todo        | 002, 014           | requirements | 16       |
| 022 | cross-agent-skill-compat  | done        | 001                | —            | 17       |
| 023 | fix-log                   | done        | —                  | —            | 18       |

`Status`: `todo` · `in_progress` · `blocked` · `interrupted` · `done`. Written only by
the orchestrator (rolled up from each spec's own `tasks.md`) — never hand-edit it,
`loop status` will flag any disagreement.

`Stage`: `requirements` · `design_closed` · `tasks_ready` · `looping` — which skill a
spec needs next, so nobody has to open its files to find out. `—` once `done`, or for
a spec never tracked through the pipeline (`001`–`005`, foundational, predate this
column). Unlike `Status`, no single writer: each pipeline skill sets it once, at its
own transition (`specloop:start` → `requirements`, `specloop:design-closing` →
`design_closed`, `specloop:task-breakdown` → `tasks_ready`, `specloop:loop`/`loop-setup`
→ `looping`). The deterministic `loop run` CLI path doesn't write it yet — `015` T020
tracks that.

`Priority`: a live, human-edited ordering number — lower runs first among specs
`Depends on` doesn't already force an order. Edit the number directly to reorder; no
separate list to keep in sync. `—` means the spec predates this convention (`001`–`005`)
or was deliberately left unranked as order-independent of everything else (`019`).
`skills/loop` breaks ties on it when more than one spec is eligible; the deterministic
`loop run` CLI doesn't consult it yet — `015` T019 tracks that.
