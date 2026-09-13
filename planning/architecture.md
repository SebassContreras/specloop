# Architecture

## Container

**An Agent Skills package, distributed today as a Claude Code Plugin.** The skills
themselves (`SKILL.md`: `name`/`description`/`when_to_use` frontmatter + instructions)
target the open, cross-tool Agent Skills format — the same format Cursor, Codex CLI,
Gemini CLI, GitHub Copilot, OpenCode, Windsurf and Goose all read natively, several via
the vendor-neutral `.agents/skills/<name>/SKILL.md` discovery path (OpenCode confirmed
also accepts `.opencode/skills/` and `.claude/skills/` as equivalent aliases).
`.claude-plugin/
plugin.json` is a *distribution* convenience for `claude --plugin-dir` installs, not a
claim that the skills only work there. **Verified: OpenCode** — live-audited
2026-09-08 (`022-cross-agent-skill-compat` T003), confirmed to auto-trigger a skill
from its `description` unmodified, tolerate the non-base-spec `when_to_use` key, and
sustain `start`'s one-question-at-a-time write-as-you-go interview across a full
phase. **Not yet audited: Cursor, Codex CLI** — see `022-cross-agent-skill-compat`.

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
  Q&A that asks which worker CLI(s) to use and writes `.specloop/loop.config.json`.
  The loop folder's static config already exists from `start`; this step fills in
  the rest. Nothing to install or link — there is no orchestrator package.
- **Loop Skill** (`002`, `skills/loop/`): the only way to actually run the loop. The
  chat session running it is the master — see `002-loop-orchestrator`'s Fixed rule
  below and that spec's own files for the full contract.
- **Status Skill** (`009`, `skills/status/`): read-only, standalone (no dependency on
  `.specloop/loop.config.json` existing). Reports the roadmap's state — active
  spec(s), task counts, `blocked`/`interrupted` rows, next-suggested-action per
  spec, and any `Stage`/`Status` drift — as a chat summary, and writes a static,
  self-contained `planning/dashboard.html` (regenerated fully each run; no
  server/watcher, by the same no-standalone-process reasoning below).
- **No hooks of its own yet** — defined per target repo, not shipped by the plugin.

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
  silently dropped. When the user is genuinely unsure rather than declining (`016`),
  the engine judges whether the dimension is researchable (a technical/stylistic
  choice — search for current options, or say so and use the model's own knowledge if
  no web-search tool is available) or not (a fact about the user's own project —
  ask a narrower question instead of manufacturing options); either way it never
  infers a choice to close the dimension.
- **A change to a cross-cutting mechanism must be reflected everywhere it's
  documented or checked, not just the file most directly touched.** The interview
  contract, the checklist grammar and similar mechanisms are each described in
  several places at once — a skill's `SKILL.md` instructions, `question-bank.md`,
  this file's own summary, and a `scripts/check-skill-consistency.mjs` guard. Editing
  one without the others is exactly how `001`'s Phase E gap (`T033`) happened. When a
  spec adds or changes one of these, update every place that names it in the same
  change.
- `roadmap.md` is always an index table (ID | Plan | Status | Depends on | Stage |
  Priority) and **carries no other content** — no prose history, no separate ordering
  list. Without this, an agent dropped into the repo has no idea what's next, and
  shouldn't have to read anything else to find out. The row parser reads the first
  four cells (`ID`/`Plan`/`Status`/`Depends on`) positionally and ignores trailing
  ones, so the table can gain columns without breaking every existing row — `Stage`
  and `Priority` exist only as those trailing, code-ignored cells. Any rationale
  behind a row's dependencies or ordering belongs in that spec's own
  `requirements.md`/`design.md`, or `planning/handoff.md` for a point-in-time note —
  never duplicated into the index, which is exactly what went stale before (`015`
  T015/T019/T020, 2026-09-12).
