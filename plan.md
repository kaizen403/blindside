# Blindwall — Dashboards Plan

> Admin and Client dashboards for delivering pentest engagements end-to-end.
> One source of truth: admin writes Markdown findings, clients see analytics, timelines, and remediation tracking.

---

## 0. North Star

**Admin** uploads/edits a Markdown report with YAML frontmatter. The platform parses it into structured findings, updates the engagement timeline, and recomputes client-side analytics in real time.

**Client** never sees a raw PDF. They see:
- A live engagement timeline (6 PTES stages)
- Findings as cards with severity, CVSS, asset, remediation
- Analytics: severity distribution, OWASP categories, trend over time, MTTR
- Notifications when stages advance or new findings drop
- Asset inventory with per-asset risk scores

**Aesthetic constraint:** every surface must feel like a continuation of the marketing site — `#09090b` background, `liquid-glass` / `glass-3d` panels, Anthropic Sans body + Instrument Serif display, `#dc2626` accent used sparingly for severity/CTAs, generous negative space, subtle Framer Motion entrances.

---

## 1. Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 16 (App Router, RSC) | Already in repo |
| Styling | Tailwind v4 + existing `globals.css` tokens | Reuse `liquid-glass`, `glass-3d`, color vars |
| Auth | **Better Auth** | Email + password, magic link, role-based, edge-friendly |
| DB | **Postgres on Neon** | Serverless, branch-per-PR, generous free tier |
| ORM | **Prisma** | Type-safe, migrations, plays nicely with Better Auth |
| File storage | Cloudflare R2 (already wired via `.wrangler`) | Optional original-PDF archive, evidence images |
| Markdown | `gray-matter` + `remark` + `remark-gfm` + `rehype-sanitize` | Frontmatter + safe HTML |
| Charts | `recharts` (tree-shakeable, themeable) | Severity donut, trend lines, category bars |
| Tables | `@tanstack/react-table` headless | Client-side sort/filter on findings |
| Forms | `react-hook-form` + `zod` | Validation across admin forms |
| Email | Resend | Stage transitions, new-finding alerts |
| Realtime | Postgres `LISTEN/NOTIFY` via SSE route, fallback polling | Client dashboard live updates |
| Animations | `framer-motion` (already installed) | Match existing entrance language |
| Icons | `lucide-react` (already installed) | Consistent with marketing |

> Three.js stays out of dashboards. Reserved for marketing.

---

## 2. Information Architecture

```
/                         marketing (existing)
/login                    Better Auth — single page, role-based redirect
/forgot                   password reset
/onboard/[token]          client first-time setup (set password, accept terms)

— CLIENT —
/app                      overview (timeline + KPIs)
/app/findings             all findings (table + filters)
/app/findings/[id]        single finding (markdown body, evidence, remediation)
/app/assets               scoped assets + per-asset risk
/app/timeline             full engagement timeline + activity log
/app/reports              downloadable PDF export of full report
/app/notifications        feed
/app/settings             org profile, team, API keys

— ADMIN —
/admin                    operations overview (all clients, all engagements)
/admin/clients            client list
/admin/clients/[id]       client detail + engagements
/admin/engagements        list of all engagements (filterable by stage)
/admin/engagements/[id]   engagement editor (stages, findings, assets, team)
/admin/engagements/[id]/upload   markdown upload / paste editor
/admin/engagements/[id]/findings/[id]  finding editor
/admin/library            reusable finding templates (OWASP categories, common vulns)
/admin/users              admin user management
/admin/audit              audit log
```

Role-gated middleware: `client` → `/app/*`, `admin` → `/admin/*`. Wrong role = 403 page in same theme.

---

## 3. Data Model (Prisma schema sketch)

