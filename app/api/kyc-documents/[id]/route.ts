import { NextResponse } from "next/server";
import { sql } from "@/db/client";
import { getCurrentUser } from "@/lib/auth";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const { id } = await params;
  const rows = await sql`
    select user_id, file_name, mime_type, file_data
    from kyc_documents where id = ${id}
  `;
  const doc = rows[0];
  if (!doc) return new NextResponse("Not found", { status: 404 });

  const isOwner = doc.user_id === user.id;
  const isAdmin = user.role === "admin";
  if (!isOwner && !isAdmin) return new NextResponse("Forbidden", { status: 403 });

  if (!doc.file_data) return new NextResponse("No file stored for this document", { status: 404 });

  // The Neon HTTP driver returns bytea columns as a Node Buffer.
  const bytes = doc.file_data as Buffer;

  return new NextResponse(new Uint8Array(bytes), {
    headers: {
      "Content-Type": (doc.mime_type as string) || "application/octet-stream",
      "Content-Disposition": `inline; filename="${(doc.file_name as string) || "document"}"`,
      "Content-Length": String(bytes.length),
      "Cache-Control": "private, max-age=0, no-store",
    },
  });
}
