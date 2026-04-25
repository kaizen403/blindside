import { requireAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { Card, CardBody, CardHeader, CardTitle } from "@/app/dashboard/components/ui/Card";
import Link from "next/link";

export default async function ClientsPage() {
  await requireAdmin();
  const orgs = await prisma.org.findMany({
    include: { users: true, engagements: true },
    orderBy: { name: "asc" },
  });
  return (
    <div className="space-y-6">
      <h2 className="font-serif text-3xl">Clients</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orgs.map((o) => (
          <Link key={o.id} href={`/admin/clients/${o.id}`}>
            <Card className="h-full hover:bg-white/[0.02] transition-colors">
              <CardHeader>
                <CardTitle>{o.name}</CardTitle>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="text-xs text-[color:var(--muted-foreground)]">
                  {o.users.length} member{o.users.length === 1 ? "" : "s"} · {o.engagements.length} engagement{o.engagements.length === 1 ? "" : "s"}
                </div>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