```prisma
// auth (managed by Better Auth)
model User {
  id            String   @id
  email         String   @unique
  emailVerified Boolean
  name          String?
  image         String?
  role          Role     @default(CLIENT)
  orgId         String?
  org           Org?     @relation(fields: [orgId], references: [id])
  createdAt     DateTime @default(now())
  // ...sessions, accounts (Better Auth)
}

enum Role { ADMIN ANALYST CLIENT }

model Org {
  id            String   @id @default(cuid())
  name          String
  slug          String   @unique
  logoUrl       String?
  users         User[]
  engagements   Engagement[]
  createdAt     DateTime @default(now())
}

model Engagement {
  id            String   @id @default(cuid())
  orgId         String
  org           Org      @relation(fields: [orgId], references: [id])
  name          String           // "Q4 2025 — Web App Pentest"
  scopeSummary  String?          // markdown
  startDate     DateTime
  targetEndDate DateTime?
  endedAt       DateTime?
  currentStage  Stage    @default(SCOPING)
  status        EngagementStatus @default(ACTIVE)
  stages        StageEvent[]
  findings      Finding[]
  assets        Asset[]
  activity      ActivityEvent[]
  reports       Report[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

enum Stage { SCOPING RECON SCANNING EXPLOITATION REPORTING REMEDIATION }
enum EngagementStatus { ACTIVE PAUSED COMPLETED ARCHIVED }

model StageEvent {
  id            String   @id @default(cuid())
  engagementId  String
  engagement    Engagement @relation(fields: [engagementId], references: [id])
  stage         Stage
  state         StageState // PENDING | IN_PROGRESS | COMPLETED | SKIPPED
  startedAt     DateTime?
  completedAt   DateTime?
  note          String?    // markdown
  actorId       String?
  createdAt     DateTime @default(now())
}

enum StageState { PENDING IN_PROGRESS COMPLETED SKIPPED }

model Asset {
  id            String   @id @default(cuid())
  engagementId  String
  engagement    Engagement @relation(fields: [engagementId], references: [id])
  name          String     // "api.client.com"
  type          AssetType  // WEB, API, MOBILE, NETWORK, CLOUD, IOT
  url           String?
  inScope       Boolean   @default(true)
  notes         String?
  findings      Finding[]
}

enum AssetType { WEB API MOBILE NETWORK CLOUD IOT OTHER }

model Finding {
  id            String   @id @default(cuid())
  engagementId  String
  engagement    Engagement @relation(fields: [engagementId], references: [id])
  assetId       String?
  asset         Asset?   @relation(fields: [assetId], references: [id])
  title         String
  slug          String
  severity      Severity            // CRITICAL HIGH MEDIUM LOW INFO
  cvssVector    String?
  cvssScore     Float?
  category      String              // OWASP A01:2021, etc.
  cweId         String?
  status        FindingStatus @default(OPEN)
  bodyMarkdown  String              // full report body
  bodyHtml      String              // pre-rendered, sanitized
  remediation   String              // markdown
  references    String[]            // URLs
  evidence      Evidence[]
  discoveredAt  DateTime
  resolvedAt    DateTime?
  authorId      String
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  @@unique([engagementId, slug])
}

enum Severity { CRITICAL HIGH MEDIUM LOW INFO }
enum FindingStatus { OPEN ACKNOWLEDGED IN_PROGRESS RESOLVED RISK_ACCEPTED FALSE_POSITIVE }

model Evidence {
  id            String   @id @default(cuid())
  findingId     String
  finding       Finding  @relation(fields: [findingId], references: [id])
  kind          EvidenceKind  // IMAGE, REQUEST, RESPONSE, LOG, FILE
  caption       String?
  url           String        // R2 key or external
  createdAt     DateTime @default(now())
}

enum EvidenceKind { IMAGE REQUEST RESPONSE LOG FILE }

model ActivityEvent {
  id            String   @id @default(cuid())
  engagementId  String
  engagement    Engagement @relation(fields: [engagementId], references: [id])
  type          ActivityType
  payload       Json
  actorId       String?
  visibleToClient Boolean @default(true)
  createdAt     DateTime @default(now())
}

enum ActivityType {
  ENGAGEMENT_CREATED
  STAGE_STARTED
  STAGE_COMPLETED
  FINDING_PUBLISHED
  FINDING_UPDATED
  FINDING_RESOLVED
  ASSET_ADDED
  REPORT_PUBLISHED
  COMMENT_ADDED
}

model Report {
  id            String   @id @default(cuid())
  engagementId  String
  engagement    Engagement @relation(fields: [engagementId], references: [id])
  version       Int
  pdfUrl        String?
  publishedAt   DateTime?
  createdAt     DateTime @default(now())
}

model Notification {
  id        String   @id @default(cuid())
  userId    String
  type      String
  title     String
  body      String?
  href      String?
  readAt    DateTime?
  createdAt DateTime @default(now())
}

model AuditLog {
  id        String   @id @default(cuid())
  actorId   String?
  action    String
  entity    String
  entityId  String
  diff      Json?
  ip        String?
  ua        String?
  createdAt DateTime @default(now())
}
```

