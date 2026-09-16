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
  `AGENTS.md`. Directly invoked, it stops before task-breakdown — `033`'s
  `specloop:advance` is the one caller allowed to chain past that stop.
- **Task-breakdown Skill** (`003`, `skills/task-breakdown/`): run separately per spec
  once its `design.md` is closed, drafts + confirms + writes `tasks.md`, marking each
  task agent-runnable or human-only.
- **Advance Skill** (`033`, `skills/advance/`): chains `design-closing` then
  `task-breakdown` per spec, for every spec still short of `tasks_ready` — deriving
  their Q&A answers from the interview's own answers rather than re-asking, showing
  the real draft for a yes/changes/defer, and asking live only when a question
  genuinely can't be inferred. Auto-chained from `start`'s Phase 8 right after the
  interview, and separately re-invocable later to pick up deferred specs.
  `design-closing`/`task-breakdown` themselves are unchanged and still directly
  invocable on a single spec.
- **Amend Skill** (`012`, `skills/amend/`): revises an existing spec's
  `requirements.md` and/or reopens its closed `design.md`, refusing outright if any
  task is `[status:in_progress]` and requiring an explicit confirm before touching
  closed content. Reuses `start`'s and `design-closing`'s own Q&A by reference rather
  than duplicating it, and flags (never auto-fixes) a `tasks.md` gone stale from the
  change. Deliberately invoked only, never chained from another skill or the loop.
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
- **Fix Skill** (`027`, `skills/fix/`): the only supported way to author a new
  `planning/fix/` entry — quick-capture, not a guided interview — computes the next
  `NNN`, asks scope/found/status/fix, writes one `planning/fix/NNN-name.md` entry.
  Deliberately invoked, never chained from another skill or the loop.
- **No hooks of its own yet** — defined per target repo, not shipped by the plugin.

## Fixed rules

- The folder structure scaffolded in the target repo is the same one documented by
  `planning/roadmap.md` in this repo (dogfooding): `CLAUDE.md`, `AGENTS.md`,
  `planning/product.md`, `planning/architecture.md`, `planning/roadmap.md`,
  `planning/specs/NNN-name/{requirements,design,tasks}.md`, `planning/styles.md`,
  and `.specloop/` (`loop.config.json`, `logs/`, `interview.md`).
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
  this file's own summary, and a `scripts/check-skill-consistency.mjs` guard. When a
  spec adds or changes one of these, update every place that names it in the same
  change (`001` T033 is why this rule exists).
- `roadmap.md` is always an index table (ID | Plan | Status | Depends on | Stage |
  Priority) and **carries no other content** — no prose history, no separate ordering
  list. Without this, an agent dropped into the repo has no idea what's next, and
  shouldn't have to read anything else to find out. The row parser reads the first
  four cells (`ID`/`Plan`/`Status`/`Depends on`) positionally; a parser written
  before a later column existed safely ignores it, which is how `Stage` and
  `Priority` were added as trailing cells without breaking every existing row.
  **Neither is cosmetic**: both are actively read and used today —
  `skills/loop`'s Phase 1 reads `Stage` and `Priority` at positions 5 and 6, for
  the in-progress-resume check and the lowest-`Priority`-wins tiebreak. Any
  future trailing column stays safely ignored only until some skill is
  deliberately updated to read it, same as happened here. Any rationale
  behind a row's dependencies or ordering belongs in that spec's own
  `requirements.md`/`design.md`, or `planning/handoff.md` for a point-in-time note —
  never duplicated into the index. See `015` T015/T019/T020 for what went stale
  before this rule.
- **`Stage`** (`requirements` · `design_closed` · `tasks_ready` · `looping`, `—` once
  `done` or never tracked) records which skill a spec needs next. Unlike `Status`, it
  has no single writer: each pipeline skill sets it exactly once, at its own
  transition, and never touches another spec's row — `specloop:start` → `requirements`,
  `specloop:design-closing` → `design_closed`, `specloop:task-breakdown` →
  `tasks_ready`, `specloop:loop` → `looping` on starting execution, **and again → `—`
  when it rolls a spec's `Status` up to `done`, in the same edit**. See
  `planning/fix/002-stage-not-reset-on-done` for why that last transition is called
  out explicitly.
