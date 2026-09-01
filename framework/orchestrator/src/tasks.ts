import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export type TaskStatus =
  'todo' | 'in_progress' | 'blocked' | 'interrupted' | 'done';

export interface TaskRow {
  id: string;
  task: string;
  status: TaskStatus;
  notes: string;
}

// Matches the fixed `| ID | Task | Status | Notes |` row shape from 001's design.
// Each cell is captured as everything between pipes and trimmed afterward,
// rather than a lazy quantifier butted up against `\s*` — that overlap is what
// causes catastrophic backtracking on non-matching input. Header/separator
// rows are filtered below by the id's shape, not by the regex itself.
const ROW_RE = /^\|([^|]*)\|([^|]*)\|([^|]*)\|([^|]*)\|$/;

function specDir(cwd: string, specId: string, specName: string): string {
  return join(cwd, 'docs', 'specs', `${specId}-${specName}`);
}

export function tasksPath(
  cwd: string,
  specId: string,
  specName: string,
): string {
  return join(specDir(cwd, specId, specName), 'tasks.md');
}

export function parseTasks(path: string): TaskRow[] {
  const text = readFileSync(path, 'utf8');
  const rows: TaskRow[] = [];
  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('|')) continue;
    const m = ROW_RE.exec(trimmed);
    if (!m) continue;
    const id = m[1].trim();
    if (id === 'ID' || /^-+$/.test(id)) continue;
    rows.push({
      id,
      task: m[2].trim(),
      status: m[3].trim() as TaskStatus,
      notes: m[4].trim(),
    });
  }
  return rows;
}

export function nextRunnableTask(rows: TaskRow[]): TaskRow | undefined {
  return (
    rows.find((r) => r.status === 'interrupted') ??
    rows.find((r) => r.status === 'todo')
  );
}

export function writeTaskStatus(
  path: string,
  taskId: string,
  status: TaskStatus,
  notes = '',
): void {
  const text = readFileSync(path, 'utf8');
  const lines = text.split('\n').map((line) => {
    const trimmed = line.trim();
    if (!trimmed.startsWith('|')) return line;
    const m = ROW_RE.exec(trimmed);
    if (!m || m[1].trim() !== taskId) return line;
    return `| ${m[1].trim()} | ${m[2].trim()} | ${status} | ${notes} |`;
  });
  writeFileSync(path, lines.join('\n'));
}
