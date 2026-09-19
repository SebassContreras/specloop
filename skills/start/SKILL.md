---
name: start
description: >
  Scaffold the specloop structure (CLAUDE.md, AGENTS.md, planning/product.md,
  planning/architecture.md, planning/roadmap.md, planning/specs/NNN-name/{requirements,
  design,tasks}.md, .specloop/) in the current repo, then run the full guided
  interview: project type, goal, technologies/architecture/tools, recommended
  skills/plugins for your agent, styles/preferences — seeding the roadmap from the answers
  and filling each spec's requirements one at a time.
when_to_use: >
  Use when the user wants to bootstrap a new project's docs from scratch, or
  add a new feature spec to an already-scaffolded repo. Works for any project
  type — app, website, marketing/content, operations, research, or anything
  else that needs a roadmap. Trigger on phrasing like "I need to set up X",
  "let's build Y", "scaffold a new project for Z", "start a new spec for W",
  "bootstrap the docs for this repo".
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
`planning/architecture.md`, `planning/roadmap.md`, `planning/styles.md`, `planning/specs/**`,
`planning/handoff.md`, and `.specloop/{loop.config.json,logs/.gitkeep,.gitignore,interview.md}`.
Never scaffold anything else — `README.md`, `CONTRIBUTING.md`, `LICENSE` and CI config are
project deliverables the roadmap decides, as specs like any other. `planning/handoff.md` is
only ever written when the user confirms it at a stopping point (see the interview
contract) — never proactively.

## The interview contract

Applies to every Q&A phase. This is the part that matters most; the templates below
are just where answers land.

- **No phase ends on a fixed question count.** A phase ends when its question-bank
  dimensions are each `covered` or `skipped`, *and* Phase F's closing sweep has come
  back with nothing new.
- **Maintain `.specloop/interview.md`** as you go — one row per dimension:
  `| dimension | status | answer summary or skip reason |`. Write it after every
  answer. This is what makes an interrupted interview resumable and an explicit skip
  distinguishable from an oversight. Until Phase 1's second half has run, the ledger is
  the only file on disk, so put the user's answer in their own words in the last column,
  not a paraphrase — it is what the scaffold is later written from.
- **Follow up on anything named but unspecified.** If the user says "the dashboard",
  "the integration", "our brand guidelines", that noun is a new open dimension. Ask.
- **A skip is recorded, never silently dropped.** "Don't care" / "later" / "not
  relevant" → `skipped`, with the reason.
- **Ask in plain chat text by default.** Never call the harness's structured-question
  tool (a selectable-options dialog, where one exists) for an open-ended dimension —
  `goal`, `audience`, `mvp`, `done-when` and the rest. That tool needs a list of options,
  an open question has none, and whatever goes there is filler ("Type your answer",
  "Answer in own words", "Skip") beside the free-text choice the harness already adds.
  Use it only for a closed choice with 2–6 real alternatives (`project-type`, a yes/no
  confirmation), where every option is an actual answer and none is a skip. Never
  preselect a skip: a stray Enter would record a `skipped` the user didn't ask for.
- **Never infer an answer to close a dimension.** Leave it `open` and ask again in the
  sweep. `TBD` on disk is always better than a guess.
- **Help the user decide when they're unsure.** If the answer shows genuine
  uncertainty — "no sé", "not sure", "no tengo idea", in any phase, not gated to a
  specific command — judge whether the dimension is one researched options can
  actually help with (a technical or stylistic choice: `runtime`, `framework`,
  `palette`, `typography`, and the like) versus one that's inherently a fact about the
  user's own project or business (`audience`, `stakeholders`, `mvp`), where a generic
  web answer wouldn't help. For the researchable kind: search for current, fitting
  options (a web-search tool if the session has one) and present 3–5 ranked options
  with a one-line reason each, tailored to what's already been answered. No
  web-search tool available? Say so explicitly and offer options from your own
  knowledge instead — never pass a guess off as researched. For the non-researchable
  kind: say a generic search wouldn't help, and ask a narrower question instead of
  manufacturing a list. Either way, the user picks, asks for more, or leaves it
  `open` — never infer a choice to close the dimension. Record the final answer
  `covered`, noting it was resolved via researched options.
- **Write to disk after every answer.** An interrupted session must lose nothing.
- **The user can stop at any point** — "that's enough for now", "let's pause", "stop
  here", or similar. Before actually stopping, ask whether to write `planning/handoff.md`.
  If yes, write a point-in-time note in the shape of this repo's own `planning/handoff.md`
  template: what's covered per the ledger, what's still `open`/`skipped` and why, and how
  to resume (start your harness in this repo and invoke `start` — under Claude Code,
  `claude --plugin-dir <path-to-specloop>` then `/specloop:start`; the ledger picks up at the
  first `open` dimension). Never stop silently: a bare `open`
  row in the ledger says *that* something is unanswered, not *why*, which is what a
  resuming session or person actually needs.

