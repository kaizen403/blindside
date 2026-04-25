"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
import { parseReport } from "@/lib/markdown";
import { auth } from "@/lib/auth";
import { sendEmail, inviteEmail } from "@/lib/email";

export async function publishReportAction(engagementId: string, markdown: string) {
  const admin = await requireAdmin();
  const engagement = await prisma.engagement.findUnique({ where: { id: engagementId } });
  if (!engagement) throw new Error("Engagement not found");

  const result = await parseReport(markdown);
  if (!result.ok) {
    return { ok: false as const, errors: result.errors };
  }

  let created = 0;
  let updated = 0;

  for (const f of result.findings) {
    const existing = await prisma.finding.findUnique({
      where: { engagementId_slug: { engagementId, slug: f.frontmatter.slug } },
    });

    let assetId: string | undefined;
    if (f.frontmatter.asset) {
      const asset = await prisma.asset.findFirst({
        where: { engagementId, name: f.frontmatter.asset },
      });
      assetId = asset?.id;
    }

    if (existing) {
      await prisma.finding.update({
        where: { id: existing.id },
        data: {
          title: f.frontmatter.title,
          severity: f.frontmatter.severity,
          cvssVector: f.frontmatter.cvss,
          cvssScore: f.frontmatter.cvssScore,
          category: f.frontmatter.category,
          cweId: f.frontmatter.cwe,
          assetId,
          bodyMarkdown: f.bodyMarkdown,
          bodyHtml: f.bodyHtml,
          remediation: f.frontmatter.remediation ?? existing.remediation,
          refs: f.frontmatter.refs ?? existing.refs,
        },
      });
      updated++;
    } else {
      await prisma.finding.create({
        data: {
          engagementId,
          assetId,
          title: f.frontmatter.title,
          slug: f.frontmatter.slug,
          severity: f.frontmatter.severity,
          cvssVector: f.frontmatter.cvss,
          cvssScore: f.frontmatter.cvssScore,
          category: f.frontmatter.category,
          cweId: f.frontmatter.cwe,
          bodyMarkdown: f.bodyMarkdown,
          bodyHtml: f.bodyHtml,
          remediation: f.frontmatter.remediation ?? "",
          refs: f.frontmatter.refs ?? [],
          discoveredAt: f.frontmatter.discovered ? new Date(f.frontmatter.discovered) : new Date(),
          authorId: admin.id,
        },
      });
      await prisma.activityEvent.create({
        data: {
          engagementId,
          type: "FINDING_PUBLISHED",
          payload: { title: f.frontmatter.title, severity: f.frontmatter.severity },
          actorId: admin.id,
          visibleToClient: true,
        },
      });
      const orgUsers = await prisma.user.findMany({ where: { orgId: engagement.orgId, role: "CLIENT" } });
      for (const u of orgUsers) {
        await prisma.notification.create({
          data: {
            userId: u.id,
            type: "FINDING_PUBLISHED",
            title: `New ${f.frontmatter.severity.toLowerCase()} finding`,
            body: f.frontmatter.title,
            href: `/app/findings`,
          },
        });
      }
      created++;
    }
  }

  if (result.stageUpdate) {
    await prisma.stageEvent.create({
      data: {
        engagementId,
        stage: result.stageUpdate.stage,
        state: result.stageUpdate.state,
        note: result.stageUpdate.note,
        actorId: admin.id,
        startedAt: result.stageUpdate.state !== "PENDING" ? new Date() : null,
        completedAt: result.stageUpdate.state === "COMPLETED" ? new Date() : null,
      },
    });
    if (result.stageUpdate.state === "IN_PROGRESS") {
      await prisma.engagement.update({
        where: { id: engagementId },
        data: { currentStage: result.stageUpdate.stage },
      });
    }
    await prisma.activityEvent.create({
      data: {
        engagementId,
        type: result.stageUpdate.state === "COMPLETED" ? "STAGE_COMPLETED" : "STAGE_STARTED",
        payload: { stage: result.stageUpdate.stage },
        actorId: admin.id,
        visibleToClient: true,
      },
    });
  }

  await prisma.auditLog.create({
    data: {
      actorId: admin.id,
      action: "report.publish",
      entity: "Engagement",
      entityId: engagementId,
      diff: { created, updated },
    },
  });

  revalidatePath(`/admin/engagements/${engagementId}`);
  revalidatePath("/app");
  return { ok: true as const, created, updated };
}

