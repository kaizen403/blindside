import { requireClient } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { Card, CardBody, CardHeader, CardTitle } from "@/app/dashboard/components/ui/Card";

export default async function SettingsPage() {
  const user = await requireClient();
  const org = user.orgId ? await prisma.org.findUnique({ where: { id: user.orgId }, include: { users: true } }) : null;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="font-serif text-3xl">Settings</h2>
      </div>
      <Card>
        <CardHeader><CardTitle>Your profile</CardTitle></CardHeader>
        <CardBody className="pt-0 space-y-2">
          <Row label="Name" value={user.name} />
          <Row label="Email" value={user.email} />
          <Row label="Role" value={user.role ?? "CLIENT"} />
        </CardBody>
      </Card>
      {org && (
        <Card>
          <CardHeader><CardTitle>Organization</CardTitle></CardHeader>
          <CardBody className="pt-0 space-y-2">
            <Row label="Name" value={org.name} />
            <Row label="Slug" value={org.slug} />
            <Row label="Members" value={String(org.users.length)} />
          </CardBody>
        </Card>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
      <span className="text-xs uppercase tracking-wider text-[color:var(--muted-foreground)]">{label}</span>
      <span className="text-sm font-mono">{value}</span>
    </div>
  );
}
