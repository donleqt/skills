# Mock Generation Procedure

Always sketch before implementation.

Process:

1. Understand user goals
2. Infer missing requirements
3. Reuse project UI patterns from `.ui-skill/` (or `references/default-tokens.json`)
4. Copy `templates/base-shell.html` or the closest matching template
5. Design mobile-first using spacing tokens only (`page`, `section`, `card`, `stack`)
6. Generate responsive mockup
7. Include empty state
8. Include loading state
9. Include primary CTA
10. Run visual QA per `references/validate-mock.md`
11. Open in browser at 375px, 768px, 1280px; fix failures before returning

Output:

{
  "title": "",
  "assumptions": [],
  "html": "",
  "notes": []
}

Rules:

- Self-contained HTML starting from `base-shell.html` or a template
- Tailwind CDN allowed
- Placeholder data allowed
- Static interactions allowed
- Spacing must use tokens from `.ui-skill/tokens.json` or `references/default-tokens.json`
- `notes` must include `Visual QA: passed at 375px, 768px, 1280px` when browser verification succeeded

Forbidden:

- API calls
- Database access
- Authentication
- Business logic
- Production implementation
- One-off margin/padding classes outside the token scale
- Returning a mock without running the validate-mock checklist
