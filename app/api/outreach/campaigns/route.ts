import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const campaigns = await prisma.outreachCampaign.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { contacts: true } },
      contacts: {
        select: {
          status: true,
          openCount: true,
          clickCount: true,
        },
      },
    },
  });

  const data = campaigns.map((c) => {
    const total = c.contacts.length;
    const sent = c.contacts.filter((x) =>
      ["SENT", "OPENED", "CLICKED", "REPLIED"].includes(x.status)
    ).length;
    const opened = c.contacts.filter((x) =>
      ["OPENED", "CLICKED", "REPLIED"].includes(x.status)
    ).length;
    const clicked = c.contacts.filter((x) =>
      ["CLICKED", "REPLIED"].includes(x.status)
    ).length;
    const replied = c.contacts.filter((x) => x.status === "REPLIED").length;

    return {
      id: c.id,
      name: c.name,
      subject: c.subject,
      status: c.status,
      fromName: c.fromName,
      replyTo: c.replyTo,
      templateHtml: c.templateHtml,
      templateText: c.templateText,
      createdAt: c.createdAt,
      stats: {
        total,
        sent,
        pending: total - sent,
        opened,
        clicked,
        replied,
        openRate: sent > 0 ? Math.round((opened / sent) * 100) : 0,
        clickRate: sent > 0 ? Math.round((clicked / sent) * 100) : 0,
        replyRate: sent > 0 ? Math.round((replied / sent) * 100) : 0,
      },
    };
  });

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, subject, templateHtml, templateText, fromName, replyTo } =
    body;

  const campaign = await prisma.outreachCampaign.create({
    data: {
      name,
      subject,
      templateHtml,
      templateText,
      fromName: fromName || "Rishi from Blindwall",
      replyTo: replyTo || "rishi@blindwall.tech",
    },
  });

  return NextResponse.json(campaign, { status: 201 });
}
