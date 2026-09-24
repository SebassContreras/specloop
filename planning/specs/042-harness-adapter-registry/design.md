# 042 — harness-adapter-registry — Design

## Approach

Extraer las 6 entradas actuales (`claude -p`, `codex exec`, `opencode run`, `copilot --allow-all-tools -p`, `cursor-agent --trust --force -p`, `agy --add-dir {repoRoot} --mode accept-edits -p`) a `skills/shared/harness-registry.json` versión `1` con schema:

```json
{
  "version": "1",
  "harnesses": {
    "claude": { "args": ["-p"], "scanPaths": { "project": [".claude/skills"], "global": ["~/.claude/skills"] }, "nativeSubagent": "Task", "notes": "" },
    "agy": { "args": ["--add-dir", "{repoRoot}", "--mode", "accept-edits", "-p"], "scanPaths": { "project": [".agents/skills"], "global": [] }, "nativeSubagent": "invoke_subagent", "notes": "needs permissions.allow regex in ~/.gemini/antigravity-cli/settings.json" }
  }
}
```

`{repoRoot}` permanece literal en `args`; lo sustituye `skills/loop` al lanzar subprocess, como hoy. El helper `skills/shared/resolve_harness.py` (stdlib-only, `python3` con fallback `python` igual que `skills/status`) resuelve `cli → args` y emite JSON; `loop` Phase 3 lo invoca una vez por batch, `loop-setup` Phase 1 lo usa para no preguntar flag conocido. Si el harness ofrece sub-agent nativo, el helper lo señala y prose prioriza esa vía — el flag solo importa en fallback subprocess o switch explícito por quota. Skills encogen a "resolve against registry via helper; if missing ask user for headless flag and append". `question-bank.md` worker-cli deja de citar `loop-setup/SKILL.md` y apunta al archivo JSON.

Resolver de ruta del registro replica `skills/status` 4.1: si `${CLAUDE_PLUGIN_ROOT}` llega sin sustituir, probea `SKILL.md` dir → `.agents/skills` / `.claude/skills` / `.opencode/skills` / `.github/skills` / `.cursor/skills` y luego `~/.agents/skills` etc. Si nada existe, mensaje claro y stop — no inventar variable.

## Deliverables

- Nuevo: `skills/shared/harness-registry.json` + `skills/shared/resolve_harness.py` (stdlib-only, `--help` no-op, `open(encoding="utf-8", newline="\n")`).
- Modificados: `skills/loop/SKILL.md` Phase 3, `skills/loop-setup/SKILL.md` Phase 1, `skills/start/references/question-bank.md` Phase C `worker-cli`.
- Guard: `scripts/check-skill-consistency.mjs` grupo 16 (hardcoded map derelict + registry ↔ matrix drift) + import de `skills/shared/canonical-headers.mjs` intacto.
- Doc: `planning/architecture.md` Resolved entrada nueva "harness registry single source" + nota de scope (no es second source para `README.md` matrix) y `AGENTS.md` style sweep.

## Sequencing

1. Congelar schema de 6 rows verificando cada flag vía fetch (docs harness oficiales) y registrar URLs en `requirements.md`.
2. Escribir `harness-registry.json` v1.
3. Helper + probe logic + determinismo `json.dumps(sort_keys=True)`.
4. Reescribir 3 prose files para consumir helper y eliminar mapa hardcodeado.
5. Añadir grupo 16 y pasar `node scripts/check-skill-consistency.mjs` y `node scripts/check-markdown-conventions.mjs`.
6. Sweep `README.md` Install one-liners y `planning/architecture.md` Container/Resolved para stale wording (grep cross-cutting).

## Open questions / deferred

- Ubicación final: `skills/shared/` vs repo-root `config/` vs `.specloop/` — `skills/shared/` mantiene el registro transportable vía `install.sh` tarball y visible a `SKILL.md` helper; confirmar en design-closing.
- ¿Debe `install.sh`/`install.ps1` leer el registro para destinations o seguir independiente? Defer — hoy ya cubre `022` paths; leerlo añade `python` dep al installer.
- `args` con espacios/`{repoRoot}` en medio: helper preserva como array, no string único — el caller une con `shlex` safe.
- Nuevo harness `cline`/`gemini` no entra aquí; spec siguiente lo añade tras 4 checks `022`.
