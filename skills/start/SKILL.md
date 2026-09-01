---
name: start
description: >
  Scaffold the specloop documentation structure (CLAUDE.md, README.md,
  CONTRIBUTING.md, docs/product.md, docs/architecture.md, docs/roadmap.md,
  docs/specs/NNN-name/{requirements,design,tasks}.md) in the current repo. On first
  run, walks guided Q&A for the project's goal/MVP, worker-skill suggestions, and an
  optional license before the first spec exists, then fills a new spec's
  requirements and the stack/architecture decisions.
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

1. Check whether `CLAUDE.md`, `README.md`, `CONTRIBUTING.md`, and `docs/product.md`,
   `docs/architecture.md`, `docs/roadmap.md` already exist in the current repo root.
2. If `docs/architecture.md` exists, check whether it has real content or is still a
   `TBD` stub. Same check for `docs/product.md`'s "What this is" section.
3. Decide which phases to run:
   - **No `docs/` structure at all** → run Phase 1, then Phase 2, then Phase 3, then
     Phase 4.
   - **Structure exists, `product.md`'s "What this is" already has real content**
     (vision Q&A already happened) → skip Phase 2. If `architecture.md` also has
     real content, skip Phase 4 too and go straight to Phase 3 — near its end, ask
     whether this new spec introduces a stack/architecture change worth appending to
     `docs/architecture.md` (if yes, a short append, not a full re-run of Phase 4).
     If `architecture.md` is still a stub, run Phase 3 then Phase 4.
   - **Structure exists, `product.md`'s "What this is" is still a stub** — treat as a
     partially-completed prior run: say so and ask whether to run Phase 2 now before
     continuing, rather than silently skipping it.

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
  constraints. Placeholder content; gets filled in Phase 4.
- **`docs/roadmap.md`**:
  ```markdown
  # Roadmap

  Index of all specs: order, status, dependencies.

  | ID  | Plan | Status | Depends on |
  |-----|------|--------|------------|

  Possible statuses: `todo` · `in_progress` · `blocked` · `interrupted` · `done`.
  ```
- **`README.md`** — section headers only: "What this is", "Install"/"Usage",
  "License". Distinct from `CLAUDE.md` (that stays the internal Claude Code entry
  point) — this is the human/GitHub-facing landing page. Content stays `TBD — fill
  via Q&A` until Phase 2 finalizes it.
- **`CONTRIBUTING.md`** — write real content immediately (not a stub — this is
  structural, not product-specific):
  ```markdown
  # Contributing

  This repo follows a spec-driven workflow:

  - Check `docs/roadmap.md` for the index of specs, their status, and dependencies
    before proposing anything new.
  - Each feature lives in `docs/specs/NNN-name/`: `requirements.md` first, then a
    closed `design.md`, then a populated `tasks.md`.
  - Open a spec's requirements before writing code for it.
  ```
- **No `LICENSE` yet** — created in Phase 2 only if the user picks one. Never
  scaffold a license file before that's actually decided.

## Phase 2 — Vision & tooling Q&A (first run only)

Runs once, right after Phase 1's skeleton is created and before Phase 3 creates the
first spec. Skipped on a repeat invocation (Phase 0 already checked this).

Ask one at a time, writing to disk after each:

1. **"What's the final goal — the overall purpose of this project?"** → write into
   `docs/product.md`'s "What this is" section, replacing the Phase 1 placeholder.
2. **"What's the MVP, or first phase, you want to reach?"** → append as a short
   "MVP / first phase" note under the same section. Hold onto this answer — Phase 3
   uses it below.
3. **Skill suggestions** — given the stated goal (and MVP, if it narrows things
   down), suggest Claude Code skills/plugins *other than specloop itself* that would
   help the loop-orchestrator's worker agents on this kind of project (e.g. a
   language/framework-specific skill, `security-review`, a relevant test-runner
   skill). Only suggest what's actually relevant — don't pad the list to hit a
   count. Ask which, if any, the user wants installed now.
   - **Never install anything without explicit confirmation** — same bar as any
     other action that changes the user's environment.
   - If a plugin-install mechanism is available in this session, use it for what's
     confirmed. Otherwise, or if a suggested plugin can't be resolved, print plain
     manual install instructions instead of guessing at a command that might not
     exist.
   - This is a suggestion, not a gate — the user can decline all of them and move
     straight to the next question.
4. **License** — "Which open-source license, if any, for this project?" (suggest MIT
   as the default, Apache-2.0 as an alternative, or "none for now").
   - If the user picks one: write the real `LICENSE` file. Read the copyright holder
     from the target repo's `git config user.name`; confirm it with the user rather
     than assuming, and ask directly if git config has nothing.
   - If "none for now": don't create `LICENSE` at all — never force a license before
     the user has actually decided.
5. **Finalize `README.md`** — replace Phase 1's stub sections with real content:
   "What this is" from the goal answer (question 1), "Install"/"Usage" kept short/
   generic at this stage (there's no install story yet for a brand-new repo),
   "License" linking to `LICENSE` if one was created, or left `TBD` if the user chose
   none.

## Phase 3 — Spec creation + requirements Q&A

1. Read `docs/roadmap.md`'s table. Next spec ID = highest existing `ID` + 1,
   zero-padded to 3 digits (`001` if the table is empty).
2. Ask: "What should this spec be called?" → convert the answer to kebab-case →
   folder `docs/specs/NNN-name/`. If this is the first spec in the repo and Phase 2
   ran, suggest the MVP answer as the default name/scope instead of asking cold —
   the user can still override it.
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

## Phase 4 — Stack Q&A

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