---

## 4. Markdown Report Format

The contract between admin and platform. One file = one batch of findings + optional stage updates.

```markdown
---
engagement: cl_xyz                # engagement id (or slug)
report_version: 3
stage_update:
  stage: SCANNING
  state: COMPLETED
  note: "Authenticated + unauthenticated scans complete. 14 findings queued."
findings:
  - title: "Stored XSS in profile bio"
    slug: stored-xss-profile-bio
    severity: HIGH
    cvss: "CVSS:3.1/AV:N/AC:L/PR:L/UI:R/S:C/C:H/I:H/A:N"
    category: "A03:2021 — Injection"
    cwe: CWE-79
    asset: api.client.com
    discovered: 2026-04-22
    references:
      - https://owasp.org/Top10/A03_2021-Injection/
  - title: "Weak password policy"
    slug: weak-password-policy
    severity: MEDIUM
    category: "A07:2021 — Identification and Authentication Failures"
    asset: app.client.com
---

## Stored XSS in profile bio

The `bio` field on `/api/v1/users/me` accepts arbitrary HTML…

### Reproduction
1. Log in as any user
2. PATCH `/api/v1/users/me` with `{"bio":"<script>alert(1)</script>"}`
3. Visit any page that renders the profile

### Impact
Session hijacking, account takeover, phishing on trusted domain.

### Remediation
- Encode output via `DOMPurify` or server-side sanitizer
- Set `Content-Security-Policy: script-src 'self'`

---

## Weak password policy

…
```

**Parser pipeline:**
1. `gray-matter` splits frontmatter ↔ body
2. `zod` validates frontmatter shape
3. Body split into per-finding sections by `^## ` headings, matched to frontmatter `title`s
4. Each section → `remark` → `rehype-sanitize` → `bodyHtml` stored alongside `bodyMarkdown`
5. Upsert findings by `(engagementId, slug)` — preserves status set by client
6. Apply `stage_update` if present → creates `StageEvent`
7. Emit `ActivityEvent`s → fan out notifications + SSE

**Validation errors** render inline in the upload UI with line numbers (CodeMirror gutter).

---

## 5. Pentest Stages

Six PTES-aligned stages. Each carries `state`, timestamps, and a markdown note.

| # | Stage | Client-facing description |
|---|---|---|
| 1 | **Scoping** | Defining targets, rules of engagement, success criteria |
| 2 | **Recon** | Mapping the attack surface |
| 3 | **Scanning** | Automated + manual vulnerability discovery |
| 4 | **Exploitation** | Validating findings with safe proof-of-concept |
| 5 | **Reporting** | Compiling findings, severities, and remediation |
| 6 | **Remediation** | Tracking fixes and re-testing |

The timeline component renders a horizontal track on desktop, vertical on mobile. Each node animates from `state=PENDING` (muted dot) → `IN_PROGRESS` (pulsing red ring) → `COMPLETED` (filled, check icon).

---

## 6. Page Designs

### 6.1 `/login`

Centered card, full-bleed dark background with subtle radial gradient. Logo top-left. Email + password, magic link option, "Request access" link. `glass-3d` card, Instrument Serif heading "Welcome back", body Anthropic Sans.

### 6.2 Client `/app` — Overview

```
┌─ Sidebar (240px) ─┬─ Topbar (56px) ──────────────────────────────┐
│ Logo              │ org switcher · search · notifications · me   │
│                   ├──────────────────────────────────────────────┤
│ ▸ Overview        │  H1 (serif): "Q4 Web App Pentest"            │
│   Findings        │  meta: Active · Stage 3 of 6 · 14 findings   │
│   Assets          │                                              │
│   Timeline        │  ┌─ TIMELINE STRIP (horizontal, 6 nodes) ─┐  │
│   Reports         │  └────────────────────────────────────────┘  │
│   Notifications   │                                              │
│   ──              │  ┌─ KPI ─┐ ┌─ KPI ─┐ ┌─ KPI ─┐ ┌─ KPI ─┐    │
│   Settings        │  │Critic.│ │ Open  │ │ MTTR  │ │ Score │    │
│                   │  │   2   │ │  11   │ │ 4.2d  │ │ 72/100│    │
│                   │  └───────┘ └───────┘ └───────┘ └───────┘    │
│                   │                                              │
│                   │  ┌─ Severity donut ─┐ ┌─ Top categories ─┐  │
│                   │  │                  │ │ A03 Injection  ▆▆ │  │
│                   │  └──────────────────┘ │ A07 Auth      ▆▆▆▆│  │
│                   │                       └───────────────────┘  │
│                   │                                              │
│                   │  ┌─ Recent findings (last 5) ─────────────┐  │
│                   │  │ ●HIGH  Stored XSS in profile bio       │  │
│                   │  │ ●MED   Weak password policy            │  │
│                   │  └────────────────────────────────────────┘  │
│                   │                                              │
│                   │  ┌─ Activity feed (timeline view) ────────┐  │
│                   │  └────────────────────────────────────────┘  │
└───────────────────┴──────────────────────────────────────────────┘
```

