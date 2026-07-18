"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { sql } from "@/db/client";
import { getCurrentUser } from "@/lib/auth";
import { sendTransactionEmail } from "@/lib/email";

const schema = z.object({
  type: z.enum(["Deposit", "Withdrawal"]),
  amount: z.coerce.number().positive(),
  method: z.enum(["Card", "Bank wire", "Crypto"]),
});

export type TxState = { error?: string; success?: boolean } | undefined;

export async function submitTransactionAction(_prev: TxState, formData: FormData): Promise<TxState> {
  const user = await getCurrentUser();
  if (!user) return { error: "You must be signed in." };

  const parsed = schema.safeParse({
    type: formData.get("type"),
    amount: formData.get("amount"),
    method: formData.get("method"),
  });
  if (!parsed.success) return { error: "Please enter a valid amount." };

  const { type, amount, method } = parsed.data;

  if (type === "Withdrawal" && Number(user.balance_available) < amount) {
    return { error: "Insufficient available balance." };
  }

  await sql`
    insert into transactions (user_id, type, amount, method, status)
    values (${user.id}, ${type}, ${amount}, ${method}, 'Pending')
  `;

  if (type === "Deposit") {
    await sql`update users set balance_available = balance_available + ${amount} where id = ${user.id}`;
  } else {
    await sql`update users set balance_available = balance_available - ${amount} where id = ${user.id}`;
  }

  await sendTransactionEmail(user.email as string, user.first_name as string, type, amount).catch((err) =>
    console.error("transaction email failed", err),
  );

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/deposit");
  return { success: true };
}
