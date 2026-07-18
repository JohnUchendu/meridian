"use server";
import { z } from "zod";
import { sql } from "@/db/client";
import { sendContactReceipt } from "@/lib/email";

const schema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(1),
});

export type ContactState = { error?: string; success?: boolean } | undefined;

export async function submitContactAction(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Please fill in all fields correctly." };
  const { firstName, lastName, email, subject, message } = parsed.data;

  await sql`
    insert into contact_messages (first_name, last_name, email, subject, message)
    values (${firstName}, ${lastName}, ${email}, ${subject}, ${message})
  `;
  await sendContactReceipt(email, firstName, subject).catch((err) => console.error("contact receipt failed", err));

  return { success: true };
}
