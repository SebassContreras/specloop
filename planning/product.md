# Product

## What this is

A **Claude Code Plugin** that unifies how any new project gets started: it interviews
the user, turns the answers into a roadmap that can be built step by step, and then
works through that roadmap unsupervised.

"Any project" is literal — an app, a website, a marketing or content project, an
operations/research project, or anything else that can be automated and needs a
roadmap. The project *type* is the first thing the interview establishes, and it
branches everything downstream (see `planning/architecture.md`'s fixed rules).

**One trigger** — "I need to set up X" — does the initial scaffold:

1. Scaffolds a fixed documentation structure in the target repo:
   `CLAUDE.md` + `AGENTS.md` + `planning/product.md` + `planning/architecture.md` +
   `planning/roadmap.md` + `planning/specs/NNN-name/{requirements,design,tasks}.md`, plus
   `planning/styles.md` when the project has a visual surface, plus the `.specloop/`
   loop folder's static files (config + log dir + ignore rules).
2. Asks what kind of project this is, what the goal is, and who it serves.
3. Asks about technologies, architecture, and tools — branched by project type, with
   the answers written into `planning/architecture.md` as a decision register. Its section
   headers are keyed to the project type, so a marketing project gets
   channels/tools/data-sources rather than container/stack.
4. Recommends Claude Code skills based on the answers given in (3) — confirmed before
   anything is installed, never installed silently.
5. Asks for styles and preferences (colors, typography, tone, code conventions) and
   records them where worker agents actually read them.
6. Seeds the roadmap from all of the above, then fills each spec's requirements
   feature by feature, in roadmap order.

**The interview is exhaustive by contract, not by script.** No Q&A phase terminates on
a fixed question count. Each one draws from a per-project-type question bank, records
coverage in `.specloop/interview.md`, generates follow-ups on anything named but
unspecified, and ends only after a closing sweep comes back clean twice. An explicit
skip is recorded as a skip — never silently dropped. See `planning/architecture.md`.

**Separate, deliberate steps** — run later, per spec, once it's actually ready for
each one (a repo can sit with several specs at requirements-only for a while; none
of this is chained automatically after the scaffold trigger):

7. A guided skill closes a spec's `design.md` once its `requirements.md` is ready,
   and writes any stack/convention decisions it settles back into
   `planning/architecture.md` and `AGENTS.md`.
8. A guided skill breaks a closed `design.md` into a populated `tasks.md`, marking
   each task as agent-runnable or human-only.
9. The **loop orchestrator**'s payload gets installed into the target repo — a
   one-time step run once there's at least one spec with agent-runnable tasks. The
   loop folder's *static* files already exist from step 1; this step adds the
   orchestrator itself and puts `loop` on PATH.
10. The orchestrator then works through each spec's agent-runnable tasks step by step,
    using whichever CLI the user configures (`claude`, `codex`, `opencode`, ...), and
    hands every worker the project's context files so its output respects the
    decisions made in steps 3–5.

## Who uses it

Personal use by the author (scontreras) to avoid manually repeating the same setup
every time a new project starts (ringa-crm, sigespy, auth-service, etc.) — and to have
a reliable loop that works through the backlog without constant supervision.

## Out of scope (for now)

- Governance hooks (ADR-first, etc.) — defined per target repo, not shipped by the
  plugin by default.
- Does not replace or depend on `opencode-orchestrator` (separate repo, reviewed and
  discarded as a base — recycling specific pieces may be evaluated later).
- Does not scaffold `README.md`, `CONTRIBUTING.md`, `LICENSE`, or CI config into the
  target repo. These are project deliverables, not roadmap/loop infrastructure — if a
  target project needs one, the roadmap decides it, as a spec like any other.
  (`CLAUDE.md`, `AGENTS.md`, `planning/styles.md` and `.specloop/` are *not* in this
  category: they are the context channel the loop's own workers read, which is why the
  plugin owns them.)
