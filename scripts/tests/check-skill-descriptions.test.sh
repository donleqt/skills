#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
checker="$root/scripts/check-skill-descriptions.sh"
fixtures="$root/scripts/tests/fixtures"

run_expect_ok() {
  local fixture="$1"
  if ! output="$("$checker" "$fixture" 2>&1)"; then
    echo "FAIL expected OK for $fixture"
    echo "$output"
    return 1
  fi
  if [[ "$output" != OK* ]]; then
    echo "FAIL expected OK line for $fixture"
    echo "$output"
    return 1
  fi
  echo "OK   pass fixture: $(basename "$(dirname "$fixture")")"
}

run_expect_fail() {
  local fixture="$1"
  local reason="$2"
  if output="$("$checker" "$fixture" 2>&1)"; then
    echo "FAIL expected FAIL for $fixture ($reason)"
    echo "$output"
    return 1
  fi
  if [[ "$output" != FAIL* ]]; then
    echo "FAIL expected FAIL line for $fixture ($reason)"
    echo "$output"
    return 1
  fi
  echo "OK   fail fixture: $(basename "$(dirname "$fixture")") ($reason)"
}

failed=0

while IFS= read -r -d '' fixture; do
  run_expect_ok "$fixture" || failed=1
done < <(find "$fixtures/pass" -name SKILL.md -print0 | sort -z)

run_expect_fail "$fixtures/fail/block-scalar/SKILL.md" "block scalar |" || failed=1
run_expect_fail "$fixtures/fail/folded-scalar/SKILL.md" "block scalar >" || failed=1
run_expect_fail "$fixtures/fail/literal-strip/SKILL.md" "block scalar |-" || failed=1
run_expect_fail "$fixtures/fail/too-short/SKILL.md" "too short" || failed=1
run_expect_fail "$fixtures/fail/too-long/SKILL.md" "too long" || failed=1
run_expect_fail "$fixtures/fail/no-period/SKILL.md" "missing period" || failed=1

if [[ "$failed" -ne 0 ]]; then
  echo
  echo "Checker tests failed."
  exit 1
fi

echo
echo "All checker tests passed."
