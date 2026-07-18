import { sql } from "@/db/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { KycRowActions } from "@/components/admin/KycRowActions";

const DOC_LABELS: Record<string, string> = {
  passport: "Passport / National ID",
  drivers_license: "Driver's license",
  proof_of_address: "Proof of address",
  selfie: "Selfie verification",
};

export default async function AdminKyc() {
  const users = await sql`
    select id, first_name, last_name, email, kyc_status
    from users where role = 'client' and kyc_status != 'Verified'
    order by created_at desc
  `;

  const docs = users.length > 0
    ? await sql`
        select id, user_id, doc_type, file_name, created_at
        from kyc_documents
        where user_id = any(${users.map((u) => u.id as string)}::uuid[])
        order by created_at desc
      `
    : [];

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">KYC Review</h1><p className="text-sm text-muted-foreground">Review submitted documents, then approve or reject verification.</p></div>
      <Card className="border-border/60 bg-card/60"><CardContent className="p-0">
        {users.length === 0 && <div className="px-5 py-8 text-center text-sm text-muted-foreground">Nothing pending review.</div>}
        {users.map((u) => {
          const userDocs = docs.filter((d) => d.user_id === u.id);
          return (
            <div key={u.id as string} className="border-b border-border/40 px-5 py-4 last:border-0">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="font-medium">{u.first_name as string} {u.last_name as string}</div>
                  <div className="text-xs text-muted-foreground">{u.email as string}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{u.kyc_status as string}</Badge>
                  <KycRowActions userId={u.id as string} />
                </div>
              </div>
              {userDocs.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {userDocs.map((d) => (
                    <Button key={d.id as string} size="sm" variant="outline" asChild className="gap-1.5">
                      <a href={`/api/kyc-documents/${d.id}`} target="_blank" rel="noopener noreferrer">
                        <FileText className="h-3.5 w-3.5" />
                        {DOC_LABELS[d.doc_type as string] ?? (d.doc_type as string)}
                      </a>
                    </Button>
                  ))}
                </div>
              )}
              {userDocs.length === 0 && (
                <div className="mt-2 text-xs text-muted-foreground">No documents uploaded yet.</div>
              )}
            </div>
          );
        })}
      </CardContent></Card>
    </div>
  );
}
