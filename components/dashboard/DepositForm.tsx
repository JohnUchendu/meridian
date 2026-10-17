"use client";
import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { submitTransactionAction, type TxState } from "@/app/dashboard/deposit/actions";

export function DepositForm({ type }: { type: "Deposit" | "Withdrawal" }) {
  const [state, formAction, pending] = useActionState<TxState, FormData>(submitTransactionAction, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      toast.success(type === "Deposit" ? "Deposit submitted" : "Withdrawal requested");
      formRef.current?.reset();
    }
    if (state?.error) toast.error(state.error);
  }, [state, type]);

  return (
    <form ref={formRef} action={formAction} className="grid gap-3">
      <input type="hidden" name="type" value={type} />
      <div>
        <Label htmlFor={`${type}-amount`}>{type === "Deposit" ? "Amount sent (USD)" : "Amount to withdraw (USD)"}</Label>
        <Input
          id={`${type}-amount`}
          name="amount"
          type="number"
          step="0.01"
          min="1"
          placeholder={type === "Deposit" ? "500" : "250"}
          required
          className="mt-2"
        />
      </div>

      {type === "Deposit" ? (
        <>
          <input type="hidden" name="method" value="QR code" />
          <div>
            <Label htmlFor="deposit-reference">Payment reference (optional)</Label>
            <Input
              id="deposit-reference"
              name="reference"
              maxLength={120}
              placeholder="Transaction hash or bank reference"
              className="mt-2"
            />
          </div>
        </>
      ) : (
        <div>
          <Label htmlFor="withdraw-method">Payout method</Label>
          <select
            id="withdraw-method"
            name="method"
            defaultValue="Bank wire"
            className="mt-2 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
          >
            <option value="Bank wire">Bank wire</option>
            <option value="Crypto">Crypto</option>
          </select>
        </div>
      )}

      <div className="pt-1">
        <Button type="submit" disabled={pending} className="w-full sm:w-auto">
          {pending ? "Submitting..." : type === "Deposit" ? "Confirm deposit" : "Request withdrawal"}
        </Button>
      </div>
      <p className="text-[11px] text-muted-foreground">
        {type === "Deposit"
          ? "Your balance updates as soon as your payment is confirmed."
          : "Withdrawals are paid to your selected payout method."}
      </p>
    </form>
  );
}
