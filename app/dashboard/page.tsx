import { getCurrentUser } from "@/lib/auth";
import { sql } from "@/db/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowDownLeft, ArrowUpRight, DollarSign, PiggyBank, Scale, Wallet } from "lucide-react";
import { allocation, equityCurve } from "@/lib/market-data";
import { OverviewCharts } from "@/components/dashboard/OverviewCharts";

const statusVariant = (status: string) => (status === "Successful" ? "outline" : "secondary");

export default async function Overview() {
  const user = await getCurrentUser();
  const txRows = user
    ? await sql`select type, amount, method, status, created_at from transactions where user_id = ${user.id} order by created_at desc limit 5`
    : [];
  const totals = user
    ? await sql`
        select
          coalesce(sum(case when type = 'Deposit' and status = 'Successful' then amount end), 0)::numeric as deposited,
          coalesce(sum(case when type = 'Withdrawal' and status = 'Successful' then amount end), 0)::numeric as withdrawn
        from transactions where user_id = ${user.id}
      `
    : [];

  const available = Number(user?.balance_available ?? 0);
  const invested = Number(user?.balance_trading ?? 0);
  const balance = available + invested;
  const deposited = Number(totals[0]?.deposited ?? 0);
  const withdrawn = Number(totals[0]?.withdrawn ?? 0);

  const kpis = [
    { label: "Portfolio Balance", value: `$${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, delta: "Total account value", icon: Wallet, up: true },
    { label: "Available Balance", value: `$${available.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, delta: "Free to withdraw", icon: Scale, up: true },
    { label: "Total Deposited", value: `$${deposited.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, delta: "All successful deposits", icon: PiggyBank, up: true },
    { label: "Total Withdrawn", value: `$${withdrawn.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, delta: "All successful withdrawals", icon: DollarSign, up: true },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome back{user ? `, ${user.first_name}` : ""}</h1>
        <p className="text-sm text-muted-foreground">Here&apos;s how your portfolio is performing today.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label} className="border-border/60 bg-card/60">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{k.label}</div>
                <k.icon className="h-4 w-4 text-[color:var(--gold)]" />
              </div>
              <div className="mt-3 text-2xl font-bold tabular-nums">{k.value}</div>
              <div className={`mt-1 text-xs ${k.up ? "text-success" : "text-destructive"}`}>{k.delta}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <OverviewCharts equityCurve={equityCurve} allocation={allocation} />

      <Card className="border-border/60 bg-card/60">
        <CardContent className="p-0">
          <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
            <div className="font-semibold">Recent transactions</div>
            <Button size="sm" variant="outline" asChild><a href="/dashboard/deposit">View all</a></Button>
          </div>
          {txRows.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-muted-foreground">No transactions yet.</div>
          ) : (
            txRows.map((r, i) => {
              const isDeposit = r.type === "Deposit";
              return (
                <div key={i} className="grid grid-cols-4 items-center border-b border-border/40 px-5 py-3 text-sm last:border-0">
                  <div className="flex items-center gap-2">
                    {isDeposit ? <ArrowDownLeft className="h-4 w-4 text-success" /> : <ArrowUpRight className="h-4 w-4 text-[color:var(--gold)]" />}
                    {r.type as string}
                  </div>
                  <div className="tabular-nums">${Number(r.amount).toFixed(2)}</div>
                  <div className="text-muted-foreground">{r.method as string}</div>
                  <div><Badge variant={statusVariant(r.status as string)}>{r.status as string}</Badge></div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}
