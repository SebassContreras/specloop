---
name: start
description: >
  Scaffold the specloop structure (CLAUDE.md, AGENTS.md, planning/product.md,
  planning/architecture.md, planning/roadmap.md, planning/specs/NNN-name/{requirements,
  design,tasks}.md, .specloop/) in the current repo, then run the full guided
  interview: project type, goal, technologies/architecture/tools, recommended
  Claude Code skills, styles/preferences — seeding the roadmap from the answers
  and filling each spec's requirements one at a time.
when_to_use: >
  Use when the user wants to bootstrap a new project's docs from scratch, or
  add a new feature spec to an already-scaffolded repo. Works for any project
  type — app, website, marketing/content, operations, research, or anything
  else that needs a roadmap. Trigger on phrasing like "I need to set up X",
  "let's build Y", "scaffold a new project for Z", "start a new spec for W",
  "bootstrap the docs for this repo".
context: fork
background: false
---

# specloop: start

You are running the specloop bootstrap flow **inside the target repo** (the repo the
user invoked this in — not the specloop plugin repo itself). Follow the phases below
in order. Ask **one question at a time** and wait for the reply before asking the
next one — never batch questions into a single message.

Your job is to leave the repo with a roadmap that can be built step by step, and with
the project's decisions recorded where the loop's worker agents will actually read
them. `skills/start/references/question-bank.md` is the coverage contract for every
Q&A phase below — read it before you start asking.

**This skill owns exactly these files:** `CLAUDE.md`, `AGENTS.md`, `planning/product.md`,
`planning/architecture.md`, `planning/roadmap.md`, `planning/styles.md`, `planning/specs/**`, and
`.specloop/{loop.config.json,logs/.gitkeep,.gitignore,interview.md}`. Never scaffold
anything else — `README.md`, `CONTRIBUTING.md`, `LICENSE` and CI config are project
deliverables the roadmap decides, as specs like any other.

## The interview contract

Applies to every Q&A phase. This is the part that matters most; the templates below
are just where answers land.

- **No phase ends on a fixed question count.** A phase ends when its question-bank
  dimensions are each `covered` or `skipped`, *and* Phase F's closing sweep has come
  back with nothing new twice in a row.
- **Maintain `.specloop/interview.md`** as you go — one row per dimension:
  `| dimension | status | answer summary or skip reason |`. Write it after every
  answer. This is what makes an interrupted interview resumable and an explicit skip
  distinguishable from an oversight.
- **Follow up on anything named but unspecified.** If the user says "the dashboard",
  "the integration", "our brand guidelines", that noun is a new open dimension. Ask.
- **A skip is recorded, never silently dropped.** "Don't care" / "later" / "not
  relevant" → `skipped`, with the reason.
- **Never infer an answer to close a dimension.** Leave it `open` and ask again in the
  sweep. `TBD` on disk is always better than a guess.
- **Write to disk after every answer.** An interrupted session must lose nothing.

## Phase 0 — Detect state

1. Check which of this skill's owned files already exist.
2. If `.specloop/interview.md` exists, read it — this is a resumed interview. Report
   what's already covered and continue from the first `open` dimension rather than
   restarting.
