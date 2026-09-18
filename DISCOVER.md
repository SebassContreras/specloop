# DISCOVER — Auditoría specloop: ¿Universal o fork por proveedor?

> Fecha: 2026-09-18. Auditor: lectura completa de `README.md`, `planning/architecture.md`, `planning/product.md`, `planning/roadmap.md`, `skills/*/SKILL.md`, `planning/specs/022-*`, `skills/status/scripts/build_dashboard.py`, `.claude-plugin/plugin.json` y `.specloop/loop.config.json`. No se editó código; esta es la foto del estado real.

## Veredicto

**No hagas forks por proveedor. `specloop` ya es universal por diseño y forkeado lo romperías.**

Lo que falta no es reescribir lógica por proveedor, es cerrar la brecha de **distribución** (cómo se instala/descubre el mismo `skills/` en cada harness) y completar la verificación que el propio repo se impuso.

## 1. Estado actual — ya es `core + adapters`

### 1.1 Skills universales (Agent Skills abierto)

`skills/*/SKILL.md` usan el formato abierto `name`/`description`/`when_to_use` + instrucciones, no un formato Claude-only. Es el mismo formato que leen nativamente Cursor, Codex CLI, Gemini CLI, GitHub Copilot, OpenCode, Windsurf y Goose — varios vía la ruta vendor-neutral `.agents/skills/<name>/SKILL.md` (`planning/architecture.md:5`).

Distribución actual: `.claude-plugin/plugin.json:2` es solo conveniencia para `claude --plugin-dir` (`planning/architecture.md:11`). No es el formato canónico; el registro es el propio frontmatter.

Fallback documentado en `README.md:76`:

- **Codex CLI** — copiar `skills/` a `.agents/skills/` (o `~/.agents/skills/` global)
- **OpenCode** — copiar a `.opencode/skills/` o aliases `.agents/skills/` / `.claude/skills/` (`~/.config/opencode/skills/`)
- **Cualquier otro harness compatible** — `.agents/skills/` primero

### 1.2 Loop CLI-agnóstico

El loop no está atado a Claude. `skills/loop/SKILL.md:28` y `skills/loop-setup/SKILL.md:48` lo dejan explícito:

> `workers: [{cli, args}]` — el loop siempre elige el entry cuyo `cli` matchea el harness que lo corre, prefiere el mecanismo nativo de sub-agente de ese harness antes que un subprocess, y el resto de `workers` existe solo para portabilidad y para el fallback explícito por quota.

`.specloop/loop.config.json:2` ya trae `claude -p`, `codex exec` y `opencode run` en el mismo archivo. `planning/architecture.md:157` y `planning/product.md:64` lo fijan como regla.

### 1.3 Verificación 022 — 1/3 harnesses cerrado

`planning/specs/022-cross-agent-skill-compat/tasks.md:6`:

- **T003 OpenCode — `done`** (fixture aislado fuera del repo, con su propio `.git`): discovery `pass`, auto-trigger desde lenguaje natural sin nombrar el skill `pass`, tolerancia a `when_to_use` `pass`, write-as-you-go 5 preguntas sin colapso `pass`.
- **T001 Cursor — `todo` (human)**
- **T002 Codex CLI — `todo` (human)**

Requisito de cierre de 022 solo exigía 1 harness no-Claude — por eso `planning/roadmap.md:24` marca 022 `done` y `planning/architecture.md:13` nombra OpenCode como verificado y Cursor/Codex como no auditados. `planning/specs/022-cross-agent-skill-compat/requirements.md:51` impone no afirmar portabilidad no verificada.

## 2. Por qué forkeado sería un error ahora

`specloop` tiene **0 líneas de lógica por proveedor**. Todo es `SKILL.md` (markdown con contrato) + 1 script determinista `skills/status/scripts/build_dashboard.py:1` (Python stdlib). Forkear multiplicaría por 3 el mismo `SKILL.md` con un `plugin.json` distinto.

Coste ya pagado: el repo mantuvo `framework/orchestrator/` (CLI determinista `loop run`/`stop`/`status`) en paralelo a `skills/loop` y lo eliminó el 2026-09-12 precisamente por drift y doble fuente de verdad (`planning/handoff.md:158`, `planning/architecture.md:360`). La regla dura `planning/architecture.md:344` exige tu go-ahead explícito para editar Fixed/Declined — forkear sin él reintroduce el mismo problema.

Fork = 3 READMEs, 3 roadmaps, 3 sets de issues, bugs por triplicado, 500 stars diluidas en 5 repos de 100. Ninguna `awesome-*` list acepta 5 variantes del mismo plugin.

