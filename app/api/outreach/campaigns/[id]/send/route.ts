import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOutreachEmail } from "@/lib/outreach";

// POST /api/outreach/campaigns/[id]/send
// Sends to all PENDING contacts in batches
export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const campaign = await prisma.outreachCampaign.findUniqueOrThrow({
    where: { id: params.id },
  });

  const pending = await prisma.outreachContact.findMany({
    where: { campaignId: params.id, status: "PENDING" },
  });

  if (pending.length === 0) {
    return NextResponse.json({ message: "No pending contacts", sent: 0 });
  }

  await prisma.outreachCampaign.update({
    where: { id: params.id },
    data: { status: "SENDING" },
  });

  let sent = 0;
  let failed = 0;

  for (const contact of pending) {
    try {
      await sendOutreachEmail(contact.id);
      sent++;
      // small delay to respect ACS rate limits (10/min on free tier)
      await new Promise((r) => setTimeout(r, 6100));
    } catch (err) {
      console.error(`Failed to send to ${contact.email}:`, err);
      failed++;
    }
  }

  await prisma.outreachCampaign.update({
    where: { id: params.id },
    data: { status: "SENT" },
  });

  return NextResponse.json({ sent, failed, total: pending.length });
}
