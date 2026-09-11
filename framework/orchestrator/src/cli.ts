import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadConfig } from './config.js';
import {
  parseRoadmap,
  pickNextSpec,
  writeSpecStatus,
  type SpecRef,
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
import { registerTaskPid, clearTaskPid, isTaskStillRunning } from './taskLock.js';

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

function specHasRunnableWork(spec: SpecRef): boolean {
  try {
    const tasks = parseTasks(tasksPath(cwd, spec.id, spec.name));
    return !!nextRunnableTask(tasks);
  } catch {
    return false;
  }
}

function run(): void {
  const config = loadConfig(cwd);
  clearStop(config, cwd);
  const roadmap = parseRoadmap(cwd);
  const spec = pickNextSpec(roadmap, specHasRunnableWork);
  if (!spec) {
    console.log(
      '[loop] nothing eligible to run — check planning/roadmap.md status/deps, or every eligible spec has no runnable tasks yet.',
    );
    return;
  }
  const path = tasksPath(cwd, spec.id, spec.name);
  console.log(`[loop] working spec ${spec.id}-${spec.name}`);

  // Round-robins across config.workers by task order, across all specs the
  // loop works in one `run()` call.
  let workerIndex = 0;

  for (;;) {
    if (isStopRequested(config, cwd)) {
      console.log('[loop] stop requested — not starting a new task.');
      break;
    }
    const tasks = parseTasks(path);
    const task = nextRunnableTask(tasks);
    if (!task) {
      // A task can sit at `in_progress` with nothing actually working it: the
      // process that was running it (this loop, or a detached split-pane) got
      // killed without going through safeStop's clean path. nextRunnableTask
      // deliberately won't resume an `in_progress` row on its own — that's
      // right when the registered owner is still alive — so recover only the
      // ones whose owner is provably gone before giving up on this spec.
      const stuck = tasks.filter(
        (t) =>
          t.owner === 'agent' &&
          t.status === 'in_progress' &&
          !isTaskStillRunning(config, cwd, spec.id, t.id),
      );
      if (stuck.length > 0) {
        for (const t of stuck) {
          writeTaskStatus(
            path,
            t.id,
            'interrupted',
            'recovered — no live process was still working this task',
          );
          clearTaskPid(config, cwd, spec.id, t.id);
        }
        console.log(
          `[loop] recovered ${stuck.length} task(s) left in_progress by a process that's gone: ${stuck
            .map((t) => t.id)
            .join(', ')}`,
        );
        continue;
      }
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
    if (config.splitMode === 'none') {
      // Only `none` mode blocks on the worker in this same process — a
      // detached split-pane registers its own PID from inside `runTask`.
      registerTaskPid(config, cwd, spec.id, task.id);
    }
    writeTaskStatus(path, task.id, 'in_progress', task.notes);
    const result = dispatchTask(config, spec, task, cwd, workerIndex);
    workerIndex++;

    if (config.splitMode !== 'none') {
      // Detached pane owns this task's final status flip; move on.
      continue;
    }
    clearTaskPid(config, cwd, spec.id, task.id);
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
function runTask(
  specId: string,
  specName: string,
  taskId: string,
  workerIndexArg: string,
): void {
  const config = loadConfig(cwd);
  const path = tasksPath(cwd, specId, specName);
  const tasks = parseTasks(path);
  const task = tasks.find((t) => t.id === taskId);
  if (!task) throw new Error(`Task ${taskId} not found in ${path}`);

  console.log(`[loop] running task ${task.id}: ${task.task}`);
  // specId/specName/workerIndex arrive as arguments from the split-pane
  // launcher, which runs in its own detached process with no access to the
  // master's in-memory round-robin counter. This process's own PID is this
  // task's true owner while it runs — the master already moved on.
  registerTaskPid(config, cwd, specId, taskId);
  const workerIndex = Number(workerIndexArg ?? 0) || 0;
  const { ok, log } = runWorkerSync(
    config,
    { id: specId, name: specName },
    task,
    cwd,
    workerIndex,
  );
  mkdirSync(join(cwd, config.logDir), { recursive: true });
  writeFileSync(join(cwd, config.logDir, `${specId}-${task.id}.log`), log);
  const lastLine = log.trim().split('\n').pop() ?? '';
  clearTaskPid(config, cwd, specId, taskId);

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
    runTask(args[0], args[1], args[2], args[3]);
    break;
  default:
    console.log('Usage: loop <run|stop|status>');
    process.exitCode = 1;
}
