---
name: kiss
description: Simplify code, plans, and designs to the smallest correct solution. Use when invoking /kiss, stripping complexity, or applying YAGNI.
---

# KISS (`/kiss`)

## What it does

- Reviews the implementation plan or code changes
- Understands the real problem and goal
- Proposes the simplest pragmatic solution
- Removes over-engineering, unnecessary abstractions, and complexity

## Approach

- State the core goal in one sentence.
- Point out unnecessary complexity.
- Deliver a cleaner, shorter, more readable version.
- Prioritize minimal code, minimal concepts, and maximum clarity.

## Philosophy

Achieve the goal with the least amount of code and moving parts possible — without sacrificing correctness or maintainability.

## Response shape (always)

Use this order so the simplification is easy to scan:

1. **Core goal** — One sentence: what must stay true when everything else is negotiable?
2. **Unnecessary complexity** — Bullet list: abstractions, indirection, config, types, files, or ceremony that do not buy enough clarity or safety.
3. **Simpler version** — The concrete replacement: shorter plan, fewer steps, less code, or fewer concepts. Prefer showing the minimal diff or structure, not a lecture.
4. **Tradeoffs** — Only if something was removed that could matter later; keep this short.

## Guardrails

- Do not simplify by dropping error handling, tests, or invariants that correctness or the user's constraints require.
- Prefer deleting code and concepts over "clever" replacements.
- If the simplest fix is to use a boring library primitive or the platform’s built-in behavior, say so.
