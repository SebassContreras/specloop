# 001 — scaffold-and-spec-skill

## Requirements (draft — to be reviewed)

- The plugin ships one or more Skills that, when invoked inside a target repo, create
  there: `CLAUDE.md`, `docs/product.md`, `docs/architecture.md`, `docs/roadmap.md`, and
  `docs/specs/NNN-name/{requirements,design,tasks}.md` per feature.
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
