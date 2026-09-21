# 035 — wshobson-agents-research — Design

## Approach

Time-box de lectura estructurada sobre `wshobson/agents` sin clonar: fetch de `README.md`, `docs/harnesses.md`, `docs/usage.md`, `Makefile`, `tools/adapters/capabilities.py`, `.claude-plugin/marketplace.json`, `.agents/plugins/marketplace.json`, `.gitignore` y un `plugins/<name>/` de ejemplo — todos vía `raw.githubusercontent.com` con verificación de flags/paths, nunca adivinados. La síntesis no copia código, solo hechos verificados escalados a specloop (9 skills, no 94 plugins).

El entregable no es código, es `research.md` dentro del propio spec — una matriz con dos columnas (reutilizable con 1-3 JSONs vs overkill de pipeline completo) y una recomendación que `036` consume verbatim. Eso mantiene `035` como research puro y evita que `036` adivine formatos de `marketplace.json`.

## Deliverables

- `planning/specs/035-wshobson-agents-research/research.md` (nuevo) — secciones: 1) Arquitectura `plugins/` → adapters → registries commitados vs gitignored, 2) Matriz de capacidades y degradación mecánica por harness (8KB cap, `tools:` mappings, `AGENTS.md` caps), 3) Instalación lean (`gh skill`/`npx skills` sin clone vs `gh repo clone + make install-*`), 4) Quality gates (`validate_generated.py`, `doc_gardener.py`, `smoke-test`), 5) Clasificación reutilizable vs overkill con justificación por escala, 6) Recomendación híbrida lean (1 `marketplace.json` + `install.sh` `curl|tar`) para `036`.
- Este `design.md` y `requirements.md` (ya existentes) — no se tocan `README.md`, `plugin.json`, `planning/architecture.md` (los toca `036` con go-ahead fechado).

## Sequencing

Solo este spec — `research.md` se escribe tras leer los 6-8 archivos fuente arriba y se verifica por fetch cruzado (cada path citado existe en `main`). No hay orden con `036` más allá de `Depends on` en `roadmap.md`: `036` no empieza su `design-closing` hasta que `035` esté `done` y su `research.md` sea la fuente de formatos.

## Open questions / deferred

- Si specloop crece a 5+ plugins, ¿amerita `037` con `tools/adapters/` real? Dejado como `deferred` en `research.md` — no se decide aquí, solo se enmarca el umbral.
- Formato exacto de `.claude-plugin/marketplace.json` para specloop (campo `owner`, `plugins[].source`) — `035` lo documenta desde `wshobson/agents` como referencia, `036` lo verifica contra `code.claude.com/docs/en/plugin-marketplaces` antes de escribirlo (regla `AGENTS.md: verify CLI flag`).
