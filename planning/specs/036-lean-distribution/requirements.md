# 036 — lean-distribution — Requirements

Raised 2026-09-21 — que instalar specloop no obligue a clonar todo el repo (6.1MB, 5.2MB son `.github/assets` gifs) para usar 147KB de `skills/`.

## What's being built

- Artefacto lean `specloop-skills.tar.gz` (solo `skills/` + `.claude-plugin/plugin.json`) publicado en GitHub Releases por un workflow en tag — sin `planning/`, `examples/`, `scripts/`, `test/`, `.github/assets`.
- `install.sh` (bash) + `install.ps1` (PowerShell) en la raíz que descargan el tarball y lo colocan en `.agents/skills` / `.claude/skills` (detecta harness, flags `--global` vs `--local`, `--version`, idempotente, sin `pip`/`npm`).
- `.claude-plugin/marketplace.json` (y opcional `.agents/plugins/marketplace.json`) para installs nativos `claude plugin marketplace add SebassContreras/specloop` / `copilot plugin marketplace add` / `npx codex-marketplace add` — formato verificado contra `code.claude.com/docs/en/plugin-marketplaces` y `docs.github.com/en/copilot/.../plugins-marketplace`, no adivinado.
- `README.md` Install actualizado a 3 columnas: Marketplace / Installer `curl|tar` / Manual `cp -r` (este último sigue funcionando verbatim como fallback).

## Who/what it serves

Usuario final en un target repo que hoy debe hacer `git clone SebassContreras/specloop` entero para luego hacer `cp -r /path/to/specloop/skills .agents/skills` (`README.md:91-99`). Con esto hace una línea sin clonar.

## Hard constraints

- Backward compat: `cp -r /path/to/specloop/skills .agents/skills` y `claude --plugin-dir /path/to/specloop` (`plugin.json: "skills": "./skills/"`) siguen funcionando verbatim — no mover/renombrar `skills/`.
- Preservar layout relativo `skills/status/{SKILL.md,references/template.html,scripts/build_dashboard.py}` y resolución `${CLAUDE_PLUGIN_ROOT}/skills/status/scripts/build_dashboard.py` (`skills/status/SKILL.md:30-34`) + fallback por `SKILL.md` probe — no aplanar.
- Stdlib-only en `build_dashboard.py` (`030`) y sin `pip`/`npm` en el installer (curl/tar/bash o PowerShell) — misma regla que `030` (no `pip install` step).
- No scaffolding de `planning/`, `examples/`, `scripts/` en target — siguen repo-only (`planning/architecture.md:236`, `034` es repo-only).
- Formato de `marketplace.json` verificado por fetch antes de escribir (regla `AGENTS.md: Never guess a CLI's flag`) — no adivinar campos `owner`, `plugins[].source`.

## Acceptance criteria

- [ ] `curl -fsSL https://raw.githubusercontent.com/SebassContreras/specloop/main/install.sh | bash` en un repo vacío deja `skills/` descubrible por los 6 harnesses de `022` (`.agents/skills` / `.claude/skills` / `.opencode/skills` / `.cursor/skills` / `.github/skills`) sin traer `planning/` ni `.github/assets` — verificado por `ls`/`git ls-files`.
- [ ] `claude plugin marketplace add SebassContreras/specloop && claude plugin install specloop` funciona (o doc de por qué se eligió solo-installer si se descarta marketplace) — verificado por `claude plugin validate .` y `claude plugin marketplace list`.
- [ ] Tag `v0.x.y` genera `specloop-skills.tar.gz` byte-identical en segundo run contra inputs sin cambios (sin timestamp), workflow falla loud si `build_dashboard.py` falla (no `continue-on-error`), como `034`.
- [ ] `README.md` Install muestra Marketplace / Installer / Manual con one-liners por harness; `CONTRIBUTING.md` añade validación de `marketplace.json`.
- [ ] `planning/architecture.md:359` Declined row `marketplace.json listing` actualizada con `Superseded by 036 (2026-09-21, user go-ahead)` y fecha — no borrada sin traza, siguiendo `AGENTS.md: Never edit Declined without go-ahead`.

## Out of scope

- Full `tools/adapters/` pipeline de `wshobson/agents` (7 adapters, `uv` venv, 6 árboles gitignored, `make generate-all`) — overkill para 1 plugin × 9 skills; si specloop crece a 5+ plugins, spec aparte `037`.
- `034` Pages workflow (repo-only, no cambia) y `032` markdown checks (ya cubren `marketplace.json` si se añade al `shared/canonical-headers.mjs`).
- Publicar en `agentskills.io` / `skills.sh` — `035` ya garantiza `name==dir` para `gh skill`/`npx skills` sin registry adicional.

## Dependencies

`035` (research — provee formatos verificados), `001` (skills layout `skills/*/SKILL.md`), `005` (open-source-release — `plugin.json` owner/license), `022` (support matrix — paths que installer debe cubrir).

## Owner split

Todo `agent`, salvo habilitar Pages/marketplace visibility si requiere admin GitHub (`human` — como `034` T003).
