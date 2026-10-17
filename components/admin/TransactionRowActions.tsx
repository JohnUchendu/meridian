"use client";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { approveTransactionAction, rejectTransactionAction } from "@/app/admin/deposits/actions";

export function TransactionRowActions({ txId }: { txId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        disabled={pending}
        className="border-success/40 text-success"
        onClick={() => startTransition(async () => {
          const result = await approveTransactionAction(txId);
          if (result.ok) toast.success("Marked successful");
          else toast.error(result.error ?? "Could not update the transaction");
        })}
      >
        <Check className="mr-1 h-3.5 w-3.5" /> Successful
      </Button>
      <Button
        size="sm"
        variant="outline"
        disabled={pending}
        className="border-destructive/40 text-destructive"
        onClick={() => startTransition(async () => {
          const result = await rejectTransactionAction(txId);
          if (result.ok) toast.error("Transaction rejected");
          else toast.error(result.error ?? "Could not update the transaction");
        })}
      >
        <X className="mr-1 h-3.5 w-3.5" /> Reject
      </Button>
    </>
  );
}
