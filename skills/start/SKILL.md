---
name: start
description: >
  Scaffold the specloop documentation structure (CLAUDE.md, docs/product.md,
  docs/architecture.md, docs/roadmap.md, docs/specs/NNN-name/{requirements,design,
  tasks}.md) in the current repo, then walk guided Q&A to fill a new spec's
  requirements and, on first run, the stack/architecture decisions.
when_to_use: >
  Use when the user wants to bootstrap a new project's docs from scratch, or add a
  new feature spec to an already-scaffolded repo. Trigger on phrasing like "I need
  to set up X", "let's build Y", "scaffold a new project for Z", "start a new spec
  for W", "bootstrap the docs for this repo".
context: fork
background: false
---

# specloop: start

You are running the specloop bootstrap flow **inside the target repo** (the repo the
user invoked this in — not the specloop plugin repo itself). Follow the phases below
in order. Ask **one question at a time** and wait for the reply before asking the
next one — never batch questions into a single message.

## Phase 0 — Detect state

1. Check whether `CLAUDE.md` and `docs/product.md`, `docs/architecture.md`,
   `docs/roadmap.md` already exist in the current repo root.
2. If `docs/architecture.md` exists, check whether it has real content or is still a
   `TBD` stub.
3. Decide which phases to run:
   - **No `docs/` structure at all** → run Phase 1, then Phase 2, then Phase 3.
   - **Structure exists, `architecture.md` has real content** → skip Phase 1 and
     Phase 3 by default, go straight to Phase 2. Near the end of Phase 2, ask
     whether this new spec introduces a stack/architecture change worth appending to
     `docs/architecture.md` (if yes, do a short append, not a full re-run of Phase 3).
   - **Structure exists, `architecture.md` is still a stub** → run Phase 2, then
     Phase 3.

**Never overwrite a file that already has real (non-stub) content without explicit
confirmation first.** If something looks like a partially-completed prior run, say so
and ask how to proceed before writing anything.

## Phase 1 — Scaffold

Create, only if missing:

- **`CLAUDE.md`** — entry point pointing at the docs below. Mirror the structure of
  specloop's own `CLAUDE.md` (dogfooding — this repo's own `docs/` is the reference
  layout).
- **`docs/product.md`** — section headers only: "What this is", "Who uses it", "Out
  of scope". Content stays `TBD — fill via Q&A` until the user actually describes it
  in a future pass — never invent product content here.
- **`docs/architecture.md`** — section headers only: "Container", stack/conventions/
  constraints. Placeholder content; gets filled in Phase 3.
- **`docs/roadmap.md`**:
  ```markdown
  # Roadmap

  Index of all specs: order, status, dependencies.

  | ID  | Plan | Status | Depends on |
  |-----|------|--------|------------|

  Possible statuses: `todo` · `in_progress` · `blocked` · `interrupted` · `done`.
  ```

## Phase 2 — Spec creation + requirements Q&A

1. Read `docs/roadmap.md`'s table. Next spec ID = highest existing `ID` + 1,
   zero-padded to 3 digits (`001` if the table is empty).
2. Ask: "What should this spec be called?" → convert the answer to kebab-case →
   folder `docs/specs/NNN-name/`.
3. Create three files in that folder:
   - **`requirements.md`** — filled via guided Q&A. Ask focused questions one at a
     time (what's being built, who/what it serves, hard constraints, explicit
     out-of-scope items). **Write the file to disk after each answer** — don't wait
     until the whole Q&A is done, so an interrupted session doesn't lose progress.
   - **`design.md`**:
     ```markdown
     # NNN — name — Design

     TBD — to be defined in the next review (no coding yet).
     ```
   - **`tasks.md`**:
     ```markdown
     # NNN — name — Tasks

     Status legend: `todo` · `in_progress` · `blocked` · `interrupted` · `done`

     | ID | Task | Status | Notes |
     |----|------|--------|-------|
     ```
     Header only — do not invent tasks here. Tasks get filled once `design.md` is
     closed, in a later pass, the same convention specloop uses on itself.
4. Ask what this spec depends on (default suggestion: the previous row's `ID`, or
   `—` if this is the first spec in the repo). Append a new row to
   `docs/roadmap.md`: `| NNN | name | todo | <depends-on> |`.

## Phase 3 — Stack Q&A

Only runs when Phase 0 decided it should. Ask guided questions about: language/
runtime, key dependencies, hard constraints (specific DB, hosting, multi-tenancy
rules, etc.), and conventions to enforce repo-wide. Write the answers into
`docs/architecture.md`, replacing the Phase 1 placeholder content.

On a repeat run where `architecture.md` already has real content, only ask "does
`<spec-name>` introduce a new stack/architecture constraint worth recording?" — if
yes, append a short note instead of re-running the full Q&A.

## Style rules

- Keep every file terse and structural, matching specloop's own `docs/*.md` — no
  filler prose, no marketing language.
- Never fabricate product/architecture/requirements content the user hasn't actually
  said — leave `TBD` rather than guess.
- One question at a time, always wait for the reply before continuing.
