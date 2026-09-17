#!/usr/bin/env python3
"""Regenerate planning/dashboard.html from planning/roadmap.md and every spec's tasks.md.

Replaces skills/status/SKILL.md's former Phases 0-5 prose algorithm (030-dashboard-
build-script) so every harness gets byte-identical output instead of re-implementing
the same read/compute/escape steps freehand. No arguments; the working directory must
be the *target* repo's root (planning/roadmap.md, every spec's tasks.md, and
planning/dashboard.html are all read/written relative to it) — this script is
typically invoked from a different directory than its own (it ships inside the
specloop plugin install, the target repo is wherever the skill is actually running),
so its own bundled template.html is located relative to this file, never to cwd.
Standard library only, no pip install. Deterministic: every listing is sorted
explicitly and no wall-clock value is embedded in the written file, so unchanged
input always produces byte-identical output.
"""

import json
import re
import sys
from pathlib import Path

ROADMAP_PATH = Path("planning/roadmap.md")
FIX_LOG_DIR = Path("planning/fix")
# Bundled with this script inside the plugin, not the target repo — resolve relative
# to this file's own location, never to cwd (the target repo's root).
TEMPLATE_PATH = Path(__file__).resolve().parent.parent / "references" / "template.html"
OUTPUT_PATH = Path("planning/dashboard.html")

TASK_LINE_RE = re.compile(r"^- \[([ xX])\] (T\d+) \[(\w+)\] \[status:(\w+)\] (.*)$")
NOTE_LINE_RE = re.compile(r"^ {6}└─ ?(.*)$")
FIX_FILENAME_RE = re.compile(r"^(\d+)-(.+)\.md$")
CLOSE_SCRIPT_RE = re.compile(r"</(script)", re.IGNORECASE)

TASK_STATUSES = ("todo", "in_progress", "blocked", "interrupted", "done")


def fail(message):
    print(f"error: {message}", file=sys.stderr)
    sys.exit(1)


def parse_depends_on(raw):
    """"1, 2" -> ["1", "2"]; "" or "—" -> []."""
    raw = (raw or "").strip()
    if not raw or raw == "—" or raw == "-":
        return []
    return [part.strip() for part in raw.split(",") if part.strip()]


def priority_sort_key(priority):
    """Numeric priorities sort low-to-high; "—" (or anything non-numeric) sorts last."""
    priority = (priority or "").strip()
    return (0, int(priority)) if priority.isdigit() else (1, 0)


def parse_roadmap(text):
    """Read the roadmap table positionally (first four cells required, Stage/Priority
    trailing and optional) — same contract skills/loop and skills/status already use,
    so a row from before those two columns existed is still read correctly."""
    specs = []
    for line in text.splitlines():
        line = line.strip()
        if not line.startswith("|"):
            continue
        cells = [c.strip() for c in line.strip("|").split("|")]
        if len(cells) < 4 or not re.fullmatch(r"\d+", cells[0]):
            continue  # header/separator rows, or anything not a spec ID
        specs.append({
            "id": cells[0],
            "plan": cells[1],
            "status": cells[2],
            "dependsOnRaw": cells[3],
            "stage": cells[4].strip() if len(cells) > 4 and cells[4].strip() else "—",
            "priority": cells[5].strip() if len(cells) > 5 and cells[5].strip() else "—",
        })
    specs.sort(key=lambda s: s["id"])
    return specs


def parse_tasks(text):
    """Same grammar as skills/loop: a task line starts at column 0; an optional note
    line follows, indented exactly 6 spaces then the box-drawing continuation mark."""
    tasks = []
    for line in text.splitlines():
        m = TASK_LINE_RE.match(line)
        if m:
            checked, task_id, owner, status, task_text = m.groups()
            tasks.append({
                "id": task_id,
                "owner": owner,
                "status": status,
                "text": task_text.strip(),
                "note": "",
                "checked": checked in ("x", "X"),
            })
            continue
        nm = NOTE_LINE_RE.match(line)
        if nm and tasks and not tasks[-1]["note"]:
            tasks[-1]["note"] = nm.group(1).strip()
    return tasks


