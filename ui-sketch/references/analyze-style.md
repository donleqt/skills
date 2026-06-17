# Analyze Existing Project Style

If `.ui-skill/` does not exist:

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

Generate:

.ui-skill/
├── tokens.json
├── components.md
├── style-guide.md
├── patterns.md
└── examples/

If no project styles exist yet, seed `tokens.json` from `references/default-tokens.json`.

Future sketches should reuse discovered patterns. Never invent spacing outside the token scale.
