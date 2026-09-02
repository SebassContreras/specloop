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
control to the caller. That's required here: scaffold → type/vision → tech → skills →
styles → seeding → requirements is inherently a multi-turn conversation, not a single
dispatch. It's also why the interview contract can exist at all — a coverage loop needs
to be able to ask an unplanned follow-up.

**Reference file:** `skills/start/references/question-bank.md` holds the per-project-type
question sets and the closing-sweep procedure. It is the coverage contract, not a script
to read aloud; keeping it out of `SKILL.md` stops the skill body from becoming a wall of
questions and lets `design-closing` re-check the same dimensions.

**Scope boundary.** This skill owns the roadmap structure, the agent context files
(`AGENTS.md`/`CLAUDE.md`), the preference record (`docs/styles.md`), the `.specloop/`
loop folder's static files, and the whole interview that fills them. It does **not**
scaffold `README.md`/`CONTRIBUTING.md`/`LICENSE`/CI config — those are project
deliverables the roadmap decides.

That boundary was drawn wrongly once. On 2026-09-02 an earlier revert grouped the
context files, the technology Q&A and skill recommendation together with the project
deliverables and declined all of them, citing a `docs/product.md` clause written in the
same change. Four of the project's six stated objectives went with it. The distinction
that actually holds: **a file the loop's own workers read is infrastructure this skill
owns; a file the project ships is a deliverable the roadmap decides.** See `tasks.md`
T15–T27 and `docs/architecture.md`'s "Declined" preamble.

## Flow

Eight phases. `SKILL.md` is the authoritative statement of each; this records *why*
each is shaped the way it is.

### Phase 0 — Detect state

Branches on `.specloop/interview.md` first: if a ledger exists, this is a resumed
interview and the run continues from the first `open` dimension. Only when there's no
ledger does it fall back to content detection (`docs/product.md`'s "What this is" real
vs. stub). Ledger-first matters because file existence can't distinguish "finished" from
"interrupted after two questions" — the failure mode the old detection had.

### Phase 1 — Scaffold

