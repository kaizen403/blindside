import { Resend } from "resend";

type SendArgs = { to: string; subject: string; html: string };

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.EMAIL_FROM || "Blindwall <onboarding@resend.dev>";
const isPlaceholder = !apiKey || apiKey.startsWith("re_placeholder") || apiKey === "re_xxx";

const client = !isPlaceholder ? new Resend(apiKey) : null;

export async function sendEmail({ to, subject, html }: SendArgs) {
  if (!client) {
    console.log(`[email:dev] to=${to} subject="${subject}"\n${html.replace(/<[^>]+>/g, "").slice(0, 240)}\n`);
    return { ok: true, dev: true };
  }
  try {
    await client.emails.send({ from, to, subject, html });
    return { ok: true };
  } catch (e) {
    console.error("[email] send failed", e);
    return { ok: false };
  }
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
