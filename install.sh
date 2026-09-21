#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage: install.sh [--global | --local] [--version VERSION] [--force]

Install specloop skills from the GitHub release tarball.

Skills go to .agents/skills (read by OpenCode, Codex, Cursor, Copilot, Antigravity)
and, when a .claude directory exists, to .claude/skills (read by Claude Code).
An existing install is left alone unless --force is given.
EOF
}

scope="local"
version="latest"
force=0

while (($#)); do
  case "$1" in
    --global)
      scope="global"
      ;;
    --local)
      scope="local"
      ;;
    --version)
      if (($# < 2)); then
        echo "--version requires a value" >&2
        exit 2
      fi
      version="$2"
      shift
      ;;
    --force)
      force=1
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage >&2
      exit 2
      ;;
  esac
  shift
done

repo="SebassContreras/specloop"
asset="specloop-skills.tar.gz"
if [[ "$version" == "latest" ]]; then
  url="https://github.com/$repo/releases/latest/download/$asset"
else
  url="https://github.com/$repo/releases/download/$version/$asset"
fi

if ! command -v curl >/dev/null 2>&1; then
  echo "curl is required" >&2
  exit 1
fi
if ! command -v tar >/dev/null 2>&1; then
  echo "tar is required" >&2
  exit 1
fi

temp_dir="$(mktemp -d)"
trap 'rm -rf "$temp_dir"' EXIT

archive="$temp_dir/$asset"
extracted="$temp_dir/extracted"
mkdir -p "$extracted"

echo "Downloading $url"
curl -fsSL "$url" -o "$archive"
tar -xzf "$archive" -C "$extracted"
source_dir="$extracted/skills"

if [[ ! -f "$source_dir/status/SKILL.md" ]]; then
  echo "The release archive does not contain a skills tree" >&2
  exit 1
fi

if [[ "$scope" == "local" ]]; then
  base="$PWD"
else
  base="${HOME:?}"
fi

destinations=("$base/.agents/skills")
[[ -d "$base/.claude" ]] && destinations+=("$base/.claude/skills")

for destination in "${destinations[@]}"; do
  if [[ -f "$destination/status/SKILL.md" && $force -eq 0 ]]; then
    echo "Already installed in $destination (use --force to overwrite)"
    continue
  fi
  mkdir -p "$destination"
  cp -R "$source_dir/." "$destination/"
  echo "Installed skills in $destination"
done
