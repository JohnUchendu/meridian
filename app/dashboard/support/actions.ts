"use server";
import { z } from "zod";
import { sql } from "@/db/client";
import { getCurrentUser } from "@/lib/auth";
import { sendContactReceipt } from "@/lib/email";

const schema = z.object({
  subject: z.string().min(1),
  message: z.string().min(1),
});

export type SupportState = { error?: string; success?: boolean } | undefined;

export async function submitSupportTicketAction(_prev: SupportState, formData: FormData): Promise<SupportState> {
  const user = await getCurrentUser();
  if (!user) return { error: "You must be signed in." };

  const parsed = schema.safeParse({
    subject: formData.get("subject"),
    message: formData.get("message"),
  });
  if (!parsed.success) return { error: "Please fill in both fields." };

  const { subject, message } = parsed.data;

  await sql`
    insert into contact_messages (first_name, last_name, email, subject, message)
    values (${user.first_name}, ${user.last_name}, ${user.email}, ${subject}, ${message})
  `;
  await sendContactReceipt(user.email as string, user.first_name as string, subject).catch((err) =>
    console.error("support receipt failed", err),
  );

  return { success: true };
}
