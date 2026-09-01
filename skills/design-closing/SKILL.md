---
name: design-closing
description: >
  Guided Q&A that closes a spec's design.md once its requirements.md is ready —
  covers approach, components/files touched, sequencing, and open risks, writing
  the answer to disk after each question.
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
   `docs/roadmap.md`. Otherwise read `docs/roadmap.md`'s table, find rows with status
   `todo` or `in_progress` whose `docs/specs/NNN-name/design.md` is still the `TBD`
   stub, and ask the user which one to close.
2. Read that spec's `requirements.md`. **Refuse and stop** if:
   - The file doesn't exist, or
   - Its `## Requirements` section has no real bullets (just the header, or an
     obvious placeholder).
   Tell the user requirements need to be filled first (via `specloop:start`'s
   requirements Q&A) — never guess at requirements content here.
3. If `docs/architecture.md` exists and has real (non-stub) content, read it for
   stack/convention context — design answers should stay consistent with it.

## Phase 1 — Guided design Q&A

Ask, one at a time, waiting for each reply before continuing:

1. **Approach** — "How should this get built, in plain terms?" (the mechanism, not a
   line-by-line implementation transcript).
2. **Components / files touched** — "What new or existing files/modules does this
   create or change?"
3. **Sequencing / dependencies** — "Does anything inside this spec have to happen in
   a specific order? Anything it needs from another spec beyond what `roadmap.md`
   already records?"
4. **Risks / open questions** — "Anything genuinely undecided that should be flagged
   as deferred rather than guessed at?" Skip this question's section entirely in the
   output if the answer is "nothing" — never write a placeholder "none" bullet.

**Write `design.md` to disk after each answer** — don't wait until the whole Q&A is
done, so an interrupted session doesn't lose progress.

Replace the file's `TBD` stub with:

```markdown
# NNN — name — Design

## Approach

<answer 1>

## Components / files touched

- <answer 2, as bullets>

## Open questions / deferred

- <answer 4, as bullets — section omitted if empty>
```

## Phase 2 — Stop. Do not chain into task-breakdown.

Once `design.md` is written, tell the user it's closed and that `specloop:task-
breakdown` can be run on it whenever they're ready. **Do not invoke it
automatically** — these are separate, deliberate steps per spec.

## Style rules

- Keep every file terse and structural, matching specloop's own `docs/*.md` — no
  filler prose, no marketing language.
- Never fabricate a design decision the user hasn't actually made — leave it as an
  open question instead of guessing.
- One question at a time, always wait for the reply before continuing.
