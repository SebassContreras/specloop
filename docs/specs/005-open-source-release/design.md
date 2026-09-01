# 005 — open-source-release — Design

## Files added/changed

- `LICENSE` — standard MIT text, copyright holder = repo author, year = current.
- `README.md` (root) — human/GitHub-facing, distinct from `CLAUDE.md`:
  - What it is (one paragraph, mirrors `docs/product.md`'s "What this is").
  - Install: `claude --plugin-dir <path-to-specloop>` (or a future marketplace
    install, once that exists — not yet, per requirements' out-of-scope).
  - Quickstart: the four skills and when each fires
    (`specloop:start` → `specloop:design-closing` → `specloop:task-breakdown` →
    `specloop:loop-setup` → `loop run`).
  - Pointer to `docs/product.md` / `docs/architecture.md` / `docs/roadmap.md` for
    anyone who wants the full design, instead of duplicating their content.
  - License line/badge referencing `LICENSE`.
- `.claude-plugin/plugin.json` — add `"license": "MIT"` and
  `"repository": "https://github.com/SebassContreras/specloop"`.
- `CONTRIBUTING.md` (root) — spec-driven workflow pointer, local dev commands
  (`claude plugin validate .`, `claude --plugin-dir .`, orchestrator `pnpm`
  commands), and a status line matching README's tone (personal project, shared
  as-is, no SLA).

## Explicitly not building

- No issue templates or `CODE_OF_CONDUCT.md` — would be governance theater for a
  personal project with no active external contributors; add only if that changes.
- No visibility flip (private → public) — a separate, deliberate action the author
  takes themselves once these files are in place.

## Verification

- `git log --all --grep=Claude -i` and a secret-pattern grep across tracked files
  come back clean before calling this done (both already checked once during this
  pass).
- `claude plugin validate .` still passes after the `plugin.json` edit.
