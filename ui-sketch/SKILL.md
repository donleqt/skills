---
name: ui-sketch
description: Generate responsive HTML UI mockups before implementation. Use when designing new screens, workflows, forms, or when UI requirements are ambiguous.
---

# UI Sketch

When this skill is activated:

1. Read `references/analyze-style.md`
2. Resolve the style cache per `references/analyze-style.md` (`<git-dir>/ui-skill/` or `.agents/ui-skills/`); build or update if needed (seed from `references/default-tokens.json` when no project tokens exist)
3. Read `references/generate-mock.md`
4. Read `references/responsive-rules.md`
5. Read `references/validate-mock.md`
6. Copy `templates/base-shell.html` or the closest matching template from `templates/`
7. Generate a responsive HTML mockup using project or default spacing tokens only
8. Run the visual QA checklist and responsive self-review in `references/validate-mock.md`
9. Do NOT implement production code
10. Return only the requested mock output format

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
