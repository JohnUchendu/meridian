import { getCurrentUser } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";

export default async function WalletPage() {
  const user = await getCurrentUser();
  const available = Number(user?.balance_available ?? 0);
  const trading = Number(user?.balance_trading ?? 0);
  const bonus = Number(user?.balance_bonus ?? 0);

  const wallets = [
    { name: "Available Balance", value: available, note: "Ready to withdraw" },
    { name: "Trading Balance", value: trading, note: "Allocated to positions" },
    { name: "Bonus Balance", value: bonus, note: "Promotional" },
  ];

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Wallet</h1><p className="text-sm text-muted-foreground">Manage balances and internal transfers.</p></div>
      <div className="grid gap-4 md:grid-cols-3">
        {wallets.map((w) => (
          <Card key={w.name} className="border-border/60 bg-card/60">
            <CardContent className="p-5">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{w.name}</div>
              <div className="mt-2 text-2xl font-bold tabular-nums">${w.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
              <div className="mt-1 text-xs text-muted-foreground">{w.note}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="border-border/60 bg-card/60">
        <CardContent className="p-5">
          <div className="font-semibold">Transfer between wallets</div>
          <p className="mt-2 text-sm text-muted-foreground">
            Internal transfers between Available/Trading/Bonus balances aren&apos;t wired to the database yet —
            deposits and withdrawals (which are real) live on the{" "}
            <a href="/dashboard/deposit" className="text-[color:var(--gold)] hover:underline">Deposit &amp; Withdraw</a> page.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
