# 022 — cross-agent-skill-compat

## What's being built

Raised alongside `020`: "just as the loop orchestrator is CLI-agnostic, the plugin
itself should be too." Researched 2026-09-05 before committing to a design — the
finding changes the shape of the work:

**Agent Skills (`SKILL.md`) is now an open, cross-tool standard**, not a Claude Code
invention. Cursor, Codex CLI, Gemini CLI, GitHub Copilot, OpenCode, Windsurf and Goose
all read it natively — several (OpenCode confirmed) via the vendor-neutral
`.agents/skills/<name>/SKILL.md` discovery path, equally reachable via
`.opencode/skills/` or `.claude/skills/` as aliases, the same shape specloop's
`skills/` folder already matches. That means
the actual content of `skills/start`, `skills/design-closing`, `skills/task-breakdown`,
`skills/loop-setup` is likely *already* far more portable than the repo's "Claude Code
Plugin" framing suggested. `planning/architecture.md`'s Container section and
`planning/product.md`'s opening are updated now to say so.

**Reserved for later, per explicit instruction — not designed or implemented in this
pass:**

- A full cross-tool audit: actually install and trigger each skill in at least Cursor,
  Codex CLI, and OpenCode, and confirm each auto-selects the right skill from its
  `description`, not just that the file is discoverable.
- Frontmatter tolerance: confirm every target harness ignores the non-base-spec
  `when_to_use` field gracefully rather than choking on an unrecognized key (the base
  Agent Skills spec's optional fields are `license`/`compatibility`/`metadata`, not
  `when_to_use`).
- An install path for a tool that doesn't read `.claude-plugin/plugin.json` at all —
  likely means documenting (or scripting) a copy of `skills/` into whatever directory
  that tool scans — `.agents/skills/` first, `.opencode/skills/` and `.claude/skills/`
  named as equivalent aliases, or a global equivalent — since specloop's own `skills/`
  folder already matches the shape
  those paths expect.
- Whether `skills/start`'s "recommends Claude Code skills" step (Phase 2) needs
  generalizing for a non-Claude-Code target environment, or stays as-is since it's
  about what the *target project* installs, not about specloop's own mechanism.
- Whether `.claude-plugin/plugin.json` should gain a non-Claude-Code counterpart
  manifest, or whether "no manifest needed, just the `skills/` folder" is sufficient
  for every other tool (per the base spec, no manifest is required — registration is
  the frontmatter itself).

**Amended 2026-09-19 — scope widened from three harnesses to every CLI on the roster
below.** The three-harness audit above (Cursor, Codex CLI, OpenCode) is superseded by
this roster, drawn from the official Agent Skills adopters list (agentskills.io) and
filtered to clients that can be driven from a terminal. Non-CLI clients on that list
(IDE extensions, desktop apps, cloud platforms) stay out — see Out of scope.

- **Already audited:** Claude Code, OpenCode (`T003`), Codex CLI (`T002`, agent-driven
  run recorded 2026-09-19).
- **High-usage:** Cursor (`cursor-agent`), Antigravity CLI (`agy`, Google's
  replacement for Gemini CLI).
- **Open-source terminal agents:** Hermes Agent, Workshop.
- **Commercial:** GitHub Copilot.

Every roster entry is audited against the same four-dimension matrix, and ends in one of
two final states only: `verified` or `discarded` (with a stated reason).

## Who/what it serves

Anyone using specloop from a coding agent other than Claude Code — currently
undocumented and unverified, despite the underlying format likely already supporting
it.

## Hard constraints

- **Don't claim more than is verified.** This spec exists precisely because the repo
  should not assert cross-tool compatibility it hasn't tested — see `CLAUDE.md`'s
  "don't assert a rule the code doesn't honor" rule. Positioning language says "the
  format is open and likely portable, parity is unaudited," not "works everywhere."
- Any concrete change (install path, manifest, frontmatter trim) must not break the
  existing `claude --plugin-dir` install path — additive, not a replacement.
- `skills/start`'s guided-Q&A nature (one question at a time, write-as-you-go) must
  survive in any other harness that runs it — a harness that can't hold a multi-turn
  Q&A loop the way Claude Code does may not be able to run `start` at all, and that
  limitation should be documented, not silently papered over.