def count_by_status(tasks):
    counts = {status: 0 for status in TASK_STATUSES}
    for task in tasks:
        if task["status"] in counts:
            counts[task["status"]] += 1
    return counts


def design_is_stub(design_path):
    """Same stub skills/design-closing refuses to build on: a title line followed by
    nothing but the "TBD" placeholder."""
    if not design_path.exists():
        return True
    lines = design_path.read_text(encoding="utf-8").splitlines()
    body_lines = lines[1:] if lines and lines[0].startswith("#") else lines
    return "\n".join(body_lines).strip().startswith("TBD")


def load_specs():
    """Phase 0 equivalent: read the roadmap, then every listed spec's own tasks.md
    (and design.md, for the Stage/Status drift checks below)."""
    if not ROADMAP_PATH.exists():
        fail(f"{ROADMAP_PATH} not found — run this script from the repo root")
    specs = parse_roadmap(ROADMAP_PATH.read_text(encoding="utf-8"))

    for spec in specs:
        spec_dir = Path("planning/specs") / f"{spec['id']}-{spec['plan']}"
        tasks_path = spec_dir / "tasks.md"
        tasks_text = tasks_path.read_text(encoding="utf-8") if tasks_path.exists() else ""
        spec["tasks"] = parse_tasks(tasks_text)
        spec["counts"] = count_by_status(spec["tasks"])
        spec["dependsOn"] = parse_depends_on(spec["dependsOnRaw"])
        spec["designIsStub"] = design_is_stub(spec_dir / "design.md")

    return specs


def compute_next_eligible(specs):
    """Phase 1.1's eligibility rule, reused verbatim for the "nextEligible" flag: the
    in_progress row if one exists, else the lowest-Priority todo row whose every
    dependency is done and that has at least one runnable ([agent], todo/interrupted)
    task. Returns the eligible spec's id, or None if nothing is eligible."""
    in_progress = [s for s in specs if s["status"] == "in_progress"]
    if in_progress:
        return sorted(in_progress, key=lambda s: s["id"])[0]["id"]

    specs_by_id = {s["id"]: s for s in specs}
    candidates = []
    for spec in specs:
        if spec["status"] != "todo":
            continue
        if not all(specs_by_id.get(dep, {}).get("status") == "done" for dep in spec["dependsOn"]):
            continue
        has_runnable = any(
            t["owner"] == "agent" and t["status"] in ("todo", "interrupted")
            for t in spec["tasks"]
        )
        if has_runnable:
            candidates.append(spec)

    if not candidates:
        return None
    return sorted(candidates, key=lambda s: (priority_sort_key(s["priority"]), s["id"]))[0]["id"]


def detect_drift(specs):
    """Phase 2's five Stage/Status drift rules, checked in order for every spec (already
    sorted by id), so the resulting list needs no further sort to stay deterministic."""
    drift = []

    def flag(spec_id, rule, message):
        drift.append({"specId": spec_id, "rule": rule, "message": message})

    for spec in specs:
        sid, status, stage, tasks = spec["id"], spec["status"], spec["stage"], spec["tasks"]
        agent_tasks = [t for t in tasks if t["owner"] == "agent"]

        # 1. done but Stage wasn't reset to "—" (planning/fix/002-stage-not-reset-on-done).
        if status == "done" and stage != "—":
            flag(sid, "stage-not-reset-on-done", f"Status done, Stage {stage} — expected —")

        # 2. Stage claims tasks exist (tasks_ready/looping) but tasks.md is still the
        #    header-only stub.
        if stage in ("tasks_ready", "looping") and not tasks:
            flag(sid, "tasks-stub-but-stage-advanced",
                 f"Stage {stage} but tasks.md has no task lines")

        # 3. Stage claims design is closed but design.md is still the TBD stub.
        if stage in ("design_closed", "tasks_ready", "looping") and spec["designIsStub"]:
            flag(sid, "design-stub-but-stage-advanced",
                 f"Stage {stage} but design.md is still the TBD stub")

        # 4. done but not every [agent] task is actually checked done.
        unfinished = [t["id"] for t in agent_tasks if not (t["checked"] and t["status"] == "done")]
        if status == "done" and unfinished:
            flag(sid, "done-but-tasks-incomplete",
                 f"Status done but task(s) {', '.join(unfinished)} not done")

        # 5. Status isn't blocked while some [agent] task is stuck.
        stuck = [t["id"] for t in agent_tasks if t["status"] in ("blocked", "interrupted")]
        if status != "blocked" and stuck:
            flag(sid, "stuck-task-but-status-not-blocked",
                 f"Status {status} while task(s) {', '.join(stuck)} are blocked/interrupted")

    return drift


