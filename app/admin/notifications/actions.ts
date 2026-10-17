"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { sql } from "@/db/client";
import { getCurrentUser } from "@/lib/auth";

const schema = z.object({
  audience: z.string().min(1),
  title: z.string().min(2).max(120),
  message: z.string().min(2).max(2000),
});

export type NotificationState = { error?: string; success?: boolean } | undefined;

export async function sendNotificationAction(
  _prev: NotificationState,
  formData: FormData,
): Promise<NotificationState> {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "admin") return { error: "Not authorized." };

  const parsed = schema.safeParse({
    audience: formData.get("audience"),
    title: formData.get("title"),
    message: formData.get("message"),
  });
  if (!parsed.success) {
    return { error: "Add a title and message (title 2–120 chars, message up to 2000)." };
  }

  const { audience, title, message } = parsed.data;
  let userId: string | null = null;

  if (audience !== "all") {
    const parsedId = z.string().uuid().safeParse(audience);
    if (!parsedId.success) return { error: "Choose a valid recipient." };
    const recipient = await sql`select id from users where id = ${audience}`;
    if (recipient.length === 0) return { error: "Recipient not found." };
    userId = audience;
  }

  await sql`
    insert into notifications (user_id, title, message, created_by)
    values (${userId}, ${title}, ${message}, ${admin.id})
  `;

  revalidatePath("/admin/notifications");
  revalidatePath("/dashboard/notifications");
  return { success: true };
}
