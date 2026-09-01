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
  roadmap}.md` + `README.md` + `CONTRIBUTING.md`.
  - **Missing:** create them using specloop's own `docs/*.md`/`README.md` as the
    structural reference (headers/sections only for `product.md`/`architecture.md`/
    `README.md` — content comes from the Q&A phases below, per 001's "out of scope":
    no fixed template content). `CONTRIBUTING.md` is the one exception: it's written
    with real content immediately (see below), since it's structural, not
    product-specific.
  - **Present:** skip straight to Phase 3 — this is a repeat invocation adding a new
    spec to an already-scaffolded repo.
- `README.md` — headers only: "What this is", "Install"/"Usage", "License". Distinct
  from `CLAUDE.md`: this is the human/GitHub-facing landing page (mirrors specloop's
  own README), `CLAUDE.md` stays the internal Claude Code entry point. Phase 2
  replaces these stubs once the goal (and license choice) are known.
- `CONTRIBUTING.md` — real content immediately, no Q&A: explains the docs/specs
  workflow specloop itself defines (specs live in `docs/specs/NNN-name/`, the
  `requirements → design → tasks` sequence, check `docs/roadmap.md` before proposing
  anything new).
- **No `LICENSE` in this phase** — created in Phase 2 only once the user has actually
  picked a license. Never scaffold a license file with no real choice behind it.
- Never overwrite a file that already has non-stub content without asking first
  (protects a repo where scaffolding was partially run before).

### Phase 2 — Vision & tooling Q&A (first run only, before the first spec exists)

Runs once — right after the skeleton exists and before Phase 3 creates the first
spec. Skipped entirely on a repeat invocation (`docs/product.md`'s "What this is"
already has real, non-stub content) — never re-asked per spec.

One question at a time, write to disk after each:

1. **"What's the final goal — the overall purpose of this project?"** → write into
   `docs/product.md`'s "What this is" section, replacing the Phase 1 placeholder.
2. **"What's the MVP, or first phase, you want to reach?"** → append as a short
   "MVP / first phase" line under the same section. Hold onto the answer — Phase 3
   uses it to suggest the first spec's name/scope instead of asking cold.
3. **Skill suggestions** — given the stated goal (and MVP, if it narrows things),
   suggest Claude Code skills/plugins *other than specloop itself* that would help
   the loop-orchestrator's worker agents on this kind of project (e.g. a
   language/framework-specific skill, `security-review`, a test-runner skill —
   whatever's actually relevant, don't pad the list). Ask which ones, if any, the
   user wants installed now.
   - **Never install without explicit confirmation** — this changes the user's
     environment, same bar as any other side-effecting action.
   - If Claude Code's plugin-management is available in-session, use it to install
     what's confirmed. If it isn't, or a suggested plugin can't be resolved, print
     plain manual install instructions instead of guessing at a command that might
     not exist.
   - This step is a suggestion, not a gate — the user can decline all of them and
     move straight to the next question.
4. **License** — "Which open-source license, if any, for this project?" (MIT
   suggested as default, Apache-2.0 as an alternative, or "none for now"). If the
   user picks one: write the real `LICENSE` file, copyright holder read from the
   target repo's `git config user.name` and confirmed with the user (ask directly if
   git config has nothing). If "none for now": don't create `LICENSE` at all — never
   force a license before the user's actually decided.
5. **Finalize `README.md`** — replace Phase 1's stub sections using what's now known:
   "What this is" from the goal answer, "Install"/"Usage" pointing at the repo's own
   setup once it exists (kept short/generic at this stage), "License" linking to
   `LICENSE` if one was created, or left `TBD` if the user chose none.

### Phase 3 — Spec creation + requirements Q&A

- Read `docs/roadmap.md`'s table, take the highest existing `ID`, next spec is
  `ID + 1` zero-padded to 3 digits (`001`, `002`, … `010`, …).
- Ask for a short kebab-case feature name → folder `docs/specs/NNN-name/`. If this is
  the very first spec (table was empty) and Phase 2 ran, suggest the MVP answer as
  the default name/scope instead of asking cold — the user can still override it.
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

### Phase 4 — Stack Q&A

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
  Phase 1, skips Phase 2 (vision Q&A already answered), skips Phase 4 (unless flagged
  as needed), and goes straight to creating the next spec in Phase 3.
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
  still not needed for this version; Phase 4 stays a plain Q&A.
- Exactly which skill/plugin catalog Phase 2's suggestion step draws from (the
  session's currently available skills, a curated list, a web search) isn't fixed —
  left to judgment at run time rather than hardcoded, since the useful set changes
  over time.