Solo forkeado tendría sentido si >70% del código diverge por proveedor (ej. VS Code extension vs Neovim lua vs CLI), que no es el caso aquí.

## 3. Gaps que hoy impiden "funciona para todos" de verdad

### P1 — Distribución con fricción (razón #1 por la que parece Claude-only)

- Solo Claude tiene one-liner (`claude --plugin-dir`). El resto requiere copiar `skills/` a mano (`README.md:81`). No existe `.codex-plugin/plugin.json`, no hay entry en marketplace de OpenCode, no hay `scripts/install.mjs`.
- Badge `[![Built for Claude Code]]` (`README.md:4`) + snippet `claude --plugin-dir /path/to/specloop` como primer ejemplo sesgan SEO y descubrimiento. El `topics` del repo aún no incluye `opencode`, `codex-cli`, `agent-skills`.
- Sin instalador, cada harness nuevo es documentación, no producto.

### P1 — `${CLAUDE_PLUGIN_ROOT}` no es portable

`skills/status/SKILL.md:33` invoca:

```
python3 "${CLAUDE_PLUGIN_ROOT}/skills/status/scripts/build_dashboard.py"
```

Claude Code sustituye `${CLAUDE_PLUGIN_ROOT}` inline antes de entregar el texto (`skills/status/SKILL.md:41`). Bajo OpenCode/Codex ese placeholder no resuelve — el audit de OpenCode pasó copiando `skills/` localmente, no vía plugin install. Es el bug `planning/fix/012-status-script-path-not-portable.md:1` (path relativo que solo funcionaba por accidente cuando target y plugin eran el mismo checkout). El script en sí ya sabe resolver su template relativo a `Path(__file__)` (`skills/status/scripts/build_dashboard.py:18`), pero el `SKILL.md` no aprovecha ese fallback.

### P2 — Compatibilidad no verificada

- T001/T002 abiertos ⇒ no se puede afirmar universal. `when_to_use` no es parte del spec base (`license`/`compatibility`/`metadata` sí, `planning/specs/022-cross-agent-skill-compat/requirements.md:27`) y su tolerancia solo está probada en OpenCode.
- Gemini CLI, Copilot, Windsurf, Goose ni evaluados (`planning/specs/022-cross-agent-skill-compat/design.md:82`).

### P2 — Showcase bloqueado

`019-public-showcase` `in_progress` (`planning/roadmap.md:22`). Faltan: GIF real de `specloop:loop` como sesión de chat (el viejo `demo-loop.tape` fue borrado con el CLI `planning/handoff.md:204`), banner/logo y diagrama extendido más allá del mermaid `README.md:48` / `.github/assets/`. Sin esto, cualquier `Show HN` / `Product Hunt` rebota.

### P2 — Consistencia cross-archivo

`scripts/check-skill-consistency.mjs:10` valida que `skills/start` no hardcodee "Claude Code skills" en Phase 4, pero no valida que los manifests de distribución apunten al mismo `skills/` — se puede desincronizar si se añaden `.codex-plugin/` etc. sin guard.

## 4. Arquitectura recomendada — universal con adapters de distribución

No forks. **1 repo, 1 core `skills/`**, adapters finos por harness igual que `workers[]` ya hace para ejecución:

```
specloop/
  .claude-plugin/plugin.json   # existente, skills: "./skills/"
  .codex-plugin/plugin.json    # nuevo, mismo skills: "./skills/" (si Codex lo requiere)
  skills/                      # core único — nunca se duplica
  scripts/install.mjs          # nuevo: detecta harness y copia/linka skills a .agents/skills etc.
```

- Cada `plugin.json` apunta al mismo `skills/` (`skills: "./skills/"`). La lógica no se copia.
- `scripts/install.mjs` es el único código nuevo por harness y es trivial (detectar `claude`/`codex`/`opencode` en PATH, resolver su scan path, copiar).
- Extender `scripts/check-skill-consistency.mjs` para que valide que todos los manifests referencian el mismo `skills/` y que `README.md`'s tabla de install está sincronizada.

Alternativa sin código: mantener solo documentación (como hoy `README.md:76`) si el audit confirma que todos los harnesses aceptan `.agents/skills/` sin manifest — decisión explícita de 022 (`planning/specs/022-cross-agent-skill-compat/design.md:42`).

## 5. Plan concreto — 3 fases

### Fase A — Cerrar universal sin código nuevo (1–2 días)