Creates only what's missing, using specloop's own `docs/*.md` as the structural
reference (headers only — content comes from the Q&A). `AGENTS.md` carries the content;
`CLAUDE.md` is a one-line `@AGENTS.md` import, so the two cannot drift apart. Also
writes `docs/specs/.gitkeep` (the directory can't be committed empty otherwise) and
`.specloop/.gitignore` covering `orchestrator/` and `logs/` — scoped to `.specloop/`
rather than the repo root, which this skill doesn't own. Never overwrites non-stub
content without asking.

### Phase 2 — Type & vision Q&A (first run only)

`project-type` is asked **first**, because it branches every later phase; asking it
after the goal would mean re-deriving it or asking software questions of a marketing
project. Written to both `docs/product.md` and `AGENTS.md` so downstream skills read it
off disk instead of re-inferring. Then goal, audience, MVP, done-when, hard constraints,
stakeholders, automatability.

### Phase 3 — Technologies / architecture / tools Q&A

Uses the question-bank block matching the project type. Answers go to
`docs/architecture.md` as a decision register (what / choice / why) and the operative
form to `AGENTS.md`. Two files on purpose: the register holds reasoning that would bloat
a worker's context, `AGENTS.md` holds the rules a worker must follow.

This phase's absence was the single worst defect of the pre-restoration design. Without
it, a first run asked **zero** technology questions, `docs/architecture.md` stayed a
permanent `TBD` stub — `SKILL.md` claimed it would "fill in progressively as designs get
closed" while no file in the repo ever wrote it — and the read-gates in
`design-closing`/`task-breakdown` that test for real content were therefore permanently
inert.

### Phase 4 — Helper skills & agent tooling

Positioned after Phase 3 deliberately: objective 4 is "recommend skills based on the
user's **selections**", so it must run once selections exist. Recommending from the goal
alone was the earlier shape and it couldn't satisfy the objective. Confirm before
install; manual instructions when nothing resolves; anything the user wants but can't
install now becomes a roadmap row rather than evaporating.

### Phase 5 — Styles & preferences Q&A

Gated on `visual-surface` for the visual dimensions; `code-conventions`, `tone` and
`anti-preferences` are asked always, since they govern worker output regardless of
whether anything is rendered. Detail to `docs/styles.md`, operative summary plus
strength (hard rule vs. overridable) to `AGENTS.md`. Also writes
`.specloop/loop.config.json`, including `contextFiles`.

Note the dependency: until spec `014` lands, a worker's prompt names no context files,
so on `codex`/`opencode` none of this reaches the agent. Captured here, delivered there.

### Phase 6 — Roadmap seeding

Now downstream of the recorded answers rather than a substitute for asking them.
Seeding was the right idea — "technologies, architectures or skills to be implemented"
genuinely are roadmap entries — but it was made to *replace* the Q&A, which turned N
elicitation questions into one bulk approval prompt and made the agent the author of
the tech decisions. Both now: ask, record, then seed from what was recorded.

Adds the MVP-cut question (milestone grouping), an explicit per-item dependency question
instead of silently defaulting to the previous row, and a
`## How this gets built, step by step` narrative — the objective's "clearly detail the
step-by-step process" is not satisfied by a bare table. Ends with a sweep against
`done-when`: anything the goal requires that no spec covers is a missing row.

### Phase 7 — Spec requirements Q&A

Per spec, in roadmap order. Template gains `## Acceptance criteria` (2–5 observably
checkable statements) — `task-breakdown` turns each into a final verification task, so a
spec's definition of done becomes executable rather than prose. Stops after each spec
and asks before continuing; never chains silently.

### Phase 8 — Report, then stop

Lists what exists, the next deliberate step per spec, and **every dimension left `open`
or `skipped`** — the report is the last defence against a point disappearing quietly.
Runs nothing.

## `tasks.md` contract with 002

001 must leave `tasks.md` in a format the (future) loop orchestrator can parse
deterministically. Filling `tasks.md` with actual tasks is **not** part of 001's
Q&A (out of scope, same as today) — but the shape is fixed now so nothing has to be
migrated later:

```markdown
# NNN — name — Tasks

Status legend: `todo` · `in_progress` · `blocked` · `interrupted` · `done`
Owner: `agent` (loop-runnable) · `human` (skipped by the loop)

| ID | Task | Owner | Status | Notes |
|----|------|-------|--------|-------|
| T1 | Short, single-action task description | agent | todo | |
```

A markdown table (not a checklist) mirrors `roadmap.md`'s own fixed-format rule, and
gives 002 one deterministic thing to parse. The `Notes` column is where a safe-stop
leaves its "resume from here" pointer. Full read/write protocol is 002's design, not
001's — this only fixes the column contract so 001 doesn't block it.

`Owner` exists because not every task is agent-runnable: anything needing a credential,
an approval, a purchase, a physical act or a live interactive session must be skipped
rather than attempted and marked `blocked`. It's load-bearing for non-software projects,
where a large share of the work is human by nature. `015` implements the parsing side and
keeps pre-`Owner` 4-column tables working, so the 13 specs already on disk here don't
need migrating to stay readable (`T28` decides whether to migrate them anyway).

## Idempotency / re-entry

- Re-running `/specloop:start` in an already-scaffolded repo must be safe: with a
  ledger it resumes at the first `open` dimension; without one it skips Phases 1–6 on
  content detection and goes straight to Phase 7's next spec, offering to revisit
  Phases 3–5 if the user says a decision changed.
- Nothing is silently overwritten — existing non-stub content is only touched after
  explicit confirmation.

## Local dev / testing

- `claude --plugin-dir ./specloop` from a separate target-repo checkout, run
  `/specloop:start`, verify the scaffold + Q&A + file writes end-to-end.
- `/reload-plugins` after editing `SKILL.md` mid-session instead of restarting.

## Open questions / deferred

- Which skill/plugin catalog Phase 4 draws from (the session's available skills, a
  curated list, a web search) isn't fixed — left to judgment at run time rather than
  hardcoded, since the useful set changes over time.
- How long an interview a user will actually sit through. The contract removes the
  ceiling on questions, which is what the objective demands, but the sweep's
  stopping rule ("nothing new twice") is the only brake. Whether that needs a
  per-phase escape hatch is unknown until `T29`'s live run.
- Whether `docs/architecture.md` should be renamed for non-software projects. Its
  headers are type-keyed (`017`), which addresses the mismatch, but the filename still
  reads oddly for a marketing project. Renaming means touching every spec and skill
  that references it — deliberately not done as part of the restoration.
- Whether this repo's own 13 `tasks.md` files migrate to the 5-column layout (`T28`).
  Backward compatibility makes it optional; dogfooding argues for it.
