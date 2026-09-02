import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadConfig } from './config.js';
import {
  parseRoadmap,
  pickNextSpec,
  writeSpecStatus,
  type SpecStatus,
} from './roadmap.js';
import {
  parseTasks,
  tasksPath,
  nextRunnableTask,
  writeTaskStatus,
  pendingHumanTasks,
  type TaskRow,
} from './tasks.js';
import { runWorkerSync } from './worker.js';
import { dispatchTask } from './splitPane/index.js';
import {
  requestStop,
  isStopRequested,
  clearStop,
  markInterrupted,
} from './safeStop.js';

const cwd = process.cwd();

/**
 * Rolls a spec's task states up into the single status the roadmap records.
 * `human` tasks don't hold a spec open — the loop can't act on them, so a spec
 * whose only remaining work is the user's counts as done from the loop's side
 * and is reported separately.
 */
function rollUpStatus(tasks: TaskRow[]): SpecStatus {
  if (tasks.length === 0) return 'todo';
  const agentTasks = tasks.filter((t) => t.owner === 'agent');
  if (agentTasks.some((t) => t.status === 'blocked')) return 'blocked';
  if (agentTasks.some((t) => t.status === 'interrupted')) return 'interrupted';
  if (agentTasks.every((t) => t.status === 'done')) return 'done';
  return 'in_progress';
}

function run(): void {
  const config = loadConfig(cwd);
  clearStop(config, cwd);
  const roadmap = parseRoadmap(cwd);
  const spec = pickNextSpec(roadmap);
  if (!spec) {
    console.log(
      '[loop] nothing eligible to run — check docs/roadmap.md status/deps.',
    );
    return;
  }
  const path = tasksPath(cwd, spec.id, spec.name);
  console.log(`[loop] working spec ${spec.id}-${spec.name}`);

  for (;;) {
    if (isStopRequested(config, cwd)) {
      console.log('[loop] stop requested — not starting a new task.');
      break;
    }
    const tasks = parseTasks(path);
    const task = nextRunnableTask(tasks);
    if (!task) {
      // The roadmap's Status column has no other writer: without this the row
      // stays in_progress forever, pickNextSpec keeps resuming this same spec,
      // and no todo row can ever become eligible.
      writeSpecStatus(cwd, spec.id, rollUpStatus(tasks));
      console.log(`[loop] spec ${spec.id} has no remaining runnable tasks.`);
      const human = pendingHumanTasks(tasks);
      if (human.length > 0) {
        console.log(
          `[loop] ${human.length} task(s) need you: ${human
            .map((t) => t.id)
            .join(', ')}`,
        );
      }
      break;
    }
    writeTaskStatus(path, task.id, 'in_progress', task.notes);
    const result = dispatchTask(config, spec, task, cwd);

    if (config.splitMode !== 'none') {
      // Detached pane owns this task's final status flip; move on.
      continue;
    }
    if (isStopRequested(config, cwd)) {
      markInterrupted(path, task.id, result?.lastLogLine ?? '');
      break;
    }
    writeTaskStatus(
      path,
      task.id,
      result?.ok ? 'done' : 'blocked',
      result?.lastLogLine ?? '',
    );
  }
}

/** Invoked inside a split-pane by windowsTerminal.ts / tmux.ts — one task, one process. */
function runTask(specId: string, specName: string, taskId: string): void {
  const config = loadConfig(cwd);
  const path = tasksPath(cwd, specId, specName);
  const tasks = parseTasks(path);
  const task = tasks.find((t) => t.id === taskId);
  if (!task) throw new Error(`Task ${taskId} not found in ${path}`);

  console.log(`[loop] running task ${task.id}: ${task.task}`);
  // specId/specName arrive as arguments from the split-pane launcher and were
  // previously dropped here, leaving the in-pane worker with no spec context.
  const { ok, log } = runWorkerSync(
    config,
    { id: specId, name: specName },
    task,
    cwd,
  );
  mkdirSync(join(cwd, config.logDir), { recursive: true });
  writeFileSync(join(cwd, config.logDir, `${specId}-${task.id}.log`), log);
  const lastLine = log.trim().split('\n').pop() ?? '';

  if (isStopRequested(config, cwd)) {
    markInterrupted(path, task.id, lastLine);
    return;
  }
  writeTaskStatus(path, task.id, ok ? 'done' : 'blocked', lastLine);
}

function stop(): void {
  const config = loadConfig(cwd);
  requestStop(config, cwd);
  console.log('[loop] stop requested — active work will wind down safely.');
}

function status(): void {
  const roadmap = parseRoadmap(cwd);
  for (const spec of roadmap) {
    // Derive from tasks.md rather than echoing the roadmap cell, so a stale or
    // hand-edited Status is visible instead of being reported as truth.
    let derived = '';
    try {
      const tasks = parseTasks(tasksPath(cwd, spec.id, spec.name));
      const rolled = rollUpStatus(tasks);
      const human = pendingHumanTasks(tasks);
      if (rolled !== spec.status) derived = `  (tasks say: ${rolled})`;
      if (human.length > 0) derived += `  [${human.length} for you]`;
    } catch {
      derived = '  (no tasks.md)';
    }
    console.log(`${spec.id} ${spec.name} — ${spec.status}${derived}`);
  }
}

const [, , command, ...args] = process.argv;
switch (command) {
  case 'run':
    run();
    break;
  case 'stop':
    stop();
    break;
  case 'status':
    status();
    break;
  case '_run-task':
    runTask(args[0], args[1], args[2]);
    break;
  default:
    console.log('Usage: loop <run|stop|status>');
    process.exitCode = 1;
}
