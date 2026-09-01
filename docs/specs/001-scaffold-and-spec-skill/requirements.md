# 001 — scaffold-and-spec-skill

## Requirements (draft — to be reviewed)

- The plugin ships one or more Skills that, when invoked inside a target repo, create
  there: `CLAUDE.md`, `docs/product.md`, `docs/architecture.md`, `docs/roadmap.md`, and
  `docs/specs/NNN-name/{requirements,design,tasks}.md` per feature.
- Also scaffolds, in the target repo: `README.md` (public-facing, filled from the
  vision Q&A's goal once known), `CONTRIBUTING.md` (structural — explains the
  docs/specs workflow, doesn't need Q&A), and `LICENSE` (only once the user picks a
  license in the vision Q&A — never force one before they've decided).
- **Vision Q&A, first run only, before the first spec is created:** ask, one at a
  time — (1) the project's final goal/overall purpose, written into
  `docs/product.md`'s "What this is"; (2) the MVP/first phase, written alongside it
  and used to seed the first spec's name/description; (3) suggest Claude Code
  skills/plugins (other than specloop itself) that would help the loop-
  orchestrator's worker agents given that goal, and offer to install any the user
  wants — confirm before installing anything, never install silently.
- Interactive Q&A to progressively fill each spec's `requirements.md`, step by step
  (not all at once).
- Interactive Q&A to choose stack/tooling based on what's being built.
- Single entry point: the user says "I need to set up X" and the plugin chains
  scaffold → spec Q&A → stack Q&A.
- The target repo's `docs/roadmap.md` is kept as a real index table (ID, plan, status,
  depends on) — not a free-form changelog.
- No governance hooks included — left for the user to define in the target repo later.
- Does not generate the loop orchestrator (that's spec 002) — but must leave
  `tasks.md` in a format that 002 can consume.

## Out of scope

- Stack-research subagents (evaluate later).
- Actual content of the target repo's `architecture.md`/`product.md` — that's filled
  by the Q&A, not a fixed template.
