import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOutreachEmail } from "@/lib/outreach";

// GET /api/outreach/campaigns/[id]/contacts
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const contacts = await prisma.outreachContact.findMany({
    where: { campaignId: params.id },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(contacts);
}

// POST /api/outreach/campaigns/[id]/contacts
// Body: { contacts: [{email, name?, company?}] } or plain text list
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const list: { email: string; name?: string; company?: string }[] =
    body.contacts || [];

  const created = await prisma.$transaction(
    list.map((c) =>
      prisma.outreachContact.upsert({
        where: { campaignId_email: { campaignId: params.id, email: c.email } },
        create: { campaignId: params.id, ...c },
        update: {},
      })
    )
  );

  return NextResponse.json({ added: created.length }, { status: 201 });
}