def extract_section(text, header):
    pattern = re.compile(
        r"^##\s+" + re.escape(header) + r"\s*$\n(.*?)(?=^##\s|\Z)",
        re.MULTILINE | re.DOTALL,
    )
    match = pattern.search(text)
    return match.group(1).strip() if match else ""


def load_fixes():
    """Phase 4 equivalent: planning/fix/ not existing is a normal empty result, not
    an error — skills/fix/SKILL.md is the only writer and names every file NNN-name.md."""
    if not FIX_LOG_DIR.exists():
        return []

    fixes = []
    for path in FIX_LOG_DIR.glob("*.md"):
        m = FIX_FILENAME_RE.match(path.name)
        if not m:
            continue
        fix_id, name = m.groups()
        text = path.read_text(encoding="utf-8")
        fixes.append({
            "id": fix_id,
            "name": name,
            "scope": extract_section(text, "Scope"),
            "status": extract_section(text, "Status"),
            "date": extract_section(text, "Date"),
            "found": extract_section(text, "Found"),
            "fix": extract_section(text, "Fix"),
        })
    fixes.sort(key=lambda f: f["id"])
    return fixes


def build_data(specs, drift, fixes):
    """Assemble the JSON contract skills/status/references/template.html expects.
    generatedAt is deliberately left blank rather than a real timestamp — embedding
    wall-clock time here would break the byte-identical-output determinism guarantee;
    the template already renders no "Generated" line when the field is empty."""
    eligible_id = compute_next_eligible(specs)
    totals = {status: 0 for status in TASK_STATUSES}

    spec_entries = []
    for spec in specs:
        for status, n in spec["counts"].items():
            totals[status] += n
        spec_entries.append({
            "id": spec["id"],
            "plan": spec["plan"],
            "status": spec["status"],
            "dependsOn": spec["dependsOn"],
            "stage": spec["stage"],
            "priority": spec["priority"],
            "nextEligible": spec["id"] == eligible_id,
            "counts": spec["counts"],
            "tasks": [
                {"id": t["id"], "owner": t["owner"], "status": t["status"],
                 "text": t["text"], "note": t["note"]}
                for t in spec["tasks"]
            ],
        })

    return {
        "generatedAt": "",
        "specs": spec_entries,
        "totals": totals,
        "drift": drift,
        "fixes": fixes,
    }


def render_dashboard(data):
    if not TEMPLATE_PATH.exists():
        fail(f"{TEMPLATE_PATH} not found — plugin install is missing its own references/template.html")
    template = TEMPLATE_PATH.read_text(encoding="utf-8")

    placeholder = "__DASHBOARD_DATA_JSON__"
    if template.count(placeholder) != 1:
        fail(f"expected exactly one {placeholder} occurrence in {TEMPLATE_PATH}, "
             f"found {template.count(placeholder)}")

    json_text = json.dumps(data, ensure_ascii=True, indent=2)
    # Neutralize every "</script" (any case) inside a string value so untrusted task
    # text or fix-log notes can never close the tag early.
    json_text = CLOSE_SCRIPT_RE.sub(lambda m: "<\\/" + m.group(1), json_text)

    return template.replace(placeholder, json_text, 1)


def main():
    specs = load_specs()
    drift = detect_drift(specs)
    fixes = load_fixes()
    data = build_data(specs, drift, fixes)
    html = render_dashboard(data)

    with open(OUTPUT_PATH, "w", encoding="utf-8", newline="\n") as f:
        f.write(html)

    print(f"Wrote {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
