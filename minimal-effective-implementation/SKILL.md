---
name: minimal-effective-implementation
description: Audit local or branch changes to remove unnecessary code and keep the diff minimal. Use before commit or PR when trimming bloat or simplifying changes.
disable-model-invocation: true
---

# Minimal and effective implementation review

The user's intent (use verbatim when summarizing back):

Perfect now, scan our change to check and remove anything that is not really necessary for our change, we want our implementation to be minimal and effective, not creating more mess


Your job is to *reduce scope and noise* in the current work *without* weakening the feature, breaking callers, or hiding real bugs. Prefer *deleting* and *inlining* over adding new abstractions.

## When to use

- After a feature "works" and before commit, split-to-commits, or create-branch-draft-pr-develop.
- User says: minimal diff, trim fat, remove unnecessary code, simplify implementation, less mess, audit the change, clean up scope.
- PR or branch grew files/helpers the issue did not require.

## Hard rules

- *Do not remove behavior* required by the issue, acceptance criteria, or explicit user requests from the session.
- *Do not* run repo-wide pnpm format, mass lint fixes, or unrelated refactors "while you're here."
- *Do not* delete tests that cover behavior you keep; do not delete tests just to shrink diff unless the tested code is removed.
- *Do not* commit skill-only or rule-only edits as part of a product PR unless the user asked for that.
- *Stage and show* what you remove; user should see a smaller, clearer diff—not a rewrite of the feature.

## 1. Establish scope (what "necessary" means)

Before deleting anything, write a *one-paragraph scope* from:

- GitHub issue / user message / chat summary (acceptance criteria).
- git diff / git diff --stat against the base branch (usually develop).
- Files touched vs files *required* for that scope.

Everything *outside* that scope is a candidate for removal or revert. Everything *inside* must still work after trim.

Run in parallel:

git status -sb
git diff --stat
git diff
git log -5 --oneline

If the branch has multiple commits, also:

git diff develop...HEAD --stat
git diff develop...HEAD

## 2. Scan categories (check each)

Work through these in order. For each finding, label *Remove*, *Keep*, or *Simplify* with one line why.

### A. Dead code and unused surface

- Exports, props, types, hooks, or components *never imported* or passed from callers.
- Props added "for later" (e.g. onCardPress when nothing passes it).
- Duplicate handlers (two scroll-end paths doing the same jump).
- Commented-out blocks, debug console.log, temporary flags.

*Action:* Delete unused API; do not keep "just in case" unless user insists.

### B. Over-engineering for the problem size

- Extra abstraction layers (one-off helpers, generic utilities used once).
- Premature optimization (e.g. initialNumToRender, windowSize, removeClippedSubviews on lists with &lt;20 items when default FlatList is fine).
- onScroll reposition loops when *momentum-end* recenter matches an existing repo pattern (e.g. FeaturedOffersCarousel).
- Triple-buffer vs bookend clones: keep whichever is *working and smallest*; do not add both patterns.

*Action:* Collapse to the simplest approach that still meets acceptance criteria.

### C. Drive-by or unrelated diffs

- Formatting-only changes in files the task did not need to touch.
- Renames unrelated to the feature (unless part of an approved extract/move).
- Dependency or config churn not required by the task.
- Docs, skills, or AGENTS.md edits mixed into a product PR.

*Action:* Revert those files or hunks (git checkout develop -- path or manual restore).

### D. Duplicate logic with existing code

- New filter/math/UI that duplicates an existing hook or component elsewhere in the repo.
- Copy-paste carousel logic when a shared pattern already exists.

*Action:* Prefer *reuse or move to shared* (one move commit) over a second implementation—but only if the issue asked for reuse; otherwise keep local minimal code.

### E. Redundant state and effects

- useEffect that resets UI on every parent re-render when a stable key (brandIds.join(',')) is enough.
- Multiple useEffects that can be one without losing clarity.
- Refs written but never read for decisions (internalIndexRef only assigned, never used).
- Dedupe refs (activeLogicalRef) when parent already no-ops on same id (optional trim; keep if it avoids expensive child work).

*Action:* Merge or remove; fix dependency arrays intentionally (document with comment only if non-obvious).

### F. Barrel and export bloat

- index.ts re-exporting symbols *only used inside* the same folder.
- Public exports "for convenience" with no external importers.

*Action:* Trim barrel to what grep shows importers actually need.

### G. UI and layout noise

- Extra wrappers (overflow: hidden + footer + padding) when one mechanism suffices.
- Skeleton/layout variants not used by any screen.
- Caption/state variables only used once—inline if it improves readability without spreading logic.

*Action:* Remove redundant layout; align with nearest similar screen in the repo.

### H. Commits and messages (when branch not yet pushed)

- Unrelated commits on the branch → split or drop per *split-to-commits* skill.
- Co-authored-by agent trailers → remove per team skill/rules before push.

## 3. Luup-specific defaults

- *Expo:* Match patterns in the closest feature (FeaturedOffersCarousel, ActiveDealsTab, existing Brands scroll). Same naming, Tamagui tokens, file placement (shared/ vs features/).
- *Do not* mix Supabase migrations with unrelated app tweaks in one commit.
- *Lint/typecheck:* Only on touched files (npx eslint path, npx tsc --noEmit path)—not whole monorepo.
- *Tests:* Run tests *for the area you changed*; do not delete tests to fake minimalism.

## 4. Execute trims safely

1. List planned removals in a short table (path / what / why).
2. Apply edits file by file; prefer the smallest diff that removes the item.
3. Re-run targeted lint/tests on touched paths.
4. Show git diff --stat before vs after trim so the user sees shrinkage.

If unsure whether something is required, *keep it* and note "verify with user" in the report—do not guess-delete feature code.

## 5. Report back (required format)

Keep the report concise but complete:

### Scope
One sentence: what the change is supposed to deliver.

### Removed or simplified
| Item | Action | Reason |
|------|--------|--------|
| … | Remove / Simplify / Keep | … |

### Kept intentionally
Bullet list of things that look "extra" but are *required* (e.g. trailing padding for last carousel snap, shared extract for two call sites).

### Left unchanged (optional)
Anything you considered but did not touch and why.

### Verification
Commands run and result (tests, eslint, manual QA note).

End with:

- Updated git diff --stat (or "no further changes").
- Ask only if a finding needs product decision (e.g. dropping an issue requirement).

## 6. Anti-patterns (do not do this)

| Anti-pattern | Why |
|--------------|-----|
| "Clean up" entire file while touching one line | Bloats review, unrelated risk |
| Add new skill/rule files in the same PR as the feature | User asked for product minimalism |
| Remove error handling that guards real edge cases | Breaks robustness for byte count |
| Replace working code with a "clever" one-liner | Harder to review and match repo style |
| Strip types to any to avoid imports | Hides bugs |

## 7. Relationship to other skills

| Skill | When |
|-------|------|
| *split-to-commits* | After trim, when splitting into focused commits |
| *create-branch-draft-pr-develop* | After trim + commits, for draft PR to develop |
| *pr-code-review* | Reviewing someone else's PR, not trimming your own WIP |

*Order:* implement → *this skill (trim)* → split-to-commits (if needed) → push / draft PR.

## One-line summary

Diff against scope → classify dead code, over-engineering, drive-bys, duplicate state → remove safely → verify → report what stayed and why.
