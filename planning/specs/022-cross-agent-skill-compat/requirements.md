# 022 — cross-agent-skill-compat

## Priority: 5

## What's being built

Raised alongside `020`: "just as the loop orchestrator is CLI-agnostic, the plugin
itself should be too." Researched 2026-09-05 before committing to a design — the
finding changes the shape of the work:

**Agent Skills (`SKILL.md`) is now an open, cross-tool standard**, not a Claude Code
invention. Cursor, Codex CLI, Gemini CLI, GitHub Copilot, OpenCode, Windsurf and Goose
all read it natively — several (OpenCode confirmed) via the exact same
`.claude/skills/<name>/SKILL.md` discovery path specloop already produces. That means
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
  that tool scans (`.claude/skills/`, `.opencode/skills/`, `.agents/skills/`, or a
  global equivalent), since specloop's own `skills/` folder already matches the shape
  those paths expect.
- Whether `skills/start`'s "recommends Claude Code skills" step (Phase 2) needs
  generalizing for a non-Claude-Code target environment, or stays as-is since it's
  about what the *target project* installs, not about specloop's own mechanism.
- Whether `.claude-plugin/plugin.json` should gain a non-Claude-Code counterpart
  manifest, or whether "no manifest needed, just the `skills/` folder" is sufficient
  for every other tool (per the base spec, no manifest is required — registration is
  the frontmatter itself).

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

## Out of scope

- Rewriting the loop orchestrator's execution model — it's already CLI-agnostic
  (`workers[]`), unaffected by this spec.
- `021-harness-worker-backend` (a different concern: execution backend, not skill
  discovery/invocation).
- Building a universal installer/CLI for specloop across every tool — start from
  documentation of what already works, per the audit above, before building tooling
  around it.