1. **Completar auditoría 022 T001/T002** — fixtures aislados fuera del repo (con su propio `.git`, como T003 `022/tasks.md:8`), matriz de 4 dimensiones (`planning/specs/022-cross-agent-skill-compat/design.md:9`): discovery, auto-trigger desde `description`, tolerancia `when_to_use`, multi-turn Q&A write-as-you-go. Si Cursor/Codex fallan `when_to_use`, condicionar frontmatter; si fallan multi-turn, documentar limitación en vez de ocultarla (`requirements.md:59`).
2. **Fix portabilidad `status`** — en `skills/status/SKILL.md:33` reemplazar placeholder único por fallback: intentar `${CLAUDE_PLUGIN_ROOT}` / `${CODEX_PLUGIN_ROOT}` / `${OPENCODE_PLUGIN_ROOT}` según harness, o resolver relativo a `Path(__file__)` del script. Misma idea que `planning/fix/012`.
3. **README re-balance** — tabla `## Install` por harness (Claude Code | OpenCode | Codex CLI | Generic `.agents/skills/`) con one-liners equivalentes. Añadir `topics`: `claude-code`, `opencode`, `codex-cli`, `agent-skills`, `spec-driven`. Cambiar badge a `Agent Skills — Claude Code · OpenCode · Codex CLI` tras cerrar T001/T002.

### Fase B — Adapters de distribución (mismo core, 0 duplicación)

1. Añadir `.codex-plugin/plugin.json` (si Codex lo exige) y opcional `opencode.json` shim — ambos apuntando a `./skills/`.
2. Añadir `scripts/install.mjs` (Node, sin deps) — `node scripts/install.mjs --harness auto` detecta y copia. Mantener `skills/status/scripts/build_dashboard.py` como único Python (`planning/architecture.md:300`).
3. Extender `scripts/check-skill-consistency.mjs:10` con grupo `[14] Distribution manifests point to same skills/`.
4. PRs a `awesome-opencode`, `awesome-claude-code`, `agentskills/awesome` — eso es promoción, no fork.

### Fase C — Promoción (cuando A esté verde)

Orden para no quemar `Show HN`:

1. Dogfooding demo: grabar `demo-interview.gif` bajo OpenCode (ya verificado `022/tasks.md:8`) + captura `planning/dashboard.html` live en `sebasscontreras.github.io/specloop` (`.github/workflows/dashboard.yml:1` ya publica en Pages).
2. Cerrar `019-public-showcase` — diagrama mermaid `README.md:48` ya existe, faltan assets `.github/assets/` (GIF, banner).
3. Lanzamiento escalonado: Discord OpenCode + Claude Code `#showcase` → GitHub Discussion → Reddit `r/opencode` / `r/ClaudeAI` (formato problema→demo→código) → X hilo con video (etiqueta `@opencode`, `@thdxr`) → Dev.to "Interview → Roadmap → Loop: spec-driven sin CLI standalone" → `Show HN` con título `Show HN: Specloop — interview-to-roadmap-to-loop, harness-agnostic Agent Skills`.
4. Métrica de éxito: 1 repo con 500 stars > 5 repos con 100. El texto de promoción debe ser "tenía este dolor X, lo solucioné así [demo], acá está el código", no "miren mi plugin".

## 6. Próximos pasos / decisiones pendientes

- [ ] ¿Priorizar Fase A (verificación Cursor/Codex — requiere sesión humana real, no loopeable) o Fase B (manifests + install script) primero?
- [ ] ¿Mantener `skills/status/scripts/build_dashboard.py` como único script Python o aceptar `scripts/install.mjs` Node para distribución? Respeta `planning/architecture.md:303`.
- [ ] ¿Cambiar badge ahora o tras cerrar T001/T002?

## Referencias

- Container / plugin components: `planning/architecture.md:3`
- Fixed rules (no forks sin go-ahead, single writer `Status`): `planning/architecture.md:71`
- Declined (standalone CLI eliminado): `planning/architecture.md:360`
- Roadmap source of truth: `planning/roadmap.md:1`
- Loop workers portabilidad: `skills/loop/SKILL.md:28`, `skills/loop-setup/SKILL.md:52`, `.specloop/loop.config.json:2`
- Status portabilidad: `skills/status/SKILL.md:33`, `planning/fix/012-status-script-path-not-portable.md:1`, `skills/status/scripts/build_dashboard.py:18`
- 022 audit: `planning/specs/022-cross-agent-skill-compat/requirements.md:51`, `planning/specs/022-cross-agent-skill-compat/design.md:9`, `planning/specs/022-cross-agent-skill-compat/tasks.md:6`
- Showcase bloqueado: `planning/roadmap.md:22`, `planning/handoff.md:204`
- Consistencia: `scripts/check-skill-consistency.mjs:10`, `scripts/shared/canonical-headers.mjs:1`
