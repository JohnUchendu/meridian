import { sql } from "@/db/client";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, DollarSign, Users, TrendingUp } from "lucide-react";

export default async function AdminHome() {
  const [{ count: userCount }] = await sql`select count(*)::int as count from users where role = 'client'`;
  const [{ sum: totalBalance }] = await sql`
    select coalesce(sum(balance_available + balance_trading), 0)::numeric as sum from users
  `;
  const [{ count: pendingTx }] = await sql`select count(*)::int as count from transactions where status = 'Pending'`;
  const [{ sum: mtdVolume }] = await sql`
    select coalesce(sum(amount), 0)::numeric as sum from transactions
    where created_at >= date_trunc('month', now())
  `;

  const kpis = [
    { icon: Users, label: "Total clients", value: Number(userCount).toLocaleString() },
    { icon: DollarSign, label: "Assets under management", value: `$${Number(totalBalance).toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
    { icon: Activity, label: "Pending transactions", value: String(pendingTx) },
    { icon: TrendingUp, label: "Volume (MTD)", value: `$${Number(mtdVolume).toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
  ];

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Admin overview</h1><p className="text-sm text-muted-foreground">Real-time platform metrics from Neon.</p></div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label} className="border-border/60 bg-card/60"><CardContent className="p-5">
            <div className="flex items-center justify-between"><div className="text-xs uppercase tracking-wider text-muted-foreground">{k.label}</div><k.icon className="h-4 w-4 text-[color:var(--gold)]" /></div>
            <div className="mt-3 text-2xl font-bold tabular-nums">{k.value}</div>
          </CardContent></Card>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        Revenue/volume time-series charts still use demo data (<code>lib/market-data.ts</code>) since there&apos;s no trading engine generating real daily P/L yet — see <code>/admin/analytics</code>.
      </p>
    </div>
  );
}
