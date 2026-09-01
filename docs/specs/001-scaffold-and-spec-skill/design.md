# 001 — scaffold-and-spec-skill — Design

## Plugin skeleton

```
specloop/
├── .claude-plugin/
│   └── plugin.json          # name: "specloop", skills: "./skills/"
├── skills/
│   └── start/
│       └── SKILL.md         # the single entry-point skill (see below)
└── docs/                    # already exists — doubles as the reference
                              # template for what gets scaffolded (dogfooding)
```

`plugin.json` needs only `name`, plus `displayName`, `version`, `description`,
`skills: "./skills/"`. No `agents/`, `hooks/`, or `commands/` for this spec — those
stay "still to define" per `docs/architecture.md`.

## Skill: `specloop:start`

One skill, invoked as `/specloop:start` or triggered by natural phrasing ("I need to
set up X", "let's scaffold a new project for X") via its `description`/`when_to_use`
frontmatter.

**Frontmatter:** `context: fork`, `background: false`. A plain skill's body loads once
as static context — it can't itself re-prompt turn by turn. A forked, foreground skill
runs as its own subagent with a full ask → wait-for-reply → ask-next loop, then returns
control to the caller. That's required here: scaffold → requirements Q&A → stack Q&A
is inherently a multi-turn conversation, not a single dispatch.

## Flow

### Phase 1 — Scaffold

- Check whether the target repo already has `CLAUDE.md` + `docs/{product,architecture,
  roadmap}.md`.
  - **Missing:** create them using specloop's own `docs/*.md` as the structural
    reference (headers/sections only — content comes from the Q&A phases below, per
    001's "out of scope": no fixed template content).
  - **Present:** skip straight to Phase 2 — this is a repeat invocation adding a new
    spec to an already-scaffolded repo.
- Never overwrite a file that already has non-stub content without asking first
  (protects a repo where scaffolding was partially run before).

### Phase 2 — Spec creation + requirements Q&A

- Read `docs/roadmap.md`'s table, take the highest existing `ID`, next spec is
  `ID + 1` zero-padded to 3 digits (`001`, `002`, … `010`, …).
- Ask for a short kebab-case feature name → folder `docs/specs/NNN-name/`.
- Create `requirements.md`, `design.md`, `tasks.md` in that folder.
  - `requirements.md`: filled via guided Q&A, **one question at a time**, writing the
    answer to disk after each question (so an interrupted session doesn't lose
    progress).
  - `design.md` / `tasks.md`: created as stubs, same convention already used for 001
    and 002 themselves:
    ```
    # NNN — name — Design
    TBD — to be defined in the next review (no coding yet).
    ```
- Append a new row to `docs/roadmap.md`'s table: `| NNN | name | todo | <depends-on> |`.
  Ask the user what it depends on (default: the previous row's ID, or `—` if none).

### Phase 3 — Stack Q&A

- Runs when `docs/architecture.md` doesn't exist yet or is still a stub (i.e., first
  time scaffolding this repo) — guided questions about stack, tooling, conventions,
  hard constraints, then written into `docs/architecture.md`.
- On a repeat invocation (architecture.md already has real content), skip by default;
  ask the user only if this new spec seems to introduce a constraint worth appending
  (e.g. a new dependency), rather than re-running the full Q&A.

## `tasks.md` contract with 002

001 must leave `tasks.md` in a format the (future) loop orchestrator can parse
deterministically. Filling `tasks.md` with actual tasks is **not** part of 001's
Q&A (out of scope, same as today) — but the shape is fixed now so nothing has to be
migrated later:

```markdown
# NNN — name — Tasks

Status legend: `todo` · `in_progress` · `blocked` · `interrupted` · `done`

| ID | Task | Status | Notes |
|----|------|--------|-------|
| T1 | Short, single-action task description | todo | |
```

A markdown table (not a checklist) mirrors `roadmap.md`'s own fixed-format rule, and
gives 002 one deterministic thing to parse. The `Notes` column is where a safe-stop
leaves its "resume from here" pointer. Full read/write protocol is 002's design, not
001's — this only fixes the column contract so 001 doesn't block it.

## Idempotency / re-entry

- Re-running `/specloop:start` in an already-scaffolded repo must be safe: it skips
  Phase 1, skips Phase 3 (unless flagged as needed), and goes straight to creating the
  next spec in Phase 2.
- Nothing is silently overwritten — existing non-stub content is only touched after
  explicit confirmation.

## Local dev / testing

- `claude --plugin-dir ./specloop` from a separate target-repo checkout, run
  `/specloop:start`, verify the scaffold + Q&A + file writes end-to-end.
- `/reload-plugins` after editing `SKILL.md` mid-session instead of restarting.

## Open questions / deferred

- Who fills `tasks.md`'s actual task rows (manual, another skill, or part of a later
  spec)? Not decided — noted so it doesn't get silently dropped.
- Optional stack-research subagent (mentioned in requirements as "evaluate later") —
  still not needed for this version; Phase 3 stays a plain Q&A.
