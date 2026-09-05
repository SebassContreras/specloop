# Roadmap

Index of all specs: order, status, dependencies.

| ID  | Plan                      | Status      | Depends on         |
|-----|---------------------------|-------------|--------------------|
| 001 | scaffold-and-spec-skill   | in_progress | —                  |
| 002 | loop-orchestrator         | interrupted | 001, 003           |
| 003 | task-breakdown-skill      | interrupted | 001, 004           |
| 004 | design-closing-skill      | interrupted | 001                |
| 005 | open-source-release       | done        | 001                |
| 006 | e2e-smoke-testing         | blocked     | 001, 002, 003, 004 |
| 007 | orchestrator-unit-tests   | todo        | 002                |
| 008 | ci-pipeline               | todo        | 007                |
| 009 | status-dashboard-skill    | todo        | 001                |
| 010 | loop-auto-continue        | todo        | 002                |
| 011 | windows-path-safety       | todo        | 002                |
| 012 | spec-amend-skill          | todo        | 001, 003, 004      |
| 013 | task-retry-backoff        | todo        | 002                |
| 014 | worker-context-injection  | in_progress | 002                |
| 015 | roadmap-status-writer     | in_progress | 002                |
| 016 | interview-engine          | todo        | 001                |
| 017 | project-type-genericity   | todo        | 001, 016           |
| 018 | project-style-preferences | todo        | 014, 016           |
| 019 | public-showcase           | todo        | 001, 005           |
| 020 | checklist-task-format     | done        | 002, 003           |
| 021 | harness-worker-backend    | todo        | 002, 014           |
| 022 | cross-agent-skill-compat  | todo        | 001                |
| 023 | fix-log                   | done        | —                  |

Possible statuses: `todo` · `in_progress` · `blocked` · `interrupted` · `done`.

`002`/`003`/`004` are `interrupted` rather than `done`: every task is complete except a
live-interactive local test that cannot be scripted (`002` T11, `003` T7, `004` T7).
Those runs are what `006` exists to perform. `006` is `blocked` for the same reason —
it cannot start until those interactive sessions happen.

## Build order

Row order is by ID, not priority — the `Status` column has no writer and the row parser
is exact-arity, so a `Priority` column would silently break every row today (`015`
fixes both, and adds the column). Until then, the real sequence is:

1. **`001`** — undo the 2026-09-02 scope revert: restore the technologies/architecture/
   tools Q&A and the skill-recommendation step, scaffold `AGENTS.md` + `CLAUDE.md`, and
   write the `.specloop/` loop folder's static files. This is the drift fix; everything
   else assumes it.
2. **`014`** — worker context injection. Until a worker's prompt names its spec and
   context files, nothing recorded by `001` or `018` reaches the agent that needs it,
   and non-Claude workers get no context at all. Blocks `018` from being anything but
   decoration.
3. **`015`** — roadmap status writer + extensible row parser. Without a `Status` writer
   the loop pins itself to a spec that can never complete; this repo's own roadmap sat
   in that state.
4. **`016`** — interview engine: the coverage ledger, question bank, follow-up triggers
   and closing sweep that make the interview exhaustive by contract rather than by
   script.
5. **`017`** — project-type genericity: the classifier and the type-keyed branching that
   let a marketing/content/ops project use the pipeline past the requirements stage.
6. **`018`** — styles and preferences.
7. `006`–`013` as previously prioritised (`006` highest), once their prerequisites clear.
8. **`019`** — public showcase (screenshots, diagram, demo, docs). Pure presentation,
   no functional dependency on anything above — doesn't block or get blocked by the
   rest of the build order. Went public (`005` T7) before this exists; this fills the
   repo in afterward rather than gating the release on it.
9. **`020`** — `tasks.md` becomes a checkbox list (industry-familiar, spec-kit-style
   IDs) instead of a pipe table, keeping the owner/status tags a table gave for free.
   Slotted here rather than earlier because every existing spec's `tasks.md` had to
   migrate in the same pass — doing it before `019`'s content settled would have meant
   migrating twice.
10. **`021`** — a Claude-Agent-SDK-backed worker kind, additive alongside today's
    CLI-spawning workers (`codex`/`opencode` keep using a CLI; only Claude gains an
    in-process option). Not designed yet — depends on `014` for the context-injection
    contract it must also honor, and on a permission-mode decision `loop-setup`'s Q&A
    doesn't ask yet.
11. **`022`** — cross-agent skill compatibility. The positioning shift (specloop's
    skills target the open Agent Skills format, not a Claude-Code-only one) is
    documented now; the actual frontmatter audit and cross-tool testing (Cursor, Codex
    CLI, Gemini CLI, OpenCode) is reserved for later, same as `021`.
12. **`023`** — `planning/fix/`, a flat hand-authored log for post-hoc corrections.
    Independent of everything else on this list (no code reads it); listed last only
    because it was raised last, not because it's gated on anything.
