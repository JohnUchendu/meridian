import { getCurrentUser } from "@/lib/auth";
import { sql } from "@/db/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, ArrowUpRight, DollarSign, PieChart as PieIcon, Scale, Wallet } from "lucide-react";
import { allocation, equityCurve, ticker } from "@/lib/market-data";
import { OverviewCharts } from "@/components/dashboard/OverviewCharts";

export default async function Overview() {
  const user = await getCurrentUser();
  const txRows = user
    ? await sql`select type, amount, method, status, created_at from transactions where user_id = ${user.id} order by created_at desc limit 5`
    : [];

  const available = Number(user?.balance_available ?? 0);
  const trading = Number(user?.balance_trading ?? 0);
  const equity = available + trading;

  const kpis = [
    { label: "Portfolio Balance", value: `$${equity.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, delta: "Live", icon: Wallet, up: true },
    { label: "Available Balance", value: `$${available.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, delta: "Free to withdraw", icon: Scale, up: true },
    { label: "Trading Balance", value: `$${trading.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, delta: "Allocated", icon: ArrowUpRight, up: true },
    { label: "Equity", value: `$${equity.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, delta: "Today", icon: DollarSign, up: true },
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
            txRows.map((r, i) => (
              <div key={i} className="grid grid-cols-4 items-center border-b border-border/40 px-5 py-3 text-sm last:border-0">
                <div>{r.type as string}</div>
                <div className="tabular-nums">${Number(r.amount).toFixed(2)}</div>
                <div className="text-muted-foreground">{r.method as string}</div>
                <div><Badge variant={r.status === "Completed" ? "outline" : "secondary"}>{r.status as string}</Badge></div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/60">
        <CardContent className="p-0">
          <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
            <div className="font-semibold">Watchlist</div>
          </div>
          <div className="grid grid-cols-12 border-b border-border/60 px-5 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            <div className="col-span-3">Symbol</div>
            <div className="col-span-2 text-right">Volume</div>
            <div className="col-span-2 text-right">Entry</div>
            <div className="col-span-2 text-right">Current</div>
            <div className="col-span-3 text-right">P/L</div>
          </div>
          {ticker.slice(0, 6).map((t, i) => {
            const up = t.change >= 0;
            return (
              <div key={i} className="grid grid-cols-12 items-center border-b border-border/40 px-5 py-3 text-sm last:border-0">
                <div className="col-span-3 font-medium">{t.symbol}</div>
                <div className="col-span-2 text-right tabular-nums">{(0.5 + i * 0.25).toFixed(2)}</div>
                <div className="col-span-2 text-right tabular-nums">{(t.price * 0.998).toFixed(t.price < 10 ? 4 : 2)}</div>
                <div className="col-span-2 text-right tabular-nums">{t.price.toFixed(t.price < 10 ? 4 : 2)}</div>
                <div className={`col-span-3 text-right tabular-nums ${up ? "text-success" : "text-destructive"}`}>
                  <span className="inline-flex items-center gap-1">{up ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}{t.change.toFixed(2)}%</span>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
