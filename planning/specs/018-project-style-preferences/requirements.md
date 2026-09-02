# 018 — project-style-preferences

## Priority: 6

## What's being built

The user's objective 6 — *"add styles, let the user choose colors or preferences"* —
which before 2026-09-02 had **zero presence in the repo**: no hit for
palette/colour/typography/theme/brand/design-system anywhere in `planning/`, `skills/`,
`README.md` or `CLAUDE.md`. It had never been considered, so it wasn't even in the
Declined table — and it had been collaterally foreclosed by a rule written that day
(`skills/start`: *"Never scaffold a file this skill doesn't own"*).

Three parts, and all three are needed — capture without delivery is decoration:

1. **Capture** — question-bank Phase D, gated on `visual-surface`: `palette`,
   `typography`, `density-mode`, `brand-refs`, `tone`, `accessibility`, plus
   `code-conventions` and `anti-preferences`, which apply to every project type. Each
   preference records its **strength**: hard rule, or a default an agent may deviate
   from with reason.
2. **Storage** — `planning/styles.md` for detail (hex values, type stacks, tokens);
   `AGENTS.md`'s "Style" section for the operative summary that a worker reads.
3. **Delivery** — depends on `014`. A worker's prompt must name the context files, or
   nothing here reaches the agent executing task T7 three days later. On `codex`/
   `opencode` it reaches nothing at all today.

## Who/what it serves

Any project with a visual surface, and — via `code-conventions`/`anti-preferences` —
every project, since those govern what worker agents produce regardless of whether
anything is rendered.

## Hard constraints

- **Never invent a style value.** No palette the user didn't choose, no hex code
  fabricated to fill a section. An unanswered style dimension stays `open`.
- Skip the visual dimensions entirely for a project with no visual surface — but always
  ask `code-conventions`, `tone` and `anti-preferences`.
- `planning/styles.md` is owned by `skills/start`, not a project deliverable the roadmap
  decides. It is loop context, in the same category as `AGENTS.md` — that distinction
  is recorded in `planning/product.md`'s "Out of scope".
- Preference strength must survive to the worker: a hard rule and a soft default must
  not read identically in `AGENTS.md`.

## Acceptance criteria

- A project declaring a visual surface ends with a `planning/styles.md` containing only
  values the user actually chose, and an `AGENTS.md` "Style" section summarising them
  with their strength.
- A project with no visual surface gets no `planning/styles.md` and is never asked about
  colors, but is still asked about code conventions and anti-preferences.
- Declining a style dimension records it as `skipped`, not as an invented default.
- With `014` in place, a worker prompt on a styled project names `planning/styles.md`.

## Out of scope

- Rendering, theming implementation, or generating design tokens/CSS — the plugin
  records the choice; building against it is a spec in the *target* project's roadmap.
- Brand asset generation or storage.
- Enforcing style conformance in review (a target-repo concern, and adjacent to
  `security-review`-style skills recommended in question-bank Phase C).
