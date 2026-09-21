# 035 — wshobson-agents-research — Tasks

Status legend: `todo` · `in_progress` · `blocked` · `interrupted` · `done`
Owner: `agent` (loop-runnable) · `human` (skipped by the loop)

- [x] T001 [agent] [status:done] Fetch y mapear arquitectura de distribución de wshobson/agents: `plugins/` source-of-truth, `tools/adapters/{base,capabilities,codex,cursor,opencode,antigravity,copilot,pi}.py` + `tools/generate.py`, `Makefile` targets (`make generate HARNESS=...`, `make generate-all`, `make validate/garden`), verificado por fetch de raw URLs
      └─ Added and verified `research.md` with the upstream architecture map and raw-URL ledger.
- [x] T002 [agent] [status:done] Documentar registries commitados vs gitignored: `.claude-plugin/marketplace.json`, `.agents/plugins/marketplace.json`, `plugins/*/.codex-plugin/plugin.json`, `.cursor-plugin/` vs `.codex/`, `.opencode/`, `.antigravity/`, `.pi/` — con regla lean "small JSONs committed, large trees gitignored" y `!.agents/plugins/` exception
      └─ Appended verified registry, ignore, and `.pi/` exception findings to `research.md`.
- [x] T003 [agent] [status:done] Extraer matriz de capacidades y degradación mecánica por harness: 8KB cap Codex → `references/details.md`, `tools:` mappings (`sandbox_mode`/`permission:`/agy-native), `TodoWrite`/`Task`/`AGENTS.md` 150 líneas/32KiB — desde `tools/adapters/capabilities.py` y `docs/harnesses.md`
      └─ Appended the verified capability matrix and mechanical degradation rules to `research.md`.
- [x] T004 [agent] [status:done] Documentar flujos de instalación: `gh skill install` / `npx skills add` (sin clone, bare `name==dir`, tracking `main` vs release) vs `gh repo clone + make install-*` (con clone, symlinks globales) — con trade-off one-step-URL de `docs/harnesses.md: Native install`
      └─ Appended verified skills-only and clone-plus-generation installation flows to `research.md`.
- [x] T005 [agent] [status:done] Mapear quality gates: `tools/validate_generated.py` (TOML, cap 8KB, frontmatter `name==dir`), `tools/doc_gardener.py` (STALE_ARTIFACT, DEAD_LINK, SKILL_OVER_CODEX_CAP, MARKETPLACE_ORPHAN), `make smoke-test` y `plugin-eval` 3 capas
      └─ Appended verified quality-gate contracts and the 404 discrepancy for the historical Python paths to `research.md`.
- [x] T006 [agent] [status:done] Escribir `research.md` con clasificación reutilizable vs overkill justificada por escala (9 skills vs 94 plugins): sí traer (micro-registry 1-3 JSONs, guard 8KB 10 líneas stdlib, `name==dir`, `validate`/`garden` ligero) vs no traer (7 adapters ~3k LOC, venv `uv`, `make install-*` ×4, `plugin-eval` completo) — con recomendación híbrida lean (`.claude-plugin/marketplace.json` + `install.sh` `curl|tar`) para `036`
      └─ Appended the scale-based classification and hybrid lean recommendation for `036` to `research.md`.