## Phase 0 — Detect state

1. Check which of this skill's owned files already exist.
2. If `.specloop/interview.md` exists, read it — this is a resumed interview. Report
   what's already covered and continue from the first `open` dimension rather than
   restarting. A ledger with no `planning/` structure beside it means Phase 2 was cut
   short: finish it, then run Phase 1's second half as usual. A `planning/handoff.md`
   alone doesn't count as the scaffold — the ledger decides.
3. Otherwise decide by content:
   - **No `planning/` structure** → Phase 1's first half (the ledger) → 2 → Phase 1's
     second half (the rest of the scaffold) → 3 → 4 → 5 → 6 → 7.
   - **Structure exists, `planning/product.md`'s "What this is" has real content** →
     skip to Phase 7 (next spec's requirements). Offer to revisit Phases 3–5 if the
     user says a decision has changed.
   - **Structure exists, "What this is" is still a stub** → a partially-completed
     prior run with no ledger: say so and ask whether to run Phase 2 now.

**Never overwrite a file that already has real (non-stub) content without explicit
confirmation first.**

## Phase 1 — Scaffold (ledger first, the rest after Phase 2)

Written in two halves, so the interview leads and nothing is written on speculation —
the user's first sight of the run is a question, not a wall of new files:

1. **First half — before the first question.** Create only `.specloop/interview.md`,
   the ledger from the interview contract: one row per Phase A dimension, all `open`.
   Write nothing else yet.
2. **Second half — when Phase 2 ends** (each of its dimensions `covered` or `skipped`,
   and Phase F's sweep clean). Create everything below, only if missing, then write
   Phase 2's answers from the ledger into their files (see Phase 2). `project-type` is
   known by now, which is what `planning/architecture.md`'s header set needs.

The ledger already holds every answer, so a session that stops before the second half
loses nothing; a resumed run (Phase 0) finishes it when Phase 2 ends.

Second half — create, only if missing:

- **`AGENTS.md`** — the single source of project context, and the file the loop's
  workers actually read. Sections: "Project" (one-line goal, audience, project type),
  "Doc map", "Stack & conventions", "Style", "Rules for agents". Content stays
  `TBD — fill via Q&A` except "Project", which Phase 2's answers fill.
- **`CLAUDE.md`** — a thin import, so the two can never diverge:
  ```markdown
  # <project>

  @AGENTS.md
  ```
  Claude Code resolves `@path` imports; the other harnesses in the README's support
  matrix read `AGENTS.md` directly. Every harness therefore sees one set of facts. Never write project content into
  `CLAUDE.md` itself.
- **`planning/product.md`** — headers only: "What this is", "Who uses it", "Out of scope".
- **`planning/architecture.md`** — headers keyed to `project-type` (answered in Phase 2,
  before this file is written; if it ended `skipped`, use the `other` set), content
  filled by Phase 3's Q&A:

  ```markdown
  # Architecture

  ## <type-keyed headers>

  ## Fixed rules

  ## Still to define

  ## Declined
  ```

  Use the header set matching the answered `project-type`:
  - **software** → `Container`, `Stack`, `Conventions`
  - **marketing/content** → `Channels`, `Tools`, `Data sources`
  - **operations/process** → `Systems`, `Cadence`, `Handoffs`
  - **research** → `Sources`, `Method`, `Output`
  - **other** → `Tools`, `Inputs/Outputs` (mirrors Phase B's `B-other` generic dimensions)

  `design-closing`/`task-breakdown` tolerate this file staying header-only (Phase 3
  skipped, or `project-type` left `skipped`) — never gate on it having content.
- **`planning/roadmap.md`**:
  ```markdown
  # Roadmap

  Index of every spec — status, dependencies, pipeline stage, and priority. Read this
  table first; nothing else in this repo should be needed to get oriented.

  | ID  | Plan | Status | Depends on | Stage | Priority |
  |-----|------|--------|------------|-------|----------|

  `Status`: `todo` · `in_progress` · `blocked` · `done` (a stopped spec stays
  `in_progress`; `interrupted` is a task state only). Written only by
  `specloop:loop` after the row is created — never hand-edit it.

  `Stage`: `requirements` · `design_closed` · `tasks_ready` · `looping` — which skill
  a spec needs next. `—` until this skill finishes that spec's `requirements.md`.

  `Priority`: a live ordering number — lower runs first among specs `Depends on`
  doesn't already order. `—` if unranked.
  ```
  Carries no other content — no history, no separate ordering list; that's what goes
  stale (see `planning/architecture.md`'s roadmap Fixed rules if the reasoning is ever
  unclear). The `Plan` cell must be byte-identical to its folder's post-`NNN-` segment
  — `specloop:loop` concatenates the two into a filesystem path. Verify this after
  every row you write. `Stage` and `Priority` are trailing columns the row parser
  ignores positionally (safe to ship with or without values in them). Leave `Stage`
  `—` when you create a spec's row; once this skill finishes writing that spec's real
  `requirements.md` (end of Phase 7 for it), write `requirements` into its `Stage`
  cell — the next skill in the pipeline (`design-closing`) advances it from there.
  Leave `Priority` `—` until Phase 6 asks the user to rank the seeded specs, then fill
  it from that ranking. Never invent a priority the user hasn't actually given; a spec
  with no stated priority stays `—`, not a guessed number.
- **`planning/specs/.gitkeep`** — so the directory survives a commit before the first spec.
- **`.specloop/logs/.gitkeep`** and **`.specloop/.gitignore`**:
  ```gitignore
  logs/*
  !logs/.gitkeep
  ```
  Written here rather than in the repo root `.gitignore`, which this skill doesn't own.
  The `!logs/.gitkeep` exception matters: a bare `logs/` line ignores the
  `.gitkeep` too, defeating its whole purpose of keeping the empty directory
  tracked (`planning/fix/006`).

## Phase 2 — Type & vision Q&A (first run only)

Question-bank Phase A. Start with `project-type` — it branches everything downstream,
so it must be answered first. Record each answer in the ledger as it lands; the
scaffold doesn't exist yet (Phase 1's first half wrote only the ledger).

Then work through `goal`, `audience`, `mvp`, `done-when`, `constraints-hard`,
`stakeholders`, `automatability`, following up as the contract requires. Close with
Phase F's sweep.

Then run Phase 1's second half, and write what this phase collected out of the ledger:
`goal` into `planning/product.md`'s "What this is", `audience` into "Who uses it", what
the `mvp` answer excludes into "Out of scope", and `project-type`, `goal` and `audience`
into `AGENTS.md`'s "Project" section; every later phase reads them from there. The other
dimensions stay in the ledger, which `design-closing` reads directly.

## Phase 3 — Technologies, architecture & tools Q&A

Question-bank Phase B, using the block matching the project type. Do **not** ask
software questions of a marketing project.

Write answers into `planning/architecture.md` as a decision register — one entry per
decision, with what was decided and why:

```markdown
| Decision | Choice | Why |
|---|---|---|
| Runtime | Node 22 | Team knows it; LTS |
```

Then mirror the short version into `AGENTS.md`'s "Stack & conventions" section, which
is what a worker agent reads. `planning/architecture.md` holds the reasoning; `AGENTS.md`
holds the operative rules. Close with Phase F's sweep.

If the user genuinely has no decisions yet, record the dimension as `open` and seed a
decision spec for it in Phase 6 — never invent a stack on their behalf.

## Phase 4 — Helper skills & agent tooling

Question-bank Phase C. This runs **after** Phase 3, so recommendations key off the
user's actual selections rather than a guess from the goal.

1. Given the Phase 3 answers, name the skills/plugins (other than specloop) available
   in this session that would help this project's worker agents. Only what's relevant
   — don't pad to a count. Check what's already available in-session before
   recommending it; this is about the current interviewing session's own toolset, not
   a specific vendor's — the session running this interview need not be Claude Code
   (see `022-cross-agent-skill-compat`).
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
    { "cli": "<answer>", "args": ["<headless flags, from loop-setup's known-flags map>"] }
  ],
  "logDir": ".specloop/logs",
  "contextFiles": ["AGENTS.md", "planning/architecture.md", "planning/styles.md"],
  "language": "<BCP 47 / ISO 639-1 two-letter code from the tone dimension, e.g. \"es\", \"pt\" — omit the field entirely if English>"
}
```
One entry per worker CLI the user named, its `args` the whole array from
`skills/loop-setup/SKILL.md`'s known-flags map (Phase 1, step 1). More than one is for
portability across
whichever harness ends up running `specloop:loop` (it always picks the entry
matching its own session, never splits work across the rest). `language` comes
from Phase 5's `tone` dimension ("what tone... and in
which language?") — write it here too, not just into `AGENTS.md`'s "Style" section, so
`skills/loop` can put it directly in every task's prompt (`014` T10). Omit the field
(don't write `"en"`) when the project is English-only. **Always the lowercase two-letter
code, never the language's own name** (`"es"`, not `"Spanish"`/`"español"`) — see
`planning/architecture.md`'s Fixed rules and `planning/fix/001-language-field-format`.

Use `"TBD"` for anything the user defers. `specloop:loop-setup` asks the rest of the
loop's Q&A later and will re-ask anything left `TBD`.

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
   silently to the previous row. The confirmed order is itself a priority ranking —
   ask whether to record it in the `Priority` column (lower = more urgent), or leave
   it `—` if the user only cares about row order, not a portable number.
4. Once confirmed, create one spec per item, in order: `planning/specs/NNN-name/` with stub
   `design.md`/`tasks.md`, and a `planning/roadmap.md` row. Leave `requirements.md` for
   Phase 7.
5. Tell the user, in chat only, how this gets built step by step: the specs in order,
   what each unlocks (its `Depends on`) and which skill to run next on each (its
   `Stage`). Never write this into `planning/roadmap.md` — it carries no other content
   (Phase 1), and prose there goes stale.
6. Run Phase F's sweep against the goal: does the roadmap actually reach it? Anything
   in `done-when` no spec covers is a missing row.

## Phase 7 — Spec requirements Q&A

Question-bank Phase E, for the next unfilled spec.

1. If this spec's folder doesn't exist yet — a brand-new spec added on a later
   invocation, not one Phase 6 already seeded — ask what it should be called →
   kebab-case → folder `planning/specs/NNN-name/` (`NNN` = highest existing `ID` + 1,
   zero-padded to 3), ask which existing spec(s) it depends on, and append the
   roadmap row. A spec Phase 6 already seeded has its folder and roadmap row already;
   skip straight to step 2 for it.
2. Ask the Phase E dimensions one at a time, **writing to disk after each answer**.
   For `dependencies`, ask it regardless of whether step 1 ran this time: "Does this
   need anything from another spec that the roadmap doesn't already record?" — use
   the roadmap's current `Depends on` cell as context (whether it came from step 1
   just now or from Phase 6's seeding) so the user is confirming/adding to it, not
   deriving it from scratch. Update the roadmap row if the answer adds anything new.
   All 7 dimensions (`what`, `serves`, `constraints`, `acceptance`, `out-of-scope`,
   `dependencies`, `owner-split`) must end up as a row in `.specloop/interview.md`
   and a section in `requirements.md` — none silently skipped:

   ```markdown
   # NNN — name — Requirements

   ## What's being built

   ## Who/what it serves

   ## Hard constraints

   ## Acceptance criteria

   ## Out of scope

   ## Dependencies

   ## Owner split
   ```

   Keep these headers exactly — `specloop:design-closing` reads them to tell real
   content from a stub. `## Acceptance criteria` holds 2–5 observably-checkable
   statements; it's what `task-breakdown` turns into a final verification task.
   `## Owner split` records anything the user wants to do themselves rather than have
   an agent do — `task-breakdown` reads it when assigning each task's `Owner`. Omit
   `## Dependencies`'s body (leave it empty) only if the answer was genuinely "none" —
   still write the section, don't drop it.
