#!/usr/bin/env node
/**
 * Prints the next plugin version, for `.github/workflows/auto-release.yml` (038).
 *
 * Usage: node scripts/next-version.mjs <current> [auto|patch|minor|major] < messages
 *
 * stdin: the full messages of every commit since the last tag that touched `skills/`,
 * NUL-separated (`git log --format='%B%x00'`). With `auto`, the level comes from
 * Conventional Commits: a breaking change (`type!:` or a `BREAKING CHANGE` footer) is
 * major, `feat` is minor, anything else is patch. Below 1.0.0 a breaking change only
 * bumps minor, same as a feat — 0.x has no stable API to break.
 */
import { readFileSync } from 'node:fs';

const [current, level = 'auto'] = process.argv.slice(2);
const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(current ?? '');
if (!match) {
  console.error(`not a plain semver version: ${current}`);
  process.exit(1);
}
if (!['auto', 'patch', 'minor', 'major'].includes(level)) {
  console.error(`unknown bump level: ${level}`);
  process.exit(1);
}
let [major, minor, patch] = match.slice(1).map(Number);

const levelFrom = (messages) => {
  const breaking = messages.some(
    (m) => /^\w+(\([^)]*\))?!:/.test(m) || /^BREAKING[ -]CHANGE:/m.test(m),
  );
  if (breaking) return major === 0 ? 'minor' : 'major';
  if (messages.some((m) => /^feat(\([^)]*\))?:/.test(m))) return 'minor';
  return 'patch';
};

const messages = readFileSync(0, 'utf8')
  .split('\0')
  .map((m) => m.trim())
  .filter(Boolean);
const bump = level === 'auto' ? levelFrom(messages) : level;

if (bump === 'major') [major, minor, patch] = [major + 1, 0, 0];
else if (bump === 'minor') [minor, patch] = [minor + 1, 0];
else patch += 1;

console.log(`${major}.${minor}.${patch}`);
