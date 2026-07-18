"use server";
import { revalidatePath } from "next/cache";
import { sql } from "@/db/client";
import { getCurrentUser } from "@/lib/auth";

async function assertAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") throw new Error("Not authorized");
}

export async function setKycStatusAction(userId: string, status: "Verified" | "Rejected") {
  await assertAdmin();
  await sql`update users set kyc_status = ${status} where id = ${userId}`;
  revalidatePath("/admin/kyc");
  revalidatePath("/admin/users");
}
