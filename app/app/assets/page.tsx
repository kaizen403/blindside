import { requireClient } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { Card, CardBody, CardHeader, CardTitle } from "@/app/dashboard/components/ui/Card";
import { EmptyState } from "@/app/dashboard/components/ui/KPI";
import { SeverityDot } from "@/app/dashboard/components/ui/Badge";

export default async function AssetsPage() {
  const user = await requireClient();
  if (!user.orgId) return <EmptyState title="No organization" />;
  const engagement = await prisma.engagement.findFirst({
    where: { orgId: user.orgId, status: "ACTIVE" },
    include: { assets: { include: { findings: true } } },
  });
  if (!engagement) return <EmptyState title="No active engagement" />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-3xl">Assets</h2>
        <p className="text-sm text-[color:var(--muted-foreground)] mt-1">
          Assets in scope for this engagement.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {engagement.assets.map((a) => {
          const bySev = {
            CRITICAL: a.findings.filter((f) => f.severity === "CRITICAL").length,
            HIGH: a.findings.filter((f) => f.severity === "HIGH").length,
            MEDIUM: a.findings.filter((f) => f.severity === "MEDIUM").length,
            LOW: a.findings.filter((f) => f.severity === "LOW").length,
            INFO: a.findings.filter((f) => f.severity === "INFO").length,
          };
          return (
            <Card key={a.id}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/5 text-[color:var(--muted-foreground)]">
                    {a.type}
                  </span>
                  {!a.inScope && (
                    <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/5 text-[color:var(--muted-foreground)]">
                      Out of scope
                    </span>
                  )}
                </div>
                <CardTitle className="mt-2">{a.name}</CardTitle>
                {a.url && (
                  <a href={a.url} className="text-xs text-[color:var(--accent)] hover:underline font-mono mt-1 block">
                    {a.url}
                  </a>
                )}
              </CardHeader>
              <CardBody className="pt-0">
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <SeverityDot severity="CRITICAL" /> {bySev.CRITICAL}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <SeverityDot severity="HIGH" /> {bySev.HIGH}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <SeverityDot severity="MEDIUM" /> {bySev.MEDIUM}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <SeverityDot severity="LOW" /> {bySev.LOW}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <SeverityDot severity="INFO" /> {bySev.INFO}
                  </div>
                </div>
                <div className="text-xs text-[color:var(--muted-foreground)] mt-3">
                  {a.findings.length} total finding{a.findings.length === 1 ? "" : "s"}
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
