# Roadmap

Index of all specs: order, status, dependencies.

| ID  | Plan                      | Status      | Depends on      |
|-----|---------------------------|-------------|-----------------|
| 001 | scaffold-and-spec-skill   | in_progress | —               |
| 002 | loop-orchestrator         | in_progress | 001, 003        |
| 003 | task-breakdown-skill      | in_progress | 001, 004        |
| 004 | design-closing-skill      | in_progress | 001             |
| 005 | open-source-release       | in_progress | 001             |
| 006 | e2e-smoke-testing         | todo        | 001, 002, 003, 004 |
| 007 | orchestrator-unit-tests   | todo        | 002             |
| 008 | ci-pipeline               | todo        | 007             |
| 009 | status-dashboard-skill    | todo        | 001             |
| 010 | loop-auto-continue        | todo        | 002             |
| 011 | windows-path-safety       | todo        | 002             |
| 012 | spec-amend-skill          | todo        | 001, 003, 004   |
| 013 | task-retry-backoff        | todo        | 002             |

Possible statuses: `todo` · `in_progress` · `blocked` · `interrupted` · `done`.

Specs `006`–`013` are ordered by priority (`006` highest, `013` lowest) — see each
spec's `requirements.md` for the rationale. Ordering, not a separate column, per this
table's fixed contract (`docs/architecture.md`).
