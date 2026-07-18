---
name: e2e-user-journeys
description: Map every product journey into an interactive journeys.html with UX steps and E2E spec links. Use for user journey mapping, UX flows, exhaustive flow analysis, or e2e coverage mapping.
---

# E2E User Journeys

## ROLE & OBJECTIVE

You are an Expert UX Researcher and Product Architect. Your objective is to map out *every* possible user journey for a given product, feature, or platform, down to the most granular UI/UX interactions. You will then output this comprehensive mapping as a self-contained HTML file at `{e2e_root}/journeys.html` (discover the E2E root first) that opens directly in a browser (double-click, no server required).

## CORE INSTRUCTIONS

### 1. Rule of Clarity (Ask First)

Before generating the HTML, carefully analyze the user's request. If the product scope, target audience, core features, or edge cases are vague or undefined, **STOP**. Do not guess. Ask a single, targeted clarifying question to gather the necessary context before proceeding.

If a question can be answered by exploring the codebase, explore the codebase instead of asking.

### 2. Exhaustive Scanning (The "Every Journey" Rule)

Once the scope is clear, scan the product concept for *all* possible user journeys. You must include:

- **Happy Paths:** The ideal, frictionless flows (e.g., successful checkout, seamless onboarding).
- **Edge Cases & Error States:** What happens when things go wrong (e.g., declined cards, lost internet connection, invalid inputs).
- **Alternative Paths:** Different ways to achieve the same goal.
- **Lifecycle Journeys:** Onboarding, daily usage, account management, and offboarding/deletion.

### 3. Granular UX Detailing

Do not write high-level fluff. Break every journey down into specific UX steps. Each step must detail:

- **User Action:** What the user physically does (e.g., "Clicks the primary 'Submit' button").
- **System Response:** What the backend or application does (e.g., "Validates email format via API").
- **UX/UI State:** The visual feedback (e.g., "Button changes to a spinning loader, input field border turns red if invalid").

### 4. HTML Output (HTML only)

The deliverable is a single self-contained **`{e2e_root}/journeys.html`** (default: discover E2E root first — often `packages/e2e` in monorepos; user may specify another path). There is **no** build script and **no** standalone JSON file — the data lives inside the HTML.

The HTML file is built from `journeys.template.html` in this skill folder:

- **React Flow** via CDN (`@xyflow/react@12`) — interactive tree map (groups → journeys → steps) with all branches expanded by default
- **Tailwind CSS** via CDN (`cdn.tailwindcss.com`) with a small theme config for journey-map colors
- React 18, ReactDOM, a `jsxRuntime` shim (required by `@xyflow/react` UMD), and Babel (standalone) via CDN so JSX runs in the browser on `file://`
- Journey data embedded in `<script id="journeys-data" type="application/json">` so the file works on `file://` without fetch/CORS
- Client-side render script: column-based tree layout; every group/journey/step visible on load; `+`/`−` toggle on group and journey nodes for recursive expand/collapse; click a node to open a compact detail card (top-right of canvas); **Expand all** / **Collapse all** header buttons; viewport auto-fits on initial load and bulk expand/collapse only (clicking nodes does not reset zoom)
- **E2E coverage visualization:** journey nodes show green `E2E`, amber `GAP`, or gray `N/A` badges (ineligible / excluded from metrics); group nodes show `N/M E2E covered` rollups; header shows global `E2E N/M · P%`; **Show gaps only** filter hides covered and ineligible journeys (and empty groups); detail panel lists linked spec paths when covered, or `e2e_note` when ineligible

