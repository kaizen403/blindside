import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Azure Event Grid webhook for ACS email events
// Events: DeliveryReportReceived, EngagementTrackingReportReceived
export async function POST(req: NextRequest) {
  const body = await req.json();

  // Azure sends array of events
  const events = Array.isArray(body) ? body : [body];

  // Handle Event Grid subscription validation BEFORE auth check
  for (const event of events) {
    if (event.eventType === "Microsoft.EventGrid.SubscriptionValidationEvent") {
      return NextResponse.json({
        validationResponse: event.data.validationCode,
      });
    }
  }

  // Auth check for all other events
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.AZURE_EVENT_GRID_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  for (const event of events) {

    const eventType: string =
      event.eventType || event.type || "";
    const data = event.data || {};

    // ACS email events
    if (eventType.includes("EmailDeliveryReportReceived") || eventType.includes("DeliveryReport")) {
      const messageId = data.messageId || data.MessageId;
      const status = data.status || data.DeliveryStatus;
      const recipient = data.recipient || data.RecipientAddress;

      if (messageId) {
        await prisma.outreachContact.updateMany({
          where: { messageId },
          data:
            status === "Delivered"
              ? { status: "SENT" }
              : status === "Bounced" || status === "Failed"
              ? { status: "BOUNCED" }
              : {},
        });

        await prisma.outreachEvent.create({
          data: {
            contactId: "system",
            messageId,
            eventType: status || "DeliveryReport",
            eventTime: event.eventTime ? new Date(event.eventTime) : new Date(),
            payload: data,
          },
        }).catch(() => {});
      }
    }

    // ACS engagement tracking (open/click from Azure side)
    if (eventType.includes("EngagementTracking")) {
      const messageId = data.messageId || data.MessageId;
      const engagementType = data.engagementType || data.EngagementType; // "View" or "Click"
      const url = data.url || data.Url;

      if (messageId) {
        const contact = await prisma.outreachContact.findFirst({
          where: { messageId },
        });

        if (contact) {
          const now = new Date();
          if (engagementType === "View") {
            await prisma.outreachContact.update({
              where: { id: contact.id },
              data: {
                status: "OPENED",
                openedAt: contact.openedAt ?? now,
                openCount: { increment: 1 },
              },
            });
          } else if (engagementType === "Click") {
            await prisma.outreachContact.update({
              where: { id: contact.id },
              data: {
                status: "CLICKED",
                clickedAt: contact.clickedAt ?? now,
                clickCount: { increment: 1 },
              },
            });
          }

          await prisma.outreachEvent.create({
            data: {
              contactId: contact.id,
              messageId,
              eventType: engagementType === "View" ? "Opened" : "Clicked",
              linkUrl: url,
              eventTime: new Date(),
              payload: data,
            },
          });
        }
      }
    }
  }

  return NextResponse.json({ ok: true });
}
