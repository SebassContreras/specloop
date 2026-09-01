import { spawn } from "node:child_process";
import type { SpecRef } from "./index.js";
import type { TaskRow } from "../tasks.js";

export function runInTmux(spec: SpecRef, task: TaskRow, cwd: string): void {
  const runTaskCmd = `loop _run-task ${spec.id} ${spec.name} ${task.id}`;
  spawn("tmux", ["split-window", "-c", cwd, runTaskCmd], {
    stdio: "ignore",
    detached: true,
  }).unref();
}