3. `design.md` and `tasks.md` stay stubs:
   ```markdown
   # NNN — name — Design

   TBD — to be defined in the next review (no coding yet).
   ```
   ```markdown
   # NNN — name — Tasks

   Status legend: `todo` · `in_progress` · `blocked` · `interrupted` · `done`
   Owner: `agent` (loop-runnable) · `human` (skipped by the loop)
   ```
   Legend only, no task lines yet — never invent tasks here.
4. Close with Phase F's sweep, then stop and ask whether to continue into the next
   queued spec — never chain silently through all of them.

## Phase 8 — Report, then auto-chain into specloop:advance

1. Tell the user what exists now. List any dimension left `open` or `skipped` so
   nothing disappears quietly.
2. State that `specloop:advance` now runs automatically to close design and
   tasks (`specloop:design-closing` then `specloop:task-breakdown`) for every
   seeded spec, deriving its answers from what the interview already
   established and asking live only when something can't be inferred — and
   that it's separately re-invocable later for any spec deferred along the
   way.
3. Report that `specloop:loop-setup` finishes configuring the loop when a spec
   has agent-runnable tasks, and that starting the loop itself
   (`specloop:loop`) is a further step after that. **Do not run either of
   these.** They stay manual, separate, deliberate steps.
4. Chain directly into `specloop:advance`'s logic (Phase 0 onward) — no
   separate invocation needed.
5. Once `specloop:advance` reports and stops, ask whether to write
   `planning/handoff.md`, same as any other stopping point — this is the
   actual stopping point now, since `specloop:advance` may leave specs at
   different stages (`tasks_ready`, deferred, blocked) that a handoff written
   before it ran wouldn't reflect.

## Style rules

- Keep every file terse and structural, matching specloop's own `planning/*.md` — no
  filler prose, no marketing language.
- Never fabricate product/architecture/requirements/style content the user hasn't
  actually said — leave `TBD` rather than guess.
- One question at a time, always wait for the reply before continuing.
- Never scaffold a file this skill doesn't own (see the list at the top).