## Acceptance criteria

*(To be made concrete at design time — not yet designed.)*

- At least one non-Claude-Code harness (Cursor, Codex CLI, or OpenCode) successfully
  discovers and triggers a specloop skill from its own `description`-matching, without
  modifying the skill's frontmatter.
- A documented (or scripted) install path exists for a harness that doesn't read
  `.claude-plugin/plugin.json`.
- `planning/architecture.md`'s Container section is updated from "unaudited" to
  naming exactly which harnesses were verified and how.

*Added by the 2026-09-19 amendment (the three criteria above were met at first close;
these extend, not replace, them):*

- Every roster harness ends in exactly one final state: `verified` (passes the four
  audit dimensions in `design.md`) or `discarded` (with a stated reason — no CLI, no
  skills support, or not obtainable/runnable here). `documented` — the harness's own
  official docs confirm where it scans for skills — is an interim state only and never
  a valid place to stop.
- A single support-matrix table lives in `README.md`'s `## Install`, one row per roster
  harness with its final (or current, while open) state and a pointer to its evidence.
  It is the only place per-harness state is listed; `planning/architecture.md`'s
  Container section points to it instead of repeating names.
- Nothing is labelled `verified` on documentation alone — only on a run of the four
  dimensions, per the existing "don't claim more than is verified" constraint.

## Out of scope

- Rewriting the loop orchestrator's execution model — it's already CLI-agnostic
  (`workers[]`), unaffected by this spec.
- `021-harness-worker-backend` (a different concern: execution backend, not skill
  discovery/invocation) — retired 2026-09-12 once `skills/loop` covered the same
  goal directly (see `002-loop-orchestrator`).
- Building a universal installer/CLI for specloop across every tool — start from
  documentation of what already works, per the audit above, before building tooling
  around it.
- Clients on the official adopters list that aren't driven from a terminal — IDE
  extensions, desktop apps, cloud/platform agents (e.g. VS Code, Roo Code, Trae,
  Mux, Emdash, Databricks, Snowflake). Only CLI-capable ones are audited here.
- Goose and Windsurf: named in the original research but not in the groups chosen for
  this amendment; add them through a further `specloop:amend` if wanted.
- Factory (Droid) and Amp — removed from the roster 2026-09-19: both are paid-only with
  no free path found (Factory: cheapest plan $20/month, no documented trial; Amp: free
  tier closed to new signups, pay-as-you-go from $5), so they can't be tested here.
  Removed rather than `discarded` at the user's direction; re-add through an amendment
  if access ever exists.
- Kiro and nanobot — removed from the roster 2026-09-19 at the user's direction, as not
  practically testable: Kiro's free tier only works interactively (API-key/headless auth
  is paid-only) and no Windows install was found; nanobot only scans a global
  `~/.nanobot/workspace/skills/`, with no per-project directory to isolate a fixture in.
  Re-add through an amendment if that changes.
- Tabnine — removed from the roster 2026-09-19 at the user's direction: its CLI needs
  a team admin to enable Tabnine Agents and an installer host (`TABNINE_HOST`) from a
  team/enterprise deployment, sits on a paid plan (~$59/user/month, per third-party
  sources) with no personal signup path found, and no headless flags were found in its
  docs. Re-add through an amendment if a team account ever exists.
- Gemini CLI — replaced on the roster by Antigravity CLI 2026-09-19 at the user's
  direction: on 2026-06-18 Google stopped serving Gemini CLI to free, Google AI Pro and
  Ultra users (per Google's own announcement it stays available to enterprise licences
  and paid API keys), so it can't be used here without a paid key. Antigravity CLI is
  Google's successor.
- Mistral Vibe, pi, Autohand Code CLI, Deep Code, Letta Code and Junie — removed from the roster
  2026-09-19 at the user's direction. Each was installed and passed a startup smoke test
  (`--version`, `--help`), then uninstalled because each needs its own account or API key
  and the owner won't test them. Their install/auth notes stay in the owner's personal
  harness guide; re-add through an amendment if that changes.
- Any harness not on the roster above; the roster only grows or shrinks through an
  amendment.

## Dependencies

`001` (per `planning/roadmap.md`'s `022` row).

## Owner split

(none stated)
