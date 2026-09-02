# Specloop

A [Claude Code](https://claude.com/claude-code) plugin that unifies how a project
gets started and kept moving: it interviews you, turns the answers into a roadmap that
can be built step by step, and then runs a CLI-agnostic loop orchestrator in your repo
to work through that roadmap unattended.

Not software-only — an app, a website, a marketing or content project, an
operations/research project, or anything else that needs a roadmap. The project type is
the first thing the interview establishes, and it branches everything after it.

## Install

```
claude --plugin-dir /path/to/specloop
```

(from inside the repo you want to bootstrap — not from this repo itself).

## Quickstart

Run these skills from inside your **target** repo, one at a time, whenever each is
actually ready — none of them chain automatically:

1. **`/specloop:start`** — "I need to set up X". Scaffolds `AGENTS.md` + `CLAUDE.md` +
   `docs/{product,architecture,roadmap}.md` + `.specloop/`, then runs the interview:
   project type → goal/audience/MVP → technologies, architecture and tools →
   recommended Claude Code skills → styles and preferences. Each answer is written to
   disk as it lands, the roadmap is seeded from all of it, and each spec's
   `requirements.md` is filled in roadmap order.

   The interview is exhaustive by contract, not by script: it draws from a
   per-project-type question bank, tracks coverage in `.specloop/interview.md`, follows
   up on anything you named but didn't specify, and won't end a phase until a closing
   sweep comes back clean twice. A dimension you skip is recorded as skipped, not
   quietly dropped.

   Project deliverables (`README.md`, `CONTRIBUTING.md`, `LICENSE`, CI config) are
   specs the roadmap decides, not files this skill assumes.
2. **`/specloop:design-closing`** — once a spec's requirements are filled, closes its
   `design.md` via guided Q&A, and appends any stack/convention decisions it settles
   to `docs/architecture.md` and `AGENTS.md`.
3. **`/specloop:task-breakdown`** — once a spec's design is closed, drafts and
   confirms a `tasks.md` (single-action, verifiable tasks), marking each `agent` or
   `human` so the loop only attempts what an agent can actually finish.
4. **`/specloop:loop-setup`** — one-time step: installs the loop orchestrator into
   your repo (`.specloop/orchestrator/`) and puts `loop` on PATH. The loop folder's
   config already exists from step 1; this adds the payload. It no longer refuses on
   an empty backlog — it installs and tells you what's still needed.
5. **`loop run`** — starts working through the roadmap's next eligible spec, task by
   task. `loop stop` triggers a safe stop (marks the in-flight task `interrupted`,
   logs where it left off); `loop status` shows what's running.

## Docs

- [`docs/handoff.md`](docs/handoff.md) — where the work stands, what's next, and what
  is deliberately not yet verified. Read this first if you're picking the project up.
- [`docs/product.md`](docs/product.md) — what this is, who it's for.
- [`docs/architecture.md`](docs/architecture.md) — stack, conventions, resolved,
  open, and declined design decisions.
- [`docs/roadmap.md`](docs/roadmap.md) — index of every spec, status, dependencies.
- [`docs/specs/`](docs/specs/) — one folder per spec: `requirements.md`,
  `design.md`, `tasks.md`.
- [`framework/orchestrator/`](framework/orchestrator/) — the loop orchestrator's
  reference implementation, copied into target repos by `specloop:loop-setup`.
- [`examples/`](examples/) — a worked `requirements.md` → `design.md` →
  `tasks.md` example and a sample `.specloop/loop.config.json`, so you can see
  what a skill's output actually looks like before running one.
- [`CHANGELOG.md`](CHANGELOG.md) — what has shipped, by spec, in delivery order.
  (`docs/roadmap.md` is direction/status; this is delivered history.)

## Status

Personal project, shared as-is — no support SLA, but issues/PRs are welcome. See
[`CONTRIBUTING.md`](CONTRIBUTING.md) for the workflow and local dev commands, and
[`SECURITY.md`](SECURITY.md) to report a vulnerability privately.

## License

[MIT](LICENSE)
