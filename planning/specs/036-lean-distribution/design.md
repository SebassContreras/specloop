# 036 — lean-distribution — Design

## Approach

Híbrido lean (recomendación de `035`): 1 JSON de marketplace + 1 installer `curl|tar`, sin pipeline de adapters.

**Marketplace:** Un solo `.claude-plugin/marketplace.json` en la raíz del repo (formato `code.claude.com/docs/en/plugin-marketplaces`: `{name, owner, plugins: [{name, description, version, source}]}` verificado por fetch antes de escribir — `source` es `./` — la raíz del repo es el plugin, con `.claude-plugin/plugin.json` y `skills/`; `./skills` no serviría porque el `source` debe contener el manifest o una carpeta `skills/`). Copilot lo lee también desde `.claude-plugin/` (`docs.github.com` lo confirma; probado con `copilot plugin marketplace add` + `install`: 9 skills). Codex no tiene flujo de marketplace verificado — usa el installer; `npx codex-marketplace` no se pudo verificar y se quitó. No se crean `plugins/*/.codex-plugin/plugin.json` separados porque specloop es 1 plugin, no 94 — evita duplicar manifests. La fila Declined `planning/architecture.md:359` se actualiza a `Superseded by 036 (2026-09-21, user go-ahead)` con fecha, no se borra sin traza (`AGENTS.md: Never edit Declined without go-ahead`).

**Installer:** `install.sh` (bash, `set -euo pipefail`) + `install.ps1` (PowerShell) en la raíz, sin dependencias más allá de `curl`/`tar`/`unzip` (bash) y `Invoke-WebRequest`/`Expand-Archive` (ps). Flags: `--global` (home) vs default `--local` (cwd), `--version v0.x.y` (default `latest` vía `releases/latest/download`), `--force` para sobrescribir; sin `--force` una carpeta que ya tiene las skills se salta. Siempre escribe a `.agents/skills/` (lo leen OpenCode, Codex, Cursor, Copilot y Antigravity según la matriz de `022`) y además a `.claude/skills/` si existe `.claude/` (Claude Code no lee `.agents/skills/`). Preserva `skills/status/{references/template.html,scripts/build_dashboard.py}` relativo — el tarball no aplana.

**Release:** `.github/workflows/release-skills.yml` dispara en `push: tags: v*` (no en cada push a `main` como `034`): `tar -czf specloop-skills.tar.gz skills/ .claude-plugin/plugin.json .claude-plugin/marketplace.json` (sin `planning/`, `examples/`, `scripts/`, `.github/assets`), `gh release create` si el release no existe (empujar un tag no lo crea) + `gh release upload` + checksum. Job falla loud si `py_compile` de `build_dashboard.py` falla o si el archivo trae rutas solo-repo (no `continue-on-error`); `build_dashboard.py --help` no sirve como check — el script no tiene ayuda y regenera `planning/dashboard.html`. Determinismo: `tar` con `sort` y sin timestamp (como `030`).

## Deliverables

- Nuevos: `.claude-plugin/marketplace.json`, `install.sh`, `install.ps1`, `.github/workflows/release-skills.yml`.
- Modificados: `planning/architecture.md` (Declined row), `README.md` (Install 3 columnas + one-liners por harness), `CONTRIBUTING.md` (validación `marketplace.json`), `.gitignore` si hace falta excluir tarball local.
- Artefacto en Releases: `specloop-skills.tar.gz` (y `.sha256`).

## Sequencing

1. `035` `done` primero — provee formatos verificados de `marketplace.json` (no adivinar).
2. Escribir `marketplace.json` y validar con `claude plugin validate .` antes del installer — el installer lo empaqueta.
3. Escribir `install.sh`/`install.ps1` y probar en fixture vacío (`bash install.sh` + `pwsh install.ps1`) verificando descubrimiento en 6 paths de `022`.
4. Workflow de release último — depende de que el tarball layout esté congelado.
5. Docs (`README.md`, `architecture.md`) al final, con sweep `grep` por `AGENTS.md: After changing cross-cutting mechanism...`.

## Open questions / deferred

- ¿Publicar también `.agents/plugins/marketplace.json` para Codex nativo o basta con que Codex lea `.claude-plugin/marketplace.json`? `035` lo aclara; default es solo `.claude-plugin/` y se añade el segundo solo si `035` encuentra que Codex no hace fallback.
- ¿Soporte `npx specloop-install` (npm) además de `curl|bash`? Deferred a `037` si hay demanda — `curl` cubre el 95% sin publicar en npm.
- Full adapters `wshobson/agents` si specloop crece a 5+ plugins — deferred, no se decide aquí.
