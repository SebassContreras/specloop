# 043 — ax-packaging-workspace — Design

## Approach

Híbrido lean igual que `036`: un registry JSON pequeño + una declaración Workspace que reuse el artefacto `specloop-skills.tar.gz`.

Investigar primero (`035`-style fetch ledger): `https://raw.githubusercontent.com/google/ax/main/docs/manifests.md` (Task/Workspace/Gateway/Model), `https://antigravity.google/docs/cli/install` y codelab `how-to-create-agent-skills-for-antigravity-cli`, y formato `marketplace.json` de `code.claude.com/docs/en/plugin-marketplaces`. Extraer campos requeridos (`name`, `source`, `skills` path). Expectativa: `source: "./"` (plugin root, no `skills/`), igual que `036` — la raíz contiene `.claude-plugin/plugin.json` + `skills/`; `./skills` fallaría porque el manifest no estaría en source.

Workspace file minimal (keys exactas tras verificar): e.g. `ax/workspace.yaml` `apiVersion: ax.io/v1alpha1 kind: Workspace spec: { skills: [{name: specloop, path: ./skills}], git: [{repo: https://github.com/SebassContreras/specloop}] }` o JSON equivalente. Si `ax` reusa `.agents/plugins/marketplace.json` ya existente para Codex, reutilizarlo en lugar de crear `.ax/workspace.json` propio — verificar caída. El archivo queda committed y pequeño; cualquier árbol `.ax/generated/` futuro va gitignored (como `.codex/` en `035`).

Release workflow `release-skills.yml` amplía `tar -czf` para incluir nuevo JSON de forma determinística (`sort`, sin timestamp, `sha256` como `030`). `install.sh` no cambia lógica core — solo doc — salvo que `ax` requiera hint `ax --sparse .claude-plugin skills` (análogo a Claude `036` follow-up 263 KB).

## Deliverables

- Nuevo: `ax` registry/marketplace JSON + Workspace declaration (path final tras fetch, committed).
- Modificados: `.github/workflows/release-skills.yml` tar list, `README.md` Install (fila `ax`), `CONTRIBUTING.md` validación, `.gitignore` si excluye `specloop-skills.tar.gz` local ya cubierto, `planning/architecture.md` Declined actualizado.

## Sequencing

1. Fetch ledger `ax` schema + `agy` skill docs y anotar URLs en header de `requirements.md`.
2. Escribir workspace/marketplace JSON(s) con `source:"./"` y `version` de `.claude-plugin/plugin.json`; validar con `python -m json.tool` o validador `agy` si disponible.
3. Wire a release workflow y doc Install.
4. Sweep `architecture.md` Declined con fecha go-ahead + `check-skill-consistency` si nuevo JSON requiere guard.

## Open questions / deferred

- ¿`.agents/plugins/marketplace.json` compartido Codex/`ax` o `ax` necesita propio? `036` dejó open; verificar caída.
- ¿`name==dir` requerido como `gh skill`? Probable sí (`035` `name==dir`), respetar.
- ¿Sparse checkout equiv para `ax` (`--sparse`)? No asumir; medir tamaño clone (`036` 6 MB) y documentar `curl|tar` lean como primario si no existe.
