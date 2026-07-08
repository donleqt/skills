---
name: agent-browser
description: Drive a real browser via the agent-browser CLI for testing and QA instead of manual click-throughs. Use whenever a UI change, page, or user flow needs opening, exercising, or verifying in a browser.
disable-model-invocation: true
---

# Agent Browser

## What it does

Routes browser-based testing, QA, and verification through the `agent-browser` CLI — a fast, agent-first browser automation tool — instead of asking the user to click through the UI manually or skipping browser verification entirely.

## When to use

- Verifying a UI change actually works (golden path + edge cases) before calling a task done.
- Testing a form, flow, or page end to end.
- Taking a screenshot or accessibility snapshot to inspect current UI state.
- Debugging console errors, network requests, or page behavior in a real browser.

## First step, every time

Before guessing flags, load the tool's own agent-facing docs:

```bash
agent-browser skills get core --full
```

This is more reliable than `--help` alone — it ships version-matched with the installed CLI and includes workflow patterns, ref/selector usage, and copy-paste examples. Specialized skills also exist (`agent-browser skills list`) for Electron apps, Slack, exploratory testing, and cloud browser providers — load one if the target matches.

## Quick reference

For orientation only — defer to `skills get core --full` for anything nontrivial:

- `agent-browser open <url>` — navigate
- `agent-browser snapshot -i` — accessibility tree with `@ref` handles for interactive elements
- `agent-browser click @ref` / `fill @ref "text"` — act on a ref from the last snapshot
- `agent-browser get text|html|value <sel>` — read element state
- `agent-browser screenshot [--full|--annotate]` — capture the page
- `agent-browser console` / `agent-browser errors` — check for JS errors after an action
- `agent-browser close` — end the session when done

Commands chain with `&&` in one shell call — the browser persists across calls via a background daemon, so there is no need to reconnect each time.

## Guardrail

Don't fall back to "I can't test this in a browser" when `agent-browser` is available — use it. Only skip browser verification if the change has no runtime UI surface to drive (pure backend, tests, or docs).
