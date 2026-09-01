import { readFileSync } from "node:fs";
import { join } from "node:path";

export type SpecStatus = "todo" | "in_progress" | "blocked" | "interrupted" | "done";

export interface RoadmapRow {
  id: string;
  name: string;
  status: SpecStatus;
  dependsOn: string[];
}

// Matches roadmap.md's fixed `| ID | Plan | Status | Depends on |` row shape.
// The header/separator rows never match: "ID" and "---" aren't \d{3}.
const ROW_RE = /^\|\s*(\d{3})\s*\|\s*([^|]+?)\s*\|\s*([a-z_]+)\s*\|\s*([^|]*?)\s*\|\s*$/;

export function parseRoadmap(cwd: string = process.cwd()): RoadmapRow[] {
  const text = readFileSync(join(cwd, "docs", "roadmap.md"), "utf8");
  const rows: RoadmapRow[] = [];
  for (const line of text.split("\n")) {
    const m = ROW_RE.exec(line.trim());
    if (!m) continue;
    const [, id, name, status, dependsOnRaw] = m;
    const dependsOn = dependsOnRaw.trim();
    rows.push({
      id,
      name: name.trim(),
      status: status.trim() as SpecStatus,
      dependsOn:
        dependsOn === "" || dependsOn === "—" || dependsOn === "-"
          ? []
          : dependsOn.split(",").map((s) => s.trim()),
    });
  }
  return rows;
}

export function pickNextSpec(rows: RoadmapRow[]): RoadmapRow | undefined {
  const byId = new Map(rows.map((r) => [r.id, r]));
  const resuming = rows.find((r) => r.status === "in_progress");
  if (resuming) return resuming;
  return rows
    .filter((r) => r.status === "todo")
    .find((r) => r.dependsOn.every((dep) => byId.get(dep)?.status === "done"));
}
