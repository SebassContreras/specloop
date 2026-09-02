## What & why

What user problem does this solve? Link the issue if one exists.

## Scope

- What changed:
- What deliberately did not change:

## Testing

Exact commands run and their results. Do not write only "tests pass".

- `claude plugin validate .` (if `.claude-plugin/plugin.json` or `skills/`
  changed)
- `framework/orchestrator/`: `pnpm run lint` / `pnpm run typecheck` /
  `pnpm run format:check` (if orchestrator source changed)

## Checklist

- [ ] The relevant spec's `docs/specs/NNN-name/tasks.md` row is updated (status +
      notes)
- [ ] `docs/roadmap.md` is updated if this closes or changes a spec's status
- [ ] `CHANGELOG.md` gets a new entry if this closes a spec's last task
- [ ] No secrets, tokens, or another party's data in the diff
