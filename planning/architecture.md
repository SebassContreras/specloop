# Architecture

## Container

**Claude Code Plugin** (not a standalone skill) — packages Skills (and eventually
Subagents) into a single installable/versionable repo.

## Plugin components

- **Bootstrap Skill** (`001`, `skills/start/`): scaffold the folder structure, then run
  the full interview — project type, goal/purpose, technologies/architecture/tools,
  recommended skills, styles/preferences — writing each answer to disk as it lands, and
  seeding the roadmap from all of it. Invocable from inside any target repo, with a
  single entry point ("I need to set up X"). Also writes the `.specloop/` loop folder's
  static files (`loop.config.json`, `logs/.gitkeep`, `.gitignore`).
- **Design-closing Skill** (`004`, `skills/design-closing/`): guided Q&A, run
  separately per spec once its `requirements.md` is ready, closes `design.md`, and
  appends any stack/convention decisions it settles to `planning/architecture.md` and
  `AGENTS.md`.
- **Task-breakdown Skill** (`003`, `skills/task-breakdown/`): run separately per spec
  once its `design.md` is closed, drafts + confirms + writes `tasks.md`, marking each
  task agent-runnable or human-only.
- **Loop-setup Skill** (`002`, `skills/loop-setup/`): one-time, deliberately-invoked
  step that copies `framework/orchestrator/` into the target repo and wires up the
  `loop` console command there. The loop folder's static config already exists from
  `start`; this step installs the payload.
- **No hooks of its own yet** — defined per target repo, not shipped by the plugin.
- **No orchestrator *runtime* lives or executes in this repo** — `framework/
  orchestrator/` here is the reference implementation source; it only actually runs
  once `loop-setup` copies it into a target repo (see spec `002-loop-orchestrator`).

## Fixed rules

- The folder structure scaffolded in the target repo is the same one documented by
  `planning/roadmap.md` in this repo (dogfooding): `CLAUDE.md`, `AGENTS.md`,
  `planning/product.md`, `planning/architecture.md`, `planning/roadmap.md`,
  `planning/specs/NNN-name/{requirements,design,tasks}.md`.
- **`AGENTS.md` is the single source of project context; `CLAUDE.md` is a thin
  `@AGENTS.md` import.** They must never carry diverging copies of the same facts.
  This is required by CLI-agnosticism, not a preference: `claude` auto-loads
  `CLAUDE.md`, while `codex`/`opencode` auto-load `AGENTS.md`. Scaffolding only one of
  them makes the plugin Claude-only in its context layer.
- **The project type is established by the first interview question** and persisted in
  `planning/product.md`. Every downstream phase and skill branches on it: `start`'s
  question bank and seeding exemplars, `planning/architecture.md`'s section headers,
  `design-closing`'s deliverables question, `task-breakdown`'s single-action rule.
  The plugin is not software-only — an app, a website, a marketing/content project, an
  operations/research project, and "anything else that needs a roadmap" are all
  first-class.
- **No Q&A phase terminates on a fixed question count.** Every interview phase draws
  from `skills/start/references/question-bank.md`, records covered/skipped/open
  dimensions in `.specloop/interview.md`, generates follow-ups for anything named but
  unspecified, and ends only after a closing sweep returns nothing new twice in a row.
  A dimension the user declines is recorded as skipped, with the reason — never
  silently dropped.
- `roadmap.md` is always an index table (ID | Plan | Status | Depends on) — without
  this, an agent dropped into the repo has no idea what's next. The row parser reads
  the first four cells positionally and ignores trailing ones, so the contract can be
  extended without breaking every existing row.
- **`tasks.md` is a GFM checkbox list, not a table** (`020-checklist-task-format`):
  `- [ ] T001 [agent] [status:todo] <task>`, with an optional indented note line
  directly below (`      └─ <note>`) replacing the old `Notes` cell. The checkbox
  reflects `done` vs. not; `[status:...]` carries the other 4 states. A task line is
  identified only by starting at column 0 — never by counting delimiters across the
  line, which is what made the old pipe table breakable by an unescaped `|` in a
  task's own text. `framework/orchestrator/src/checklist.ts` holds the grammar;
  `tasks.ts`'s `writeTaskStatus` rewrites only the checkbox/status/note substrings,
  leaving the owner tag and description untouched on every write. IDs are
  zero-padded (`T001`), matching GitHub spec-kit's own convention — chosen
  deliberately so the format reads as industry-familiar, not a specloop invention,
  while keeping the owner/status distinction spec-kit has no equivalent for.
- **The `Plan` cell must be byte-identical to its folder's post-`NNN-` segment** —
  `framework/orchestrator/src/tasks.ts` concatenates the two into a filesystem path.
- **The roadmap's `Status` column has exactly one writer**: the orchestrator, which
  rolls it up from the spec's `tasks.md` when the spec's runnable tasks are exhausted.
  Without a writer the column goes stale and `pickNextSpec` pins the loop to a spec
  that will never complete.
- The loop orchestrator (spec 002) is **CLI-agnostic** (not tied to Claude Code's
  native `Workflow` tool): it must be able to invoke `claude`, `codex`, `opencode`, or
  another CLI, configurable per repo/run.