3. Otherwise decide by content:
   - **No `planning/` structure** → Phase 1 → 2 → 3 → 4 → 5 → 6 → 7.
   - **Structure exists, `planning/product.md`'s "What this is" has real content** →
     skip to Phase 7 (next spec's requirements). Offer to revisit Phases 3–5 if the
     user says a decision has changed.
   - **Structure exists, "What this is" is still a stub** → a partially-completed
     prior run with no ledger: say so and ask whether to run Phase 2 now.

**Never overwrite a file that already has real (non-stub) content without explicit
confirmation first.**

## Phase 1 — Scaffold

Create, only if missing:

- **`AGENTS.md`** — the single source of project context, and the file the loop's
  workers actually read. Sections: "Project" (one-line goal, audience, project type),
  "Doc map", "Stack & conventions", "Style", "Rules for agents". Content stays
  `TBD — fill via Q&A` until the phases below fill it.
- **`CLAUDE.md`** — a thin import, so the two can never diverge:
  ```markdown
  # <project>

  @AGENTS.md
  ```
  Claude Code resolves `@path` imports; `codex`/`opencode` read `AGENTS.md` directly.
  Both CLIs therefore see one set of facts. Never write project content into
  `CLAUDE.md` itself.
- **`planning/product.md`** — headers only: "What this is", "Who uses it", "Out of scope".
- **`planning/architecture.md`** — headers only. Phase 4 fills it and keys its headers to
  the project type (software → container/stack/conventions; marketing → channels/tools/
  data sources; operations → systems/cadence/handoffs; research → sources/method/output).
- **`planning/roadmap.md`**:
  ```markdown
  # Roadmap

  Index of all specs: order, status, dependencies.

  | ID  | Plan | Status | Depends on |
  |-----|------|--------|------------|

  Possible statuses: `todo` · `in_progress` · `blocked` · `interrupted` · `done`.
  ```
  The `Plan` cell must be byte-identical to its folder's post-`NNN-` segment — the
  orchestrator concatenates the two into a filesystem path. Verify this after every
  row you write.
- **`planning/specs/.gitkeep`** — so the directory survives a commit before the first spec.
- **`.specloop/logs/.gitkeep`** and **`.specloop/.gitignore`**:
  ```gitignore
  orchestrator/
  logs/
  ```
  Written here rather than in the repo root `.gitignore`, which this skill doesn't own.

## Phase 2 — Type & vision Q&A (first run only)

Question-bank Phase A. Start with `project-type` — it branches everything downstream,
so it must be answered first. Write the answer into `planning/product.md` *and*
`AGENTS.md`'s "Project" section; every later phase reads it from there.

Then work through `goal`, `audience`, `mvp`, `done-when`, `constraints-hard`,
`stakeholders`, `automatability`, following up as the contract requires. Close with
Phase F's sweep.

## Phase 3 — Technologies, architecture & tools Q&A

Question-bank Phase B, using the block matching the project type. Do **not** ask
software questions of a marketing project.

Write answers into `planning/architecture.md` as a decision register — one entry per
decision, with what was decided and why:

```markdown
| Decision | Choice | Why |
|---|---|---|
| Runtime | Node 22 | Team knows it; orchestrator already uses it |
```

Then mirror the short version into `AGENTS.md`'s "Stack & conventions" section, which
is what a worker agent reads. `planning/architecture.md` holds the reasoning; `AGENTS.md`
holds the operative rules. Close with Phase F's sweep.

If the user genuinely has no decisions yet, record the dimension as `open` and seed a
decision spec for it in Phase 6 — never invent a stack on their behalf.

## Phase 4 — Helper skills & agent tooling

Question-bank Phase C. This runs **after** Phase 3, so recommendations key off the
user's actual selections rather than a guess from the goal.

1. Given the Phase 3 answers, name the Claude Code skills/plugins (other than specloop)
   that would help this project's worker agents. Only what's relevant — don't pad to a
   count. Check what's already available in-session before recommending it.
2. Ask which, if any, to install. **Never install anything without explicit
   confirmation.** If a plugin-install mechanism is available, use it for what's
   confirmed; otherwise print plain manual install instructions rather than guessing a
   command that may not exist.
3. **Anything the user wants but can't be installed now becomes a roadmap entry in
   Phase 6** — a recommendation must not evaporate.
4. Ask `worker-cli` and `agent-rules`. Write the CLI answers into
   `.specloop/loop.config.json` (Phase 5) and the rules into `AGENTS.md`'s "Rules for
   agents".

## Phase 5 — Styles & preferences Q&A

Question-bank Phase D. Ask `visual-surface` first and skip the visual dimensions if
the answer is no — but always ask `code-conventions`, `tone` and `anti-preferences`,
which apply to every project type.

- Write the detail into **`planning/styles.md`** (palette hex values, type stacks, tokens).
- Write the operative summary into **`AGENTS.md`'s "Style"** section, and reference
  `planning/styles.md` from it. `AGENTS.md` is what reaches a worker; `planning/styles.md` on
  its own is inert.
- Record each preference's strength — hard rule vs. overridable default.
- **Never invent a style value.** No palette the user didn't choose, no hex code you
  made up. An unanswered style dimension stays `open`.

Then write `.specloop/loop.config.json` from Phase 4's CLI answers:

```json
{
  "workers": [
    { "cli": "<answer>", "args": ["<headless flag>"] }
  ],
  "splitMode": "none",
  "logDir": ".specloop/logs",
  "contextFiles": ["AGENTS.md", "planning/architecture.md", "planning/styles.md"]
}
```
One entry per worker CLI the user named — more than one round-robins across them by
task order.

Use `"TBD"` for anything the user defers. `specloop:loop-setup` installs the
orchestrator payload later and will re-ask anything left `TBD`.

## Phase 6 — Roadmap seeding

Now the recorded answers become the roadmap. This is where "technologies, architectures
or skills to be implemented" turn into ordered spec entries.

1. Propose an ordered list of what needs setting up before the project's own features,
   derived from the Phase 3–5 answers — including any helper skill from Phase 4 that
   couldn't be installed, and any dimension still `open` (as a decision spec). Use
   type-appropriate exemplars: software → framework scaffold, database, test harness;
   marketing → audience research, brand/tone guidelines, channel setup, asset pipeline;
   operations → system access, current-state mapping, runbook; research → source
   acquisition, method design.
2. Ask the `mvp`-cut question: which of these are in the first phase and which come
   later. Group the roadmap accordingly.
3. Show the proposal and get it confirmed — add / remove / reorder — before writing
   anything. Ask an explicit dependency question per item rather than defaulting
   silently to the previous row.
4. Once confirmed, create one spec per item, in order: `planning/specs/NNN-name/` with stub
   `design.md`/`tasks.md`, and a `planning/roadmap.md` row. Leave `requirements.md` for
   Phase 7.
5. Write a `## How this gets built, step by step` section below the roadmap table: the
   specs in order, what each unlocks, and which skill to run next on each.
6. Run Phase F's sweep against the goal: does the roadmap actually reach it? Anything
   in `done-when` no spec covers is a missing row.

## Phase 7 — Spec requirements Q&A

Question-bank Phase E, for the next unfilled spec.

1. On a repeat invocation, ask what the spec should be called → kebab-case → folder
   `planning/specs/NNN-name/` (`NNN` = highest existing `ID` + 1, zero-padded to 3), ask
   its dependencies, and append the roadmap row.
2. Ask the Phase E dimensions one at a time, **writing to disk after each answer**:

   ```markdown
   # NNN — name — Requirements

   ## What's being built

   ## Who/what it serves

   ## Hard constraints

   ## Acceptance criteria

   ## Out of scope
   ```

   Keep these headers exactly — `specloop:design-closing` reads them to tell real
   content from a stub. `## Acceptance criteria` holds 2–5 observably-checkable
   statements; it's what `task-breakdown` turns into a final verification task.
3. `design.md` and `tasks.md` stay stubs:
   ```markdown
   # NNN — name — Design

   TBD — to be defined in the next review (no coding yet).
   ```
   ```markdown
   # NNN — name — Tasks

   Status legend: `todo` · `in_progress` · `blocked` · `interrupted` · `done`
   Owner: `agent` (loop-runnable) · `human` (skipped by the loop)

   | ID | Task | Owner | Status | Notes |
   |----|------|-------|--------|-------|
   ```
   Header only — never invent tasks here.
4. Close with Phase F's sweep, then stop and ask whether to continue into the next
   queued spec — never chain silently through all of them.

## Phase 8 — Report, then stop

Tell the user what exists now, and what the next deliberate step is per spec
(`specloop:design-closing`), plus that `specloop:loop-setup` installs the orchestrator
when a spec has agent-runnable tasks. **Do not run any of them.** List any dimension
left `open` or `skipped` so nothing disappears quietly.

## Style rules

- Keep every file terse and structural, matching specloop's own `planning/*.md` — no
  filler prose, no marketing language.
- Never fabricate product/architecture/requirements/style content the user hasn't
  actually said — leave `TBD` rather than guess.
- One question at a time, always wait for the reply before continuing.
- Never scaffold a file this skill doesn't own (see the list at the top).
