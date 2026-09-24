# 042 — harness-adapter-registry — Requirements

Raised 2026-09-24 — el mapa `cli → args` está hardcodeado en 3 lugares y no escala a `ax` ni a harnesses futuros.

## What's being built

- Un registro único `skills/shared/harness-registry.json` como single source of truth para harnesses: por cada `cli` su `args` headless, `scanPaths` project/global, `nativeSubagent` tool name, y `notes` (e.g. allow rules `agy`).
- Helper determinístico stdlib (`skills/shared/resolve_harness.py` o equivalente) que resuelve `cli → args` y expone la misma resolución a `skills/loop` y `skills/loop-setup`.
- Deduplicación del texto prose en `skills/loop/SKILL.md` Phase 3, `skills/loop-setup/SKILL.md` Phase 1 y `skills/start/references/question-bank.md` Phase C `worker-cli` para leer del registro.
- Guard `scripts/check-skill-consistency.mjs` grupo 16 que falla si queda mapa hardcodeado o deriva entre matriz y registro.

## Who/what it serves

- Maintainers que añaden un harness (hoy añadir `cline` o `ax` requiere editar 2 SKILL.md + `question-bank.md` + `planning/architecture.md` a mano).
- Masters `skills/loop` bajo cualquier harness: resuelven `args` sin adivinar.
- Specs futuros 043–045 que consumen el registro (workspace `ax`, export manifests, status bridge).

## Hard constraints

- Sin mapa duplicado tras el cambio: el texto hardcodeado en 2+ lugares desaparece — un solo JSON es la verdad.
- Aditivo: no rompe `claude --plugin-dir`, `.specloop/loop.config.json` `workers[]` + sustitución `{repoRoot}`, ni forma legacy `workerCli`/`workerArgs` como array de un elemento.
- `AGENTS.md: Never guess` — cada `args` proviene de doc verificado por fetch, no inventado.
- Solo stdlib (`python3` sin `pip` o `node` sin deps), mismo patrón que `030` (`build_dashboard.py`).
- `AGENTS.md` sigue single source, `CLAUDE.md` thin import — el registro no crea segundo canal de contexto.
- Ruta del registro probea igual que `skills/status` (`${CLAUDE_PLUGIN_ROOT}` → probe `SKILL.md` dir → `.agents/skills` / `~/.agents/skills` etc.) si el placeholder llega sin sustituir.

## Acceptance criteria

- [ ] `skills/shared/harness-registry.json` existe, contiene exactamente los 6 verified entries (`claude -p`, `codex exec`, `opencode run`, `copilot --allow-all-tools -p`, `cursor-agent --trust --force -p`, `agy --add-dir {repoRoot} --mode accept-edits -p`) con `scanPaths` de `022` matrix y campo `nativeSubagent` donde aplica.
- [ ] `skills/loop/SKILL.md` Phase 3 y `skills/loop-setup/SKILL.md` Phase 1 resuelven `cli → args` vía registro/helper; solo piden flag al usuario si `cli` no está en registro.
- [ ] Añadir `mycli` nuevo requiere editar solo el JSON + pasar `scripts/check-skill-consistency.mjs` — no editar prose duplicada.
- [ ] Grupo 16 del checker falla si cualquier `SKILL.md` hardcodea `["-p"]`/`["exec"]` fuera del registro o si registro deriva de `README.md` matrix.
- [ ] `.specloop/loop.config.json` legacy `workerCli`/`workerArgs` sigue leyéndose como `workers[0]` sin reescritura forzada.
- [ ] `skills/start/references/question-bank.md` `worker-cli` apunta al registro, no a prose de `loop-setup`.

## Out of scope

- Añadir un harness nuevo (solo extracción); el registro no trae `cline`/`gemini` aún — eso es siguiente spec tras verificar.
- Full `tools/adapters/` 7-adapter pipeline de `wshobson/agents` — overkill para 1 plugin × 9 skills (ver `035` deferred).
- Marketplace/manifests `ax` (043/044) — dependen del registro, no parte de este.
- Cambios en `install.sh`/`install.ps1` más allá de que ya escriben `.agents/skills` (sigue válido).

## Dependencies

`002` (loop owns map), `022` (verified scan paths), `030` (stdlib helper precedent), `035` (capabilities matrix).

## Owner split

Todo `agent` salvo una verificación `[human]`: correr `loop-setup` bajo `agy` + `copilot` y confirmar que el dispatch usa el valor del registro (native vs subprocess) sin adivinar.
