import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  parseChecklistLine,
  renderNoteLine,
  renderTaskLine,
  sanitizeNote,
} from './checklist.js';

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
  /** Index of this task's line in the source file, so a write can find it
   *  again without re-parsing the whole file. */
  lineIndex: number;
  /** Index of the note continuation line, if one currently follows. */
  noteLineIndex?: number;
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
  const lines = readFileSync(path, 'utf8').split('\n');
  const rows: TaskRow[] = [];
  for (let i = 0; i < lines.length; i++) {
    const looksLikeTask = /^- \[.\] T\d+ /.test(lines[i]);
    const parsed = parseChecklistLine(lines, i);
    if (parsed) {
      // A row whose status isn't a real status is malformed — surfaced below
      // instead of silently treated as `todo`, or the task could never roll
      // up to `done` while never being picked up as runnable either.
      if (!isOwner(parsed.owner) || !isStatus(parsed.status)) {
        console.warn(
          `[loop] ${path}: ignoring malformed row "${parsed.id}" (owner/status tag not recognized)`,
        );
        continue;
      }
      rows.push({
        id: parsed.id,
        task: parsed.task,
        owner: parsed.owner,
        status: parsed.status,
        notes: parsed.notes,
        lineIndex: parsed.lineIndex,
        noteLineIndex: parsed.noteLineIndex,
      });
    } else if (looksLikeTask) {
      console.warn(
        `[loop] ${path}: ignoring malformed row at line ${i + 1} (expected "- [ ] Txxx [agent|human] [status:...] ...")`,
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
  return rows.filter((r) => r.owner === 'human' && r.status !== 'done');
}

export function allTasksSettled(rows: TaskRow[]): boolean {
  return rows.every((r) => r.status === 'done' || r.owner === 'human');
}

/**
 * Rewrites only the checkbox, the `[status:...]` tag, and the note line for
 * one task — every other part of the line (owner tag, description, any
 * future tag) is left byte-for-byte untouched.
 */
export function writeTaskStatus(
  path: string,
  taskId: string,
  status: TaskStatus,
  notes = '',
): void {
  const lines = readFileSync(path, 'utf8').split('\n');
  for (let i = 0; i < lines.length; i++) {
    const parsed = parseChecklistLine(lines, i);
    if (!parsed || parsed.id !== taskId) continue;

    lines[i] = renderTaskLine(parsed.id, parsed.owner, status, parsed.task);
    const cleanNotes = sanitizeNote(notes);
    const hasNoteLine = parsed.noteLineIndex !== undefined;
    if (cleanNotes) {
      const noteLine = renderNoteLine(cleanNotes);
      if (hasNoteLine) {
        lines[parsed.noteLineIndex!] = noteLine;
      } else {
        lines.splice(i + 1, 0, noteLine);
      }
    } else if (hasNoteLine) {
      lines.splice(parsed.noteLineIndex!, 1);
    }
    break;
  }
  writeFileSync(path, lines.join('\n'));
}
