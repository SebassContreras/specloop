# 044 — declarative-export-manifests — Design

## Approach

Clonar estructura `skills/status/scripts/build_dashboard.py` (`030`): `parse_roadmap()` (positional 4 cells, `Stage`/`Priority` trailing), `parse_tasks()` (column-0 checkbox `- [ ]`/`- [x]` grammar), `compute_next_eligible()` tie-break, `read_fix()` empty si no existe. Segundo pass: `build_ax_manifest(spec, context)` llenando JSON `{id, plan, status, stage, priority, dependsOn, counts, tasks: [{id, owner, status, text, note}], language, contextFiles}` — `language` de `.specloop/loop.config.json` si existe, BCP47 lowercase. Determinismo vía `sorted(specs, key=lambda s: s.id)` y `json.dumps(sort_keys=True, ensure_ascii=False)`, `</script` escape case-insensitive como `build_dashboard.py`, `encoded utf-8 \n`.

Output: `.ax/generated/<id>-<plan>.json` + `.ax/generated/index.json` `{specs:[], drift:[], totalCounts:{}}` sin `generatedAt`. Ubicación `skills/export/scripts/` bundled con plugin; CWD = target repo root (probe `python3` luego `python` igual que `status` Phase 0 y fallback `${CLAUDE_PLUGIN_ROOT}` → `SKILL.md` dir → `.agents/skills` probe). Template no requerido — JSON puro. Capability degradation lean: si harness `Codex` 8KB cap, mover detalles largos a `references/details.md` pointer en manifest `detailsRef` sin full `tools/adapters/`.

## Deliverables

- Nuevo: `skills/export/scripts/generate_ax_manifests.py` + opcional `skills/export/references/` si se parte spec.
- Helpers: posible extracción `skills/shared/roadmap_parser.py` para evitar drift entre dos scripts (o mantener copia con guard que aserta regex iguales).
- Guard: `scripts/check-manifests.mjs` (o grupo 17 en `check-skill-consistency.mjs`) usando `git ls-files` para listar `planning/specs/**/tasks.md` sin escanear `node_modules`.
- Docs: `planning/architecture.md` Resolved (segundo helper) + `README.md` nota sibling de `status` para `export`.

## Sequencing

1. Fetch `ax` manifest schema esperado y capacidad `035` matrix para degradación lean (8KB, `TodoWrite` noop, `AGENTS.md` trunc).
2. Escribir parser reuse desde `030` y verificar contra `test/status-verify-fixture/` determinismo.
3. Emitter + sort/no-timestamp + escape.
4. Guard + docs sweep.
5. Verificar `sha256` dos runs idénticos + validación JSON schema pointer.

## Open questions / deferred

- Output path: `.ax/generated/` gitignored (ax-native) vs `planning/ax-manifests/` repo-only (como `dashboard.html` committed demo)? Por defecto `.ax/generated/` gitignored para no ensuciar diffs; `index.json` puede copiar a `planning/` si se quiere demo committed.
- Incluir `AGENTS.md` 150 líneas cap truncado o warning? Defer — generador emite completo y `ax` Workspace lo monta con `goal` que indica `contextFiles`.
- ¿Debe `specloop:status` auto-invocar export? Default manual `python3 skills/export/scripts/generate_ax_manifests.py` como `030`; auto en `status` defer hasta medir.
