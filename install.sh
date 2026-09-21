#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage: install.sh [--global | --local] [--version VERSION] [--force]

Install specloop skills from the GitHub release tarball.
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
tar -xzf "$archive" -C "$extracted" --strip-components=1

if [[ ! -f "$extracted/status/SKILL.md" ]]; then
  echo "The release archive does not contain a skills tree" >&2
  exit 1
fi

destinations=()
if [[ "$scope" == "local" ]]; then
  destinations+=("$PWD/.agents/skills")
else
  destinations+=("${HOME:?}/.agents/skills")
  [[ -d "$PWD/.claude" ]] && destinations+=("${HOME:?}/.claude/skills")
  [[ -d "$PWD/.opencode" ]] && destinations+=("${HOME:?}/.config/opencode/skills")
  [[ -d "$PWD/.cursor" ]] && destinations+=("${HOME:?}/.cursor/skills")
  [[ -d "$PWD/.github" ]] && destinations+=("${HOME:?}/.copilot/skills")
fi

for destination in "${destinations[@]}"; do
  mkdir -p "$destination"
  if ((force)); then
    cp -Rf "$extracted/." "$destination/"
  else
    # Copying the same relative tree again is intentionally idempotent.
    cp -R "$extracted/." "$destination/"
  fi
  echo "Installed skills in $destination"
done
