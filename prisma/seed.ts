/* eslint-disable @typescript-eslint/no-explicit-any */
import "dotenv/config";
import { PrismaClient, Severity, Stage, StageState, AssetType, FindingStatus, ActivityType, EvidenceKind } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { auth } from "../lib/auth";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function signUpOrGet(email: string, password: string, name: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return existing;
  try {
    const res = await auth.api.signUpEmail({
      body: { email, password, name },
    });
    return await prisma.user.findUnique({ where: { id: (res as any).user.id } });
  } catch (e: any) {
    // user may have been partially created; fall back
    const again = await prisma.user.findUnique({ where: { email } });
    if (again) return again;
    throw e;
  }
}

async function main() {
  console.log("🌱 Seeding Blind Side...");

  // --- Users ---
  const admin = await signUpOrGet("admin@blindside.local", "Admin@123456", "Admin User");
  const analyst = await signUpOrGet("analyst@blindside.local", "Analyst@123456", "Ada Analyst");
  await prisma.user.update({ where: { id: admin!.id }, data: { role: "ADMIN", emailVerified: true } });
  await prisma.user.update({ where: { id: analyst!.id }, data: { role: "ANALYST", emailVerified: true } });

  // --- Org ---
  const org = await prisma.org.upsert({
    where: { slug: "acme" },
    update: { name: "ACME Corporation" },
    create: { name: "ACME Corporation", slug: "acme" },
  });

  const ceo = await signUpOrGet("ceo@acme.local", "Client@123456", "Casey CEO");
  const cto = await signUpOrGet("cto@acme.local", "Client@123456", "Tori CTO");
  await prisma.user.update({ where: { id: ceo!.id }, data: { role: "CLIENT", orgId: org.id, emailVerified: true } });
  await prisma.user.update({ where: { id: cto!.id }, data: { role: "CLIENT", orgId: org.id, emailVerified: true } });

  // --- Engagement ---
  const engagement = await prisma.engagement.upsert({
    where: { id: "eng_seed_001" },
    update: {},
    create: {
      id: "eng_seed_001",
      orgId: org.id,
      name: "Q2 2026 Web Application Pentest",
      scopeSummary: "Full authenticated + unauthenticated assessment of ACME's public web properties.",
      startDate: new Date("2026-04-01"),
      targetEndDate: new Date("2026-06-30"),
      currentStage: "SCANNING",
      status: "ACTIVE",
    },
  });

  // --- Stage events (idempotent: delete existing for this engagement then recreate) ---
  await prisma.stageEvent.deleteMany({ where: { engagementId: engagement.id } });
  const stageDefs: { stage: Stage; state: StageState; note?: string; offsetDays: number; duration?: number }[] = [
    { stage: "SCOPING", state: "COMPLETED", note: "Scope defined: 4 assets, authenticated + unauthenticated testing approved.", offsetDays: 0, duration: 3 },
    { stage: "RECON", state: "COMPLETED", note: "Attack surface enumerated: 127 endpoints, 4 subdomains.", offsetDays: 4, duration: 5 },
    { stage: "SCANNING", state: "IN_PROGRESS", note: "Authenticated scan in flight; 14 findings queued.", offsetDays: 10, duration: 7 },
    { stage: "EXPLOITATION", state: "PENDING", offsetDays: 18, duration: 7 },
    { stage: "REPORTING", state: "PENDING", offsetDays: 26, duration: 5 },
    { stage: "REMEDIATION", state: "PENDING", offsetDays: 32, duration: 14 },
  ];
  const start = new Date("2026-04-01");
  for (const s of stageDefs) {
    const startedAt = s.state !== "PENDING" ? new Date(start.getTime() + s.offsetDays * 86400000) : null;
    const completedAt = s.state === "COMPLETED" ? new Date(start.getTime() + (s.offsetDays + (s.duration ?? 0)) * 86400000) : null;
    await prisma.stageEvent.create({
      data: {
        engagementId: engagement.id,
        stage: s.stage,
        state: s.state,
        startedAt,
        completedAt,
        note: s.note,
        actorId: analyst!.id,
      },
    });
  }

  // --- Assets ---
  const assetDefs = [
    { id: "asset_api", name: "api.acme.com", type: "API" as AssetType, url: "https://api.acme.com" },
    { id: "asset_app", name: "app.acme.com", type: "WEB" as AssetType, url: "https://app.acme.com" },
    { id: "asset_admin", name: "admin.acme.com", type: "WEB" as AssetType, url: "https://admin.acme.com" },
    { id: "asset_mobile", name: "ACME iOS", type: "MOBILE" as AssetType, url: null },
  ];
  const assets: Record<string, string> = {};
  for (const a of assetDefs) {
    const row = await prisma.asset.upsert({
      where: { id: a.id },
      update: {},
      create: { id: a.id, engagementId: engagement.id, name: a.name, type: a.type, url: a.url ?? undefined, inScope: true },
    });
    assets[a.id] = row.id;
  }

  // --- Findings ---
  const findingDefs: { slug: string; title: string; severity: Severity; category: string; cweId?: string; cvssVector?: string; cvssScore?: number; status: FindingStatus; assetId: string; body: string; remediation: string }[] = [
    {
      slug: "stored-xss-profile-bio", title: "Stored XSS in profile bio", severity: "HIGH", category: "A03:2021 — Injection",
      cweId: "CWE-79", cvssVector: "CVSS:3.1/AV:N/AC:L/PR:L/UI:R/S:C/C:H/I:H/A:N", cvssScore: 8.7, status: "OPEN", assetId: "asset_api",
      body: "The `bio` field on `/api/v1/users/me` accepts arbitrary HTML.\n\n### Reproduction\n1. Log in as any user\n2. PATCH `/api/v1/users/me` with `{\"bio\":\"<script>alert(1)</script>\"}`\n3. Visit any page that renders the profile\n\n### Impact\nSession hijacking, account takeover, phishing on trusted domain.",
      remediation: "Encode output via DOMPurify or server-side sanitizer. Set `Content-Security-Policy: script-src 'self'`.",
    },
    {
      slug: "weak-password-policy", title: "Weak password policy", severity: "MEDIUM", category: "A07:2021 — Auth Failures",
      cweId: "CWE-521", cvssScore: 5.3, status: "ACKNOWLEDGED", assetId: "asset_app",
      body: "Password policy allows 6-character passwords without complexity requirements.", remediation: "Enforce minimum 12 characters with complexity OR use passkey/magic link auth.",
    },
    {
      slug: "sql-injection-search", title: "SQL injection in search endpoint", severity: "CRITICAL", category: "A03:2021 — Injection",
      cweId: "CWE-89", cvssScore: 9.8, status: "OPEN", assetId: "asset_api",
      body: "The `q` parameter on `/api/v1/search` is concatenated into SQL.\n\n```\n/api/v1/search?q=' OR 1=1--\n```\nReturns full user table.",
      remediation: "Use parameterized queries / Prisma.",
    },
    {
      slug: "broken-access-control-admin", title: "Broken access control on admin endpoints", severity: "CRITICAL", category: "A01:2021 — Broken Access Control",
      cweId: "CWE-284", cvssScore: 9.1, status: "IN_PROGRESS", assetId: "asset_admin",
      body: "Admin endpoints under `/admin/api/*` rely on obscurity. Any authenticated user can hit them.", remediation: "Server-side role check on every admin route handler.",
    },
    {
      slug: "missing-csrf-tokens", title: "Missing CSRF tokens on state-changing forms", severity: "HIGH", category: "A01:2021 — Broken Access Control",
      cweId: "CWE-352", cvssScore: 8.0, status: "OPEN", assetId: "asset_app",
      body: "Logout, profile update, and payment forms accept cross-site POST without tokens.", remediation: "Use SameSite=Strict cookies + double-submit CSRF tokens.",
    },
    {
      slug: "jwt-none-algo", title: "JWT accepts `alg: none`", severity: "CRITICAL", category: "A02:2021 — Cryptographic Failures",
      cweId: "CWE-327", cvssScore: 9.8, status: "RESOLVED", assetId: "asset_api",
      body: "API accepts tokens with `\"alg\":\"none\"` header, allowing full auth bypass.", remediation: "Pin algorithm to HS256/RS256 server-side. Reject any token with alg=none.",
    },
    {
      slug: "outdated-deps", title: "Outdated dependencies with known CVEs", severity: "MEDIUM", category: "A06:2021 — Vulnerable Components",
      cvssScore: 6.5, status: "OPEN", assetId: "asset_app",
      body: "14 direct dependencies have known CVEs including CVE-2024-xxxxx in lodash@4.17.11.", remediation: "Upgrade via `pnpm update` and enable Dependabot.",
    },
    {
      slug: "verbose-errors", title: "Verbose error messages leak stack traces", severity: "LOW", category: "A09:2021 — Logging Failures",
      cvssScore: 3.1, status: "OPEN", assetId: "asset_api",
      body: "500 responses include full Node stack traces on production.", remediation: "Wrap handlers in try/catch, log server-side, return generic 500 client-side.",
    },
    {
      slug: "no-rate-limiting", title: "No rate limiting on authentication endpoints", severity: "HIGH", category: "A07:2021 — Auth Failures",
      cweId: "CWE-307", cvssScore: 7.5, status: "OPEN", assetId: "asset_api",
      body: "Login endpoint allows unlimited attempts per IP.", remediation: "Add per-IP and per-account throttling.",
    },
    {
      slug: "insecure-cors", title: "Permissive CORS policy", severity: "MEDIUM", category: "A05:2021 — Security Misconfiguration",
      cvssScore: 5.4, status: "ACKNOWLEDGED", assetId: "asset_api",
      body: "Access-Control-Allow-Origin reflects any origin.", remediation: "Allowlist specific origins.",
    },
    {
      slug: "missing-security-headers", title: "Missing security headers", severity: "LOW", category: "A05:2021 — Security Misconfiguration",
      cvssScore: 3.7, status: "OPEN", assetId: "asset_app",
      body: "No HSTS, no CSP, no X-Frame-Options.", remediation: "Add via Next.js headers() config.",
    },
    {
      slug: "info-disclosure-server", title: "Server version disclosed in headers", severity: "INFO", category: "A05:2021 — Security Misconfiguration",
      cvssScore: 0.0, status: "OPEN", assetId: "asset_api",
      body: "`Server: nginx/1.21.0` header exposed.", remediation: "Set `server_tokens off;`.",
    },
  ];

  for (const f of findingDefs) {
    await prisma.finding.upsert({
      where: { engagementId_slug: { engagementId: engagement.id, slug: f.slug } },
      update: {},
      create: {
        engagementId: engagement.id,
        assetId: assets[f.assetId],
        title: f.title,
        slug: f.slug,
        severity: f.severity,
        cvssVector: f.cvssVector,
        cvssScore: f.cvssScore,
        category: f.category,
        cweId: f.cweId,
        status: f.status,
        bodyMarkdown: f.body,
        bodyHtml: `<p>${f.body.replace(/\n/g, "<br>")}</p>`,
        remediation: f.remediation,
        refs: ["https://owasp.org/Top10/"],
        discoveredAt: new Date("2026-04-15"),
        resolvedAt: f.status === "RESOLVED" ? new Date("2026-04-18") : null,
        authorId: analyst!.id,
      },
    });
  }

  // --- Evidence ---
  const findings = await prisma.finding.findMany({ where: { engagementId: engagement.id }, take: 4 });
  for (const [i, f] of findings.entries()) {
    const existing = await prisma.evidence.findFirst({ where: { findingId: f.id } });
    if (existing) continue;
    await prisma.evidence.create({
      data: {
        findingId: f.id,
        kind: (["IMAGE", "REQUEST", "RESPONSE", "LOG"] as EvidenceKind[])[i % 4],
        caption: `Evidence ${i + 1} for ${f.title}`,
        url: `https://placeholder/evidence/${f.id}.png`,
      },
    });
  }

  // --- Activity events ---
  await prisma.activityEvent.deleteMany({ where: { engagementId: engagement.id } });
  const activityDefs: { type: ActivityType; payload: any; daysAgo: number }[] = [
    { type: "ENGAGEMENT_CREATED", payload: { name: engagement.name }, daysAgo: 24 },
    { type: "STAGE_STARTED", payload: { stage: "SCOPING" }, daysAgo: 24 },
    { type: "STAGE_COMPLETED", payload: { stage: "SCOPING" }, daysAgo: 21 },
    { type: "STAGE_STARTED", payload: { stage: "RECON" }, daysAgo: 20 },
    { type: "STAGE_COMPLETED", payload: { stage: "RECON" }, daysAgo: 15 },
    { type: "STAGE_STARTED", payload: { stage: "SCANNING" }, daysAgo: 14 },
    { type: "FINDING_PUBLISHED", payload: { title: "SQL injection in search endpoint", severity: "CRITICAL" }, daysAgo: 10 },
    { type: "FINDING_PUBLISHED", payload: { title: "Stored XSS in profile bio", severity: "HIGH" }, daysAgo: 9 },
  ];
  for (const a of activityDefs) {
    await prisma.activityEvent.create({
      data: {
        engagementId: engagement.id,
        type: a.type,
        payload: a.payload,
        actorId: analyst!.id,
        visibleToClient: true,
        createdAt: new Date(Date.now() - a.daysAgo * 86400000),
      },
    });
  }

  // --- Notifications ---
  const existingNotifs = await prisma.notification.count({ where: { userId: ceo!.id } });
  if (existingNotifs === 0) {
    await prisma.notification.createMany({
      data: [
        { userId: ceo!.id, type: "FINDING_PUBLISHED", title: "2 new critical findings", body: "SQL injection and JWT algorithm bypass discovered.", href: "/app/findings" },
        { userId: ceo!.id, type: "STAGE_STARTED", title: "Scanning stage started", body: "Your engagement has entered the Scanning phase.", href: "/app/timeline" },
        { userId: ceo!.id, type: "REPORT_PUBLISHED", title: "Interim report available", body: "View mid-engagement findings summary.", href: "/app/reports" },
      ],
    });
  }

  // --- Audit ---
  const existingAudits = await prisma.auditLog.count();
  if (existingAudits === 0) {
    await prisma.auditLog.createMany({
      data: [
        { actorId: admin!.id, action: "engagement.create", entity: "Engagement", entityId: engagement.id, diff: { name: engagement.name } },
        { actorId: analyst!.id, action: "finding.publish", entity: "Finding", entityId: "seed", diff: { count: findingDefs.length } },
      ],
    });
  }

  console.log(`✅ Seed complete. Users: ${await prisma.user.count()}, Findings: ${await prisma.finding.count()}, Activity: ${await prisma.activityEvent.count()}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
