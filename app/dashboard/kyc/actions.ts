"use server";
import { revalidatePath } from "next/cache";
import { sql } from "@/db/client";
import { getCurrentUser } from "@/lib/auth";

// Hard cap on uploaded KYC files. Neon (Postgres) can technically store much
// larger bytea values, but this keeps query payloads small and prevents
// someone from parking multi-hundred-MB files in the same table as users.
export const MAX_KYC_FILE_BYTES = 5 * 1024 * 1024; // 5MB

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf"]);

export type KycUploadState = { error?: string; success?: boolean } | undefined;

export async function submitKycDocAction(_prev: KycUploadState, formData: FormData): Promise<KycUploadState> {
  const user = await getCurrentUser();
  if (!user) return { error: "You must be signed in." };

  const docType = formData.get("docType");
  const file = formData.get("file");

  if (typeof docType !== "string" || !docType) return { error: "Missing document type." };
  if (!(file instanceof File) || file.size === 0) return { error: "Please choose a file." };

  if (file.size > MAX_KYC_FILE_BYTES) {
    return { error: `File is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max size is 5MB.` };
  }
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return { error: "Unsupported file type. Please upload a JPG, PNG, WebP, or PDF." };
  }

  const arrayBuffer = await file.arrayBuffer();
  const bytes = Buffer.from(arrayBuffer);

  await sql`
    insert into kyc_documents (user_id, doc_type, file_name, mime_type, file_size, file_data, status)
    values (${user.id}, ${docType}, ${file.name}, ${file.type}, ${file.size}, ${bytes}, 'Under Review')
  `;
  await sql`update users set kyc_status = 'In Review' where id = ${user.id} and kyc_status = 'Not Started'`;

  revalidatePath("/dashboard/kyc");
  revalidatePath("/dashboard/documents");
  revalidatePath("/admin/kyc");
  return { success: true };
}
