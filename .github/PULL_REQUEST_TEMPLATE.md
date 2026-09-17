## What & why

What user problem does this solve? Link the issue if one exists.

## Scope

- What changed:
- What deliberately did not change:

## Testing

Exact commands run and their results. Do not write only "tests pass".

- `claude plugin validate .` (if `.claude-plugin/plugin.json` or `skills/`
  changed)
- `node scripts/check-skill-consistency.mjs` (if any `skills/*/SKILL.md` changed)
- `node scripts/check-markdown-conventions.mjs` (if any `.md` file changed)

## Checklist

- [ ] The relevant spec's `planning/specs/NNN-name/tasks.md` row is updated (status +
      notes)
- [ ] `planning/roadmap.md` is updated if this closes or changes a spec's status
- [ ] `CHANGELOG.md` gets a new entry if this closes a spec's last task
- [ ] No secrets, tokens, or another party's data in the diff
