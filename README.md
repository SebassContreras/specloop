# Specloop

A [Claude Code](https://claude.com/claude-code) plugin that unifies how a project
gets started and kept moving: it scaffolds a fixed docs/spec structure via guided
Q&A, then generates a CLI-agnostic loop orchestrator into the target repo to work
through the resulting backlog unattended.

## Install

```
claude --plugin-dir /path/to/specloop
```

(from inside the repo you want to bootstrap — not from this repo itself).

## Quickstart

Run these skills from inside your **target** repo, one at a time, whenever each is
actually ready — none of them chain automatically:

1. **`/specloop:start`** — "I need to set up X". Scaffolds `CLAUDE.md`, `README.md`,
   `CONTRIBUTING.md`, `docs/{product,architecture,roadmap}.md`, and — on first run —
   walks guided Q&A for the project's goal/MVP, an optional `LICENSE`, and worker-
   skill suggestions, before creating a new spec's `requirements.md`.
2. **`/specloop:design-closing`** — once a spec's requirements are filled, closes its
   `design.md` via guided Q&A.
3. **`/specloop:task-breakdown`** — once a spec's design is closed, drafts and
   confirms a `tasks.md` (single-action, verifiable tasks).
4. **`/specloop:loop-setup`** — one-time step, once at least one spec has a
   populated `tasks.md`: generates the loop orchestrator into your repo
   (`.specloop/orchestrator/`) and asks which worker CLI (`claude`, `codex`,
   `opencode`, ...) and split-pane mechanism to use.
5. **`loop run`** — starts working through the roadmap's next eligible spec, task by
   task. `loop stop` triggers a safe stop (marks the in-flight task `interrupted`,
   logs where it left off); `loop status` shows what's running.

## Docs

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
