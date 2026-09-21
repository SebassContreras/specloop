# 035 — wshobson-agents-research — Requirements

Filed 2026-09-21 — research time-box sobre `wshobson/agents` para decidir qué patrones traer a specloop sin copiar el overkill.

## What's being built

- Research time-box sobre `wshobson/agents` (39.8k stars, 94 plugins, 183 skills) — su arquitectura de distribución multi-harness, matriz de capacidades, flujos de instalación y quality gates — con hallazgos verificados (fetch/web, no adivinados).
- Entregable: `research.md` dentro del spec con matriz reutilizable vs overkill y recomendación lean explícita para specloop (9 skills, 1 plugin `specloop`), que `036` consume como input.
- Registro de qué filas de `planning/architecture.md` (Declined `marketplace.json`, Fixed `Container`) tocaría cada patrón si se adoptase.

## Who/what it serves

Maintainers de specloop decidiendo distribución sin sobredimensionar: necesitan hechos del repo de referencia escalados a 9 skills, no una copia de su pipeline de 94 plugins.

## Hard constraints

- Solo lectura de `wshobson/agents` — no copiar código. Verificar flags/paths por fetch (`raw.githubusercontent.com/wshobson/agents/main/...`) antes de afirmarlos, nunca adivinar (regla `AGENTS.md: Never guess`).
- Escalar recomendación a 9 skills / 1 plugin, no a 94 — distinguir patrones de 1-3 JSONs vs pipeline completo de 7 adapters.
- No tocar `README.md`, `plugin.json`, `install` — eso es `036`.
- Tiempo acotado: research, no implementación.

## Acceptance criteria

- [ ] `research.md` existe y cubre con paths reales: `plugins/` source-of-truth, `tools/adapters/{base,capabilities,codex,cursor,opencode,antigravity,copilot,pi}.py` + `tools/generate.py`, `Makefile` (`make generate HARNESS=...`, `make generate-all`, `make validate/garden`), registries commitados (`.claude-plugin/marketplace.json`, `.agents/plugins/marketplace.json`, `plugins/*/.codex-plugin/plugin.json`) vs árboles gitignored (`.codex/`, `.opencode/`, `.antigravity/`, `.pi/`), y `gh skill` / `npx skills` skills-only installers.
- [ ] Matriz de capacidades documentada: 8KB cap Codex → `references/details.md`, `tools:` → `permission:`/`sandbox_mode`/agy-native, `TodoWrite`/`Task` por harness, `AGENTS.md` 150 líneas/32KiB — con degradación mecánica por harness.
- [ ] Clasificación reutilizable vs overkill justificada por escala: sí traer (micro-registry 1-3 JSONs apuntando a `./skills`, guard 8KB stdlib 10 líneas, `name==dir` para `gh skill`, `validate`/`garden` ligero) vs no traer (7 adapters ~3k LOC, venv `uv` + `plugins/plugin-eval`, `make install-*` symlinks, `plugin-eval` 3 capas).
- [ ] Recomendación explícita: híbrido lean (`.claude-plugin/marketplace.json` + `install.sh` `curl|tar`) como input para `036`, con porqué y qué deja fuera (`037` deferred si specloop crece a 5+ plugins).
- [ ] `planning/architecture.md` Declined `marketplace.json` row citada pero no modificada — la modifica `036` con go-ahead fechado.

## Out of scope

- Cambiar `README.md` Install, `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`, `install.sh`, workflows — todo es `036`.
- Implementar adapters, `Makefile`, o `tools/adapters/` en specloop.
- Re-auditar `022` (6 harnesses verified) — se reutiliza, no se repite.

## Dependencies

`001` (skills layout `skills/*/SKILL.md`), `022` (support matrix 6 harnesses) — se lee su matriz, no se modifica.

## Owner split

Todo `agent` — research puro, sin `[human]` steps.
