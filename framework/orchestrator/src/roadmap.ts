import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { splitRow, withCells } from './mdTable.js';

export type SpecStatus =
  'todo' | 'in_progress' | 'blocked' | 'interrupted' | 'done';

export interface RoadmapRow {
  id: string;
  name: string;
  status: SpecStatus;
  dependsOn: string[];
}

/** `| ID | Plan | Status | Depends on |`, plus any trailing columns. */
const ID_INDEX = 0;
const NAME_INDEX = 1;
const STATUS_INDEX = 2;
const DEPENDS_INDEX = 3;

function roadmapPath(cwd: string): string {
  return join(cwd, 'docs', 'roadmap.md');
}

/**
 * Reads the first four cells positionally and ignores any beyond them, so the
 * table can gain a Priority/Stage column without every row silently failing to
 * parse (which previously surfaced as "nothing eligible to run", not an error).
 */
export function parseRoadmap(cwd: string = process.cwd()): RoadmapRow[] {
  const text = readFileSync(roadmapPath(cwd), 'utf8');
  const rows: RoadmapRow[] = [];
  for (const line of text.split('\n')) {
    const cells = splitRow(line);
    if (!cells || cells.length < 4) continue;
    const id = cells[ID_INDEX];
    if (!/^\d{3}$/.test(id)) continue;
    const dependsOn = cells[DEPENDS_INDEX];
    rows.push({
      id,
      name: cells[NAME_INDEX],
      status: cells[STATUS_INDEX] as SpecStatus,
      dependsOn:
        dependsOn === '' || dependsOn === '—' || dependsOn === '-'
          ? []
          : dependsOn.split(',').map((s) => s.trim()).filter(Boolean),
    });
  }
  return rows;
}

/**
 * The roadmap's only `Status` writer. Without it the column goes stale: a spec
 * whose tasks are all finished stays `in_progress`, `pickNextSpec` keeps
 * resuming it, and every `todo` row stays ineligible because no dependency ever
 * reaches `done`.
 */
export function writeSpecStatus(
  cwd: string,
  specId: string,
  status: SpecStatus,
): void {
  const path = roadmapPath(cwd);
  const text = readFileSync(path, 'utf8');
  let changed = false;
  const lines = text.split('\n').map((line) => {
    const cells = splitRow(line);
    if (!cells || cells.length < 4) return line;
    if (cells[ID_INDEX] !== specId) return line;
    if (cells[STATUS_INDEX] === status) return line;
    changed = true;
    return withCells(cells, [[STATUS_INDEX, status]]);
  });
  if (changed) writeFileSync(path, lines.join('\n'));
}

export function pickNextSpec(rows: RoadmapRow[]): RoadmapRow | undefined {
  const byId = new Map(rows.map((r) => [r.id, r]));
  const resuming = rows.find((r) => r.status === 'in_progress');
  if (resuming) return resuming;
  return rows
    .filter((r) => r.status === 'todo')
    .find((r) => r.dependsOn.every((dep) => byId.get(dep)?.status === 'done'));
}
