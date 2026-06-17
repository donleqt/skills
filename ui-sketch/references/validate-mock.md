# Validate Mock Before Delivery

Never return a mock until every check below passes. Fix failures in the HTML, then re-check.

## Self-review (required)

Before returning, mentally walk through the HTML at three viewport widths. Trace the DOM top to bottom and ask what each breakpoint would render.

**Mobile (375px)**

- Is the layout single-column with stacked sections?
- Would any `grid-cols-*`, `flex-row`, or fixed widths cause horizontal scroll?
- Are inputs and buttons full-width where needed?
- Is the primary CTA visible without excessive scrolling?

**Tablet (768px)**

- Do grids step up correctly (`md:grid-cols-2`, etc.)?
- Would side-by-side header actions still fit without crowding?
- Is text still readable — nothing squished into narrow columns?

**Desktop (1280px+)**

- Does multi-column layout use `max-w-7xl` instead of stretching edge-to-edge?
- Are stat cards, lists, and panels evenly spaced with token `gap-6`?
- Is there still clear section rhythm (`space-y-6`)?

Fix anything that would fail at any width, then re-review until all checks pass.

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
| No overflow | No clipped, overlapping, or truncated text (`truncate` only where intentional) |
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
| Breakpoint prefixes | `sm:`, `md:`, `lg:` used consistently — mobile-first, not desktop-first |

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
- Do not skip self-review because the HTML "looks fine" at a glance.
- Do not return a mock with known horizontal scroll or edge-to-edge content.

## Output notes

When returning the mock JSON, include in `notes` any assumptions made and confirm:

```
Self-review: passed mobile, tablet, desktop responsive checks
```