- **Every worker must get project context through its prompt**, not through ambient
  cwd: the prompt names the spec directory and the `contextFiles` to read before
  working. Relying on a CLI auto-loading a memory file works for `claude` only, and
  silently gives non-Claude workers no knowledge of the project's stack, conventions or
  styles. *Required but not yet implemented — `worker.ts` still sends the task text
  alone. Spec `014` owns this; `contextFiles` already exists in `LoopConfig`.*
- The terminal-splitting mechanism used to watch sub-agents live is **configurable by
  the user at run time** — no fixed mechanism is assumed (not every OS supports the
  same tooling).
- **Safe stop** (master or child pane): stop, do not start a new task, mark the task in
  progress as `interrupted` in its `tasks.md`, leave a log of where it stopped. A safe
  stop on the master propagates to all active child panes.

## Resolved

- Plugin name: `specloop` (`.claude-plugin/plugin.json`).
- Orchestrator runtime: Node.js + TypeScript, run via `tsx` (no build step to
  maintain). Console command: `loop` (`loop run` / `loop stop` / `loop status`),
  linked into PATH by `loop-setup` via `pnpm link --global`.
- Per-target-repo config file: `.specloop/loop.config.json` (`workers` — an array of
  `{cli, args}`, round-robined by task order when there's more than one — plus
  `splitMode`, `logDir`, `contextFiles`) — written by `skills/start`'s guided Q&A,
  never hand-authored or hardcoded. The legacy single `workerCli`/`workerArgs` shape
  still loads (normalized to a one-element `workers` array). See
  `002-loop-orchestrator/design.md`.

## Still to define

- Optional subagents (stack research, etc.).
- Multi-spec parallelism, and split-pane backends beyond `windowsTerminal`/`tmux`
  (see `002-loop-orchestrator/design.md`'s open questions).

## Declined

Considered and explicitly rejected, so it doesn't get re-litigated later. Listed
here (not per-spec) because the decision applies repo-wide.

**A row here may not overrule a stated user objective.** An entry whose only authority
is a `planning/product.md` clause edited in the same change is circular and does not hold —
that failure mode is what produced the `001` scope revert of 2026-09-02, later undone.
Declining something the user asked for requires a dated decision from the user.

| Idea | Why not |
|---|---|
| Claude Code's native `Workflow` tool as the orchestrator runtime | Doesn't cover non-Claude worker CLIs (`codex`, `opencode`, ...) — the orchestrator is required to be CLI-agnostic (`planning/product.md`). |
| Auto-*running* `loop run`, or `loop-setup`'s network install/PATH link, as a side effect of `specloop:start` | Installing dependencies and linking a global binary from inside the bootstrap fails in sandboxes and CI, and starting the loop is always the user's explicit call. Scaffolding the loop folder's *static* files in `start` is fine and is what happens (see `002`). Design-closing and task-breakdown likewise stay separate, deliberate per-spec steps — a repo can sit at requirements-only for a while. |
| Building the orchestrator on top of `opencode-orchestrator` (a separate, earlier repo solving a similar problem) | Reviewed and discarded as a base — author doesn't like how it's built. Recycling specific pieces may be evaluated later; see `002-loop-orchestrator/requirements.md`'s Notes. |
| `.claude-plugin/marketplace.json` listing | Not needed for a plugin installed via `--plugin-dir` or a direct repo checkout; revisit only if distributing through a plugin marketplace becomes a goal (`005-open-source-release/requirements.md`). |
| Formal governance docs beyond `CONTRIBUTING.md`/`SECURITY.md` (code of conduct, CODEOWNERS) | Still a personal project with no active external contributors; revisit only if that changes. |
| A cross-agent HTTP-based update-notifier embedded in the plugin (checking a remote manifest, prompting on stale installs) | Proportional to a widely-distributed, unknown-install-base product. specloop is installed by one person via `git pull`/`--plugin-dir` — that already *is* the update mechanism. `CHANGELOG.md` covers "what shipped"; nothing more is needed at this scale. |
| `skills/start` scaffolding `README.md`, `CONTRIBUTING.md`, `LICENSE` or CI config into the target repo | These are project deliverables, not roadmap/loop infrastructure: if a target project needs one, the roadmap decides it as a spec like any other. Note this does **not** extend to `CLAUDE.md`, `AGENTS.md`, `planning/styles.md` or `.specloop/` — those are the context channel the loop's own workers read, so the plugin owns them. |
| Adopting GitHub spec-kit's `tasks.md` wholesale (checkbox-only, grouped by user-story phase, no owner concept) | 2026-09-05. Spec-kit has no agent/human distinction and no 5-state status — everything is assumed agent-executable. Adopting it as-is would drop `nextRunnableTask`/`pendingHumanTasks`, the exact mechanism that makes the loop safe to leave unattended. `020-checklist-task-format` borrows the checkbox *convention* (industry-familiar, GitHub-rendered) but keeps the owner/status tags spec-kit doesn't have. |
| Automatic bidirectional spec-kit `spec.md`/`plan.md` <-> `requirements.md`/`design.md` conversion | 2026-09-05. spec-kit's `spec.md` is organized by P1/P2/P3 user story with no equivalent of specloop's flat requirements + acceptance criteria shape, and spec-kit has no central roadmap/index to map `roadmap.md` onto. A one-off manual translation remains possible if ever needed; no permanent dual-format reader is planned. |
