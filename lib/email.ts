import { EmailClient, KnownEmailSendStatus, type EmailMessage } from "@azure/communication-email";
import { Prisma } from "@prisma/client";
import { Resend } from "resend";
import { prisma } from "./prisma";

type SendArgs = {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
  disableTracking?: boolean;
};

const azureConnectionString = process.env.AZURE_COMMUNICATION_CONNECTION_STRING;
const resendApiKey = process.env.RESEND_API_KEY;
const from = process.env.EMAIL_FROM || "Blindwall <reports@blindwall.app>";
const replyTo = process.env.EMAIL_REPLY_TO;

const isResendPlaceholder =
  !resendApiKey || resendApiKey.startsWith("re_placeholder") || resendApiKey === "re_xxx";

const azureClient = azureConnectionString ? new EmailClient(azureConnectionString) : null;
const resendClient = !azureClient && !isResendPlaceholder ? new Resend(resendApiKey) : null;

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function parseEmailAddress(value: string) {
  const match = value.match(/<([^>]+)>/);
  return (match?.[1] ?? value).trim();
}

function isJsonObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function toInputJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(isJsonObject(value) ? value : { value }));
}

async function logMailEvent(args: {
  eventType: string;
  providerEventId?: string;
  messageId?: string;
  recipient?: string;
  eventTime?: Date;
  payload: unknown;
}) {
  try {
    await prisma.mailEvent.upsert({
      where: { providerEventId: args.providerEventId ?? `${args.eventType}:${args.messageId}:${args.recipient}` },
      update: {
        messageId: args.messageId,
        recipient: args.recipient,
        eventTime: args.eventTime,
        payload: toInputJson(args.payload),
      },
      create: {
        providerEventId: args.providerEventId ?? `${args.eventType}:${args.messageId}:${args.recipient}`,
        eventType: args.eventType,
        messageId: args.messageId,
        recipient: args.recipient,
        eventTime: args.eventTime,
        payload: toInputJson(args.payload),
      },
    });
  } catch (error) {
    console.error("[email] failed to log mail event", error);
  }
}

export async function sendEmail({ to, subject, html, replyTo: overrideReplyTo, disableTracking }: SendArgs) {
  if (azureClient) {
    const senderAddress = parseEmailAddress(from);
    const message: EmailMessage = {
      senderAddress,
      recipients: { to: [{ address: to }] },
      replyTo: (overrideReplyTo || replyTo) ? [{ address: overrideReplyTo || replyTo! }] : undefined,
      disableUserEngagementTracking: disableTracking,
      content: {
        subject,
        html,
        plainText: stripHtml(html),
      },
    };

    try {
      const poller = await azureClient.beginSend(message, { updateIntervalInMs: 1_000 });
      const result = await poller.pollUntilDone();
      await logMailEvent({
        eventType: "SENT",
        providerEventId: `azure:${result.id}:SENT:${to}`,
        messageId: result.id,
        recipient: to,
        payload: { provider: "azure", result, subject },
      });
      return { ok: result.status === KnownEmailSendStatus.Succeeded, provider: "azure", messageId: result.id, status: result.status };
    } catch (error) {
      console.error("[email] Azure send failed", error);
      await logMailEvent({
        eventType: "SEND_FAILED",
        providerEventId: `azure:SEND_FAILED:${Date.now()}:${to}`,
        recipient: to,
        payload: { provider: "azure", subject, error: error instanceof Error ? error.message : String(error) },
      });
      return { ok: false, provider: "azure" };
    }
  }

  if (resendClient) {
    try {
      const result = await resendClient.emails.send({ from, to, subject, html, replyTo: overrideReplyTo || replyTo });
      await logMailEvent({
        eventType: "SENT",
        providerEventId: `resend:${result.data?.id ?? Date.now()}:SENT:${to}`,
        messageId: result.data?.id,
        recipient: to,
        payload: { provider: "resend", result, subject },
      });
      return { ok: true, provider: "resend", messageId: result.data?.id };
    } catch (error) {
      console.error("[email] Resend send failed", error);
      return { ok: false, provider: "resend" };
    }
  }

  console.log(`[email:dev] to=${to} subject="${subject}"\n${stripHtml(html).slice(0, 240)}\n`);
  return { ok: true, dev: true };
}

export function magicLinkEmail(url: string) {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #09090b; color: #fafafa; border-radius: 16px;">
      <h1 style="font-family: Georgia, serif; font-size: 28px; margin: 0 0 8px;">Sign in to Blindwall</h1>
      <p style="color: #a1a1aa; font-size: 14px; margin: 0 0 24px;">Click the button below to sign in. This link expires in 10 minutes.</p>
      <a href="${url}" style="display: inline-block; padding: 12px 24px; background: #dc2626; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600;">Sign in</a>
      <p style="color: #525252; font-size: 12px; margin: 24px 0 0;">If you didn't request this, you can ignore this email.</p>
    </div>
  `;
}

export function verifyEmail(url: string) {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #09090b; color: #fafafa; border-radius: 16px;">
      <h1 style="font-family: Georgia, serif; font-size: 28px; margin: 0 0 8px;">Verify your email</h1>
      <p style="color: #a1a1aa; font-size: 14px; margin: 0 0 24px;">Confirm your email to activate your Blindwall account.</p>
      <a href="${url}" style="display: inline-block; padding: 12px 24px; background: #dc2626; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600;">Verify email</a>
    </div>
  `;
}

export function inviteEmail(orgName: string, url: string) {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #09090b; color: #fafafa; border-radius: 16px;">
      <h1 style="font-family: Georgia, serif; font-size: 28px; margin: 0 0 8px;">You're invited to ${orgName}</h1>
      <p style="color: #a1a1aa; font-size: 14px; margin: 0 0 24px;">Access pentest reports, timelines and findings for ${orgName} on Blindwall.</p>
      <a href="${url}" style="display: inline-block; padding: 12px 24px; background: #dc2626; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600;">Accept invite</a>
    </div>
  `;
}

export function findingNotificationEmail(orgName: string, finding: { title: string; severity: string }, url: string) {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #09090b; color: #fafafa; border-radius: 16px;">
      <p style="color: #dc2626; text-transform: uppercase; letter-spacing: 2px; font-size: 11px; margin: 0;">${finding.severity}</p>
      <h1 style="font-family: Georgia, serif; font-size: 24px; margin: 4px 0 8px;">${finding.title}</h1>
      <p style="color: #a1a1aa; font-size: 14px; margin: 0 0 24px;">A new finding was published for ${orgName}.</p>
      <a href="${url}" style="display: inline-block; padding: 12px 24px; background: #dc2626; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600;">View finding</a>
    </div>
  `;
}
