import "server-only";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM ?? "Meridian Capital <onboarding@resend.dev>";

export async function sendWelcomeEmail(to: string, firstName: string) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: "Welcome to Meridian Capital",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h2>Welcome, ${firstName} 👋</h2>
        <p>Your Meridian Capital account has been created. You can now sign in and start funding your account.</p>
        <p>To unlock full trading limits, complete KYC verification from your dashboard.</p>
      </div>
    `,
  });
}

export async function sendContactReceipt(to: string, firstName: string, subject: string) {
  return resend.emails.send({
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
  return resend.emails.send({
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