All cards = `liquid-glass` / `glass-3d`. KPI numbers in Instrument Serif, large. Severity dot uses `--accent` for CRITICAL/HIGH, amber for MEDIUM, sky for LOW, neutral for INFO.

### 6.3 Client `/app/findings`

- Sticky filter rail: severity chips, status chips, category multi-select, asset filter, search
- Table: severity dot · title · category · asset · status · discovered · ▸
- Row click → drawer (slide-in from right, `glass-3d`) with full markdown body, evidence carousel, remediation panel, action: "Mark resolved" / "Acknowledge" / "Risk accept"
- Density toggle: comfortable / compact

### 6.4 Client `/app/timeline`

Vertical timeline, full bleed. Each stage block:
- Stage name (serif), state badge, started/completed timestamps
- Markdown note from analyst
- Nested activity events under each stage (findings published, comments)
- Smooth scroll-spy left rail

### 6.5 Admin `/admin`

Tri-column dashboard:
1. **Active engagements** (sortable by stage urgency)
2. **My queue** (findings to publish, reviews pending)
3. **Recent activity** across all clients

Plus a "command bar" (`Cmd+K`) for jumping to any client/engagement/finding.

### 6.6 Admin `/admin/engagements/[id]/upload`

Split view:
- Left: CodeMirror with markdown + frontmatter, live linter, "Validate" button
- Right: live preview rendered exactly as the client will see it
- Footer bar: validation summary (`12 findings · stage update: SCANNING → COMPLETED`), "Publish" CTA (red, glass-3d)
- After publish: diff modal showing creates/updates/no-ops, "Confirm publish" or "Edit"

### 6.6 Admin `/admin/engagements/[id]`

Tabs: **Overview · Stages · Findings · Assets · Team · Activity · Settings**
- Stages tab: drag a stage card to advance/regress, set state, add note
- Findings tab: filterable table, bulk actions (publish, hide, change status)
- Assets tab: add/remove, mark in-scope/out-of-scope
- Team tab: assign analysts, invite client members
- Activity tab: full audit trail with diff viewer

---

## 7. Design System

Reuse and extend `globals.css`. Add these tokens:

```css
:root {
  /* severity */
  --sev-critical: #dc2626;
  --sev-high:     #f97316;
  --sev-medium:   #eab308;
  --sev-low:      #38bdf8;
  --sev-info:     #a1a1aa;

  /* status */
  --status-success: #10b981;
  --status-warning: #f59e0b;
  --status-info:    #3b82f6;

  /* surfaces */
  --surface-1: rgba(255, 255, 255, 0.03);
  --surface-2: rgba(255, 255, 255, 0.05);
  --surface-3: rgba(255, 255, 255, 0.08);
}
```

**Component primitives** (`app/dashboard/components/ui/`):
- `Card`, `KPI`, `SeverityDot`, `StageBadge`, `StatusBadge`
- `Button` (primary red, secondary glass, ghost)
- `Input`, `Textarea`, `Select`, `Combobox`, `Switch`, `Checkbox`
- `Drawer`, `Dialog`, `Tabs`, `Tooltip`, `Popover` (custom, no shadcn — match existing aesthetic)
- `Table` wrapper around `@tanstack/react-table`
- `MarkdownRenderer` (sanitized, syntax-highlighted code blocks)
- `Timeline`, `TimelineNode`, `ActivityFeed`
- `EmptyState` with serif heading + helpful action
- `Skeleton` shimmers using existing `built-for-shimmer` keyframes

