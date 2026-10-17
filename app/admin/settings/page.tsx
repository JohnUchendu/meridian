import { getCurrentUser } from "@/lib/auth";
import { getDepositSettings } from "@/lib/settings";
import { DepositQrForm } from "@/components/admin/DepositQrForm";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

export default async function AdminSettings() {
  const [user, depositSettings] = await Promise.all([getCurrentUser(), getDepositSettings()]);

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">System settings</h1><p className="text-sm text-muted-foreground">Platform configuration and admin account.</p></div>
      <Card className="border-border/60 bg-card/60"><CardContent className="p-5 space-y-2">
        <div className="font-semibold">Signed in as</div>
        <div className="text-sm text-muted-foreground">{user?.first_name as string} {user?.last_name as string} — {user?.email as string}</div>
      </CardContent></Card>

      <Card className="border-border/60 bg-card/60">
        <CardContent className="p-5 space-y-4">
          <div>
            <div className="font-semibold">Deposit QR code</div>
            <p className="mt-1 text-xs text-muted-foreground">
              This is the only payment method clients see on the deposit page. Replace the image or update the address whenever your receiving account changes.
            </p>
          </div>
          <DepositQrForm
            qrImage={depositSettings.qrImage}
            address={depositSettings.address}
            instructions={depositSettings.instructions}
          />
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/60"><CardContent className="p-5 space-y-4">
        <div className="font-semibold">Platform toggles</div>
        <Row title="New account registrations" desc="Allow new clients to open accounts." defaultOn />
        <Separator />
        <Row title="Withdrawals enabled" desc="Allow clients to request withdrawals." defaultOn />
        <Separator />
        <Row title="Maintenance mode" desc="Show a maintenance banner on the marketing site." />
      </CardContent></Card>
    </div>
  );
}

function Row({ title, desc, defaultOn }: { title: string; desc: string; defaultOn?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div><div className="text-sm font-medium">{title}</div><div className="text-xs text-muted-foreground">{desc}</div></div>
      <Switch defaultChecked={defaultOn} />
    </div>
  );
}
