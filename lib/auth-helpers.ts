import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth, type Session } from "./auth";

export async function getSession(): Promise<Session | null> {
  return await auth.api.getSession({ headers: await headers() });
}

export async function requireUser() {
  const session = await getSession();
  if (!session?.user) redirect("/login");
  return session.user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "ADMIN" && user.role !== "ANALYST") redirect("/403");
  return user;
}

export async function requireClient() {
  const user = await requireUser();
  if (user.role !== "CLIENT") redirect("/403");
  return user;
}

export async function assertCanAccessEngagement(
  userId: string,
  engagementId: string,
): Promise<boolean> {
  const { prisma } = await import("./prisma");
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return false;
  if (user.role === "ADMIN" || user.role === "ANALYST") return true;
  const engagement = await prisma.engagement.findUnique({
    where: { id: engagementId },
  });
  return engagement?.orgId === user.orgId;
}
