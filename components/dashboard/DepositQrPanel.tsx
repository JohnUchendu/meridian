"use client";
import { useState } from "react";
import { Check, Copy, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DepositQrPanel({
  qrImage,
  address,
  instructions,
}: {
  qrImage: string;
  address: string;
  instructions: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="rounded-xl border border-border/60 bg-background/40 p-5">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Smartphone className="h-4 w-4 text-[color:var(--gold)]" />
        Pay by QR code
      </div>
      <div className="mt-4 flex justify-center">
        {/* The admin can replace this image from Admin → Settings. */}
        <img
          src={qrImage}
          alt="Deposit QR code"
          className="h-56 w-56 rounded-lg border border-border/60 bg-white p-3"
        />
      </div>
      <p className="mt-4 text-xs text-muted-foreground">{instructions}</p>
      <div className="mt-4 flex items-center gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2">
        <code className="min-w-0 flex-1 truncate text-xs">{address}</code>
        <Button type="button" size="sm" variant="outline" onClick={copyAddress}>
          {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
          <span className="ml-1.5">{copied ? "Copied" : "Copy"}</span>
        </Button>
      </div>
      <p className="mt-3 text-[11px] text-muted-foreground">
        Deposits are confirmed manually by our team. Your balance updates once the payment is approved.
      </p>
    </div>
  );
}
