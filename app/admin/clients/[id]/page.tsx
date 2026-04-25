import { requireAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { Card, CardBody, CardHeader, CardTitle } from "@/app/dashboard/components/ui/Card";
import { stageLabel } from "@/lib/severity";
import { notFound } from "next/navigation";
import Link from "next/link";
import { InviteUserButton } from "./InviteUserButton";

export default async function ClientDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireAdmin();
  const org = await prisma.org.findUnique({
    where: { id },
    include: { users: true, engagements: { orderBy: { createdAt: "desc" } } },
  });
  if (!org) notFound();
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-serif text-3xl">{org.name}</h2>
          <p className="text-sm text-[color:var(--muted-foreground)] mt-1 font-mono">{org.slug}</p>
        </div>
        <InviteUserButton orgId={org.id} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Members ({org.users.length})</CardTitle></CardHeader>
          <CardBody className="pt-0">
            <ul className="space-y-2">
              {org.users.map((u) => (
                <li key={u.id} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                  <div>
                    <div className="text-sm font-medium">{u.name}</div>
                    <div className="text-xs text-[color:var(--muted-foreground)]">{u.email}</div>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/5 text-[color:var(--muted-foreground)]">{u.role}</span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
        <Card>
          <CardHeader><CardTitle>Engagements ({org.engagements.length})</CardTitle></CardHeader>
          <CardBody className="pt-0">
            <ul className="space-y-2">
              {org.engagements.map((e) => (
                <li key={e.id}>
                  <Link href={`/admin/engagements/${e.id}`} className="block p-3 rounded-lg hover:bg-white/[0.02]">
                    <div className="text-sm font-medium">{e.name}</div>
                    <div className="text-xs text-[color:var(--muted-foreground)] mt-0.5">
                      {e.status.toLowerCase()} · {stageLabel[e.currentStage]}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