- **`Stage`** (`requirements` · `design_closed` · `tasks_ready` · `looping`, `—` once
  `done` or never tracked) records which skill a spec needs next. Unlike `Status`, it
  has no single writer: each pipeline skill sets it exactly once, at its own
  transition, and never touches another spec's row — `specloop:start` on writing a
  real `requirements.md`, `specloop:design-closing` on closing design,
  `specloop:task-breakdown` on producing real tasks, `specloop:loop` on starting
  execution **and again on rolling a spec's `Status` up to `done`, in the same edit,
  resetting `Stage` to `—`** (found stuck at `looping` after a `done` roll-up during
  `018`'s live verification, 2026-09-13 — see `planning/fix/002-stage-not-reset-on-done`).
- **`Priority`** is a live, human-edited ordering number — lower runs before higher
  among specs `Depends on` doesn't already order. Edited directly to reorder; no
  separate "build order" text to keep in sync. `—` means the spec predates the
  convention or was deliberately left unranked as order-independent (`019`).
  `skills/loop` breaks ties on it.
- **`tasks.md` is a GFM checkbox list, not a table** (`020-checklist-task-format`):
  `- [ ] T001 [agent] [status:todo] <task>`, with an optional indented note line
  directly below (`      └─ <note>`) replacing the old `Notes` cell. The checkbox
  reflects `done` vs. not; `[status:...]` carries the other 4 states. A task line is
  identified only by starting at column 0 — never by counting delimiters across the
  line, which is what made the old pipe table breakable by an unescaped `|` in a
  task's own text. `skills/loop/SKILL.md` holds the grammar (no code backs it — the
  skill's own text is authoritative); a write touches only the checkbox/status/note
  substrings, leaving the owner tag and description untouched. IDs are
  zero-padded (`T001`), matching GitHub spec-kit's own convention — chosen
  deliberately so the format reads as industry-familiar, not a specloop invention,
  while keeping the owner/status distinction spec-kit has no equivalent for.
- **The `Plan` cell must be byte-identical to its folder's post-`NNN-` segment** —
  it's how `skills/loop` builds a spec's directory path (`planning/specs/<id>-<name>/`).
- **The roadmap's `Status` column has exactly one writer**: `skills/loop`, which
  rolls it up from the spec's `tasks.md` when the spec's runnable tasks are exhausted.
  Without a writer the column goes stale and the loop pins itself to a spec
  that will never complete.
- The loop (spec 002) is **CLI-agnostic** (not tied to Claude Code's
  native `Workflow` tool): it must be able to invoke `claude`, `codex`, `opencode`, or
  another CLI, configurable per repo/run.
- **Every worker must get project context through its prompt**, not through ambient
  cwd: the prompt names the spec directory and the `contextFiles` to read before
  working. Relying on a CLI auto-loading a memory file works for `claude` only, and
  silently gives non-Claude workers no knowledge of the project's stack, conventions or
  styles. Implemented in `skills/loop/SKILL.md`'s Phase 3 (`014`).
- **No visual terminals, no standalone process at all.** The loop runs entirely
  inside the chat session running `skills/loop` — it runs every task inline,
  sequentially, in that same conversation. No detached windows, no split panes,
  nothing else opened for the user to watch, and no separate script or CLI either.
  **Reversed 2026-09-11 (split panes) and 2026-09-12 (the standalone CLI
  itself)**: an earlier design spawned a detached child per task in a live split
  pane (`windowsTerminal`/`tmux`), confirmed working end-to-end (`006` T012), then
  dropped by explicit user decision after watching it live. A separate
  deterministic Node CLI (`framework/orchestrator/`) shipped alongside the
  interactive skill after that, then was itself retired once the user clarified
  the loop should only ever run as a chat session — see
  `002-loop-orchestrator/design.md` and `requirements.md`'s history.
- **Safe stop**: the user says so, in the same conversation — stop, do not start a
  new task, mark the task in progress as `interrupted` in its `tasks.md`, report
  where it stopped. No stop-flag file or PID registry needed: there's no detached
  process to signal, the conversation itself is what would need to keep going.
- **Quota-exhaustion handling is judgement, not a regex.** `skills/loop/SKILL.md`
  is the chat session that *is* the master: it reads a worker's output itself,
  judges success/failure/quota-exhaustion with real judgement (no regex), and
  asks the user directly in the conversation which configured worker to
  switch to on a suspected usage/rate-limit hit. A first attempt put a regex
  heuristic and a blocking prompt into a standalone script, reasoning "the
  master always holds the terminal" — corrected once it became clear "the
  master" is meant to be a chat session, not a script; the script itself was
  later retired entirely. See `002-loop-orchestrator/design.md`.
- **A skill's own harness takes priority over a worker CLI of the same
  provider — always, whenever it's available.** `skills/loop`'s Phase 3: when
  the harness running the skill matches a task's configured worker's
  provider and offers a native way to hand off work to a sub-agent, use
  that, before ever falling back to a CLI subprocess for that task. A CLI
  subprocess is the fallback for a *different* provider, or a harness with
  no native mechanism — never the default when the native path is available.
  Phrased generically so it holds under any compatible harness, not
  Claude-Code-only (matches the Container section's open-format rule). This
  is true of the loop generally, not just this one rule: the master is any
  compatible harness's chat session, never Claude specifically.
  **Live-verified under Claude Code (`024`, 2026-09-12)**: the native path
  fired correctly for a matching-provider worker, real CLI subprocesses
  fired correctly for a different one — see that spec's `tasks.md`. Found
  live: the native path is asynchronous (dispatch, then a completion
  notification), not a live stream — `skills/loop`'s Phase 3/4 account for
  this explicitly.
- **`test/` and `.specloop/` are local-only and never committed** (both gitignored).
  `test/` holds throwaway repos used to exercise the interview and the skills
  end-to-end; `.specloop/` holds per-run loop state (`loop.config.json`, `logs/`,
  the `interview.md` ledger). Nothing committed — skills, docs, examples, or specs —
  may assume either exists on origin; references to fixture runs must say they are
  local-only.
- **`planning/dashboard.html` is the one generated artifact that *is* committed**,
  by deliberate exception to the rule above (decided 2026-09-13): it's this repo's
  own real `specloop:status` output, kept as live example/demo material —
  candidate showcase content for `019-public-showcase`'s README work — not
  per-run throwaway state. It will go stale the moment the roadmap changes again;
  re-running `specloop:status` regenerates it. Don't assume a *target* repo's copy
  is committed just because this repo's is — that stays each project's own call.
- **Any machine-read value a skill writes into a scaffolded file uses the industry-
  standard code, never a spelled-out label, and every file is UTF-8 without a BOM.**
  Found inconsistent 2026-09-13 (`018` live verification): one fixture's
  `loop.config.json` wrote `"language": "Spanish"`, another wrote `"es"` for the same
  dimension — both pass today because no format was ever specified. Resolved: BCP 47
  (in practice its ISO 639-1 two-letter subtag for a plain language, e.g. `"es"`,
  `"pt"` — no region/script subtag unless the project actually needs one), lowercase,
  matching how `Intl`/most JS tooling already reads a language tag. UTF-8 without BOM
  follows RFC 8259 (JSON MUST be UTF-8; a leading BOM MUST NOT be added) and applies
  by extension to every other scaffolded file, not just `.json` ones. See
  `planning/fix/001-language-field-format`. Applies the next time a skill introduces
  a new coded field, not just to `language` — a country, currency, or similar code
  gets its own standard body's format, not a name.

## Resolved

- Plugin name: `specloop` (`.claude-plugin/plugin.json`).
- Skill frontmatter stays to `name`/`description`/`when_to_use` — no Claude-Code-only
  execution-mode fields (the earlier `context`/`background` flags were removed, see
  `001` T32/`002` T19/`003` T10/`004` T12). `when_to_use` is additive beyond the base
  Agent Skills spec's fields (`name`/`description`/`license`/`compatibility`/
  `metadata`); whether every target harness tolerates an unrecognized frontmatter key
  is exactly what `022-cross-agent-skill-compat`'s audit needs to confirm, not assumed
  here.
- **`planning/fix/`** (`023-fix-log`) — a flat, hand-authored log for anything a
  developer finds wrong after the fact, parallel in spirit to `planning/specs/` but
  not in shape: one `report.md` per numbered entry (`planning/fix/NNN-name/report.md`),
  naming the `Scope` (which spec caused it) and what changed — no requirements/design/
  tasks pipeline, and nothing in the loop/roadmap reads it. See `023`'s design for why.
- The loop has no console command and nothing to install — `specloop:loop` is the
  entire runtime, run inside whichever chat session invokes it. (An earlier
  Node.js/TypeScript CLI, run via `tsx` and linked onto PATH by `loop-setup`,
  existed and was retired 2026-09-12 — see `002-loop-orchestrator`'s history.)
- Per-target-repo config file: `.specloop/loop.config.json` (`workers` — an array of
  `{cli, args}`, round-robined by task order when there's more than one, and also
  where a quota-exhaustion worker switch can land — plus `logDir`, `contextFiles`) —
  written by `skills/start`'s and `skills/loop-setup`'s guided Q&A, never
  hand-authored or hardcoded. A file still in the legacy single
  `workerCli`/`workerArgs` shape is read by `skills/loop` as equivalent to a
  one-element `workers` array — there's no load-time normalization code
  anymore, `skills/loop`'s own text says to treat it that way. See
  `002-loop-orchestrator/design.md`.

- **A non-software e2e fixture is built against a declared fictional persona, not a
  second real project** (`017`) — run local-only under the gitignored `test/` dir,
  where the fixture's own notes state this plainly. It proves the type-branching
  logic (no software question fires, headers/phrasing are type-appropriate), not
  interview bearability for a real user, which stays
  `001` T30 / `006` T10's human-only job.

## Still to define

- Optional subagents (stack research, etc.).
- Multi-spec parallelism (see `002-loop-orchestrator/design.md`'s open questions).

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
| Auto-*running* the loop, or folding `loop-setup`'s worker-CLI Q&A, as a side effect of `specloop:start` | Actually starting the loop is always the user's explicit call, regardless of whether there's anything to install (there no longer is — see the row below). Scaffolding the loop folder's *static* files in `start` is fine and is what happens (see `002`). Design-closing and task-breakdown likewise stay separate, deliberate per-spec steps — a repo can sit at requirements-only for a while. |
| Building the orchestrator on top of `opencode-orchestrator` (a separate, earlier repo solving a similar problem) | Reviewed and discarded as a base — author doesn't like how it's built. Recycling specific pieces may be evaluated later; see `002-loop-orchestrator/requirements.md`'s Notes. |
| `.claude-plugin/marketplace.json` listing | Not needed for a plugin installed via `--plugin-dir` or a direct repo checkout; revisit only if distributing through a plugin marketplace becomes a goal (`005-open-source-release/requirements.md`). |
| Formal governance docs beyond `CONTRIBUTING.md`/`SECURITY.md` (code of conduct, CODEOWNERS) | Still a personal project with no active external contributors; revisit only if that changes. |
| A cross-agent HTTP-based update-notifier embedded in the plugin (checking a remote manifest, prompting on stale installs) | Proportional to a widely-distributed, unknown-install-base product. specloop is installed by one person via `git pull`/`--plugin-dir` — that already *is* the update mechanism. `CHANGELOG.md` covers "what shipped"; nothing more is needed at this scale. |
| `skills/start` scaffolding `README.md`, `CONTRIBUTING.md`, `LICENSE` or CI config into the target repo | These are project deliverables, not roadmap/loop infrastructure: if a target project needs one, the roadmap decides it as a spec like any other. Note this does **not** extend to `CLAUDE.md`, `AGENTS.md`, `planning/styles.md` or `.specloop/` — those are the context channel the loop's own workers read, so the plugin owns them. |
| A standalone script or CLI (in any language/runtime) as a way to run the loop, deterministic or otherwise | 2026-09-12. Tried as `framework/orchestrator/`'s `loop run`/`loop stop`/`loop status` (Node/TypeScript), shipped alongside `skills/loop`, then retired: the user's actual intent was never "a script is the master," it's "I open a chat, and that chat is the master" — a plain script has no chat to ask a quota-exhaustion question in, and an unattended run has nobody to answer it regardless. `skills/loop` is the only way to run the loop now, under any compatible harness. See `002-loop-orchestrator`. |
| Adopting GitHub spec-kit's `tasks.md` wholesale (checkbox-only, grouped by user-story phase, no owner concept) | 2026-09-05. Spec-kit has no agent/human distinction and no 5-state status — everything is assumed agent-executable. Adopting it as-is would drop `nextRunnableTask`/`pendingHumanTasks`, the exact mechanism that makes the loop safe to leave unattended. `020-checklist-task-format` borrows the checkbox *convention* (industry-familiar, GitHub-rendered) but keeps the owner/status tags spec-kit doesn't have. |
| Automatic bidirectional spec-kit `spec.md`/`plan.md` <-> `requirements.md`/`design.md` conversion | 2026-09-05. spec-kit's `spec.md` is organized by P1/P2/P3 user story with no equivalent of specloop's flat requirements + acceptance criteria shape, and spec-kit has no central roadmap/index to map `roadmap.md` onto. A one-off manual translation remains possible if ever needed; no permanent dual-format reader is planned. |
