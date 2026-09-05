/**
 * GFM checkbox-list parsing for `tasks.md`, sibling to `mdTable.ts` (which
 * stays pipe-table-based for `roadmap.ts` — there's no checkbox equivalent for
 * a status-across-many-specs index).
 *
 * A task line is identified purely by its start (`- [ ] `/`- [x] ` at column
 * 0), never by counting delimiters across the line — unlike the old pipe
 * table, nothing here can be shredded by a stray character in the task text.
 */

const TASK_LINE =
  /^- \[([ x])\] (T\d+) \[(agent|human)\] \[status:(\w+)\] (.*)$/;
const NOTE_LINE = /^\s{2,}└─\s?(.*)$/;

export interface ChecklistLine {
  lineIndex: number;
  checked: boolean;
  id: string;
  owner: string;
  status: string;
  task: string;
  /** Index of the note continuation line, if one follows this task line. */
  noteLineIndex?: number;
  notes: string;
}

export function parseChecklistLine(
  lines: string[],
  index: number,
): ChecklistLine | undefined {
  const match = TASK_LINE.exec(lines[index]);
  if (!match) return undefined;
  const [, box, id, owner, status, task] = match;
  const noteMatch =
    index + 1 < lines.length ? NOTE_LINE.exec(lines[index + 1]) : null;
  return {
    lineIndex: index,
    checked: box === 'x',
    id,
    owner,
    status,
    task,
    noteLineIndex: noteMatch ? index + 1 : undefined,
    notes: noteMatch ? noteMatch[1] : '',
  };
}

/** Renders a single task line (no note line) — used for a fresh write. */
export function renderTaskLine(
  id: string,
  owner: string,
  status: string,
  task: string,
): string {
  const box = status === 'done' ? 'x' : ' ';
  return `- [${box}] ${id} [${owner}] [status:${status}] ${task}`;
}

export function renderNoteLine(notes: string): string {
  return `      └─ ${sanitizeNote(notes)}`;
}

/**
 * Notes come from worker log output — strip newlines so a multi-line log tail
 * can't be mistaken for a new task line or a second note line.
 */
export function sanitizeNote(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').trim();
}
