# Validate Mock Before Delivery

Never return a mock until every check below passes. Fix failures in the HTML, then re-check.

## Browser verification (required)

1. Save the mock to a temporary `.html` file.
2. Open it in a browser (`file://` or local static server).
3. Snapshot or inspect at three widths:
   - **Mobile:** 375px
   - **Tablet:** 768px
   - **Desktop:** 1280px
4. Fix any layout, spacing, or overflow issues found.
5. Re-open and re-check until all checks pass.

Use `fast-browser-mcp` when available. If browser tools are unavailable, manually trace the DOM and spacing classes section by section at each breakpoint.

## Visual QA checklist

Mark each item pass/fail. All must pass.

### Spacing and layout

| Check | Pass criteria |
|-------|---------------|
| Page breathing room | Content is not flush to viewport edges; outer padding uses token `page` (default `p-4 md:p-6 lg:p-8`) |
| Section rhythm | Major blocks separated by token `section` (default `space-y-6` or `gap-6`) |
| Card padding | Cards and panels use token `card` (default `p-4 md:p-6`) |
| Inner stacks | Related items inside a section use token `stack` (default `gap-4`) |
| Max width | Main content constrained with `max-w-7xl mx-auto` (or project equivalent) |
| No mystery gaps | No random `mt-1` / `mb-2` mixes; spacing comes from the token scale only |

### Typography and content

| Check | Pass criteria |
|-------|---------------|
| Hierarchy | One clear `h1`; subsections use `h2`/`h3` in order |
| Readability | Body text ≥ 14px equivalent; sufficient line-height |
| No overflow | No clipped, overlapping, or truncated text |
| Placeholder length | Sample text is realistic length (not one-word labels everywhere) |

### Components

| Check | Pass criteria |
|-------|---------------|
| Primary CTA | Visible without scrolling on mobile (above fold or sticky) |
| Form fields | Labels aligned; inputs full-width on mobile |
| Buttons | Adequate tap target (min ~44px height on mobile) |
| Empty state | Shown when list/table has no data; still has padding |
| Loading state | Skeleton or spinner variant included where data loads |

### Responsive

| Check | Pass criteria |
|-------|---------------|
| Mobile (375px) | Single column; no horizontal scroll |
| Tablet (768px) | Grid adapts (e.g. 2 columns); nothing squished |
| Desktop (1280px+) | Multi-column layout uses space; not stretched edge-to-edge |
| Navigation | Discoverable on all breakpoints (hamburger or visible nav) |

### HTML quality

| Check | Pass criteria |
|-------|---------------|
| Self-contained | Valid `<!DOCTYPE html>` document; works offline with Tailwind CDN |
| Semantic structure | Uses `header`, `main`, `section`, `nav` where appropriate |
| Box model | `box-sizing: border-box` on all elements |
| No broken markup | All tags closed; no orphan elements |

## Fix order

When issues are found, fix in this order:

1. **Shell** — page padding, max-width wrapper, section spacing
2. **Grid/flex** — column counts per breakpoint
3. **Components** — card padding, button sizes, form alignment
4. **Content** — text overflow, placeholder length
5. **States** — empty and loading variants

## Forbidden shortcuts

- Do not "fix" spacing by adding one-off margin classes outside the token scale.
- Do not skip browser verification because the HTML "looks fine" in source.
- Do not return a mock with known horizontal scroll or edge-to-edge content.

## Output notes

When returning the mock JSON, include in `notes` any assumptions made and confirm:

```
Visual QA: passed at 375px, 768px, 1280px
```

If a check could not be verified (e.g. no browser available), state that explicitly and list what was checked manually.
