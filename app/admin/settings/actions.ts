"use server";
import { revalidatePath } from "next/cache";
import { sql } from "@/db/client";
import { getCurrentUser } from "@/lib/auth";

const MAX_QR_BYTES = 1.5 * 1024 * 1024; // 1.5MB
const ALLOWED_QR_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

export type DepositSettingsState = { error?: string; success?: boolean } | undefined;

async function assertAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") throw new Error("Not authorized");
  return user;
}

async function upsertSetting(key: string, value: string) {
  await sql`
    insert into platform_settings (key, value) values (${key}, ${value})
    on conflict (key) do update set value = excluded.value, updated_at = now()
  `;
}

export async function saveDepositSettingsAction(
  _prev: DepositSettingsState,
  formData: FormData,
): Promise<DepositSettingsState> {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "admin") return { error: "Not authorized." };

  const address = String(formData.get("address") ?? "").trim();
  const instructions = String(formData.get("instructions") ?? "").trim();
  if (!address) return { error: "Enter the deposit address shown under the QR code." };
  if (instructions.length > 600) return { error: "Instructions must be 600 characters or fewer." };

  const file = formData.get("qr");
  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_QR_BYTES) {
      return { error: `QR image is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max 1.5MB.` };
    }
    if (!ALLOWED_QR_TYPES.has(file.type)) {
      return { error: "Unsupported image type. Upload a PNG, JPG or WebP." };
    }
    const bytes = Buffer.from(await file.arrayBuffer());
    await upsertSetting("deposit_qr_image", `data:${file.type};base64,${bytes.toString("base64")}`);
  }

  await upsertSetting("deposit_address", address);
  await upsertSetting("deposit_instructions", instructions);

  revalidatePath("/admin/settings");
  revalidatePath("/dashboard/deposit");
  return { success: true };
}

export async function resetDepositQrAction(): Promise<{ ok: boolean }> {
  await assertAdmin();
  await sql`delete from platform_settings where key = 'deposit_qr_image'`;
  revalidatePath("/admin/settings");
  revalidatePath("/dashboard/deposit");
  return { ok: true };
}
