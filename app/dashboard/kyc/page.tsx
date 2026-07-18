import { getCurrentUser } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle } from "lucide-react";
import { KycUploadForm } from "@/components/dashboard/KycUploadForm";

export default async function KYC() {
  const user = await getCurrentUser();
  const status = (user?.kyc_status as string) ?? "Not Started";

  const steps = [
    { label: "Passport / National ID", docType: "passport" },
    { label: "Proof of address", docType: "proof_of_address" },
    { label: "Selfie verification", docType: "selfie" },
  ];

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">KYC Verification</h1><p className="text-sm text-muted-foreground">Complete verification to unlock full trading limits.</p></div>
      <Card className="border-border/60 bg-card/60">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="font-semibold">Verification status</div>
            <Badge variant="outline" className="border-[color:var(--gold)]/40 text-[color:var(--gold)]">{status}</Badge>
          </div>
          <div className="mt-4 space-y-3">
            {steps.map((s) => (
              <div key={s.docType} className="flex flex-col gap-3 rounded-lg border border-border/60 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  {status === "Verified" ? <CheckCircle2 className="h-5 w-5 text-success" /> : <Circle className="h-5 w-5 text-muted-foreground" />}
                  <div className="text-sm font-medium">{s.label}</div>
                </div>
                <KycUploadForm docType={s.docType} />
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            JPG, PNG, WebP, or PDF — 5MB max. Files are stored directly in Neon and reviewed by our team, typically within an hour.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
