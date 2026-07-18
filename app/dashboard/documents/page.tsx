import { getCurrentUser } from "@/lib/auth";
import { sql } from "@/db/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

const DOC_LABELS: Record<string, string> = {
  passport: "Passport / National ID",
  drivers_license: "Driver's license",
  proof_of_address: "Proof of address",
  selfie: "Selfie verification",
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default async function DocumentsPage() {
  const user = await getCurrentUser();
  const docs = user
    ? await sql`select id, doc_type, status, file_name, file_size, created_at from kyc_documents where user_id = ${user.id} order by created_at desc`
    : [];

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Documents</h1><p className="text-sm text-muted-foreground">Documents you&apos;ve submitted for identity verification.</p></div>
      <Card className="border-border/60 bg-card/60">
        <CardContent className="p-0">
          {docs.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-5 py-12 text-center">
              <FileText className="h-8 w-8 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">No documents submitted yet.</div>
              <a href="/dashboard/kyc" className="text-sm text-[color:var(--gold)] hover:underline">Go to KYC Verification</a>
            </div>
          ) : (
            docs.map((d) => (
              <div key={d.id as string} className="flex items-center justify-between border-b border-border/40 px-5 py-4 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[color:var(--gold)]/10 text-[color:var(--gold)]"><FileText className="h-4 w-4" /></div>
                  <div>
                    <div className="text-sm font-medium">{DOC_LABELS[d.doc_type as string] ?? (d.doc_type as string)}</div>
                    <div className="text-xs text-muted-foreground">
                      {d.file_name as string} · {formatBytes(Number(d.file_size ?? 0))} · Submitted {new Date(d.created_at as string).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={d.status === "Approved" ? "outline" : "secondary"} className={d.status === "Approved" ? "border-success/40 text-success" : ""}>{d.status as string}</Badge>
                  <Button size="sm" variant="outline" asChild>
                    <a href={`/api/kyc-documents/${d.id}`} target="_blank" rel="noopener noreferrer">View</a>
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