**Motion language:** entrance = 16-24px translate-y, 400ms `[0.22, 1, 0.36, 1]`. Stagger child cards by 60ms. Hover on cards = `built-for-card--hovered` style. No bouncy springs. Respect `prefers-reduced-motion`.

**Typography scale:**
- Display: Instrument Serif, clamp(2.5rem, 4vw, 4rem)
- H1 page: serif, 2rem
- H2 section: serif, 1.5rem
- Body: Anthropic Sans, 0.9375rem, line-height 1.55
- Mono (code, CVE, CVSS): `ui-monospace, SFMono-Regular, Menlo`

---

## 8. API Routes

All under `app/api/`. Server actions for forms, route handlers for fetch + SSE.

```
GET    /api/me
GET    /api/orgs/[slug]
GET    /api/engagements                   ?status=&stage=
GET    /api/engagements/[id]
POST   /api/engagements                   (admin)
PATCH  /api/engagements/[id]              (admin)
GET    /api/engagements/[id]/findings
GET    /api/findings/[id]
PATCH  /api/findings/[id]                 (status changes — client + admin)
POST   /api/engagements/[id]/upload       (admin) — markdown body
POST   /api/engagements/[id]/stage        (admin) — manual stage transition
GET    /api/engagements/[id]/activity     SSE stream
GET    /api/notifications
PATCH  /api/notifications/[id]            (mark read)
POST   /api/reports/[engagementId]/export (PDF render via @react-pdf/renderer)
```

**Auth middleware:** `app/middleware.ts` checks Better Auth session, attaches `user.role + user.orgId`, redirects.

**Authorization helper:** `assertCanAccessEngagement(user, engagementId)` — admins pass, clients must match `orgId`.

---

## 9. Notifications

Triggered by `ActivityEvent` insert. A worker function (server action invoked inline) fans out:
- In-app notification row per affected user
- SSE push if connection open
- Email via Resend (digest-friendly, debounced 5min for the same engagement)

Client-visible activity types only (`visibleToClient=true`). Admin-only events stay internal.

---

## 10. Build Order (Phases)

Each phase ends with a working, deployable cut.

### Phase 0 — Foundations *(0.5 day)*
- Add Prisma, Better Auth, Neon, Resend env vars
- `prisma/schema.prisma` from §3, first migration
- Better Auth setup with email+password and magic link
- `app/middleware.ts` with role-based routing
- Seed script: 1 admin, 1 client org, 1 client user, 1 sample engagement with all stages + 6 sample findings

### Phase 1 — Design system + shells *(1 day)*
- Add severity/status tokens to `globals.css`
- Build UI primitives in `app/dashboard/components/ui/`
- Build `<DashboardShell>` (sidebar + topbar + main) — shared by `/app` and `/admin`
- Login page + onboard flow
- 403 / 404 pages in same theme

### Phase 2 — Client read-only *(1.5 days)*
- `/app` overview with timeline strip + KPIs + recent findings + activity feed
- `/app/findings` table + drawer
- `/app/findings/[id]` full view
- `/app/timeline` vertical view
- `/app/assets` list
- `/app/notifications` feed
- All wired to seeded data, no writes yet

### Phase 3 — Admin engagement management *(1.5 days)*
- `/admin` overview with cmd+k
- `/admin/clients`, `/admin/clients/[id]`
- `/admin/engagements`, `/admin/engagements/[id]` with all tabs
- Stage editor (drag to advance, add note)
- Asset editor
- Team management (invite client users — email magic link)

### Phase 4 — Markdown ingestion *(1.5 days)*
- `/admin/engagements/[id]/upload` split view with CodeMirror
- Frontmatter `zod` schema + parser pipeline (§4)
- Validation UI with line numbers
- Live preview matching client renderer
- Diff modal on publish
- Markdown library page (templates)

### Phase 5 — Status writes + remediation loop *(0.5 day)*
- Client can change finding status (`OPEN → ACKNOWLEDGED → IN_PROGRESS → RESOLVED`)
- Risk-accept flow with required justification
- Admin sees status changes in activity feed

### Phase 6 — Notifications + realtime *(0.5 day)*
- SSE route for activity stream
- In-app notification dropdown
- Resend email integration with 5-min debounce
- Notification preferences in `/app/settings`

