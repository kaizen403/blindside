import { requireClient } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { EmptyState } from "@/app/dashboard/components/ui/KPI";
import { Card, CardBody, CardHeader, CardTitle } from "@/app/dashboard/components/ui/Card";
import { FileText } from "lucide-react";

export default async function ReportsPage() {
  const user = await requireClient();
  if (!user.orgId) return <EmptyState title="No organization" />;
  const engagements = await prisma.engagement.findMany({
    where: { orgId: user.orgId },
    include: { reports: { orderBy: { version: "desc" } } },
  });
  const allReports = engagements.flatMap((e) =>
    e.reports.map((r) => ({ ...r, engagementName: e.name })),
  );
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="font-serif text-3xl">Reports</h2>
        <p className="text-sm text-[color:var(--muted-foreground)] mt-1">
          Download PDFs of completed engagements.
        </p>
      </div>
      {allReports.length === 0 ? (
        <EmptyState
          title="No reports yet"
          description="Reports are published after the Reporting stage completes."
          icon={<FileText size={40} />}
        />
      ) : (
        <div className="space-y-3">
          {allReports.map((r) => (
            <Card key={r.id}>
              <CardHeader>
                <CardTitle>{r.engagementName}</CardTitle>
              </CardHeader>
              <CardBody className="pt-0 flex items-center justify-between">
                <div className="text-xs text-[color:var(--muted-foreground)]">
                  Version {r.version}
                  {r.publishedAt && ` · Published ${new Date(r.publishedAt).toLocaleDateString()}`}
                </div>
                {r.pdfUrl ? (
                  <a href={r.pdfUrl} className="text-sm text-[color:var(--accent)] hover:underline">Download →</a>
                ) : (
                  <span className="text-xs text-[color:var(--muted-foreground)]">Not yet generated</span>
                )}
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
