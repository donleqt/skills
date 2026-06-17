---
name: ui-sketch
description: Generate responsive UI mockups before implementation. Use when users request new screens, dashboards, workflows, forms, redesigns, settings pages, navigation changes, or when UI requirements are ambiguous. Analyze existing project styles, build reusable UI knowledge, and produce self-contained HTML previews for UX validation before writing production code.
---

# UI Sketch

When this skill is activated:

1. Read `references/analyze-style.md`
2. Build or update `.ui-skill/` if needed (use `references/default-tokens.json` when no project tokens exist)
3. Read `references/generate-mock.md`
4. Read `references/responsive-rules.md`
5. Read `references/validate-mock.md`
6. Copy `templates/base-shell.html` or the closest matching template from `templates/`
7. Generate a responsive HTML mockup using project or default spacing tokens only
8. Run the visual QA checklist in `references/validate-mock.md`
9. Open the HTML in a browser at 375px, 768px, and 1280px; fix all failures
10. Do NOT implement production code
11. Return only the requested mock output format

## Resources

- references/analyze-style.md
- references/generate-mock.md
- references/responsive-rules.md
- references/validate-mock.md
- references/default-tokens.json

## Templates

Start from these — do not generate layout from scratch:

- templates/base-shell.html
- templates/dashboard.html
- templates/form.html
- templates/list.html
- templates/detail.html
- templates/settings.html
