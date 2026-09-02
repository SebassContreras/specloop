# 017 — project-type-genericity

## Priority: 5

## What's being built

Makes the pipeline usable for a project that isn't software — an app, a website, a
**marketing or content project**, an operations/process project, a research project, or
anything else that needs a roadmap (`docs/product.md`).

The audit of 2026-09-02 found the plugin was usable for a marketing project through
roughly the first third of the pipeline and hard-wired to software delivery for the
rest. The requirements template is type-neutral, so a marketing project reaches a
filled `requirements.md` — and then:

- `design-closing` asked *"What new or existing files/modules does this create or
  change?"* and wrote a `## Components / files touched` section.
- `task-breakdown` defined a task as *"one file, one function, one config addition"*.
- `docs/architecture.md` was scaffolded with `Container`/stack headers and, for a
  non-software project, nothing that could ever fill them — while two downstream
  skills gated on it having real content.
- `loop-setup` demanded a Node/pnpm toolchain.
- The only worked example and the only e2e fixture were both a Node CLI.
- Nothing anywhere asked what kind of project this was; "marketing" appeared twice in
  the repo, both times as a prohibition on marketing *prose*.

The 2026-09-02 pass added the classifier question, the branched question bank, the
deliverables generalization and the delivery-neutral task rule. This spec covers what
remains and pins the contract.

Remaining:

- Type-keyed section headers for `docs/architecture.md` (software → container/stack/
  conventions; marketing → channels/tools/data sources; operations → systems/cadence/
  handoffs; research → sources/method/output), and tolerate its absence in
  `design-closing`/`task-breakdown` rather than gating on content that may never come.
- `loop-setup`: recognise a project whose tasks are mostly `human`-owned and say so
  rather than walking the user through a worker-CLI setup they won't use.
- A non-software worked example under `examples/`, and a non-software fixture in
  `006-e2e-smoke-testing` — without these the generality claim stays asserted and
  unexercised, which is how it broke the first time.

## Who/what it serves

Any project of the author's that isn't a code repo, and the stated scope of
`docs/product.md`. Also the `B-other` branch's real purpose: an unanticipated project
type gets interviewed properly rather than forced into the software questions.

## Hard constraints

- The project type is established by the **first** interview question and persisted in
  `docs/product.md`; every downstream branch reads it from disk rather than re-inferring.
- No skill may ask software questions of a non-software project.
- The `tasks.md` `Owner` column is what keeps the loop from attempting human-only work
  (`015` implemented the parsing side).
- Generality must be demonstrated by a fixture, not asserted in docs.

## Acceptance criteria

- A marketing project can be taken from `specloop:start` through `design-closing` and
  `task-breakdown` to a populated `tasks.md` without being asked a single
  language/framework/database question.
- `docs/architecture.md`'s scaffolded headers differ by project type.
- `design-closing` and `task-breakdown` run against a project whose
  `docs/architecture.md` is absent.
- `examples/` contains one non-software worked example.
- `006`'s task list includes a non-software fixture run.

## Out of scope

- The interview engine itself (`016`).
- Styles and preferences (`018`), though the visual-surface gate is type-adjacent.
- Supporting project types by shipping domain templates — the question bank asks, it
  doesn't prescribe a methodology.
