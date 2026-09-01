import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export type TaskStatus = "todo" | "in_progress" | "blocked" | "interrupted" | "done";

export interface TaskRow {
  id: string;
  task: string;
  status: TaskStatus;
  notes: string;
}

// Matches the fixed `| ID | Task | Status | Notes |` row shape from 001's design.
const ROW_RE = /^\|\s*([A-Za-z0-9]+)\s*\|\s*(.+?)\s*\|\s*([a-z_]+)\s*\|\s*(.*?)\s*\|\s*$/;

function specDir(cwd: string, specId: string, specName: string): string {
  return join(cwd, "docs", "specs", `${specId}-${specName}`);
}

export function tasksPath(cwd: string, specId: string, specName: string): string {
  return join(specDir(cwd, specId, specName), "tasks.md");
}

export function parseTasks(path: string): TaskRow[] {
  const text = readFileSync(path, "utf8");
  const rows: TaskRow[] = [];
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("|")) continue;
    const m = ROW_RE.exec(trimmed);
    if (!m) continue;
    const [, id, task, status, notes] = m;
    if (id === "ID" || /^-+$/.test(id)) continue;
    rows.push({ id, task, status: status as TaskStatus, notes });
  }
  return rows;
}

export function nextRunnableTask(rows: TaskRow[]): TaskRow | undefined {
  return rows.find((r) => r.status === "interrupted") ?? rows.find((r) => r.status === "todo");
}

export function writeTaskStatus(
  path: string,
  taskId: string,
  status: TaskStatus,
  notes = ""
): void {
  const text = readFileSync(path, "utf8");
  const lines = text.split("\n").map((line) => {
    const trimmed = line.trim();
    if (!trimmed.startsWith("|")) return line;
    const m = ROW_RE.exec(trimmed);
    if (!m || m[1] !== taskId) return line;
    return `| ${m[1]} | ${m[2]} | ${status} | ${notes} |`;
  });
  writeFileSync(path, lines.join("\n"));
}
