import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/outreach/track?e=open|click&c=contactId&url=...
// Called by tracking pixel and link redirects
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const eventType = searchParams.get("e"); // "open" or "click"
  const contactId = searchParams.get("c");
  const url = searchParams.get("url");

  if (contactId && eventType) {
    try {
      const now = new Date();

      if (eventType === "open") {
        await prisma.outreachContact.updateMany({
          where: { id: contactId, openedAt: null },
          data: { status: "OPENED", openedAt: now },
        });
        await prisma.outreachContact.update({
          where: { id: contactId },
          data: { openCount: { increment: 1 } },
        });
        await prisma.outreachEvent.create({
          data: {
            contactId,
            eventType: "Opened",
            ipAddress:
              req.headers.get("x-forwarded-for") ||
              req.headers.get("x-real-ip") ||
              undefined,
            userAgent: req.headers.get("user-agent") || undefined,
            eventTime: now,
            payload: {},
          },
        });
      } else if (eventType === "click" && url) {
        await prisma.outreachContact.updateMany({
          where: { id: contactId, clickedAt: null },
          data: { status: "CLICKED", clickedAt: now },
        });
        await prisma.outreachContact.update({
          where: { id: contactId },
          data: { clickCount: { increment: 1 } },
        });
        await prisma.outreachEvent.create({
          data: {
            contactId,
            eventType: "Clicked",
            linkUrl: url,
            ipAddress:
              req.headers.get("x-forwarded-for") ||
              req.headers.get("x-real-ip") ||
              undefined,
            userAgent: req.headers.get("user-agent") || undefined,
            eventTime: now,
            payload: { url },
          },
        });
      }
    } catch (err) {
      // Silent fail — don't break redirects
      console.error("Tracking error:", err);
    }
  }

  if (eventType === "click" && url) {
    return NextResponse.redirect(decodeURIComponent(url));
  }

  // 1x1 transparent GIF for open pixel
  const pixel = Buffer.from(
    "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
    "base64"
  );
  return new NextResponse(pixel, {
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
