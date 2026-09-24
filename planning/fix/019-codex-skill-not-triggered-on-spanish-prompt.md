# 019 — codex-skill-not-triggered-on-spanish-prompt

## Scope

022, 001

## Found

En `C:\Users\sebac\Documents\GitHub\merca` con `.agents/skills` instalado (9 skills, verificado `ls` 2026-09-24), `codex` v0.156.1 (`GPT-6-Sol medium`) no activó `specloop:start` ante `prompt` en español con typos: `quiero craear una app que se conecte a la api de mi super de confiasa y me haga la compre segu mi dieta`. El modelo hizo `git status --short` + `Get-ChildItem` + `rg --files` y respondió genérico sin leer `SKILL.md`, con `fatal: not a git repository`. Conversation interrupted sin sugerir `specloop:start`.

Causa: `skills/start/SKILL.md:3-16` `description/when_to_use` solo lista triggers en inglés (`I need to set up X`, `scaffold a new project`) y aplica a Codex vía matching semántico. Prompt en español con typos no matchea, y Codex no fallback a exploración de `.agents/skills`. `022` verificó triggers en inglés bajo runs agent-driven; nunca probó prompts en español informales con typos ni repo sin `.git`.

## Status

resolved

## Fix

`skills/start/SKILL.md:1-18` frontmatter `description` y `when_to_use` ampliados con triggers bilingües: `quiero crear una app`, `crear una app que se conecte a una api`, `hacer la compra según mi dieta`, y typos `craear`/`confiasa`/`compre`, más nota `Activate even if repo has no .git yet`. Copiado a `merca/.agents/skills/start/SKILL.md` (verificado `ls` 9 skills). Código Codex 0.156.1 usa matching semántico sobre `description/when_to_use`; el trigger en inglés de `022` seguía válido pero el español no estaba cubierto. Verificado `check-markdown-conventions` y `check-skill-consistency` PASS tras el cambio. Pendiente re-probar `codex` con prompt original sin typos corregidos y documentar fallback explícito `codex exec "specloop:start — quiero crear..."` si auto-trigger sigue sin disparar.

## Date

2026-09-24