### Phase 7 — Reports + analytics polish *(1 day)*
- PDF export via `@react-pdf/renderer` (matches dashboard styling)
- Severity trend over time (line chart)
- OWASP category breakdown
- MTTR + risk-score formulas
- Engagement comparison view (admin)

### Phase 8 — Audit log + admin polish *(0.5 day)*
- `/admin/audit` with filters + diff viewer
- Audit middleware on all mutating routes
- Per-finding history view

### Phase 9 — Hardening + a11y *(1 day)*
- Run `audit` skill across all pages
- Keyboard navigation everywhere (cmd+k, arrow keys in tables, esc to close drawer)
- ARIA labels, focus-visible rings using `--accent`
- Empty states for every list
- Loading skeletons matching `glass-3d`
- Error boundaries with themed fallback
- Run `harden` skill for resilience pass

### Phase 10 — Performance + ship *(0.5 day)*
- Server-component-first audit (only interactivity is client)
- Suspense boundaries with skeletons
- Image optimization for evidence
- Run `optimize` skill
- Lighthouse pass on all dashboard pages (target ≥ 90 each)

**Total estimate:** ~9–10 working days to production-quality v1.

---

## 11. Folder Layout

```
app/
  (marketing)/                 existing landing — move existing files here
    page.tsx
    sections/
    components/
  app/                         CLIENT dashboard
    layout.tsx                 DashboardShell (client variant)
    page.tsx                   overview
    findings/
      page.tsx
      [id]/page.tsx
    assets/
    timeline/
    reports/
    notifications/
    settings/
  admin/                       ADMIN dashboard
    layout.tsx                 DashboardShell (admin variant)
    page.tsx
    clients/
    engagements/
      [id]/
        page.tsx
        upload/
        findings/[id]/
    library/
    users/
    audit/
  api/
    auth/[...all]/             Better Auth handler
    engagements/
    findings/
    notifications/
    reports/
  dashboard/                   shared dashboard pieces
    components/
      ui/                      design system primitives
      timeline/
      findings/
      charts/
      markdown/
    lib/
      auth.ts                  Better Auth client + server helpers
      authz.ts                 assertCanAccessEngagement etc.
      markdown.ts              parser pipeline
      severity.ts              CVSS helpers, color maps
      activity.ts              event emitter + fanout
      notifications.ts
      sse.ts
  login/
  onboard/[token]/
  middleware.ts
prisma/
  schema.prisma
  seed.ts
  migrations/
```

Marketing site moves into `app/(marketing)/` route group so dashboards can own clean roots without colliding.

---

## 12. Environment Variables

```
DATABASE_URL=                 # Neon
DIRECT_URL=                   # Neon direct (for migrations)
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
RESEND_API_KEY=
EMAIL_FROM="Blindwall <reports@blindwall.app>"
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=
NEXT_PUBLIC_APP_URL=
```

---

## 13. Open Decisions (defer until phase touches them)

- **Multi-tenant boundary:** one org per client now; multi-org per user later if needed
- **2FA:** Better Auth supports TOTP — add in Phase 9 if required by clients
- **API tokens:** out of scope for v1; design `/app/settings/api` page only
- **Comments on findings:** out of scope for v1; schema is comment-ready (`ActivityEvent.type=COMMENT_ADDED`)
- **SLA tracking:** post-v1; remediation deadlines per severity could drive it later

---

## 14. Quality Bar — Definition of Done

A page is "done" only when **all** of these are true:

- Visual parity with marketing site (`glass-3d`, serif display, motion language)
- Server-component-first; client islands only where needed
- Loading + empty + error states designed
- Keyboard accessible (tab order, focus rings, esc to close, cmd+k aware)
- Mobile-responsive down to 375px
- Lighthouse ≥ 90 on Performance, A11y, Best Practices, SEO
- `lsp_diagnostics` clean
- Seeded data renders without dev fallbacks
- Reduced-motion variant exists

---

## 15. First Move

Once you green-light this plan, Phase 0 starts:
1. Move existing marketing files into `app/(marketing)/`
2. Add Prisma + Better Auth + Neon + Resend deps
3. Write `prisma/schema.prisma` + first migration
4. Seed script + login page + middleware
5. Deploy to Vercel preview to confirm Neon connection works

Then Phase 1 design system, then read-only client dashboard becomes visible to you within ~3 working days.
