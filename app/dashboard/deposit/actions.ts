"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { sql } from "@/db/client";
import { getCurrentUser } from "@/lib/auth";
import { sendTransactionEmail } from "@/lib/email";

const schema = z.object({
  type: z.enum(["Deposit", "Withdrawal"]),
  amount: z.coerce.number().positive().max(10_000_000),
  method: z.string().optional(),
  reference: z.string().max(120).optional(),
});

export type TxState = { error?: string; success?: boolean } | undefined;

export async function submitTransactionAction(_prev: TxState, formData: FormData): Promise<TxState> {
  const user = await getCurrentUser();
  if (!user) return { error: "You must be signed in." };

  const parsed = schema.safeParse({
    type: formData.get("type"),
    amount: formData.get("amount"),
    method: formData.get("method") ?? undefined,
    reference: formData.get("reference") ?? undefined,
  });
  if (!parsed.success) return { error: "Please enter a valid amount." };

  const { type, amount } = parsed.data;

  // Deposits are QR-only. Withdrawals are paid out by bank transfer or crypto.
  const method =
    type === "Deposit"
      ? "QR code"
      : parsed.data.method === "Crypto"
        ? "Crypto"
        : "Bank wire";
  const reference = parsed.data.reference?.trim() || null;

  if (type === "Withdrawal" && Number(user.balance_available) < amount) {
    return { error: "Insufficient available balance." };
  }

  // Pending until the request is reviewed. Balances are only moved when the
  // transaction is marked successful from the admin console.
  await sql`
    insert into transactions (user_id, type, amount, method, reference, status)
    values (${user.id}, ${type}, ${amount}, ${method}, ${reference}, 'Pending')
  `;

  await sendTransactionEmail(user.email as string, user.first_name as string, type, amount).catch((err) =>
    console.error("transaction email failed", err),
  );

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/deposit");
  revalidatePath("/admin/deposits");
  return { success: true };
}
