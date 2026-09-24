# 044 — declarative-export-manifests — Requirements

Raised 2026-09-24 — `planning/roadmap.md` + `tasks.md` no tienen export declarativo para `ax` Task/Workspace; `specloop:status` ya tiene el patrón (`030`).

## What's being built

- `skills/export/scripts/generate_ax_manifests.py` (Python 3 stdlib-only, sin `pip`) que lee `planning/roadmap.md` + cada `planning/specs/NNN-*/tasks.md` y emite manifests declarativos `ax`-compatibles (uno por spec + `index.json`) bajo `.ax/generated/` (gitignored) o `planning/ax-manifests/` si se decide committed.
- Cada manifest contiene `id, plan, status, stage, priority, dependsOn, counts, tasks[]` más `language` (BCP47) y es byte-identical en re-runs sobre input sin cambios.
- Guard `scripts/check-manifests.mjs` (o grupo 17 en `check-skill-consistency.mjs`) usando `git ls-files` que falla en drift o no-determinismo.

## Who/what it serves

- Consumidor `ax` / CI que quiere spec list estructurada sin parsear markdown — `Task.workspaces[{name,goal}]` + `Gateway.allowlist` derivado.
- Maintainers que hoy usan `specloop:status` (`030`) para observar pero necesitan manipulación declarativa.
- Agentes que `discover({skills})` por query sobre catálogo estático sin re-leer cada `tasks.md`.

## Hard constraints

- Stdlib-only, sin `pip install`, hard fail con mensaje claro si `python3` falta (misma regla `030`/`status` probe `python3 --version` luego `python`).
- Determinístico: ordenar por `ID` (roadmap order), nunca embed `generatedAt` wall-clock; `open(encoding="utf-8", newline="\n")` (regla `030` para evitar locale `\r\n`).
- Reusar parsers `build_dashboard.py` (positional 4 cells + `Stage`/`Priority` trailing) — no duplicar regex que derive.
- Nunca escribe `planning/roadmap.md`/`tasks.md`; generated dir sigue boundary `wshobson` generated trees gitignored, registry small commitado (`035` T002).
- Mantener distribución `Plan` byte-identical a folder post-`NNN-` (`planning/architecture.md` Fixed).

## Acceptance criteria

- [ ] `python3 skills/export/scripts/generate_ax_manifests.py` (CWD target repo root) produce `.ax/generated/index.json` + `N` manifests con `dependsOn`/`priority` tie-break idéntico a `specloop:loop` Phase 1 y `build_dashboard.py`.
- [ ] Dos runs consecutivos sin cambios producen byte-identical output (`sha256` igual), sin timestamp.
- [ ] `Stage: looping`/`tasks_ready` manifest válido aun cuando `design.md` es stub (flagged via drift equivalent, no error).
- [ ] Guard `check-manifests` pasa en este repo y falla si `roadmap.md` cambia sin regenerar (como `check-markdown-conventions`).
- [ ] `planning/architecture.md` Resolved anota segundo helper stdlib (`044`) junto a `030` con scope note (bounded helper, no master).
- [ ] `skills/status` y export comparten parser sin drift — helper extraído o assert de regex igual.

## Out of scope

- Live `ax apply` publishing (043) — consume este output, no parte de este.
- Event log stream (045) — puente separado.
- Traducción completa skill bodies por harness (`capabilities.py` 8KB cap → `references/details.md`, `tools→permission`) más allá de nota lean — full adapters deferred a 5+ plugins threshold (`035`).
- `gh-pages` para manifests — repo-only como `034` boundary.

## Dependencies

`042` (registry aporta tool mappings si se degradan), `043` (workspace target dir), `030` (parser + determinism precedent), `009` (status contract).

## Owner split

Todo `agent` salvo probe `[human]` verificando `ax apply -f .ax/generated/index.json --dry-run` en fixture vacío.
