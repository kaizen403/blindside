import { requireClient } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { KPI, EmptyState } from "@/app/dashboard/components/ui/KPI";
import { TimelineStrip } from "@/app/dashboard/components/Timeline";
import { SeverityBadge, StatusBadge } from "@/app/dashboard/components/ui/Badge";
import { Card, CardBody, CardHeader, CardTitle } from "@/app/dashboard/components/ui/Card";
import { SeverityDonut, CategoryBars } from "@/app/dashboard/components/Charts";
import { LiveActivityFeed } from "@/app/dashboard/components/LiveActivityFeed";
import { riskScore } from "@/lib/severity";
import type { Severity } from "@prisma/client";
import Link from "next/link";

export default async function AppOverview() {
  const user = await requireClient();
  if (!user.orgId) {
    return (
      <EmptyState
        title="No organization"
        description="Your account isn't linked to an organization yet. Contact support."
      />
    );
  }

  const engagement = await prisma.engagement.findFirst({
    where: { orgId: user.orgId, status: "ACTIVE" },
    include: {
      stages: { orderBy: { createdAt: "asc" } },
      findings: { orderBy: { discoveredAt: "desc" }, take: 6, include: { asset: true } },
    },
  });

  if (!engagement) {
    return (
      <EmptyState
        title="No active engagement"
        description="You'll see your active pentest here once it's scoped."
      />
    );
  }

  const allFindings = await prisma.finding.findMany({ where: { engagementId: engagement.id } });
  const criticalCount = allFindings.filter((f) => f.severity === "CRITICAL").length;
  const openCount = allFindings.filter((f) =>
    f.status === "OPEN" || f.status === "ACKNOWLEDGED" || f.status === "IN_PROGRESS",
  ).length;
  const resolved = allFindings.filter((f) => f.status === "RESOLVED");
  const mttr = resolved.length > 0
    ? (resolved.reduce((sum, f) => sum + (f.resolvedAt!.getTime() - f.discoveredAt.getTime()), 0) / resolved.length / 86400000).toFixed(1)
    : "—";
  const score = riskScore(allFindings);

  const severityCounts: Record<Severity, number> = {
    CRITICAL: allFindings.filter((f) => f.severity === "CRITICAL").length,
    HIGH: allFindings.filter((f) => f.severity === "HIGH").length,
    MEDIUM: allFindings.filter((f) => f.severity === "MEDIUM").length,
    LOW: allFindings.filter((f) => f.severity === "LOW").length,
    INFO: allFindings.filter((f) => f.severity === "INFO").length,
  };

  const categoryCounts = Object.entries(
    allFindings.reduce<Record<string, number>>((acc, f) => {
      acc[f.category] = (acc[f.category] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([category, count]) => ({ category, count }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-3xl">{engagement.name}</h2>
        <p className="text-sm text-[color:var(--muted-foreground)] mt-1">
          {engagement.status.toLowerCase()} · started {new Date(engagement.startDate).toLocaleDateString()} · {allFindings.length} findings
        </p>
      </div>

      <TimelineStrip stages={engagement.stages} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPI label="Critical" value={criticalCount} accent="var(--sev-critical)" />
        <KPI label="Open" value={openCount} />
        <KPI label="MTTR" value={mttr === "—" ? mttr : `${mttr}d`} />
        <KPI
          label="Risk score"
          value={`${score}/100`}
          accent={score < 50 ? "var(--sev-critical)" : score < 75 ? "var(--sev-medium)" : "var(--status-success)"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Severity distribution</CardTitle></CardHeader>
          <CardBody className="pt-0">
            <SeverityDonut data={severityCounts} />
          </CardBody>
        </Card>
        <Card>
          <CardHeader><CardTitle>Top categories</CardTitle></CardHeader>
          <CardBody className="pt-0">
            <CategoryBars data={categoryCounts} />
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent findings</CardTitle>
          </CardHeader>
          <CardBody className="pt-0">
            {engagement.findings.length === 0 ? (
              <p className="text-sm text-[color:var(--muted-foreground)] py-6">No findings yet.</p>
            ) : (
              <ul className="divide-y divide-white/[0.04]">
                {engagement.findings.map((f) => (
                  <li key={f.id}>
                    <Link
                      href={`/app/findings/${f.id}`}
                      className="flex items-center gap-4 py-3 hover:bg-white/[0.02] rounded-lg px-2 -mx-2 transition-colors"
                    >
                      <SeverityBadge severity={f.severity} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{f.title}</div>
                        <div className="text-xs text-[color:var(--muted-foreground)] mt-0.5">
                          {f.category}{f.asset && ` · ${f.asset.name}`}
                        </div>
                      </div>
                      <StatusBadge status={f.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-4">
              <Link href="/app/findings" className="text-sm text-[color:var(--accent)] hover:underline">
                See all findings →
              </Link>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Live activity</CardTitle>
          </CardHeader>
          <CardBody className="pt-0">
            <LiveActivityFeed engagementId={engagement.id} />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
