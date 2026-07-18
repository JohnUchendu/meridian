"use server";
import { revalidatePath } from "next/cache";
import { sql } from "@/db/client";
import { getCurrentUser } from "@/lib/auth";

async function assertAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") throw new Error("Not authorized");
  return user;
}

export async function approveTransactionAction(txId: string) {
  await assertAdmin();

  const rows = await sql`select user_id, type, amount, status from transactions where id = ${txId}`;
  const tx = rows[0];
  if (!tx || tx.status !== "Pending") return;

  await sql`update transactions set status = 'Completed' where id = ${txId}`;

  // Deposits already credited balance_available at submit time (see
  // dashboard/deposit/actions.ts); withdrawals already debited it.
  // Approval here just finalizes the transaction status — no double-entry.

  revalidatePath("/admin/deposits");
  revalidatePath("/admin");
}

export async function rejectTransactionAction(txId: string) {
  await assertAdmin();

  const rows = await sql`select user_id, type, amount, status from transactions where id = ${txId}`;
  const tx = rows[0];
  if (!tx || tx.status !== "Pending") return;

  await sql`update transactions set status = 'Rejected' where id = ${txId}`;

  // Reverse the balance change that was applied optimistically at submit time.
  if (tx.type === "Deposit") {
    await sql`update users set balance_available = balance_available - ${tx.amount} where id = ${tx.user_id}`;
  } else {
    await sql`update users set balance_available = balance_available + ${tx.amount} where id = ${tx.user_id}`;
  }

  revalidatePath("/admin/deposits");
  revalidatePath("/admin");
}
