---
name: building-in-public
description: |
  Generates engaging, authentic "Build in Public" posts (X/Twitter threads, standalone posts, or Indie Hackers updates) based on git commit history, file changes, or daily progress.
  Turns code commits and file diffs into relatable stories that show transparency, small wins, learnings, and hooks for engagement.
  Always make posts honest, conversational, and value-first. Include emojis, metrics if available, and a clear CTA.
  Triggers: "build in public post", "daily bip post", "generate bip from git", "twitter thread from commits", "share today's progress", "build in public update".
---

# Building in Public Skill

## When to Use This Skill
- User wants a daily or weekly "Build in Public" post based on recent git commits or today's file changes.
- User wants to share progress transparently to grow audience and build trust.
- Combine with `indie-marketing` for better growth.

## Core Principles
- Focus on **small wins**, **struggles**, **learnings**, and **what's next** - not just "I coded".
- Be honest and vulnerable - people connect with the journey.
- Structure: Hook -> What I did -> Insight -> What's next -> CTA.
- Keep tone friendly and conversational.
- Prefer quality over quantity. One good post > many generic ones.

## How to Generate the Post
The AI should analyze:
- Recent `git log` or commit messages
- Changed files (`git diff --name-only`)
- Any additional context provided by the user (app name, current feature, challenges)

If git data is not available, ask the user to paste recent commits or describe what they worked on today.

## Output Format

**Build in Public Post — [App Name] — [Today's Date or "Day X"]**

**Standalone Post** (ready to copy-paste to X/Twitter):
[Full short post text with emojis and CTA]

**Thread Version** (recommended for higher engagement):
1/ [Strong hook]
2/ [What I built / changed today]
3/ [Key learning or challenge]
4/ [Small win or screenshot description]
5/ [What's coming next]
6/ [Question or CTA to encourage replies]

**Alternative Short Version** (if user prefers one tweet):
[Even shorter version]

**Tips for Posting**
- Best time to post: evenings or your audience's active hours.
- Add a screenshot/GIF of the actual change when possible.

Would you like a different tone, more technical version, or another variation?

---
**License**: Free to use and adapt.
