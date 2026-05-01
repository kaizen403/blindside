import { EmailClient } from "@azure/communication-email";
import { prisma } from "@/lib/prisma";

const connectionString = process.env.AZURE_COMMUNICATION_CONNECTION_STRING!;

function getEmailClient() {
  return new EmailClient(connectionString);
}

function buildTrackedHtml(
  html: string,
  contactId: string,
  appUrl: string
): string {
  // Inject open-tracking pixel
  const trackPixel = `<img src="${appUrl}/api/outreach/track?e=open&c=${contactId}" width="1" height="1" style="display:none" />`;

  // Replace all href links with tracked redirect
  const tracked = html.replace(
    /href="(https?:\/\/[^"]+)"/g,
    (_, url) =>
      `href="${appUrl}/api/outreach/track?e=click&c=${contactId}&url=${encodeURIComponent(url)}"`
  );

  return tracked + trackPixel;
}

export async function sendOutreachEmail(contactId: string) {
  const contact = await prisma.outreachContact.findUniqueOrThrow({
    where: { id: contactId },
    include: { campaign: true },
  });

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://www.blindwall.tech";
  const client = getEmailClient();

  const trackedHtml = buildTrackedHtml(
    contact.campaign.templateHtml,
    contactId,
    appUrl
  );

  const message = {
    senderAddress: `${contact.campaign.fromName} <donotreply@blindwall.tech>`,
    replyTo: [{ address: contact.campaign.replyTo }],
    recipients: {
      to: [
        {
          address: contact.email,
          displayName: contact.name || contact.email,
        },
      ],
    },
    content: {
      subject: contact.campaign.subject,
      html: trackedHtml,
      plainText: contact.campaign.templateText,
    },
  };

  await prisma.outreachContact.update({
    where: { id: contactId },
    data: { status: "SENDING" },
  });

  try {
    const poller = await client.beginSend(message);
    const result = await poller.pollUntilDone();
    const messageId = result.id;

    await prisma.outreachContact.update({
      where: { id: contactId },
      data: { status: "SENT", messageId, sentAt: new Date() },
    });

    return { success: true, messageId };
  } catch (err: any) {
    await prisma.outreachContact.update({
      where: { id: contactId },
      data: { status: "FAILED" },
    });
    throw err;
  }
}
