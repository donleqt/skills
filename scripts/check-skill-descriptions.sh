#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
min_chars=120
max_chars=200
failed=0

check_skill() {
  local skill_file="$1"
  local skill_name
  skill_name="$(basename "$(dirname "$skill_file")")"

  python3 - "$skill_file" "$skill_name" "$min_chars" "$max_chars" <<'PY'
import re
import sys

path, name, min_chars, max_chars = sys.argv[1:5]
min_chars = int(min_chars)
max_chars = int(max_chars)
text = open(path, encoding="utf-8").read()
match = re.match(r"^---\n(.*?)\n---", text, re.S)
if not match:
    print(f"FAIL {name}: missing YAML frontmatter")
    sys.exit(1)

frontmatter = match.group(1)
desc_match = re.search(r"^description:\s*(.*)$", frontmatter, re.M)
if not desc_match:
    print(f"FAIL {name}: missing description")
    sys.exit(1)

raw = desc_match.group(1).strip()
if re.match(r"^[>|]", raw):
    print(f"FAIL {name}: description uses multi-line YAML block scalar")
    sys.exit(1)

if raw.startswith(('"', "'")):
    desc = raw.strip('"').strip("'")
else:
    desc = raw

if "\n" in desc:
    print(f"FAIL {name}: description contains embedded newlines")
    sys.exit(1)

if len(desc) < min_chars:
    print(f"FAIL {name}: description is {len(desc)} chars (min {min_chars})")
    sys.exit(1)

if len(desc) > max_chars:
    print(f"FAIL {name}: description is {len(desc)} chars (max {max_chars})")
    sys.exit(1)

if not desc.endswith("."):
    print(f"FAIL {name}: description should end with a period")
    sys.exit(1)

print(f"OK   {name}: {len(desc)} chars")
PY
}

if [[ $# -gt 0 ]]; then
  for skill_file in "$@"; do
    if ! check_skill "$skill_file"; then
      failed=1
    fi
  done
else
  while IFS= read -r skill_file; do
    if ! check_skill "$skill_file"; then
      failed=1
    fi
  done < <(find "$root" -mindepth 2 -maxdepth 2 -name SKILL.md \
    ! -path "$root/scripts/*" | sort)
fi

if [[ "$failed" -ne 0 ]]; then
  echo
  echo "Skill description check failed."
  exit 1
fi

echo
echo "All skill descriptions passed."
