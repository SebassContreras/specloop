# Roadmap

Index of all specs: order, status, dependencies.

| ID  | Plan                      | Status      | Depends on         | Priority |
|-----|---------------------------|-------------|--------------------|----------|
| 001 | scaffold-and-spec-skill   | done        | —                  | —        |
| 002 | loop-orchestrator         | done        | 001, 003           | —        |
| 003 | task-breakdown-skill      | done        | 001, 004           | —        |
| 004 | design-closing-skill      | done        | 001                | —        |
| 005 | open-source-release       | done        | 001                | —        |
| 006 | e2e-smoke-testing         | done        | 001, 002, 003, 004 | 1        |
| 007 | orchestrator-unit-tests   | todo        | 002                | 2        |
| 008 | ci-pipeline               | todo        | 007                | 3        |
| 009 | status-dashboard-skill    | todo        | 001                | 4        |
| 010 | loop-auto-continue        | todo        | 002                | 5        |
| 011 | windows-path-safety       | todo        | 002                | 6        |
| 012 | spec-amend-skill          | todo        | 001, 003, 004      | 7        |
| 013 | task-retry-backoff        | todo        | 002                | 8        |
| 014 | worker-context-injection  | in_progress | 002                | 2        |
| 015 | roadmap-status-writer     | in_progress | 002                | 3        |
| 016 | interview-engine          | done        | 001                | 4        |
| 017 | project-type-genericity   | done        | 001, 016           | 5        |
| 018 | project-style-preferences | todo        | 014, 016           | 6        |
| 019 | public-showcase           | todo        | 001, 005           | —        |
| 020 | checklist-task-format     | done        | 002, 003           | 4        |
| 021 | harness-worker-backend    | todo        | 002, 014           | 9        |
| 022 | cross-agent-skill-compat  | done        | 001                | 5        |
| 023 | fix-log                   | done        | —                  | 6        |

Possible statuses: `todo` · `in_progress` · `blocked` · `interrupted` · `done`.

The `Priority` column (`015` T012/T013) is the value each spec's now-retired requirements.md
`## Priority: N` header used to carry — lower is more urgent. `001`–`005` and `019` never
had one (written before the convention, or in `019`'s case genuinely order-independent
per below). **It's a historical/informational value, not the authoritative sequence** —
priorities were assigned once at spec-creation time and go stale as work completes; the
"Build order" list below, updated as decisions change, is what actually governs.

`002`/`003`/`004`/`006`'s live-interactive local tests (`002` T11, `003` T7, `004` T7,
`006` T10) all ran 2026-09-11 under a live OpenCode session against
`test/architecture-absent-fixture/` — `003` closed with nothing else open, `002` and
`004` each surfaced one real follow-up task from the run (`002` T21: recovering a task
stuck `in_progress` after an ungraceful kill; `004` T13: reusing `start`'s type-keyed
header template when `design-closing` has to create `planning/architecture.md` from
scratch). `006` T012 (split-pane backends) then confirmed `windowsTerminal` live —
and, watching it work, the user decided against the whole split-pane approach and had
it reverted (`002` T023): the loop now always runs sequentially in the master's own
process, nothing visual. `006` closed same day.

## Build order

Row order is by ID, not priority. `015` gave the `Status` column a writer and made the
row parser positional/arity-tolerant, then added the `Priority` column above — safe now
because trailing cells are ignored, unsafe before. The `Priority` values are historical
(what each spec's requirements.md once recorded), not the live sequence: the real order,
kept current as decisions change, is:

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
10. **`021`** — a Claude-Agent-SDK-backed worker kind for the *deterministic*
    `loop run` path specifically (a plain script with no harness of its own to
    prefer), additive alongside today's CLI-spawning workers (`codex`/`opencode`
    keep using a CLI; only Claude gains an in-process option). Narrowed
    2026-09-11: the new interactive `skills/loop/SKILL.md` already gets the same
    efficiency for free on its own path (prefer the running harness's own native
    sub-agent mechanism when the provider matches), so this is scoped to what's
    left. Not designed yet — depends on `014` for the context-injection contract
    it must also honor, and on a permission-mode decision `loop-setup`'s Q&A
    doesn't ask yet.
11. **`022`** — cross-agent skill compatibility. The positioning shift (specloop's
    skills target the open Agent Skills format, not a Claude-Code-only one) is
    documented now; the actual frontmatter audit and cross-tool testing (Cursor, Codex
    CLI, Gemini CLI, OpenCode) is reserved for later, same as `021`.
12. **`023`** — `planning/fix/`, a flat hand-authored log for post-hoc corrections.
    Independent of everything else on this list (no code reads it); listed last only
    because it was raised last, not because it's gated on anything.
