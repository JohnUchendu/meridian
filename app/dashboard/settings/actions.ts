"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { sql } from "@/db/client";
import { getCurrentUser } from "@/lib/auth";

const schema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
});

export type SettingsState = { error?: string; success?: boolean } | undefined;

export async function updateProfileAction(_prev: SettingsState, formData: FormData): Promise<SettingsState> {
  const user = await getCurrentUser();
  if (!user) return { error: "You must be signed in." };

  const parsed = schema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
  });
  if (!parsed.success) return { error: "Please fill in all fields correctly." };

  const { firstName, lastName, email } = parsed.data;

  const clash = await sql`select id from users where email = ${email} and id != ${user.id}`;
  if (clash.length > 0) return { error: "That email is already in use." };

  await sql`update users set first_name = ${firstName}, last_name = ${lastName}, email = ${email} where id = ${user.id}`;

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");
  return { success: true };
}
