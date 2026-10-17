"use server";
import { revalidatePath } from "next/cache";
import { sql } from "@/db/client";
import { getCurrentUser } from "@/lib/auth";

export type TxActionResult = { ok: boolean; error?: string };

async function assertAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") throw new Error("Not authorized");
  return user;
}

/**
 * Marks a pending transaction successful and applies the balance movement.
 * Deposits credit the available balance, withdrawals debit it (guarded so an
 * account can never go negative).
 */
export async function approveTransactionAction(txId: string): Promise<TxActionResult> {
  await assertAdmin();

  const rows = await sql`
    update transactions set status = 'Successful'
    where id = ${txId} and status = 'Pending'
    returning user_id, type, amount
  `;
  const tx = rows[0];
  if (!tx) return { ok: false, error: "This transaction is no longer pending." };

  const amount = Number(tx.amount);

  if (tx.type === "Deposit") {
    await sql`update users set balance_available = balance_available + ${amount} where id = ${tx.user_id}`;
  } else {
    const updated = await sql`
      update users set balance_available = balance_available - ${amount}
      where id = ${tx.user_id} and balance_available >= ${amount}
      returning id
    `;
    if (updated.length === 0) {
      // Roll the status back so the admin can resolve the balance first.
      await sql`update transactions set status = 'Pending' where id = ${txId}`;
      return { ok: false, error: "Client has insufficient available balance for this withdrawal." };
    }
  }

  revalidatePath("/admin/deposits");
  revalidatePath("/admin");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/deposit");
  return { ok: true };
}

export async function rejectTransactionAction(txId: string): Promise<TxActionResult> {
  await assertAdmin();

  // Balances only move on approval, so rejecting has nothing to reverse.
  const rows = await sql`
    update transactions set status = 'Rejected'
    where id = ${txId} and status = 'Pending'
    returning id
  `;
  if (rows.length === 0) return { ok: false, error: "This transaction is no longer pending." };

  revalidatePath("/admin/deposits");
  revalidatePath("/admin");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/deposit");
  return { ok: true };
}
