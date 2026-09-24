# 043 — ax-packaging-workspace — Requirements

Raised 2026-09-24 — specloop no es instalable desde `google/ax` registry ni declara Workspace; `ax` es el harness genérico open-source más relevante para distribución declarativa.

## What's being built

- Entrada marketplace/registry para `ax` / Antigravity que apunte a este repo (formato verificado vía fetch de `ax` docs, no adivinado) — equivalente a `.claude-plugin/marketplace.json` de `036` pero para el ecosistema `ax`/`agy`.
- `Workspace` declarativo en el repo (e.g. `ax/workspace.yaml` o `.agents/ax-workspace.json` según schema verificado) que liste el plugin `specloop` y su `skills` path `./skills` para `ax apply`.
- `README.md` Install 3-column ampliada con fila `ax` (one-liner marketplace + installer lean) y nota de `Discovery` `.agents/skills` vs `/.agents/skills` absoluta.
- Ajuste leve de `install.sh`/`release-skills.yml` para empaquetar el nuevo manifest sin romper tar determinístico.

## Who/what it serves

- Usuario `agy`/`ax` que prefiere `ax plugin add` / `agy skills add` en lugar de `curl|tar` manual — mismo público que `022` matrix amplía a `cline`/`gemini`.
- Target repo que se bootstrappea vía `specloop:start` y luego se declara como `Workspace` en cluster `ax` (K8s + Agent Substrate) para warm start.
- Maintainers de specloop que mantienen lean distribution (`036` + `035` research como base).

## Hard constraints

- Verificar schema antes de escribir (`AGENTS.md: Never guess`) — fetch `raw.githubusercontent.com/google/ax/main/docs/manifests.md`, `antigravity.google` codelab, `code.claude.com` equivalente para `ax`.
- Backward compat: `cp -r skills .agents/skills` y `claude --plugin-dir` siguen verbatim; layout relativo `skills/status/{references/template.html,scripts/build_dashboard.py}` y resolución `${CLAUDE_PLUGIN_ROOT}` intacto (`skills/status/SKILL.md:30-34` + fallback probe).
- Stdlib-only, sin `pip`/`npm` en installer; tarball sigue sin `planning/`/`examples/`/`scripts/`/`test/`/`.github/assets` (regla `036`).
- Solo commit de JSON manifests pequeños; árboles generados `/.ax/` gitignored si `ax` los produce (como `.codex/` en `035`).
- No asset binario en git — `specloop-skills.tar.gz` sigue solo en Release.

## Acceptance criteria

- [ ] `ax workspace validate` (o validador documentado `agy --help` / `ax apply --dry-run`) pasa sobre el manifest nuevo sin error.
- [ ] `ax install SebassContreras/specloop` (o `agy` equivalente documentado) trae 9 skills a `.agents/skills` sin traer `planning/` ni `.github/assets`.
- [ ] Marketplace JSON apunta a `source: "./"` (raíz del plugin, no `./skills`), consistente con `036` fix; `version` desde `.claude-plugin/plugin.json`.
- [ ] `install.sh`/`install.ps1` siguen funcionando; optional `--ax` hint solo si `ax` lo requiere — documentado, no adivinado.
- [ ] `README.md` Install muestra columna Marketplace / Installer / Manual con one-liner `ax` y nota `--sparse .claude-plugin skills` equiv para `ax` si existe.
- [ ] `planning/architecture.md` Declined row `marketplace.json listing` actualizada a `Superseded by 043 ...` con fecha go-ahead, preservando traza (como `036`).

## Out of scope

- Full `tools/adapters/` 7-adapter pipeline de `wshobson/agents` — sigue overkill para 1 plugin × 9 skills (`035` T006).
- Generador declarativo `roadmap → manifests` (044) — consume este Workspace, no parte de este.
- `agentskills.io` publish — `035` garantiza `name==dir` para `gh skill` sin registry extra.
- Soporte `gh skill`/`npx skills` adicional — ya cubierto.

## Dependencies

`042` (registry aporta `agy` args/scanPaths), `036` (lean tarball/workflow), `001` (skills layout), `022` (verified `agy` con `--add-dir` absoluto + allow rules).

## Owner split

Todo `agent` salvo admin `human` si registry Google requiere visibilidad de org (como `034` T003).
