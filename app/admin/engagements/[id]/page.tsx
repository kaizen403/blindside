import { requireAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { Card, CardBody, CardHeader, CardTitle } from "@/app/dashboard/components/ui/Card";
import { TimelineStrip } from "@/app/dashboard/components/Timeline";
import { SeverityBadge, StatusBadge } from "@/app/dashboard/components/ui/Badge";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Upload } from "lucide-react";

export default async function EngagementDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireAdmin();
  const engagement = await prisma.engagement.findUnique({
    where: { id },
    include: {
      org: true,
      stages: { orderBy: { createdAt: "asc" } },
      findings: { include: { asset: true }, orderBy: { discoveredAt: "desc" } },
      assets: true,
      activity: { orderBy: { createdAt: "desc" }, take: 15 },
    },
  });
  if (!engagement) notFound();
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-serif text-3xl">{engagement.name}</h2>
          <p className="text-sm text-[color:var(--muted-foreground)] mt-1">
            {engagement.org.name} · {engagement.status.toLowerCase()}
          </p>
        </div>
        <Link
          href={`/admin/engagements/${engagement.id}/upload`}
          className="inline-flex items-center gap-2 px-4 h-10 rounded-lg bg-[color:var(--accent)] text-white text-sm font-medium hover:brightness-110 shadow-[0_0_24px_rgba(220,38,38,0.25)]"
        >
          <Upload size={14} />
          Upload report
        </Link>
      </div>

      <TimelineStrip stages={engagement.stages} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Findings ({engagement.findings.length})</CardTitle></CardHeader>
          <CardBody className="pt-0">
            {engagement.findings.length === 0 ? (
              <p className="text-sm text-[color:var(--muted-foreground)] py-4">No findings yet.</p>
            ) : (
              <ul className="divide-y divide-white/[0.04]">
                {engagement.findings.map((f) => (
                  <li key={f.id} className="py-2 flex items-center gap-4">
                    <SeverityBadge severity={f.severity} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{f.title}</div>
                      <div className="text-xs text-[color:var(--muted-foreground)] mt-0.5">
                        {f.asset?.name ?? "—"}
                      </div>
                    </div>
                    <StatusBadge status={f.status} />
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Assets ({engagement.assets.length})</CardTitle></CardHeader>
            <CardBody className="pt-0">
              <ul className="space-y-2">
                {engagement.assets.map((a) => (
                  <li key={a.id} className="flex items-center justify-between">
                    <span className="text-sm">{a.name}</span>
                    <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/5 text-[color:var(--muted-foreground)]">{a.type}</span>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
          <Card>
            <CardHeader><CardTitle>Recent activity</CardTitle></CardHeader>
            <CardBody className="pt-0">
              <ul className="space-y-2 text-xs">
                {engagement.activity.map((a) => (
                  <li key={a.id} className="text-[color:var(--muted-foreground)]">
                    {a.type.replaceAll("_", " ").toLowerCase()} · {new Date(a.createdAt).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
