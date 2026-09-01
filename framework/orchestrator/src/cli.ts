import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { loadConfig } from "./config.js";
import { parseRoadmap, pickNextSpec } from "./roadmap.js";
import { parseTasks, tasksPath, nextRunnableTask, writeTaskStatus } from "./tasks.js";
import { runWorkerSync } from "./worker.js";
import { dispatchTask } from "./splitPane/index.js";
import { requestStop, isStopRequested, clearStop, markInterrupted } from "./safeStop.js";

const cwd = process.cwd();

function run(): void {
  const config = loadConfig(cwd);
  clearStop(config, cwd);
  const roadmap = parseRoadmap(cwd);
  const spec = pickNextSpec(roadmap);
  if (!spec) {
    console.log("[loop] nothing eligible to run — check docs/roadmap.md status/deps.");
    return;
  }
  const path = tasksPath(cwd, spec.id, spec.name);
  console.log(`[loop] working spec ${spec.id}-${spec.name}`);

  for (;;) {
    if (isStopRequested(config, cwd)) {
      console.log("[loop] stop requested — not starting a new task.");
      break;
    }
    const tasks = parseTasks(path);
    const task = nextRunnableTask(tasks);
    if (!task) {
      console.log(`[loop] spec ${spec.id} has no remaining runnable tasks.`);
      break;
    }
    writeTaskStatus(path, task.id, "in_progress", task.notes);
    const result = dispatchTask(config, spec, task, cwd);

    if (config.splitMode !== "none") {
      // Detached pane owns this task's final status flip; move on.
      continue;
    }
    if (isStopRequested(config, cwd)) {
      markInterrupted(path, task.id, result?.lastLogLine ?? "");
      break;
    }
    writeTaskStatus(path, task.id, result?.ok ? "done" : "blocked", result?.lastLogLine ?? "");
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
  const { ok, log } = runWorkerSync(config, task);
  mkdirSync(join(cwd, config.logDir), { recursive: true });
  writeFileSync(join(cwd, config.logDir, `${specId}-${task.id}.log`), log);
  const lastLine = log.trim().split("\n").pop() ?? "";

  if (isStopRequested(config, cwd)) {
    markInterrupted(path, task.id, lastLine);
    return;
  }
  writeTaskStatus(path, task.id, ok ? "done" : "blocked", lastLine);
}

function stop(): void {
  const config = loadConfig(cwd);
  requestStop(config, cwd);
  console.log("[loop] stop requested — active work will wind down safely.");
}

function status(): void {
  const roadmap = parseRoadmap(cwd);
  for (const spec of roadmap) {
    console.log(`${spec.id} ${spec.name} — ${spec.status}`);
  }
}

const [, , command, ...args] = process.argv;
switch (command) {
  case "run":
    run();
    break;
  case "stop":
    stop();
    break;
  case "status":
    status();
    break;
  case "_run-task":
    runTask(args[0], args[1], args[2]);
    break;
  default:
    console.log("Usage: loop <run|stop|status>");
    process.exitCode = 1;
}
