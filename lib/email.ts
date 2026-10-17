import "server-only";
import { Resend } from "resend";

// Email is optional: local development and previews run without a Resend key.
// When RESEND_API_KEY is absent, sends are logged and skipped rather than
// throwing inside a server action.
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM = process.env.EMAIL_FROM ?? "Meridian Capital <onboarding@resend.dev>";

async function sendEmail(payload: Parameters<Resend["emails"]["send"]>[0]) {
  if (!resend) {
    console.info(`[email] RESEND_API_KEY not set — skipped "${payload.subject}" to ${payload.to}`);
    return { skipped: true };
  }
  return resend.emails.send(payload);
}

export async function sendWelcomeEmail(to: string, firstName: string) {
  return sendEmail({
    from: FROM,
    to,
    subject: "Welcome to Meridian Capital",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h2>Welcome, ${firstName} 👋</h2>
        <p>Your Meridian Capital account has been created. You can now sign in and start funding your account.</p>
        <p>To unlock full account limits, complete KYC verification from your dashboard.</p>
      </div>
    `,
  });
}

export async function sendContactReceipt(to: string, firstName: string, subject: string) {
  return sendEmail({
    from: FROM,
    to,
    subject: `We received your message: ${subject}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <p>Hi ${firstName},</p>
        <p>Thanks for contacting Meridian Capital. A support specialist will reply within 1 business day.</p>
      </div>
    `,
  });
}

export async function sendTransactionEmail(
  to: string,
  firstName: string,
  type: "Deposit" | "Withdrawal",
  amount: number,
) {
  return sendEmail({
    from: FROM,
    to,
    subject: `${type} request received — $${amount.toFixed(2)}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <p>Hi ${firstName},</p>
        <p>We've received your ${type.toLowerCase()} request for <b>$${amount.toFixed(2)}</b>. You'll get a follow-up email once it's processed.</p>
      </div>
    `,
  });
}