- **`Priority`** is a live, human-edited ordering number — lower runs before higher
  among specs `Depends on` doesn't already order. Edited directly to reorder; no
  separate "build order" text to keep in sync. `—` means the spec predates the
  convention or was deliberately left unranked as order-independent (`019`).
  `skills/loop` breaks ties on it.
- **`tasks.md` is a GFM checkbox list, not a table** (`020-checklist-task-format`):
  `- [ ] T001 [agent] [status:todo] <task>`, with an optional indented note line
  directly below (`      └─ <note>`) replacing the old `Notes` cell. The checkbox
  reflects `done` vs. not; `[status:...]` carries the other 4 states. A task line is
  identified only by starting at column 0, never by counting delimiters across the
  line — see `020`'s requirements for why the old pipe table couldn't make that
  guarantee. `skills/loop/SKILL.md` holds the grammar (no code backs it — the
  skill's own text is authoritative); a write touches only the checkbox/status/note
  substrings, leaving the owner tag and description untouched. IDs are zero-padded
  (`T001`), matching GitHub spec-kit's own convention — industry-familiar, not a
  specloop invention, while keeping the owner/status distinction spec-kit lacks.
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
  inside the chat session running `skills/loop` — every batch of independent
  tasks runs as its own concurrent sub-agents, inline, in that same conversation
  (batching added 2026-09-14; before that, strictly one task at a time). No
  detached windows, no split panes, no separate script or CLI. Reversed twice
  (split panes, then the standalone CLI that briefly replaced them) after each
  was actually built and confirmed working — see `002-loop-orchestrator/
  design.md`'s own history section for both reversals. **Scope note
  (2026-09-14): this governs the loop's own execution model** — who makes
  runtime decisions requiring real judgment (eligibility, batching, quota
  calls) — not scripts in general. A different skill may still ship a small,
  deterministic helper script for a bounded, judgment-free sub-task; see
  `030-dashboard-build-script`.
- **Safe stop**: the user says so, in the same conversation — stop, do not start
  new work, mark whichever task(s) are in progress as `interrupted` in their
  `tasks.md` (more than one, if a batch was running), report where it stopped.
  No stop-flag file or PID registry needed: there's no detached process to
  signal, the conversation itself is what would need to keep going.
- **Quota-exhaustion handling is judgement, not a regex.** `skills/loop/SKILL.md`
  is the chat session that *is* the master: it reads a worker's output itself,
  judges success/failure/quota-exhaustion with real judgement (no regex), and asks
  the user directly which configured worker to switch to on a suspected
  usage/rate-limit hit. See `002-loop-orchestrator/design.md`'s own history section
  for the regex-in-a-script attempt this replaced.
- **The loop always runs under its own master's provider — never round-robins
  across the other configured workers.** `skills/loop`'s Phase 3 picks, once
  per batch, whichever `config.workers` entry's `cli` matches the harness
  actually running the skill, and prefers that harness's own native
  sub-agent mechanism over a CLI subprocess whenever one's available. A CLI
  subprocess is the fallback for a harness with no native mechanism, or an
  explicit user-directed exception (e.g. on a suspected usage limit) — never
  the default, and never a way to split load across several configured
  providers within one run. The rest of `config.workers` exists for
  portability (a different session, under a different harness, finds its
  own matching entry in the same file), corrected 2026-09-14 — an earlier
  version of this rule round-robinned across every configured worker by task
  order regardless of which harness was running, which wasted the native
  path on every task that didn't happen to round-robin onto the matching
  entry. Phrased generically so it holds under any compatible harness, not
  Claude-Code-only (matches the Container section's open-format rule); the
  master is any compatible harness's chat session, never Claude specifically.
  Live-verified under Claude Code (`024`) — including the finding that the native
  path is asynchronous (dispatch, then a completion notification), not a live
  stream, which `skills/loop`'s Phase 3/4 account for. See `024`'s `tasks.md` for
  the full observed-result table.
- **Independent tasks within a batch run as parallel sub-agents; tasks that
  share a file/section, or whose independence is unclear, run one at a
  time.** `skills/loop`'s Phase 2 builds a batch from consecutive runnable
  tasks only while each new one is free of both a `design.md`-stated
  ordering and any file/section overlap with the rest of the batch — added
  2026-09-14, never guessed when unclear. Across specs, the loop keeps
  picking the next eligible spec automatically once one resolves, rather
  than stopping after each — unless the user named one specific spec, in
  which case it stops there and reports instead of moving on.
- **Cross-provider dispatch to a different spec is always explicit, never
  inferred.** The master only ever runs its own assigned work through its
  own matched provider — but the user can separately, explicitly name a
  *different* spec/task **and** a *different* configured provider to run
  alongside it (e.g. "do `007` yourself, send `008` to `codex`") — added
  2026-09-14. The master dispatches that as a background subprocess and
  keeps working its own pick in the meantime; this is genuine cross-spec
  parallelism across providers, not the quota-suspicion fallback (which
  stays reactive and still asks first) and not a way to offload the
  master's *own* work faster without being asked.
- **`test/` is local-only and never committed** (gitignored) — it holds throwaway
  repos used to exercise the interview and the skills end-to-end. Nothing
  committed — skills, docs, examples, or specs — may assume it exists on origin;
  references to fixture runs must say they are local-only.
- **`.specloop/` is committed, except its `logs/` subdirectory.** `loop.config.json`
  (`workers`/`logDir`/`contextFiles`/`language`) is the project's tracked loop
  default — a real starting point anyone can see and override locally, not
  something reinvented per session — and `interview.md` is the resumable
  interview ledger, both written by `skills/start`. Only `.specloop/logs/`
  (per-run worker logs) stays untracked, via `.specloop/.gitignore` (written by
  `skills/start`, not the repo root's). Corrected 2026-09-14: this rule
  previously claimed the whole folder was gitignored, which never matched what
  `skills/start` Phase 1 actually scaffolds (`.specloop/.gitignore` containing
  only `logs/`) — see `planning/handoff.md`.
- **`planning/dashboard.html` is the one generated artifact that *is* committed**,
  by deliberate exception to the rule above (decided 2026-09-13): it's this repo's
  own real `specloop:status` output, kept as live example/demo material —
  candidate showcase content for `019-public-showcase`'s README work — not
  per-run throwaway state. It will go stale the moment the roadmap changes again;
  re-running `specloop:status` regenerates it. Don't assume a *target* repo's copy
  is committed just because this repo's is — that stays each project's own call.
- **Every scaffolded file type has exactly one canonical header set**,
  collected here so it's not only implicit in whichever skill writes it:
  `requirements.md` → `## What's being built` / `## Who/what it serves` /
  `## Hard constraints` / `## Acceptance criteria` / `## Out of scope` /
  `## Dependencies` / `## Owner split` (`skills/start` Phase 7); `design.md`
  → `## Approach` / `## Deliverables` / `## Sequencing` / `## Open questions
  / deferred` (`skills/design-closing`); `tasks.md` → the checkbox grammar
  above (`020`); `planning/fix/NNN-*.md` → `## Scope` / `## Found` /
  `## Status` / `## Fix` / `## Date` (`skills/fix`). Each skill's own text
  stays the source of truth for *writing* its file type — this is a lookup
  index, not a duplicate. See `planning/styles.md`'s Code conventions for
  the heading-style rules (sentence case, never paraphrase a canonical
  header, one complete idea per section).
- **Any machine-read value a skill writes into a scaffolded file uses the
  industry-standard code, never a spelled-out label** (BCP 47 / lowercase ISO
  639-1 for language, e.g. `"es"` not `"Spanish"` — the same standard-body-format
  rule applies to the next coded field a skill introduces, country/currency
  included), **and every file is UTF-8 without a BOM** (RFC 8259). See
  `planning/fix/001-language-field-format` for the inconsistency this closed.

## Resolved

- Plugin name: `specloop` (`.claude-plugin/plugin.json`).
- Skill frontmatter stays to `name`/`description`/`when_to_use` — no Claude-Code-only
  execution-mode fields (the earlier `context`/`background` flags were removed, see
  `001` T32/`002` T19/`003` T10/`004` T12). `when_to_use` is additive beyond the base
  Agent Skills spec's fields (`name`/`description`/`license`/`compatibility`/
  `metadata`); whether every target harness tolerates an unrecognized frontmatter key
  is exactly what `022-cross-agent-skill-compat`'s audit needs to confirm, not assumed
  here.
- **`planning/fix/`** (`023-fix-log`, entry authoring moved to `specloop:fix` per
  `027`) — a flat log for anything a developer finds wrong after the fact, parallel
  in spirit to `planning/specs/` but not in shape: one flat file per numbered entry
  (`planning/fix/NNN-name.md`), naming the `Scope` (which spec caused it), a
  `Status` and what changed — no requirements/design/tasks pipeline, and nothing in
  the loop/roadmap reads it. See `023`'s design for why.
- The loop has no console command and nothing to install — `specloop:loop` is the
  entire runtime, run inside whichever chat session invokes it. (An earlier
  Node.js/TypeScript CLI, run via `tsx` and linked onto PATH by `loop-setup`,
  existed and was retired 2026-09-12 — see `002-loop-orchestrator`'s history.)
- Per-target-repo config file: `.specloop/loop.config.json` (`workers` — an array of
  `{cli, args}`; the loop always picks whichever entry matches its own running
  session, never round-robin, with the rest there for portability and as where a
  quota-exhaustion worker switch can land — plus `logDir`, `contextFiles`) —
  written by `skills/start`'s and `skills/loop-setup`'s guided Q&A, never
  hand-authored or hardcoded. A file still in the legacy single
  `workerCli`/`workerArgs` shape is read by `skills/loop` as equivalent to a
  one-element `workers` array — there's no load-time normalization code
  anymore, `skills/loop`'s own text says to treat it that way. See
  `002-loop-orchestrator/design.md`.
- **Python 3, standard-library only, is the implementation language for a skill's
  small, deterministic, judgment-free helper script** (`030-dashboard-build-script`)
  — `skills/status/scripts/build_dashboard.py` is the first and, as of `030`,
  the only such script; every other skill stays plain-text Skill instructions.
  Not a project-wide runtime dependency: scoped to `skills/status`'s own
  mechanical work (deterministic dashboard generation), per the Declined-table
  scope note on persisting a bounded helper script for a non-judgment sub-task.
  No `pip install` step, ever — a missing `python3` on `PATH` is a hard failure
  with a clear message, not a silent prose fallback.

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
| Auto-*running* the loop, or folding `loop-setup`'s worker-CLI Q&A, as a side effect of `specloop:start` | Actually starting the loop is always the user's explicit call, regardless of whether there's anything to install (there no longer is — see the row below). Scaffolding the loop folder's *static* files in `start` is fine and is what happens (see `002`). Design-closing and task-breakdown likewise stay separate, deliberate per-spec steps — a repo can sit at requirements-only for a while. **Scope note (2026-09-15):** that last sentence is superseded by `033-interview-to-loop-auto-continuation` (explicit user go-ahead, same conversation) — design-closing and task-breakdown running unattended per spec right after the interview, driven by decisions the interview already made, is being redesigned there, not declined. Only *auto-running `specloop:loop` itself* and *folding `loop-setup`'s Q&A into `start`* remain declined as stated. |
| Building the orchestrator on top of `opencode-orchestrator` (a separate, earlier repo solving a similar problem) | Reviewed and discarded as a base — author doesn't like how it's built. Recycling specific pieces may be evaluated later; see `002-loop-orchestrator/requirements.md`'s Notes. |
| `.claude-plugin/marketplace.json` listing | Not needed for a plugin installed via `--plugin-dir` or a direct repo checkout; revisit only if distributing through a plugin marketplace becomes a goal (`005-open-source-release/requirements.md`). |
| Formal governance docs beyond `CONTRIBUTING.md`/`SECURITY.md` (code of conduct, CODEOWNERS) | Still a personal project with no active external contributors; revisit only if that changes. |
| A cross-agent HTTP-based update-notifier embedded in the plugin (checking a remote manifest, prompting on stale installs) | Proportional to a widely-distributed, unknown-install-base product. specloop is installed by one person via `git pull`/`--plugin-dir` — that already *is* the update mechanism. `CHANGELOG.md` covers "what shipped"; nothing more is needed at this scale. |
| `skills/start` scaffolding `README.md`, `CONTRIBUTING.md`, `LICENSE` or CI config into the target repo | These are project deliverables, not roadmap/loop infrastructure: if a target project needs one, the roadmap decides it as a spec like any other. Note this does **not** extend to `CLAUDE.md`, `AGENTS.md`, `planning/styles.md` or `.specloop/` — those are the context channel the loop's own workers read, so the plugin owns them. |
| A live visual terminal (split-pane) so the user can watch a sub-agent work in its own window | 2026-09-11. Built (`windowsTerminal.ts`/`tmux.ts`), confirmed working end-to-end (`006` T012), then rejected by the user after watching it live — not worth the complexity for what it bought. See `002-loop-orchestrator/design.md`'s "No split panes" section. |
| A regex heuristic (over captured CLI output) to detect quota/rate-limit exhaustion, run from a standalone script | 2026-09-11. Reasoned "the master always holds the terminal now" — a hole, since "the master" was never meant to be a plain script. Replaced by a chat session reading a worker's output itself and judging with real judgement. See `002-loop-orchestrator/design.md`'s "Quota exhaustion" section. |
| A standalone script or CLI (in any language/runtime) as a way to run the loop, deterministic or otherwise | 2026-09-12. Tried as `framework/orchestrator/`'s `loop run`/`loop stop`/`loop status` (Node/TypeScript), shipped alongside `skills/loop`, then retired: the user's actual intent was never "a script is the master," it's "I open a chat, and that chat is the master" — a plain script has no chat to ask a quota-exhaustion question in, and an unattended run has nobody to answer it regardless. `skills/loop` is the only way to run the loop now, under any compatible harness. See `002-loop-orchestrator`. **Scope note (2026-09-14):** this is about the loop's own master/orchestration role — decisions needing real judgment (eligibility, batching, quota calls). It does not bar a different skill from persisting a small, judgment-free helper script for a bounded mechanical sub-task — see `030-dashboard-build-script`, where `skills/status`'s dashboard generation (pure data transformation, no decisions) moved into exactly that. |
| Making `planning/roadmap.md`'s `ID` column a clickable link to its spec folder (`028-clickable-roadmap-ids`, filed from GitHub issue #3) | 2026-09-16. Declined at design-closing, never built. Every link placement broke something: linking `ID` itself needs every positional parser (`skills/loop`, `skills/status`, `skills/start`'s seeding) to strip markdown-link syntax before reading the bare number it uses to build `planning/specs/<id>-<name>/`; linking `Plan` instead breaks the hard constraint that `Plan` stay byte-identical to the folder's name segment; and putting a new link column *before* `ID` shifts the "first four cells read positionally" contract that `Stage`/`Priority` also depend on. A safe trailing column (after `Priority`) was possible with zero parser risk, but `roadmap.md` is deliberately optimized for agents, not humans (see its own Fixed rule above) — the dashboard (`009`/`026`) exists precisely so a human gets a visual view instead, and the actual GitHub/phone-browsing use case this spec wanted turned out not to be served by either file as they stand today (the dashboard's own links only jump within its own page, and a static `.html` doesn't render live in GitHub's web UI without Pages). Superseded by `034-dashboard-github-pages`, which targets the real need — a live-viewable dashboard — without touching `roadmap.md` at all. |
| Adopting GitHub spec-kit's `tasks.md` wholesale (checkbox-only, grouped by user-story phase, no owner concept) | 2026-09-05. Spec-kit has no agent/human distinction and no 5-state status — everything is assumed agent-executable. Adopting it as-is would drop `nextRunnableTask`/`pendingHumanTasks`, the exact mechanism that makes the loop safe to leave unattended. `020-checklist-task-format` borrows the checkbox *convention* (industry-familiar, GitHub-rendered) but keeps the owner/status tags spec-kit doesn't have. |
| Automatic bidirectional spec-kit `spec.md`/`plan.md` <-> `requirements.md`/`design.md` conversion | 2026-09-05. spec-kit's `spec.md` is organized by P1/P2/P3 user story with no equivalent of specloop's flat requirements + acceptance criteria shape, and spec-kit has no central roadmap/index to map `roadmap.md` onto. A one-off manual translation remains possible if ever needed; no permanent dual-format reader is planned. |
