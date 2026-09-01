import type { LoopConfig } from "../config.js";
import type { TaskRow } from "../tasks.js";
import { runNone, type RunResult } from "./none.js";
import { runInWindowsTerminal } from "./windowsTerminal.js";
import { runInTmux } from "./tmux.js";

export interface SpecRef {
  id: string;
  name: string;
}

/**
 * `"none"` runs synchronously and returns the result so the master can flip
 * the task's status itself. The split-pane modes return `undefined` — they
 * hand the task off to a detached pane that flips its own status later, so
 * the master moves on without waiting.
 */
export function dispatchTask(
  config: LoopConfig,
  spec: SpecRef,
  task: TaskRow,
  cwd: string
): RunResult | undefined {
  switch (config.splitMode) {
    case "none":
      return runNone(config, task, cwd);
    case "windowsTerminal":
      runInWindowsTerminal(spec, task, cwd);
      return undefined;
    case "tmux":
      runInTmux(spec, task, cwd);
      return undefined;
    default:
      throw new Error(`Unknown splitMode: ${config.splitMode}`);
  }
}
