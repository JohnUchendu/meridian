"use client";
import { useActionState, useEffect, useRef, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  resetDepositQrAction,
  saveDepositSettingsAction,
  type DepositSettingsState,
} from "@/app/admin/settings/actions";

export function DepositQrForm({
  qrImage,
  address,
  instructions,
}: {
  qrImage: string;
  address: string;
  instructions: string;
}) {
  const [state, formAction, pending] = useActionState<DepositSettingsState, FormData>(
    saveDepositSettingsAction,
    undefined,
  );
  const [resetting, startReset] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state?.success) {
      toast.success("Deposit settings saved");
      if (fileRef.current) fileRef.current.value = "";
    }
    if (state?.error) toast.error(state.error);
  }, [state]);

  return (
    <div className="grid gap-4 sm:grid-cols-[180px_1fr]">
      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">Current QR</div>
        <img
          src={qrImage}
          alt="Current deposit QR code"
          className="mt-2 h-40 w-40 rounded-lg border border-border/60 bg-white p-2"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mt-2 px-0 text-xs text-muted-foreground"
          disabled={resetting}
          onClick={() =>
            startReset(async () => {
              await resetDepositQrAction();
              toast.success("Reset to the default QR code");
            })
          }
        >
          {resetting ? "Resetting..." : "Reset to default"}
        </Button>
      </div>

      <form action={formAction} className="grid gap-3">
        <div>
          <Label htmlFor="qr">Replace QR image</Label>
          <Input ref={fileRef} id="qr" name="qr" type="file" accept="image/png,image/jpeg,image/webp" className="mt-2" />
          <p className="mt-1 text-[11px] text-muted-foreground">PNG, JPG or WebP up to 1.5MB. Leave empty to keep the current image.</p>
        </div>
        <div>
          <Label htmlFor="address">Deposit address / reference</Label>
          <Input id="address" name="address" defaultValue={address} maxLength={200} required className="mt-2" />
        </div>
        <div>
          <Label htmlFor="instructions">Instructions</Label>
          <Textarea id="instructions" name="instructions" defaultValue={instructions} maxLength={600} rows={3} className="mt-2" />
        </div>
        <div>
          <Button type="submit" disabled={pending}>{pending ? "Saving..." : "Save deposit settings"}</Button>
        </div>
      </form>
    </div>
  );
}
