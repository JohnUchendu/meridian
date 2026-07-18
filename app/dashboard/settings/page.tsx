import { getCurrentUser } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { ProfileForm } from "@/components/dashboard/ProfileForm";

export default async function SettingsPage() {
  const user = await getCurrentUser();

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Settings</h1><p className="text-sm text-muted-foreground">Manage your profile, security and preferences.</p></div>
      <Card className="border-border/60 bg-card/60"><CardContent className="p-5 space-y-4">
        <div className="font-semibold">Profile</div>
        <ProfileForm
          firstName={(user?.first_name as string) ?? ""}
          lastName={(user?.last_name as string) ?? ""}
          email={(user?.email as string) ?? ""}
        />
      </CardContent></Card>
      <Card className="border-border/60 bg-card/60"><CardContent className="p-5 space-y-4">
        <div className="font-semibold">Security</div>
        <Row title="Two-factor authentication" desc="Require a code from your authenticator app on sign-in." defaultOn />
        <Separator />
        <Row title="Login alerts" desc="Email me whenever a new device signs in." defaultOn />
        <Separator />
        <Row title="Withdrawal confirmations" desc="Require email confirmation for all withdrawals." defaultOn />
      </CardContent></Card>
      <Card className="border-border/60 bg-card/60"><CardContent className="p-5 space-y-4">
        <div className="font-semibold">Notifications</div>
        <Row title="Price alerts" desc="Get notified when your watched instruments hit target levels." defaultOn />
        <Separator />
        <Row title="Market news" desc="Daily digest of high-impact market events." />
        <Separator />
        <Row title="Product updates" desc="Occasional emails about new features." />
      </CardContent></Card>
      <p className="text-xs text-muted-foreground">
        Security/notification toggles are UI-only for now — wire them to a <code>user_preferences</code> table using the same pattern as the profile form above.
      </p>
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
