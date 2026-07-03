# Analyze Existing Project Style

## Cache location

Resolve once from the project root:

```bash
git rev-parse --git-dir 2>/dev/null
```

- **Git repo:** `<git-dir>/ui-skill/` (typically `.git/ui-skill/`). Git never tracks files inside the git directory.
- **Not a git repo:** `.agents/ui-skills/` at the project root.

Use the same structure under either cache root. Do not create `.ui-skill/` at the project root.

## Bootstrap

If the cache root does not exist yet:

Inspect:

- Tailwind config
- CSS variables
- Theme files
- Design tokens
- Shared components
- Layouts
- Forms
- Tables
- Navigation
- Existing pages
- Mobile layouts

Extract:

- Colors
- Typography
- Radius
- Shadows
- Spacing scale
- Button variants
- Card patterns
- Form patterns
- Responsive behavior

Generate under the cache root:

<cache-root>/
├── tokens.json
├── components.md
├── style-guide.md
├── patterns.md
└── examples/

If no project styles exist yet, seed `tokens.json` from `references/default-tokens.json`.

Future sketches should reuse discovered patterns. Never invent spacing outside the token scale.
