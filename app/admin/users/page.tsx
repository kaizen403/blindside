import { requireAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { Card, CardBody, CardHeader, CardTitle } from "@/app/dashboard/components/ui/Card";

export default async function UsersPage() {
  await requireAdmin();
  const users = await prisma.user.findMany({
    include: { org: true },
    orderBy: [{ role: "asc" }, { name: "asc" }],
  });
  return (
    <div className="space-y-6">
      <h2 className="font-serif text-3xl">Users</h2>
      <Card>
        <CardHeader><CardTitle>All users ({users.length})</CardTitle></CardHeader>
        <CardBody className="pt-0">
          <table className="w-full text-sm">
            <thead className="text-[11px] uppercase tracking-wider text-[color:var(--muted-foreground)]">
              <tr>
                <th className="text-left py-2 font-medium">Name</th>
                <th className="text-left py-2 font-medium">Email</th>
                <th className="text-left py-2 font-medium">Role</th>
                <th className="text-left py-2 font-medium">Org</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-white/[0.04]">
                  <td className="py-2.5">{u.name}</td>
                  <td className="py-2.5 font-mono text-xs text-[color:var(--muted-foreground)]">{u.email}</td>
                  <td className="py-2.5">
                    <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/5">{u.role}</span>
                  </td>
                  <td className="py-2.5 text-[color:var(--muted-foreground)]">{u.org?.name ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}
