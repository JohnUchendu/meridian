"use client";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { setKycStatusAction } from "@/app/admin/kyc/actions";

export function KycRowActions({ userId }: { userId: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <>
      <Button size="sm" variant="outline" disabled={pending} className="border-success/40 text-success"
        onClick={() => startTransition(async () => { await setKycStatusAction(userId, "Verified"); toast.success("Verified"); })}>
        <Check className="h-4 w-4" />
      </Button>
      <Button size="sm" variant="outline" disabled={pending} className="border-destructive/40 text-destructive"
        onClick={() => startTransition(async () => { await setKycStatusAction(userId, "Rejected"); toast.error("Rejected"); })}>
        <X className="h-4 w-4" />
      </Button>
    </>
  );
}
