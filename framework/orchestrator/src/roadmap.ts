import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export type SpecStatus =
  'todo' | 'in_progress' | 'blocked' | 'interrupted' | 'done';

export interface RoadmapRow {
  id: string;
  name: string;
  status: SpecStatus;
  dependsOn: string[];
}

// Matches roadmap.md's fixed `| ID | Plan | Status | Depends on |` row shape.
// Each cell is captured as everything between pipes and trimmed afterward,
// rather than a lazy quantifier butted up against `\s*` — that overlap is what
// causes catastrophic backtracking on non-matching input. Header/separator
// rows are filtered below by the id's shape, not by the regex itself.
const ROW_RE = /^\|([^|]*)\|([^|]*)\|([^|]*)\|([^|]*)\|$/;

export function parseRoadmap(cwd: string = process.cwd()): RoadmapRow[] {
  const text = readFileSync(join(cwd, 'docs', 'roadmap.md'), 'utf8');
  const rows: RoadmapRow[] = [];
  for (const line of text.split('\n')) {
    const m = ROW_RE.exec(line.trim());
    if (!m) continue;
    const id = m[1].trim();
    if (!/^\d{3}$/.test(id)) continue;
    const dependsOn = m[4].trim();
    rows.push({
      id,
      name: m[2].trim(),
      status: m[3].trim() as SpecStatus,
      dependsOn:
        dependsOn === '' || dependsOn === '—' || dependsOn === '-'
          ? []
          : dependsOn.split(',').map((s) => s.trim()),
    });
  }
  return rows;
}

export function pickNextSpec(rows: RoadmapRow[]): RoadmapRow | undefined {
  const byId = new Map(rows.map((r) => [r.id, r]));
  const resuming = rows.find((r) => r.status === 'in_progress');
  if (resuming) return resuming;
  return rows
    .filter((r) => r.status === 'todo')
    .find((r) => r.dependsOn.every((dep) => byId.get(dep)?.status === 'done'));
}