export async function setFindingStatusAction(
  findingId: string,
  status: "OPEN" | "ACKNOWLEDGED" | "IN_PROGRESS" | "RESOLVED" | "RISK_ACCEPTED" | "FALSE_POSITIVE",
  note?: string,
) {
  const { requireUser } = await import("@/lib/auth-helpers");
  const user = await requireUser();
  const finding = await prisma.finding.findUnique({ where: { id: findingId } });
  if (!finding) throw new Error("Finding not found");

  if (user.role === "CLIENT") {
    const engagement = await prisma.engagement.findUnique({ where: { id: finding.engagementId } });
    if (engagement?.orgId !== user.orgId) throw new Error("Forbidden");
  }

  await prisma.finding.update({
    where: { id: findingId },
    data: {
      status,
      resolvedAt: status === "RESOLVED" ? new Date() : null,
    },
  });
  await prisma.activityEvent.create({
    data: {
      engagementId: finding.engagementId,
      type: status === "RESOLVED" ? "FINDING_RESOLVED" : "FINDING_UPDATED",
      payload: { title: finding.title, status, note },
      actorId: user.id,
      visibleToClient: true,
    },
  });
  await prisma.auditLog.create({
    data: {
      actorId: user.id,
      action: "finding.status",
      entity: "Finding",
      entityId: findingId,
      diff: { from: finding.status, to: status, note },
    },
  });
  revalidatePath(`/app/findings/${findingId}`);
  revalidatePath(`/admin/engagements/${finding.engagementId}`);
}

export async function inviteClientUserAction(orgId: string, email: string, name: string) {
  const admin = await requireAdmin();
  const org = await prisma.org.findUnique({ where: { id: orgId } });
  if (!org) throw new Error("Org not found");

  const trimmedEmail = email.trim().toLowerCase();
  if (!trimmedEmail.includes("@")) {
    return { ok: false as const, error: "Enter a valid email" };
  }

  const existing = await prisma.user.findUnique({ where: { email: trimmedEmail } });
  if (existing) {
    if (existing.orgId === orgId) {
      return { ok: false as const, error: "User is already in this org" };
    }
    return { ok: false as const, error: "Email belongs to another account" };
  }

  try {
    await auth.api.signInMagicLink({
      body: { email: trimmedEmail, name },
      headers: new Headers(),
    });
  } catch (e) {
    console.error("[invite] magic link failed", e);
  }

  const user = await prisma.user.upsert({
    where: { email: trimmedEmail },
    update: { orgId, role: "CLIENT" },
    create: { id: crypto.randomUUID(), email: trimmedEmail, name, orgId, role: "CLIENT", emailVerified: false },
  });

  const baseUrl = process.env.BETTER_AUTH_URL || "http://localhost:3000";
  await sendEmail({
    to: trimmedEmail,
    subject: `You're invited to ${org.name} on Blind Side`,
    html: inviteEmail(org.name, `${baseUrl}/login`),
  });

  await prisma.auditLog.create({
    data: {
      actorId: admin.id,
      action: "user.invite",
      entity: "User",
      entityId: user.id,
      diff: { email: trimmedEmail, orgId },
    },
  });

  revalidatePath(`/admin/clients/${orgId}`);
  return { ok: true as const, userId: user.id };
}

export async function signOutAndRedirect() {
  redirect("/login");
}
