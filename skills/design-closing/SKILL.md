---
name: design-closing
description: >
  Guided Q&A that closes a spec's design.md once its requirements.md is ready —
  covers approach, deliverables, sequencing and open risks, writing the answer to
  disk after each question, then appends any stack/convention decisions it settles
  to planning/architecture.md and AGENTS.md.
when_to_use: >
  Use when the user wants to move a spec from requirements to a closed design.
  Trigger on phrasing like "close the design for X", "let's design spec NNN",
  "spec NNN is ready for design", "design-close this spec". Refuses to run on a
  spec whose requirements.md is still empty or a stub.
context: fork
background: false
---

# specloop: design-closing

You are running the specloop design-closing flow **inside the target repo** (the repo
the user invoked this in). Ask **one question at a time** and wait for the reply
before asking the next — never batch questions into a single message.

## Phase 0 — Pick the spec + refuse if not ready

1. If the user named a spec (`NNN` or a kebab-case name), resolve it against
   `planning/roadmap.md`. Otherwise read `planning/roadmap.md`'s table, find rows with status
   `todo` or `in_progress` whose `planning/specs/NNN-name/design.md` is still the `TBD`
   stub, and ask the user which one to close.
2. Read that spec's `requirements.md`. **Refuse and stop** if the file doesn't exist,
   or if it has no real answers under its headers — just headers, or an obvious
   placeholder.
   Accept **either** layout: the current template (`## What's being built`,
   `## Who/what it serves`, `## Hard constraints`, `## Acceptance criteria`,
   `## Out of scope`) **or** the older single `## Requirements` heading with real
   bullets under it. Both are valid on disk; gating on only one makes this skill
   refuse on every spec written before the template changed.
   Tell the user requirements need filling first (via `specloop:start`) — never guess
   at requirements content here.
3. Read `planning/product.md` for the **project type**, and `AGENTS.md` +
   `planning/architecture.md` (if they have real content) for stack/convention context.
   Design answers must stay consistent with them. If `.specloop/interview.md` exists,
   read it — a dimension marked `open` there is fair game to ask about now.

## Phase 1 — Guided design Q&A

Ask, one at a time, waiting for each reply. Phrase question 2 according to the project
type — do not ask a marketing project which modules it touches.

1. **Approach** — "How should this get built, in plain terms?" (the mechanism, not a
   line-by-line implementation transcript).
2. **Deliverables** — "What does this create or change?" For software, that's files/
   modules; for a marketing project, assets/pages/campaigns; for operations, runbook
   steps/system changes; for research, datasets/analyses/outputs.
3. **Sequencing / dependencies** — "Does anything inside this spec have to happen in
   a specific order? Anything it needs from another spec beyond what `roadmap.md`
   already records?"
4. **Decisions settled** — "Does this settle any stack, tooling or convention question
   that isn't recorded yet?" Anything here gets appended in Phase 2.
5. **Risks / open questions** — "Anything genuinely undecided that should be flagged
   as deferred rather than guessed at?" Skip this section entirely in the output if
   the answer is "nothing" — never write a placeholder "none" bullet.

**Write `design.md` to disk after each answer** — don't wait until the whole Q&A is
done, so an interrupted session doesn't lose progress.

Replace the file's `TBD` stub with:

```markdown
# NNN — name — Design

## Approach

<answer 1>

## Deliverables

- <answer 2, as bullets>

## Sequencing

<answer 3 — omitted if there's nothing beyond what roadmap.md records>

## Open questions / deferred

- <answer 5, as bullets — section omitted if empty>
```

## Phase 2 — Coverage gate, then write decisions back

1. **Coverage gate.** Re-read `requirements.md` and list anything it requires that the
   design doesn't address — every bullet, and every statement under
   `## Acceptance criteria`. Ask about each until none remain. A design that doesn't
   cover its own acceptance criteria is not closed.
2. Ask the closing sweep: **"What haven't we covered in this design?"** Repeat until it
   returns nothing new twice.
3. Append anything from question 4 to `planning/architecture.md`'s decision register and
   the operative form to `AGENTS.md`'s "Stack & conventions". This is the mechanism
   that keeps those files current as specs close — without it they stay whatever the
   bootstrap left behind. Append only; never rewrite an existing decision without
   telling the user which one is changing.

## Phase 3 — Stop. Do not chain into task-breakdown.

Once `design.md` is written, tell the user it's closed and that `specloop:task-
breakdown` can be run on it whenever they're ready. **Do not invoke it
automatically** — these are separate, deliberate steps per spec.

## Style rules

- Keep every file terse and structural, matching specloop's own `planning/*.md` — no
  filler prose, no marketing language.
- Never fabricate a design decision the user hasn't actually made — leave it as an
  open question instead of guessing.
- One question at a time, always wait for the reply before continuing.
