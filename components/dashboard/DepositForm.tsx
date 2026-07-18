"use client";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { submitTransactionAction, type TxState } from "@/app/dashboard/deposit/actions";

export function DepositForm({ type }: { type: "Deposit" | "Withdrawal" }) {
  const [state, formAction, pending] = useActionState<TxState, FormData>(submitTransactionAction, undefined);

  useEffect(() => {
    if (state?.success) toast.success(type === "Deposit" ? "Deposit initiated" : "Withdrawal requested");
    if (state?.error) toast.error(state.error);
  }, [state, type]);

  return (
    <form action={formAction} className="grid gap-3 sm:grid-cols-2">
      <input type="hidden" name="type" value={type} />
      <div>
        <Label>Amount (USD)</Label>
        <Input name="amount" type="number" step="0.01" min="1" defaultValue="1000" required className="mt-2" />
      </div>
      <div>
        <Label>Method</Label>
        <select name="method" className="mt-2 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
          <option value="Card">Card</option>
          <option value="Bank wire">Bank wire</option>
          <option value="Crypto">Crypto</option>
        </select>
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" disabled={pending} className="w-full sm:w-auto">
          {pending ? "Processing..." : type === "Deposit" ? "Deposit funds" : "Request withdrawal"}
        </Button>
      </div>
    </form>
  );
}
