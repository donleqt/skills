---
name: pr-feedback
description: Vet AI review-agent PR feedback conservatively. Use when an automated reviewer (Copilot, CodeQL, custom bot) leaves comments and the user wants them addressed or the PR wrapped up.
---

# PR Feedback

The default for AI reviewer comments is **skip with reasoning** — these tools lack project context and hallucinate, and a "fix" that is correct in isolation can be wrong (or a bad trade-off) for this codebase.

For **human teammate** review, never silently skip. Report to the user instead — the user decides whether to fix, push back, or apply the reasoning.

## Flow

1. **Find the PR** for the current branch.
2. **Pull every review comment** (inline + issue-level).
3. **Tag each comment's source** — AI reviewer or human teammate.
4. **Vet each comment** — verdict + one-line reason, with rules that differ by source.
5. **Apply accepted fixes** with the smallest change that resolves the concern.
6. **Reply to skipped AI items** in-thread, short and clear.
7. **Post a top-level summary** with the buckets.

## 1. Find the PR

```bash
git rev-parse --abbrev-ref HEAD
gh pr list --head <branch> --state open --json number,title,url
```

If multiple PRs match, pick the one whose commits match `git log <default-branch>..HEAD --oneline`.

## 2. Pull every review comment

Read inline (file/line) and issue-level (general) comments **before deciding anything** — piecemeal rushing causes premature verdicts:

```bash
gh pr view <number> --comments
gh api repos/<owner>/<repo>/pulls/<number>/comments
gh api repos/<owner>/<repo>/issues/<number>/comments
```

## 3. Tag the source

For every comment, note the author. The `user.login` field in the API response tells you:

- **AI reviewer** — bot accounts: `[bot]` suffix, `copilot`, `coderabbitai`, `sourcery-ai`, `github-actions`, `codeql`, etc. Treat all bot-authored comments as AI feedback.
- **Human teammate** — anything else.

If unsure, check the user's profile (`gh api users/<login>`) or treat as human.

## 4. Vet each comment

For every comment, record a one-line judgment:

- **Claim** — what the reviewer is asserting.
- **Verdict** — `fix` | `skip` | `ask`.
- **Reason** — one sentence: fact-check, cost, complexity, or context the reviewer missed.

### AI reviewer — the conservative bar

The bar for `fix`:

- **Factually correct** about the code as it is (open the file, check).
- **Net win** for the codebase — simpler, safer, or more correct, not just consistent with a generic ideal.
- **Cost is small** relative to the win. A 200-line refactor to remove 5 lines of duplication is a loss; **complexity is a trade-off, not a target**.
- **Within scope** of the PR. Drive-by cleanups belong in another PR.

If any of these fail, default `skip`. If uncertain, `ask`.

### Human teammate — never silently skip

A teammate left the comment deliberately. Their reasoning carries weight the bot's doesn't.

- **Default `ask`** — report the comment to the user with your draft assessment (factual? in-scope? cost?) so they can decide.
- **`fix`** only when the change is trivially correct, small, and aligned with the teammate's request. State the fix in the summary.
- **Never `skip`** without the user's go-ahead. Push back in chat, not silently on the PR.

If several teammate items are queued, batch them into one ask with your draft verdicts — don't drip-ask one by one.

## 5. Apply accepted fixes

For each `fix`:

1. Open the cited file and lines; verify the reviewer's claim against the actual code.
2. Make the smallest change that addresses the comment.
3. Re-read the diff for that hunk before committing.
4. Run linter/typecheck on **touched files only**, not the whole repo.
5. Commit with a message that cites the PR and the comment (e.g. `address review: <one-line summary>`).

A fix is **done** when the change is in a commit, the touched files pass typecheck/lint, and the comment's specific concern is resolved — not merely "touched".

## 6. Reply to skipped AI items

For each AI `skip`, post a comment on the same review thread (`gh api .../comments/<id>/replies`) or, if there is no thread, a new PR comment that quotes the original.

Reply style — short, factual, friendly, like a normal PR conversation. No walls of text.

Good reply shapes:

- `Skipping — <reason>. <optional: pointer to where/how this is already handled, or the trade-off being accepted>.`
- `Fixed the null-handling part; skipping the rest as out of scope — see commit <sha>.`

Bad shapes: a bare "disagree", a 10-line essay on why the reviewer is wrong, or a generic "will revisit later" with no plan.

**Do not reply on behalf of a teammate's comment** — let the user respond.

## 7. Post a top-level summary

When every comment has a verdict, post one PR comment:

> **PR feedback wrap-up**
>
> | Bucket | Count | Items |
> | --- | ---: | --- |
> | **Fixed** | N | <one line each, with commit SHA> |
> | **Skipped (AI)** | M | <one line each, with link to the per-thread reply> |
> | **Awaiting your decision** | K | <one line each — covers all human teammate comments plus uncertain AI ones> |

Scannable rows are the work. No preamble like "I reviewed the feedback and...".

### Formatting the Items cell

Native Markdown bullets (`*`, `-`, `1.`) don't render inside table cells on GitHub. Use `<br>` line breaks — one item per line, with a leading `•` for visual grouping.

### Example

> **PR feedback wrap-up**
>
> | Bucket | Count | Items |
> | --- | ---: | --- |
> | **Fixed** | 4 | • Null-handling in `parseConfig` — `a1b2c3d`<br>• Extract `slugify` helper — `e4f5g6h`<br>• Cache `lookupTable` to avoid re-alloc — `i7j8k9l`<br>• Wrap `fetch` with `AbortSignal.timeout` — `m0n1o2p` |
> | **Skipped (AI)** | 5 | • Replace `Map` with plain object — [#comment-r1]<br>• Add JSDoc to every export — [#comment-r2]<br>• Split `utils.ts` into 3 files — [#comment-r3]<br>• Switch to `zod` for runtime validation — [#comment-r4]<br>• Rename `id` → `identifier` everywhere — [#comment-r5] |
> | **Awaiting your decision** | 2 | • Rename `getCwd` → `getCurrentWorkingDirectory` (Copilot, low confidence)<br>• Pin `typescript` to a 5.x version (you flagged in chat) |
>
> [#comment-r1]: https://github.com/org/repo/pull/42#discussion_r1
> [#comment-r2]: https://github.com/org/repo/pull/42#discussion_r2
> [#comment-r3]: https://github.com/org/repo/pull/42#discussion_r3
> [#comment-r4]: https://github.com/org/repo/pull/42#discussion_r4
> [#comment-r5]: https://github.com/org/repo/pull/42#discussion_r5

## Done when

- Every review comment has a verdict: `fix` applied, `skip` replied (AI only), or `ask` answered.
- A top-level summary comment is posted with the buckets and links.
- No `fix` commit sits without a corresponding comment addressed.
- No human teammate comment was silently skipped.
