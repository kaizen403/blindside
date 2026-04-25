import { requireClient, assertCanAccessEngagement } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { SeverityBadge, StatusBadge } from "@/app/dashboard/components/ui/Badge";
import { Card, CardBody, CardHeader, CardTitle } from "@/app/dashboard/components/ui/Card";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function FindingDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireClient();
  const finding = await prisma.finding.findUnique({
    where: { id },
    include: { asset: true, engagement: true, evidence: true },
  });
  if (!finding) notFound();
  const allowed = await assertCanAccessEngagement(user.id, finding.engagementId);
  if (!allowed) notFound();

  return (
    <div className="space-y-6 max-w-4xl">
      <Link href="/app/findings" className="inline-flex items-center gap-2 text-sm text-[color:var(--muted-foreground)] hover:text-white">
        <ArrowLeft size={14} />
        All findings
      </Link>

      <div className="space-y-3">
        <div className="flex items-center gap-3 flex-wrap">
          <SeverityBadge severity={finding.severity} />
          <StatusBadge status={finding.status} />
          {finding.cweId && (
            <span className="text-xs font-mono text-[color:var(--muted-foreground)]">{finding.cweId}</span>
          )}
          {finding.cvssScore && (
            <span className="text-xs font-mono text-[color:var(--muted-foreground)]">CVSS {finding.cvssScore}</span>
          )}
        </div>
        <h1 className="font-serif text-3xl leading-tight">{finding.title}</h1>
        <p className="text-sm text-[color:var(--muted-foreground)]">
          {finding.category}{finding.asset && ` · ${finding.asset.name}`} · Discovered {new Date(finding.discoveredAt).toLocaleDateString()}
        </p>
      </div>

      <Card>
        <CardHeader><CardTitle>Details</CardTitle></CardHeader>
        <CardBody className="pt-0">
          <div className="prose-dashboard whitespace-pre-wrap text-[color:var(--foreground)]/85 leading-relaxed">
            {finding.bodyMarkdown}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader><CardTitle>Remediation</CardTitle></CardHeader>
        <CardBody className="pt-0">
          <p className="text-[color:var(--foreground)]/85 leading-relaxed whitespace-pre-wrap">{finding.remediation}</p>
        </CardBody>
      </Card>

      {finding.evidence.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Evidence</CardTitle></CardHeader>
          <CardBody className="pt-0 space-y-3">
            {finding.evidence.map((e) => (
              <div key={e.id} className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <div className="text-xs uppercase tracking-wider text-[color:var(--muted-foreground)] mb-1">{e.kind}</div>
                {e.caption && <div className="text-sm">{e.caption}</div>}
                <a href={e.url} className="text-xs text-[color:var(--accent)] hover:underline font-mono break-all mt-1 block">{e.url}</a>
              </div>
            ))}
          </CardBody>
        </Card>
      )}

      {finding.refs.length > 0 && (
        <Card>
          <CardHeader><CardTitle>References</CardTitle></CardHeader>
          <CardBody className="pt-0">
            <ul className="space-y-1.5">
              {finding.refs.map((r) => (
                <li key={r}>
                  <a href={r} target="_blank" rel="noopener noreferrer" className="text-sm text-[color:var(--accent)] hover:underline font-mono break-all">
                    {r}
                  </a>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
