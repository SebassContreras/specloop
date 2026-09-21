# Roadmap

Index of every spec — status, dependencies, pipeline stage, and priority. Read this
table first; nothing else in this repo should be needed to get oriented on "where are
we, what's next."

| ID  | Plan                          | Status      | Depends on         | Stage        | Priority |
| --- | ----------------------------- | ----------- | ------------------ | ------------ | -------- |
| 001 | scaffold-and-spec-skill       | done        | —                  | —            | 1        |
| 002 | loop-orchestrator             | done        | 001, 003           | —            | —        |
| 003 | task-breakdown-skill          | done        | 001, 004           | —            | —        |
| 004 | design-closing-skill          | done        | 001                | —            | —        |
| 005 | open-source-release           | done        | 001                | —            | —        |
| 006 | e2e-smoke-testing             | done        | 001, 002, 003, 004 | —            | 7        |
| 009 | status-dashboard-skill        | done        | 001                | —            | 10       |
| 012 | spec-amend-skill              | done        | 001, 003, 004      | —            | 13       |
| 014 | worker-context-injection      | done        | 002                | —            | 2        |
| 015 | roadmap-status-writer         | done        | 002                | —            | 3        |
| 016 | interview-engine              | done        | 001                | —            | 4        |
| 017 | project-type-genericity       | done        | 001, 016           | —            | 5        |
| 018 | project-style-preferences     | done        | 014, 016           | —            | 6        |
| 019 | public-showcase               | in_progress | 001, 005           | —            | —        |
| 020 | checklist-task-format         | done        | 002, 003           | —            | 15       |
| 022 | cross-agent-skill-compat      | done        | 001                | —            | 17       |
| 023 | fix-log                       | done        | —                  | —            | 18       |
| 024 | loop-skill-verification       | done        | 002                | —            | 8        |
| 026 | dashboard-visual-enhancements | done        | 009                | —            | 11       |
| 027 | fix-log-skill-and-status      | done        | 023, 009           | —            | 19       |
| 030 | dashboard-build-script        | done        | 009, 026           | —            | 16       |
| 031 | markdown-convention-retrofit  | done        | —                  | —            | 20       |
| 032 | automate-markdown-convention-check | done   | 031                | —            | —        |
| 033 | interview-to-loop-auto-continuation | done | 001, 002, 003, 004 | —            | —        |
| 034 | dashboard-github-pages        | done        | 009, 026, 030      | —            | —        |
| 035 | wshobson-agents-research      | done        | 001, 022           | —            | 21       |
| 036 | lean-distribution             | done        | 035, 001, 005      | —            | 22       |

`Status`: `todo` · `in_progress` · `blocked` · `done` (a stopped spec stays `in_progress`;
`interrupted` is a task state only). Written only by
`skills/loop` once a row exists (rolled up from each spec's own `tasks.md` — see its
Phase 2; `specloop:start` creates the row) — never
hand-edit it. `specloop:status` (`009`) gives back the standalone read-only check
`loop status` used to be, plus a `Stage`/`Status` drift check nothing had before.

`Stage`: `requirements` · `design_closed` · `tasks_ready` · `looping` — which skill a
spec needs next, so nobody has to open its files to find out. `—` once `done`, or for
a spec never tracked through the pipeline (`001`–`005`, foundational, predate this
column). Unlike `Status`, no single writer: each pipeline skill sets it at its own
transition (`specloop:start` → `requirements`, `specloop:design-closing` →
`design_closed`, `specloop:task-breakdown` → `tasks_ready` — `specloop:advance` writes
those two when it chains them, `specloop:amend` → `requirements` again when it reopens a
`design.md` — `specloop:loop` → `looping`; `loop-setup` only writes
`.specloop/loop.config.json`, never this column).

`Priority`: a live, human-edited ordering number — lower runs first among specs
`Depends on` doesn't already force an order. Edit the number directly to reorder; no
separate list to keep in sync. `—` means no priority was ever assigned: the spec is
foundational and predates this convention (`002`–`005` — `001` itself got `1`), was
deliberately left unranked as order-independent of everything else (`019`), or was
filed and closed the same day without ever entering an ordered backlog (`032`, `033`,
`034`). `skills/loop` breaks ties on it when more than one spec is eligible.
