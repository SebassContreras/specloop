# Product

## What this is

A **Claude Code Plugin** that unifies how any new project gets started, in two
groups of steps.

**One trigger** — "I need to set up X" — does the initial scaffold:

1. Scaffolds a fixed documentation structure in the target repo
   (`CLAUDE.md` + `docs/product.md` + `docs/architecture.md` + `docs/roadmap.md` +
   `docs/specs/NNN-name/{requirements,design,tasks}.md`).
2. Asks questions (Q&A) to progressively fill in the requirements of each spec,
   feature by feature.
3. Asks questions to choose the stack/tooling based on what's being built.

**Separate, deliberate steps** — run later, per spec, once it's actually ready for
each one (a repo can sit with several specs at requirements-only for a while; none
of this is chained automatically after the scaffold trigger):

4. A guided skill closes a spec's `design.md` once its `requirements.md` is ready.
5. A guided skill breaks a closed `design.md` into a populated `tasks.md`.
6. A **loop orchestrator** gets generated/configured inside the target repo (not
   this plugin repo) — a one-time setup, run once there's at least one spec with a
   populated `tasks.md` to actually execute, not bundled into the initial scaffold.
7. The orchestrator then works through each spec's `tasks.md` step by step, using
   whichever CLI the user configures (`claude`, `codex`, `opencode`, ...).

## Who uses it

Personal use by the author (scontreras) to avoid manually repeating the same setup
every time a new project starts (ringa-crm, sigespy, auth-service, etc.) — and to have
a reliable loop that works through the backlog without constant supervision.

## Out of scope (for now)

- Governance hooks (ADR-first, etc.) — defined per target repo, not shipped by the
  plugin by default.
- Does not replace or depend on `opencode-orchestrator` (separate repo, reviewed and
  discarded as a base — recycling specific pieces may be evaluated later).
