import { requireAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { KPI } from "@/app/dashboard/components/ui/KPI";
import { Card, CardBody, CardHeader, CardTitle } from "@/app/dashboard/components/ui/Card";
import { StageBadge } from "@/app/dashboard/components/ui/Badge";
import { stageLabel } from "@/lib/severity";
import Link from "next/link";

export default async function AdminOverview() {
  await requireAdmin();
  const [orgs, engagements, findings, openFindings, activity] = await Promise.all([
    prisma.org.count(),
    prisma.engagement.findMany({
      where: { status: "ACTIVE" },
      include: { org: true, findings: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.finding.count(),
    prisma.finding.count({ where: { status: { in: ["OPEN", "ACKNOWLEDGED", "IN_PROGRESS"] } } }),
    prisma.activityEvent.findMany({ orderBy: { createdAt: "desc" }, take: 8, include: { engagement: true } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-3xl">Operations</h2>
        <p className="text-sm text-[color:var(--muted-foreground)] mt-1">
          Everything in motion across clients.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPI label="Clients" value={orgs} />
        <KPI label="Active engagements" value={engagements.length} />
        <KPI label="Open findings" value={openFindings} accent="var(--sev-high)" />
        <KPI label="Total findings" value={findings} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Active engagements</CardTitle></CardHeader>
          <CardBody className="pt-0">
            {engagements.length === 0 ? (
              <p className="text-sm text-[color:var(--muted-foreground)] py-4">No active engagements.</p>
            ) : (
              <ul className="space-y-2">
                {engagements.map((e) => (
                  <li key={e.id}>
                    <Link href={`/admin/engagements/${e.id}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/[0.02] transition-colors">
                      <div>
                        <div className="text-sm font-medium">{e.name}</div>
                        <div className="text-xs text-[color:var(--muted-foreground)] mt-0.5">
                          {e.org.name} · {e.findings.length} findings
                        </div>
                      </div>
                      <div className="text-xs text-[color:var(--muted-foreground)] shrink-0 ml-4">
                        {stageLabel[e.currentStage]}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader><CardTitle>Recent activity</CardTitle></CardHeader>
          <CardBody className="pt-0">
            <ul className="space-y-3">
              {activity.map((a) => {
                const p = a.payload as Record<string, string> | null;
                return (
                  <li key={a.id} className="text-sm">
                    <div>
                      <span className="text-[color:var(--muted-foreground)]">{a.engagement.name}:</span>{" "}
                      {a.type.replaceAll("_", " ").toLowerCase()}
                      {p?.title && <span className="text-[color:var(--foreground)]"> — {p.title}</span>}
                    </div>
                    <div className="text-[11px] text-[color:var(--muted-foreground)] mt-0.5">
                      {new Date(a.createdAt).toLocaleDateString()}
                    </div>
                  </li>
                );
              })}
            </ul>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
