# 001 — scaffold-and-spec-skill

## What's being built

- The plugin ships one or more Skills that, when invoked inside a target repo, create
  there: `AGENTS.md`, `CLAUDE.md`, `planning/product.md`, `planning/architecture.md`,
  `planning/roadmap.md`, `planning/specs/NNN-name/{requirements,design,tasks}.md` per feature,
  `planning/styles.md` when the project has a visual surface, and the `.specloop/` loop
  folder's static files (`loop.config.json`, `logs/.gitkeep`, `.gitignore`).
- **Project type first.** The first interview question establishes whether this is
  software (app, service, site), a marketing/content project, an operations/process
  project, a research project, or something else. It is persisted in
  `planning/product.md` and branches every downstream phase and skill. The plugin is not
  software-only.
- **Vision Q&A, first run only:** goal/overall purpose, who it's for, the MVP/first
  phase, how you'll know the whole thing is done, hard constraints, stakeholders, and
  which parts should be automated vs. kept by hand.
- **Technologies / architecture / tools Q&A**, branched by project type, with answers
  written into `planning/architecture.md` as a decision register and the operative form
  mirrored into `AGENTS.md`. `planning/architecture.md`'s section headers are keyed to the
  project type — a marketing project gets channels/tools/data sources, not
  container/stack.
- **Skill recommendation**, run *after* the technology Q&A so it keys off the user's
  actual selections rather than a guess from the goal: propose relevant Claude Code
  skills/plugins other than specloop, ask which to install, print manual instructions
  when no install mechanism resolves, and route anything uninstallable to the roadmap so
  the recommendation isn't lost.
- **Styles & preferences Q&A**, gated on whether the project has a visual surface:
  palette, typography, density/mode, brand references, tone, accessibility — plus
  code conventions and anti-preferences, which apply to every project type. Detail to
  `planning/styles.md`, operative summary to `AGENTS.md`, each with its strength (hard rule
  vs. overridable default).
- **Roadmap seeding** from the recorded answers — not from inference. Technologies,
  architectures and skills that need setting up before the project's own features
  become ordered spec entries, with an explicit dependency question per item and an
  MVP-cut question, followed by a step-by-step walkthrough of how it gets built (given
  in chat, not written into `roadmap.md` — amended 2026-09-19 to match `015`'s rule that
  the roadmap carries only the table and its legends).
  Seeding is downstream of the Q&A, not a substitute for asking.
- Interactive Q&A to progressively fill each spec's `requirements.md`, step by step
  (not all at once), in roadmap order, including `## Acceptance criteria`.
- Single entry point: the user says "I need to set up X" and the plugin runs
  type/vision → scaffold → tech → skills → styles → seeding → spec requirements
  (amended 2026-09-19 — the scaffold used to come first; see `planning/fix/016`).

## Who/what it serves

The user starting a brand-new project (or bringing specloop into an existing one)
who needs the planning scaffold — context files, roadmap, per-spec docs, and the
loop folder — created and populated through an interview rather than by hand.
Every later spec and skill in this repo depends on the structure this one
establishes: `AGENTS.md`/`CLAUDE.md` are the context channel workers read
(`014`), `planning/roadmap.md`'s row format is what `skills/loop` and
`skills/status` parse, and `tasks.md`'s `Owner` column is what `002`'s
`loop-setup` consumes downstream.

## Hard constraints

- **`AGENTS.md` is the single source of project context; `CLAUDE.md` is a thin
  `@AGENTS.md` import.** Required by the orchestrator's CLI-agnostic rule:
  `codex`/`opencode` auto-load `AGENTS.md`, `claude` auto-loads `CLAUDE.md`, and
  scaffolding only one makes the plugin Claude-only in its context layer.
- **The interview is exhaustive by contract, not by script.** No Q&A phase terminates
  on a fixed question count. Each draws from
  `skills/start/references/question-bank.md`, records every dimension as
  `covered`/`skipped`/`open` in `.specloop/interview.md`, generates follow-ups for
  anything named but unspecified, and ends only after a closing sweep returns nothing
  new twice in a row. A declined dimension is recorded as skipped, with its reason.
  (Enforcement mechanism is spec `016`.)
- Never install a recommended skill without explicit confirmation.
- Never invent a style value in the styles Q&A.
- The target repo's `planning/roadmap.md` is kept as a real index table (ID, plan, status,
  depends on) — not a free-form changelog. The `Plan` cell must be byte-identical to
  its folder's post-`NNN-` segment, since the orchestrator concatenates them into a
  path.
- No governance hooks included — left for the user to define in the target repo later.
- Does not run the loop's own worker-CLI Q&A (that's `002`'s `loop-setup`) — but writes the loop
  folder's static config, and leaves `tasks.md` in a format `002` can consume,
  including the `Owner` column.

## Acceptance criteria

- Running the scaffold skill in a target repo produces `AGENTS.md`, `CLAUDE.md`,
  `planning/product.md`, `planning/architecture.md`, `planning/roadmap.md`, one
  `planning/specs/NNN-name/{requirements,design,tasks}.md` set per seeded feature,
  `planning/styles.md` (when the project has a visual surface), and the `.specloop/`
  static loop files.
- The interview runs end to end — vision, tech, skill recommendation, styles,
  roadmap seeding, per-spec requirements — as a single entry point, in that order,
  without the user having to invoke separate commands per phase.
- `planning/roadmap.md`'s `Plan` column is byte-identical to each spec folder's
  post-`NNN-` segment.
- `006-e2e-smoke-testing` live-verified this pipeline end to end against a real
  target repo, confirming the scaffold-through-spec-requirements flow actually
  produces a working `002`-consumable roadmap and task set.

## Out of scope

- Stack-research subagents (evaluate later).
- Actual content of the target repo's `architecture.md`/`product.md`/`styles.md` —
  that's filled by the Q&A, not a fixed template.
- `README.md`, `CONTRIBUTING.md`, `LICENSE`, CI config, or any other **project
  deliverable** — the plugin scaffolds the roadmap structure, the agent context files,
  and the loop. If the roadmap decides a target project needs one of these, that's a
  spec like any other.
  This does **not** extend to `AGENTS.md`, `CLAUDE.md`, `planning/styles.md` or
  `.specloop/`: those are the context channel the loop's own workers read, which is
  why this skill owns them. An earlier version of this spec grouped them together and
  declined all of them; see `tasks.md` T15–T27 and `planning/architecture.md`'s "Declined"
  preamble.
- Installing a recommended skill *without confirmation*. Recommending is in scope;
  silently changing the user's environment is not.
- Enforcing the interview contract mechanically (`016`), the per-type question sets
  (`017`), and delivering context to workers (`014`).

## Dependencies

None — foundational spec, predates the `Depends on` convention.

## Owner split

(none stated)
