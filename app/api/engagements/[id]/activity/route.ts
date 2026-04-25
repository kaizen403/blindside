import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return new Response("unauthorized", { status: 401 });

  const engagement = await prisma.engagement.findUnique({ where: { id } });
  if (!engagement) return new Response("not found", { status: 404 });

  if (
    session.user.role === "CLIENT" &&
    engagement.orgId !== session.user.orgId
  ) {
    return new Response("forbidden", { status: 403 });
  }

  const encoder = new TextEncoder();
  let lastSeenAt = new Date();

  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(encoder.encode(`event: connected\ndata: {}\n\n`));

      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: heartbeat\n\n`));
        } catch {
          // intentionally swallowed
        }
      }, 25_000);

      const poll = setInterval(async () => {
        try {
          const events = await prisma.activityEvent.findMany({
            where: {
              engagementId: id,
              createdAt: { gt: lastSeenAt },
              ...(session.user.role === "CLIENT" ? { visibleToClient: true } : {}),
            },
            orderBy: { createdAt: "asc" },
            take: 50,
          });
          if (events.length > 0) {
            lastSeenAt = events[events.length - 1].createdAt;
            for (const e of events) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify(e)}\n\n`),
              );
            }
          }
        } catch (e) {
          console.error("[SSE] poll error", e);
        }
      }, 4000);

      request.signal.addEventListener("abort", () => {
        clearInterval(heartbeat);
        clearInterval(poll);
        try {
          controller.close();
        } catch {
          // intentionally swallowed
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "Content-Encoding": "none",
      "X-Accel-Buffering": "no",
    },
  });
}
