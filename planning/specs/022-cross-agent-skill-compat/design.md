# 022 — cross-agent-skill-compat — Design

## Approach

The 2026-09-05 research already established that Agent Skills is an open format and
repositioned `planning/architecture.md`/`planning/product.md` accordingly. What's left
is the four items `requirements.md` reserved, decided here:

**1. Audit matrix.** Live-test in Cursor, Codex CLI, and OpenCode (the three named in
this spec's acceptance criteria). Per harness, record:

| Dimension | What "pass" looks like |
|---|---|
| Discovery path | The harness finds `skills/<name>/SKILL.md` without copying or renaming anything specloop already ships. |
| Auto-trigger | Typing a natural-language request matching a skill's `description` (not its slash-style name) causes the harness to select and run that skill unprompted. |
| `when_to_use` tolerance | The harness ignores the non-base-spec `when_to_use` frontmatter key gracefully — vs. erroring, silently dropping the whole skill, or otherwise choking. |
| Multi-turn Q&A loop | `start`'s one-question-at-a-time, write-as-you-go interview survives a full phase (ask → wait for reply → write to disk → ask next) without the harness collapsing turns, auto-answering, or losing the running context between questions. |

Each of these is binary human judgment from a live session, not something inferable
from documentation — hence `human`-owned tasks, same reasoning as `001` T30. A harness
that fails the multi-turn row doesn't get marked "partial support" — it gets recorded
as "cannot run `start`," per the hard constraint that this must be documented, not
smoothed over.

**2. Skill-recommendation step (`skills/start/SKILL.md` Phase 4 / `question-bank.md`
Phase C `helper-skills`).** Generalize it. The current wording — "name the Claude Code
skills/plugins... Check what's already available in-session" — is wrong on its face
whenever `start` itself is being run from Cursor, Codex CLI, or any non-Claude-Code
harness: "in-session" already means "whatever tool is running this interview," so
hardcoding "Claude Code" asserts something false in exactly that case. This isn't the
`worker-cli` question (asked later in the same phase, about the *target* project's
execution backend) — it's about what's already loaded in the *current* interviewing
session, which this spec's own premise says need not be Claude Code. Fix: reword to
name the running harness generically ("skills/plugins available in this session") and
drop the Claude-Code-specific phrasing. `README.md`'s Quickstart section has the same
"recommended Claude Code skills" phrase and gets the same fix.

**3. Install path.** No manifest counterpart to `.claude-plugin/plugin.json` — per the
base Agent Skills spec, registration is the frontmatter itself, no manifest is
required, and a manifest for every possible harness format would need per-harness
schemas this spec has no evidence justify the effort yet. Concretely: document that a
harness without a `.claude-plugin/plugin.json` reader is expected to scan a
`skills/`-shaped directory of its own — `.agents/skills/` is the vendor-neutral path to
document first, with `.opencode/skills/` and `.claude/skills/` named as equivalent
aliases (or a global equivalent) — and that pointing it at (or copying) specloop's
`skills/` directory is the install step. This is a documentation change (`README.md`),
not new tooling — no install script yet, since a script would need to know each
harness's real scan path, which is exactly what the audit (item 1) still has to confirm
for anything beyond OpenCode's already-researched match on all three aliases.

**4. Constraint check.** None of the above touches `.claude-plugin/plugin.json` or
removes anything `claude --plugin-dir` relies on — items 2 and 3 are wording/docs
changes and item 1 is read-only observation. Additive, as required.

## Deliverables

- This `design.md` (audit matrix, three decisions above).
- `skills/start/SKILL.md` Phase 4 step 1 and `skills/start/references/question-bank.md`
  Phase C `helper-skills` row reworded off "Claude Code skills/plugins" to
  session-generic wording.
- `README.md`: Quickstart's "recommended Claude Code skills" phrase generalized;
  `## Install` section gains a short paragraph on the non-`.claude-plugin/` path
  (point at a harness's own skills-scan directory).
- `scripts/check-skill-consistency.mjs`: a new check group asserting `skills/start/
  SKILL.md`'s helper-skills step doesn't hardcode "Claude Code" outside of the parts of
  the file that are legitimately Claude-Code-specific (the `.claude-plugin/plugin.json`
  / `claude --plugin-dir` distribution mentions).
- `planning/specs/022-cross-agent-skill-compat/tasks.md` populated (this pass).
- Not in this pass: the live audit itself (`human`-owned, needs real sessions in each
  tool) and the resulting `planning/architecture.md` Container update from "unaudited"
  to named-verified harnesses — both blocked on that audit landing.

## Sequencing

Wording/doc fixes (items 2, 3) and the consistency-script check are independent of the
audit and land now. The audit (item 1) and the `architecture.md` update it unlocks stay
`blocked`/`todo` until a human runs each harness — no shortcut around that; a
documentation-only "looks compatible" claim is exactly what the hard constraint rules
out.

## Open questions / deferred

- Gemini CLI, GitHub Copilot, Windsurf, Goose — named in the research as also reading
  the format, but not in this spec's acceptance criteria. Left for a future pass or a
  follow-up spec if the three-harness audit surfaces something that makes them worth
  prioritizing sooner.
- Whether a real install script (vs. documentation) is worth building — deferred until
  the audit confirms which scan paths actually matter in practice, per
  `requirements.md`'s "start from documentation... before building tooling" scoping.
