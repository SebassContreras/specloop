# 004 — design-closing-skill — Design

## Skill: `specloop:design-closing`

One skill, invoked as `/specloop:design-closing` or triggered by natural phrasing
("close the design for X", "let's design spec NNN", "spec NNN is ready for design")
via its `description`/`when_to_use` frontmatter.

**Frontmatter:** `context: fork`, `background: false` — same reasoning as 001: this is
a multi-turn guided Q&A, not a single dispatch.

## Flow

### Phase 0 — Pick the spec + refuse if not ready

1. If the user named a spec (`NNN` or a kebab-case name), resolve it against
   `planning/roadmap.md`. Otherwise list rows from `planning/roadmap.md` with status `todo` or
   `in_progress` whose `design.md` is still the `TBD` stub, and ask which one.
2. Read that spec's `requirements.md`. **Refuse to proceed** if:
   - The file doesn't exist, or
   - Its `## Requirements` section has no real bullets (still just the section
     header, or a placeholder) — say so and point the user at `specloop:start`'s
     requirements Q&A instead of guessing.
3. Read `planning/architecture.md` for stack/convention context (if it exists and isn't a
   stub) — design answers should stay consistent with it, not contradict it.

### Phase 1 — Guided design Q&A

One question at a time, wait for the reply before asking the next, same as 001's
requirements Q&A. Cover, in order:

1. **Approach** — how does this get built, in plain terms (the mechanism, not an
   implementation transcript)?
2. **Components / files touched** — what new or existing files/modules does this
   spec create or change?
3. **Sequencing / dependencies** — does anything inside this spec have to happen in a
   specific order? Anything it needs from another spec beyond what `roadmap.md`
   already records?
4. **Risks / open questions** — anything genuinely undecided that should be flagged
   as deferred rather than guessed at.

**Write `design.md` to disk after each answer** — same write-as-you-go rule as 001,
so an interrupted session doesn't lose progress.

### Output shape

Replace the `TBD` stub with:

```markdown
# NNN — name — Design

## Approach

...

## Components / files touched

- ...

## Open questions / deferred

- ...
```

The "Open questions / deferred" section is omitted entirely if Phase 1 turned up
nothing — never write a placeholder "none" bullet.

### Phase 2 — Stop. Do not chain into 003.

Once `design.md` is written, tell the user it's closed and that `specloop:task-
breakdown` (003) can be run on it whenever they're ready — do **not** invoke it
automatically. Matches the project's rule that these are separate, deliberate steps.

## Style rules

- Same as 001: terse, structural, no filler. Never fabricate a design decision the
  user hasn't actually made — leave it as an open question instead of guessing.
- One question at a time, always wait for the reply before continuing.

## Local dev / testing

- `claude --plugin-dir ./specloop` from a target-repo checkout with at least one spec
  whose `requirements.md` is filled (e.g. `test/sample-new-repo`'s `001-hello-cli`),
  run `/specloop:design-closing`, verify `design.md` gets written incrementally and
  the refusal path fires on a spec with empty requirements.

## Open questions / deferred

- Whether `design.md`'s section list above should be enforced as a strict schema or
  stay a loose default the skill can adapt per spec — left loose for now; revisit if
  specs start producing inconsistent shapes.
