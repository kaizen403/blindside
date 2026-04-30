import { timingSafeEqual } from "node:crypto";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type EventGridEvent = {
  id?: string;
  eventType?: string;
  eventTime?: string;
  subject?: string;
  data?: Record<string, unknown>;
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function safeEquals(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function isAuthorized(request: Request) {
  const webhookSecret = process.env.AZURE_EVENT_GRID_WEBHOOK_SECRET;

  if (!webhookSecret) {
    if (process.env.NODE_ENV !== "production") return true;
    console.error("[azure-email-webhook] AZURE_EVENT_GRID_WEBHOOK_SECRET is not configured");
    return false;
  }

  const url = new URL(request.url);
  const candidate = request.headers.get("x-webhook-secret") ?? url.searchParams.get("secret");

  return Boolean(candidate && safeEquals(candidate, webhookSecret));
}

function getMessageId(data: Record<string, unknown>) {
  return (
    asString(data.messageId) ??
    asString(data.operationId) ??
    asString(data.emailMessageId) ??
    asString(data.correlationId)
  );
}

function getRecipient(data: Record<string, unknown>) {
  return (
    asString(data.recipient) ??
    asString(data.recipientAddress) ??
    asString(data.to) ??
    asString(data.email)
  );
}

function getEventKind(event: EventGridEvent, data: Record<string, unknown>) {
  const rawType = event.eventType ?? asString(data.eventType) ?? "UNKNOWN";
  const trackingType = asString(data.trackingType) ?? asString(data.engagementType) ?? asString(data.type);
  const deliveryStatus = asString(data.status) ?? asString(data.deliveryStatus);

  if (trackingType) return trackingType.toUpperCase();
  if (deliveryStatus) return deliveryStatus.toUpperCase();
  return rawType.replace(/^Microsoft\.Communication\./, "");
}

function toInputJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value));
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch (error) {
    console.warn("[azure-email-webhook] invalid JSON payload", error);
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const events: EventGridEvent[] = Array.isArray(body) ? body : [body as EventGridEvent];

  const validationEvent = events.find((event) => {
    const data = asRecord(event.data);
    return event.eventType === "Microsoft.EventGrid.SubscriptionValidationEvent" || asString(data.validationCode);
  });

  if (validationEvent) {
    const validationCode = asString(asRecord(validationEvent.data).validationCode);
    return NextResponse.json({ validationResponse: validationCode });
  }

  for (const event of events) {
    const data = asRecord(event.data);
    const providerEventId = event.id ?? `${event.eventType}:${getMessageId(data)}:${getRecipient(data)}:${event.eventTime}`;

    await prisma.mailEvent.upsert({
      where: { providerEventId },
      update: {
        eventType: getEventKind(event, data),
        messageId: getMessageId(data),
        recipient: getRecipient(data),
        eventTime: event.eventTime ? new Date(event.eventTime) : undefined,
        payload: toInputJson({ ...event, data }),
      },
      create: {
        providerEventId,
        eventType: getEventKind(event, data),
        messageId: getMessageId(data),
        recipient: getRecipient(data),
        eventTime: event.eventTime ? new Date(event.eventTime) : undefined,
        payload: toInputJson({ ...event, data }),
      },
    });
  }

  return NextResponse.json({ ok: true, received: events.length });
}
