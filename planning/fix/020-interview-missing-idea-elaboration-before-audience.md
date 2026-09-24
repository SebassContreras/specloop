# 020 — interview-missing-idea-elaboration-before-audience

## Scope

001, 016

## Found

Tras forzar `lee las skills`, Codex sí activó `specloop:start` pero registró directamente `project-type=software` y `goal="que se conecte a la api..."` copiando el prompt con typos, y pasó a `audience` con `¿La app será solo para ti o también para otras personas?` sin pedir elaboración de la idea (`merca/.specloop/interview.md:3-12`). El usuario tuvo que decirle `lee las skills` para que arrancara, y aun así la fase Type & vision no dejó estructurar la idea: no hubo pregunta de narrativa libre (`cuéntame con tus palabras de qué trata, qué problema resuelve, cómo te lo imaginas paso a paso`) ni razonamiento previo que sirva como punto de partida para encaminar `audience/mvp/done-when`. `question-bank.md:Phase A` solo tiene `goal` genérico `What's the final goal?`, insuficiente para capturar la idea con contexto.

## Status

resolved

## Fix

`skills/start/references/question-bank.md:14-18` insertada `idea-detail` entre `goal` y `audience` con pregunta abierta `Cuéntame con tus palabras...` y reasoning estructurado sin inventar. `skills/start/SKILL.md:215-230` Phase 2 reescrita: tras `project-type`+`goal` pide `idea-detail` narrativa libre, registra verbatim, hace pass de estructura (problema, usuarios, flujo, entidades, integraciones) como punto de partida, y solo luego avanza a `audience/mvp/done-when` referenciando esa narrativa. `skills/start/SKILL.md:95-102` Phase 0 añade migración de ledger: si falta `idea-detail` (upgrade), la inserta `open` entre `goal` y `audience`. Copiado a `merca/.agents/skills/start/` (ambos archivos). `merca/.specloop/interview.md` no persistió tras el run interrumpido 24/09, pero el próximo `codex` con prompt en español ahora entrará por `idea-detail` antes de `audience`. `check-markdown-conventions` y `check-skill-consistency` PASS.

## Date

2026-09-24
