"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { sql } from "@/db/client";
import { getCurrentUser } from "@/lib/auth";

async function assertAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") throw new Error("Not authorized");
}

const schema = z.object({
  userId: z.string().uuid(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  tier: z.enum(["Starter", "Standard", "Professional"]),
  kycStatus: z.enum(["Not Started", "In Review", "Verified", "Rejected"]),
  role: z.enum(["client", "admin"]),
  balanceAvailable: z.coerce.number().min(0),
  balanceTrading: z.coerce.number().min(0),
  balanceBonus: z.coerce.number().min(0),
});

export type EditUserState = { error?: string; success?: boolean } | undefined;

export async function updateUserAction(_prev: EditUserState, formData: FormData): Promise<EditUserState> {
  await assertAdmin();

  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { userId, firstName, lastName, email, tier, kycStatus, role, balanceAvailable, balanceTrading, balanceBonus } = parsed.data;

  const clash = await sql`select id from users where email = ${email} and id != ${userId}`;
  if (clash.length > 0) return { error: "That email is already in use by another account." };

  await sql`
    update users set
      first_name = ${firstName},
      last_name = ${lastName},
      email = ${email},
      tier = ${tier},
      kyc_status = ${kycStatus},
      role = ${role},
      balance_available = ${balanceAvailable},
      balance_trading = ${balanceTrading},
      balance_bonus = ${balanceBonus}
    where id = ${userId}
  `;

  revalidatePath(`/admin/users/${userId}`);
  revalidatePath("/admin/users");
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteUserAction(userId: string) {
  await assertAdmin();
  await sql`delete from users where id = ${userId}`;
  revalidatePath("/admin/users");
}
