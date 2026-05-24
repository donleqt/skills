---
name: tests-add-minimum
description: >-
  Writes tests with a "main things work" philosophy — protect critical paths and
  pure domain logic, not line coverage. Uses layered testing (pure logic first,
  cheap integration second, heavy e2e optional). Use when the user asks for tests,
  a test plan, test strategy, /test, or "add tests without chasing coverage."
disable-model-invocation: true
---

# Main things work (tests)

> One test ≈ one visible guarantee. Small fast suite, not exhaustive coverage.

## Intent

Protect what users and maintainers actually depend on: correct outcomes on happy paths, safe failure on important edge cases, and regressions in core logic. Do **not** optimize for coverage %, file-per-source-file parity, or testing every layer of the stack.

## Workflow

1. **Discover** — Find test runner, config, patterns, fixtures, and what's already covered.
2. **Map critical paths** — Smallest set of flows where a bug clearly breaks the product (infer from README, routes, API, CLI, or ask).
3. **Locate logic** — Prefer domain/lib modules over UI shells, routes, and config.
4. **Plan first** — Short list: files to add, ~count, what each protects, what you're skipping and why.
5. **Implement layer 1** — Add layer 2/3 only when layer 1 can't catch the failure.
6. **Match conventions** — Naming, colocation, style, commands. No drive-by refactors.

## Layers

| Layer | What | CI default |
|-------|------|------------|
| **1 — Pure logic** | Validators, parsers, algorithms, state transitions, guards, fallbacks | Always — fast |
| **2 — Boundary integration** | Small fixtures through one module boundary (bytes/JSON/DB → artifact) | Yes if cheap |
| **3 — Heavy / flaky** | Browser, network, GPU, large binaries, external services | Optional `@slow` / manual / nightly |

Stop when layers 1–2 give enough confidence. Never block the default fast run with layer 3.

## What to test

- Invariants, boundaries, empty/null input, error messages, idempotency
- Fallback behavior when detection/parsing/heuristics fail
- Size/limit guards that prevent OOM, hangs, or bad output
- Pipeline artifacts: type, schema, dimensions, row count — not pixel-perfect UI

## Skip (unless explicitly requested)

- Boilerplate, generated code, thin CRUD with no custom logic
- Styling, layout, copy, marketing pages, generic design-system primitives
- Component/page snapshots; drag, hit-test, and animation details
- Config, analytics, SEO, locale strings (unless product-critical)
- Private helpers when public API tests cover the guarantee
- Mocking everything to assert mocks were called

## Test quality bar

- **Name** states the guarantee: `rejects X when Y`, `returns Z for empty input`
- **Assert outcomes**, not internals
- **Arrange** minimal; prefer table-driven cases for similar rules
- Avoid brittle timestamps, random IDs, and environment-specific paths unless stabilized

## Output shape

1. Brief plan (add / skip / why)
2. Test files + minimal fixtures/helpers
3. Config changes if needed (include globs, environment, fixture dir)
4. Manual or `@slow` tests listed separately

## Success criteria

After this work, core behavior can be refactored without manually clicking through every screen — with a **small, fast** suite (typically a handful of focused files), not hundreds of tests.

## Optional context (ask or infer)

- Critical paths (if not obvious from the repo)
- CI constraints: no browser, no network, no large assets
- Test command: e.g. `pnpm test`, `pytest`, `go test ./...`
