# 001 — scaffold-and-spec-skill

## Requirements

- The plugin ships one or more Skills that, when invoked inside a target repo, create
  there: `AGENTS.md`, `CLAUDE.md`, `docs/product.md`, `docs/architecture.md`,
  `docs/roadmap.md`, `docs/specs/NNN-name/{requirements,design,tasks}.md` per feature,
  `docs/styles.md` when the project has a visual surface, and the `.specloop/` loop
  folder's static files (`loop.config.json`, `logs/.gitkeep`, `.gitignore`).
- **`AGENTS.md` is the single source of project context; `CLAUDE.md` is a thin
  `@AGENTS.md` import.** Required by the orchestrator's CLI-agnostic rule:
  `codex`/`opencode` auto-load `AGENTS.md`, `claude` auto-loads `CLAUDE.md`, and
  scaffolding only one makes the plugin Claude-only in its context layer.
- **Project type first.** The first interview question establishes whether this is
  software (app, service, site), a marketing/content project, an operations/process
  project, a research project, or something else. It is persisted in
  `docs/product.md` and branches every downstream phase and skill. The plugin is not
  software-only.
- **Vision Q&A, first run only:** goal/overall purpose, who it's for, the MVP/first
  phase, how you'll know the whole thing is done, hard constraints, stakeholders, and
  which parts should be automated vs. kept by hand.
- **Technologies / architecture / tools Q&A**, branched by project type, with answers
  written into `docs/architecture.md` as a decision register and the operative form
  mirrored into `AGENTS.md`. `docs/architecture.md`'s section headers are keyed to the
  project type — a marketing project gets channels/tools/data sources, not
  container/stack.
- **Skill recommendation**, run *after* the technology Q&A so it keys off the user's
  actual selections rather than a guess from the goal: propose relevant Claude Code
  skills/plugins other than specloop, ask which to install, **never install without
  explicit confirmation**, print manual instructions when no install mechanism
  resolves, and route anything uninstallable to the roadmap so the recommendation
  isn't lost.
- **Styles & preferences Q&A**, gated on whether the project has a visual surface:
  palette, typography, density/mode, brand references, tone, accessibility — plus
  code conventions and anti-preferences, which apply to every project type. Detail to
  `docs/styles.md`, operative summary to `AGENTS.md`, each with its strength (hard rule
  vs. overridable default). Never invent a style value.
- **The interview is exhaustive by contract, not by script.** No Q&A phase terminates
  on a fixed question count. Each draws from
  `skills/start/references/question-bank.md`, records every dimension as
  `covered`/`skipped`/`open` in `.specloop/interview.md`, generates follow-ups for
  anything named but unspecified, and ends only after a closing sweep returns nothing
  new twice in a row. A declined dimension is recorded as skipped, with its reason.
  (Enforcement mechanism is spec `016`.)
- **Roadmap seeding** from the recorded answers — not from inference. Technologies,
  architectures and skills that need setting up before the project's own features
  become ordered spec entries, with an explicit dependency question per item and an
  MVP-cut question, followed by a `## How this gets built, step by step` narrative.
  Seeding is downstream of the Q&A, not a substitute for asking.
- Interactive Q&A to progressively fill each spec's `requirements.md`, step by step
  (not all at once), in roadmap order, including `## Acceptance criteria`.
- Single entry point: the user says "I need to set up X" and the plugin runs
  scaffold → type/vision → tech → skills → styles → seeding → spec requirements.
- The target repo's `docs/roadmap.md` is kept as a real index table (ID, plan, status,
  depends on) — not a free-form changelog. The `Plan` cell must be byte-identical to
  its folder's post-`NNN-` segment, since the orchestrator concatenates them into a
  path.
- No governance hooks included — left for the user to define in the target repo later.
- Does not install the loop orchestrator's payload (that's `002`) — but writes the loop
  folder's static config, and leaves `tasks.md` in a format `002` can consume,
  including the `Owner` column.

## Out of scope

- Stack-research subagents (evaluate later).
- Actual content of the target repo's `architecture.md`/`product.md`/`styles.md` —
  that's filled by the Q&A, not a fixed template.
- `README.md`, `CONTRIBUTING.md`, `LICENSE`, CI config, or any other **project
  deliverable** — the plugin scaffolds the roadmap structure, the agent context files,
  and the loop. If the roadmap decides a target project needs one of these, that's a
  spec like any other.
  This does **not** extend to `AGENTS.md`, `CLAUDE.md`, `docs/styles.md` or
  `.specloop/`: those are the context channel the loop's own workers read, which is
  why this skill owns them. An earlier version of this spec grouped them together and
  declined all of them; see `tasks.md` T15–T27 and `docs/architecture.md`'s "Declined"
  preamble.
- Installing a recommended skill *without confirmation*. Recommending is in scope;
  silently changing the user's environment is not.
- Enforcing the interview contract mechanically (`016`), the per-type question sets
  (`017`), and delivering context to workers (`014`).
