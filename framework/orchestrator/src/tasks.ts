import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { splitRow, isHeaderOrSeparator, withCells } from './mdTable.js';

export type TaskStatus =
  'todo' | 'in_progress' | 'blocked' | 'interrupted' | 'done';

/** `human` tasks need a credential, approval, purchase, physical act or a live
 *  interactive session. The loop skips them rather than failing them. */
export type TaskOwner = 'agent' | 'human';

export interface TaskRow {
  id: string;
  task: string;
  owner: TaskOwner;
  status: TaskStatus;
  notes: string;
  /** Index of the status cell in the source row, so a write preserves layout. */
  statusIndex: number;
  /** The row's cells as parsed, so a write preserves unknown trailing columns. */
  cells: string[];
}

const TASK_STATUSES: readonly string[] = [
  'todo',
  'in_progress',
  'blocked',
  'interrupted',
  'done',
];

function isOwner(value: string): value is TaskOwner {
  return value === 'agent' || value === 'human';
}

function isStatus(value: string): value is TaskStatus {
  return TASK_STATUSES.includes(value);
}

/**
 * Reads both table layouts:
 *   `| ID | Task | Owner | Status | Notes |`  (current)
 *   `| ID | Task | Status | Notes |`          (pre-Owner, still on disk)
 * Detected by whether cell 2 holds a valid owner rather than by cell count, so
 * a table with extra trailing columns still parses correctly.
 */
function toRow(cells: string[]): TaskRow | undefined {
  const id = cells[0];
  if (!id || isHeaderOrSeparator(id)) return undefined;
  const hasOwner = cells.length >= 5 && isOwner(cells[2]);
  const statusIndex = hasOwner ? 3 : 2;
  const status = cells[statusIndex];
  // A row whose status cell isn't a real status is malformed — most often a
  // stray unescaped pipe in the task text, which shifts every later cell.
  // Returning it anyway is the dangerous option: the bogus status is neither
  // `done` nor runnable, so the loop would skip the task while the spec could
  // never roll up to `done`. Surfaced by parseTasks instead.
  if (!status || !isStatus(status)) return undefined;
  return {
    id,
    task: cells[1] ?? '',
    owner: hasOwner ? (cells[2] as TaskOwner) : 'agent',
    status: status as TaskStatus,
    notes: cells[statusIndex + 1] ?? '',
    statusIndex,
    cells,
  };
}

function specDir(cwd: string, specId: string, specName: string): string {
  return join(cwd, 'planning', 'specs', `${specId}-${specName}`);
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
    const cells = splitRow(line);
    if (!cells) continue;
    const row = toRow(cells);
    if (row) {
      rows.push(row);
    } else if (/^T\d+$/.test(cells[0] ?? '')) {
      // Looks like a task row but didn't parse — warn rather than skip
      // silently, or the task simply vanishes from the loop's view.
      console.warn(
        `[loop] ${path}: ignoring malformed row "${cells[0]}" (check for an unescaped "|" in the text — escape it as "\\|")`,
      );
    }
  }
  return rows;
}

/**
 * Resumes an interrupted task before starting new ones, and never returns a
 * `human` task — those are the user's to do, and handing one to a worker CLI
 * burns a task slot on work it cannot complete.
 */
export function nextRunnableTask(rows: TaskRow[]): TaskRow | undefined {
  const runnable = rows.filter((r) => r.owner === 'agent');
  return (
    runnable.find((r) => r.status === 'interrupted') ??
    runnable.find((r) => r.status === 'todo')
  );
}

/** Tasks still open but not loop-runnable — reported so they aren't forgotten. */
export function pendingHumanTasks(rows: TaskRow[]): TaskRow[] {
  return rows.filter(
    (r) => r.owner === 'human' && r.status !== 'done',
  );
}

export function allTasksSettled(rows: TaskRow[]): boolean {
  return rows.every((r) => r.status === 'done' || r.owner === 'human');
}

export function writeTaskStatus(
  path: string,
  taskId: string,
  status: TaskStatus,
  notes = '',
): void {
  const text = readFileSync(path, 'utf8');
  const lines = text.split('\n').map((line) => {
    const cells = splitRow(line);
    if (!cells) return line;
    const row = toRow(cells);
    if (!row || row.id !== taskId) return line;
    return withCells(cells, [
      [row.statusIndex, status],
      [row.statusIndex + 1, notes],
    ]);
  });
  writeFileSync(path, lines.join('\n'));
}
