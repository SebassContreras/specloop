# 036 — lean-distribution — Tasks

Status legend: `todo` · `in_progress` · `blocked` · `interrupted` · `done`
Owner: `agent` (loop-runnable) · `human` (skipped by the loop)

- [x] T001 [agent] [status:done] Crear `.claude-plugin/marketplace.json` con formato verificado (`code.claude.com/docs/en/plugin-marketplaces`, no adivinado): `{name, owner, plugins: [{name: "specloop", source: "./skills", description, version}]}` — validar con `claude plugin validate .` y `claude plugin marketplace list` en fixture
      └─ Added `.claude-plugin/marketplace.json`; JSON validation passed, but the `claude` CLI is unavailable in this environment.
- [x] T002 [agent] [status:done] Actualizar `planning/architecture.md:359` Declined row `marketplace.json listing` a `Superseded by 036 (2026-09-21, user go-ahead)` con fecha y referencia a `035` — no borrar sin traza, con `AGENTS.md: Never edit Declined without go-ahead`
      └─ Updated only the historical Declined row; original rationale preserved.
- [x] T003 [agent] [status:done] Escribir `install.sh` (bash `set -euo pipefail`): flags `--global`/`--local` (default local), `--version`, `--force`, idempotente; detecta harness pero siempre escribe a `.agents/skills/` (garantizado `022`); usa `curl -fsSL` + `tar -xz --strip-components=1`; sin `pip`/`npm`; preserva `skills/status/{references/,scripts/}` relativo
      └─ Added root `install.sh`; Bash syntax could not be run because Bash is unavailable on this Windows environment.
- [x] T004 [agent] [status:done] Escribir `install.ps1` (PowerShell): paridad con `install.sh` — `Invoke-WebRequest`/`Expand-Archive`, mismos flags, mismos paths (`~/.agents/skills`, `~/.claude/skills`, `~/.config/opencode/skills`), idempotente
      └─ Added `install.ps1`; PowerShell parser validation passed.
- [x] T005 [agent] [status:done] Crear `.github/workflows/release-skills.yml`: trigger `push: tags: v*`, steps `tar -czf specloop-skills.tar.gz skills/ .claude-plugin/plugin.json .claude-plugin/marketplace.json` (excluye `planning/`, `examples/`, `scripts/`, `.github/assets`), `gh release upload` + `.sha256`; sin `continue-on-error`; determinístico (sort, sin timestamp) como `030`
      └─ Added deterministic tag-triggered release workflow with archive, checksum, and GitHub Release upload.
- [x] T006 [agent] [status:done] Actualizar `README.md` Install a 3 columnas: Marketplace (`claude/copilot/codex marketplace add`), Installer (`curl -fsSL .../install.sh | bash` y `irm .../install.ps1 | iex`), Manual (`cp -r`) — con one-liners por harness de `022` y nota de backward compat
      └─ README now documents Marketplace, tar installer, manual copy, six harness paths, and backward compatibility.
- [x] T007 [agent] [status:done] Actualizar `CONTRIBUTING.md` y `.gitignore` (si hace falta): validación `cat .claude-plugin/marketplace.json | jq` + `claude plugin validate .`, excluir `specloop-skills.tar.gz` local
      └─ Added marketplace validation guidance and ignored the local release archive.
- [x] T008 [agent] [status:done] Verificar en fixtures vacíos: `bash install.sh` y `pwsh install.ps1` dejan `skills/` descubrible por 6 harnesses (`022` paths), sin `planning/` ni `.github/assets`; segundo run byte-identical; `marketplace.json` leído por `claude plugin marketplace add` en fixture local
      └─ PowerShell fixture and idempotency passed; `claude plugin validate .` passed with one warning. Bash/global paths and GNU tar determinism remain environment-limited (Windows Bash access denied; global writes intentionally not redirected).