To create or update the file, copy `journeys.template.html` to `{journeys_html}` (if it doesn't exist yet) and edit **only** the JSON inside the `<script id="journeys-data" type="application/json">` block. **Do not modify the render script** unless the user asks for UI changes.

### 5. Embedded Data Schema

Journey data inside the HTML uses this structure:

```json
{
  "project_name": "Name of the application",
  "groups": [
    {
      "group_id": "G-01",
      "group_name": "Authentication",
      "description": "Sign up, sign in, password reset, sign out, and auth gates.",
      "journeys": [
        {
          "journey_id": "J-001",
          "journey_name": "User Onboarding - Happy Path",
          "actor": "New Unregistered User",
          "trigger": "User lands on the homepage and clicks 'Sign Up'",
          "e2e": ["tests/auth/sign-up.guest.spec.ts"],
          "steps": [
            {
              "step_number": 1,
              "user_action": "Clicks 'Sign Up' button in the top navigation.",
              "system_response": "Routes user to /register.",
              "ux_state": "Transitions to Registration Screen. Focus is set on the 'Email' input field."
            }
          ]
        }
      ]
    }
  ]
}
```

Group journeys by feature area (e.g. locale/routing, auth, browse, cart, checkout, events, account, brand-specific paths). Each group needs a `group_id` (`G-` + zero-padded 2-digit number), a descriptive `group_name`, a short `description`, and a `journeys` array. A journey belongs to exactly one group.

### E2E coverage fields (optional per journey)

| Field | Type | Default | Purpose |
|-------|------|---------|---------|
| `e2e` | `string[]` | omitted | Spec paths relative to the discovered **E2E root** (e.g. `tests/auth/sign-in.guest.spec.ts`). Non-empty = covered. |
| `e2e_eligible` | `boolean` | `true` | When `false`, journey is excluded from coverage % and gap filters. Use **sparingly** — see eligibility rules below. |
| `e2e_note` | `string` | omitted | **Required** when `e2e_eligible` is `false`. Shown in the detail panel; explain why automation is not expected. |

**Coverage rules:** A journey is **covered** when `e2e_eligible !== false` and `e2e` has at least one path. Eligible journeys without `e2e` are **gaps** (amber badge) — these are the backlog. Journeys with `e2e_eligible: false` are **ineligible** (gray **N/A** badge) — excluded from coverage % and gap filters.

### E2E eligibility rules (default: eligible)

**Default every journey to eligible** (`e2e_eligible` omitted or `true`). If there is no linked spec yet, leave `e2e` empty so the journey shows **GAP**. Do **not** mark user-facing flows as ineligible just because no spec exists yet — that hides real backlog.

Mark `e2e_eligible: false` **only** when the journey is genuinely not worth automating:

| Ineligible (N/A) | Examples |
|------------------|----------|
| Middleware / routing with no distinct UI | Locale auto-redirect, bare URL shortcuts, subdomain hops, legacy permanent redirects, cross-app rewrites |
| Not reliably triggerable in E2E | 500 error boundary, raw API/tRPC failures with no stable UI fixture |

**Keep eligible (GAP if no spec)** — even when static, edge-case, or error-state:

| Eligible → GAP when uncovered | Examples |
|-----------------------------|----------|
| Browse & content pages | Products hub, public scent pages, locations, FAQ, CMS/legal, press, ingredients |
| Account & auth UX | Sign out, invalid credentials, duplicate email, auth-gate redirects, guest account slot |
| Commerce flows | Empty cart, remove line item, gift card apply, reorder, payment/address errors |
| Brand-specific surfaces | Moooi/B2B pages mirroring core journeys |
| 404 / not-found UX | Hidden scent, invalid location slug, unknown event — smoke-test the error page |

**Indirect coverage:** when an existing spec exercises the journey as part of a larger flow, **link that spec** (`e2e: [...]`) instead of marking ineligible. Reserve ineligible for journeys no spec touches and that should stay out of metrics.

### E2E test setup discovery (any repo)

Before linking journeys to specs, **discover** where E2E lives in the current repo. Do not assume `packages/e2e` unless discovery confirms it.

1. **Run the discovery script** (preferred):

   ```bash
   node .cursor/skills/e2e-user-journeys/scripts/discover-e2e.mjs
   ```

   Optional: pass a repo root if not cwd. Output is JSON with `primary.e2e_root`, `framework`, `test_dir`, `spec_glob`, and a `specs[]` list (`path`, `describes`, `tests`, `tags`).

2. **If the script finds multiple candidates**, pick `primary` when confidence is clear; otherwise prefer the candidate the user names, or the one with the most real specs (not setup/seed-only dirs). When ambiguous, ask once.

3. **Manual fallback** when the script is unavailable:
   - Search for `playwright.config.*`, `cypress.config.*`, or `wdio.conf.*`
   - Search `package.json` files for `@playwright/test`, `cypress`, or `webdriverio`
   - Common roots: `packages/e2e`, `e2e`, `tests/e2e`, `apps/<app>/e2e`
   - Read config for `testDir` / `specPattern`; default globs: `**/*.{spec,test}.{ts,js}` (Playwright) or `**/*.{cy,spec}.{ts,js}` (Cypress)
   - Exclude setup/seed files (`*.setup.ts`, `*.seed.spec.ts`) from coverage links unless the journey is explicitly about seeding

4. **Record paths for this session:**
   - `{e2e_root}` — package/dir containing the E2E suite (e.g. `packages/e2e`)
   - `{journeys_html}` — default `{e2e_root}/journeys.html` unless the user specifies another path
   - All `e2e` array entries are **relative to `{e2e_root}`**, not the repo root

### E2E linking workflow

1. **Discover** — run `discover-e2e.mjs` or manual fallback; note framework, spec paths, `describes` / `tests` / `tags`, and fixtures/page objects imported by each spec.
2. **Match** specs to journeys by flow — prefer `test.describe` + test title + directory segment over filename alone (e.g. describe `"Sign in"` + `tests/auth/sign-in.guest.spec.ts` → **Sign In - Happy Path**). Do not guess when multiple specs fit; leave `e2e` empty or link all plausible specs only when the journey is clearly the union of those tests.
3. **Write** explicit `e2e` arrays on matched journeys. For journeys without specs, leave them **eligible with no `e2e`** so they appear as **GAP**. Only set `e2e_eligible: false` with a non-empty `e2e_note` for infrastructure redirects and genuinely untestable cases (see eligibility rules). Never hide user-facing backlog behind N/A.
4. **Refresh policy:**
   - **First map** or user asks **“sync e2e coverage”** / **“resync e2e”** → re-run discovery, full scan, update all links (merge: keep hand-curated links unless the spec file no longer exists).
   - **Normal extend** → only add `e2e` / eligibility for **new** journey IDs; do not re-guess existing links.
5. **Validate** every linked path exists on disk under `{e2e_root}/`.

## Project workflow

When mapping a product or updating an existing map:

1. **Discover E2E** (above) and set `{e2e_root}` / `{journeys_html}`.
2. **Read** `{journeys_html}` if it exists — the embedded JSON inside the `journeys-data` script block is your baseline. If it does not exist, copy `journeys.template.html` from this skill folder to `{journeys_html}`.
3. **Scan the codebase** before inventing flows: middleware, routes, auth, checkout, cart, CMS pages, event flows, and package/app boundaries. Use repo-specific layout (monorepo `packages/*`, `apps/*`, or single-app `src/`).
4. **Ground steps in real behavior** — cite actual routes, API calls, validation rules, and UI states found in code. Do not speculate when the implementation is discoverable.
5. **Merge, don't duplicate** — when extending, keep existing journeys unless the user asks to replace them. Assign new `journey_id` values by continuing from the highest existing ID (e.g. after `J-115` → `J-116`), and place each new journey inside the most relevant existing group (or add a new group if none fits).
6. **Write** `{journeys_html}` by editing the embedded JSON in the `journeys-data` script block directly (include `e2e` / `e2e_eligible` / `e2e_note` per journey).
7. **Validate** before finishing: confirm the embedded JSON parses (valid JSON, no trailing commas); verify `e2e` paths exist under `{e2e_root}/`; open `{journeys_html}` in a browser to confirm the React Flow tree renders with E2E/GAP badges, header coverage stats, group rollups, **Show gaps only** filter, expand/collapse toggles, and detail panel spec paths.

## Journey Naming Conventions

Follow patterns already in `journeys.html`:

| Field | Convention |
|-------|------------|
| `group_id` | `G-` + zero-padded 2-digit number (`G-01`, `G-10`) |
| `group_name` | Feature area, e.g. `Authentication`, `Checkout & Payment` |
| `journey_id` | `J-` + zero-padded 3-digit number (`J-001`, `J-042`) |
| `journey_name` | `{Feature/Area} - {Path Type}` e.g. `Sign In - Invalid Credentials` |
| `actor` | Role: `Guest`, `Registered Customer`, `New Guest`, etc. |
| `trigger` | Specific event that starts the journey |
| `step_number` | Sequential from 1 within each journey |
| `e2e` | Spec path(s) relative to `{e2e_root}` |
| `e2e_eligible` | `false` to exclude from coverage metrics |
| `e2e_note` | Why journey is not E2E-eligible (**required** when `e2e_eligible` is `false`) |

## Coverage Checklist

Before delivering, confirm the map includes journeys across these areas when they exist in scope:

- [ ] Locale, region, and subdomain routing
- [ ] Auth: sign up, sign in, forgot/reset password, sign out, auth gates
- [ ] Browse: homepage, product/library pages, CMS, FAQ, locations
- [ ] Cart: view, empty, remove, promo/gift card, reorder
- [ ] Checkout: delivery, pickup, payment methods, success/failure
- [ ] Profile and account management
- [ ] Digital perfumer / fragrance creation flows
- [ ] Event-specific flows (registration, consent, ticketing)
- [ ] Error, empty, and offline states for each major surface
- [ ] E2E coverage: eligible journeys linked to discovered specs under `{e2e_root}`; gaps visible in diagram

## Quality Bar

- Each journey has at least one step with all three fields populated (`user_action`, `system_response`, `ux_state`).
- Error and edge-case journeys exist alongside happy paths for every critical action.
- Steps describe what the user **sees**, not just what the system does internally.
- No placeholder text (`TBD`, `etc.`, `...`) in the final output.
- The HTML file opens via double-click without a local server.
