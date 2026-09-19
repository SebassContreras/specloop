# Interview ledger — revisit of Phases C/D (2026-09-14)

specloop's own repo was never scaffolded by its own `specloop:start` — Phases
A/B/E are already covered by hand-written `planning/product.md`/`architecture.md`/
specs, per that skill's Phase 0 (real content → skip to Phase 7). This revisit
covers only Phase C (helper skills & agent tooling) and Phase D (styles &
preferences), at the user's explicit request, to populate
`.specloop/loop.config.json` and `planning/styles.md` for real instead of via
ad hoc `loop-setup` answers.

| dimension | status | answer summary or skip reason |
|---|---|---|
| helper-skills | covered | `skill-architect` recommended for `skills/*/SKILL.md` work; already available in-session, no install needed. Recorded in `AGENTS.md`'s new "Rules for agents" section. |
| worker-cli | covered | 6 workers configured: `claude` (`-p`), `codex` (`exec`), `opencode` (`run`), `copilot` (`--allow-all-tools -p`), `cursor-agent` (`--trust --force -p`), `agy` (`--add-dir {repoRoot} --mode accept-edits -p`) — the first three confirmed via web search, the last three from `022`'s 2026-09-19 audit runs, none guessed. `{repoRoot}` is replaced by `skills/loop` with the repo's absolute path; `agy`'s headless mode can't run shell commands (see `skills/loop-setup`). Whichever harness runs `specloop:loop` uses its own native sub-agent for the matching entry; the others fall back to CLI subprocess with these args. Written to `.specloop/loop.config.json`; the last three entries added by hand 2026-09-19. |
| agent-rules | covered | 4 rules recorded in `AGENTS.md`'s "Rules for agents": repo-wide sweep after a cross-cutting change; never guess a technical/factual value, verify it; check for an existing finer-grained mechanism before adding new config surface; never edit a Fixed rule/Declined row without explicit go-ahead. |
| visual-surface | covered | Yes, scoped to `planning/dashboard.html` only (specloop's own product has no UI). |
| palette | covered | Documented existing token-based palette (light+dark, per-status semantic colors) in `planning/styles.md` — already built, not newly designed. |
| typography | covered | Documented existing system font stacks (sans body, mono detail) in `planning/styles.md`. |
| density-mode | covered | One fixed density, no toggle — documented in `planning/styles.md`. |
| brand-refs | skipped | No external brand to match — specloop is the product itself. |
| accessibility | skipped | No target beyond what's already built (light/dark, semantic color pairs) — revisit if a real requirement shows up. |
| code-conventions | covered | Researched (web search): kebab-case naming (already the practice), minimal why-not-what comments, ESM scripts, and Conventional Commits going forward (repo history not rewritten). Written to `planning/styles.md` and pointed to from `CONTRIBUTING.md`. |
| tone | covered | Technical and direct, English — matches existing repo style. `language` field stays omitted from `.specloop/loop.config.json` (English default). |
| anti-preferences | covered | 5 items recorded in `planning/styles.md`: filler prose; "just in case" config/columns/skills; a rule/doc claiming behavior the code doesn't implement; a guessed technical value; a mechanically-impossible proposed command/feature. |
| preference-strength | covered | Hard rule for every preference above, no exceptions — "hard rule everything, default nothing." |
