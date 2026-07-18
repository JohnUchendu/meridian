import { getCurrentUser } from "@/lib/auth";
import { allocation, equityCurve } from "@/lib/market-data";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PortfolioChart } from "@/components/dashboard/PortfolioChart";

export default async function Portfolio() {
  const user = await getCurrentUser();
  const available = Number(user?.balance_available ?? 0);
  const trading = Number(user?.balance_trading ?? 0);
  const total = available + trading;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Portfolio</h1>
        <p className="text-sm text-muted-foreground">Performance and holdings across all asset classes.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border/60 bg-card/60"><CardContent className="p-5"><div className="text-xs uppercase tracking-wider text-muted-foreground">Total balance</div><div className="mt-2 text-2xl font-bold">${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div></CardContent></Card>
        <Card className="border-border/60 bg-card/60"><CardContent className="p-5"><div className="text-xs uppercase tracking-wider text-muted-foreground">Available</div><div className="mt-2 text-2xl font-bold">${available.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div></CardContent></Card>
        <Card className="border-border/60 bg-card/60"><CardContent className="p-5"><div className="text-xs uppercase tracking-wider text-muted-foreground">In trading</div><div className="mt-2 text-2xl font-bold">${trading.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div></CardContent></Card>
      </div>
      <PortfolioChart data={equityCurve} />
      <Card className="border-border/60 bg-card/60">
        <CardContent className="p-5">
          <div className="font-semibold">Allocation by asset class</div>
          <div className="mt-4 space-y-4">
            {allocation.map((a) => (
              <div key={a.name}>
                <div className="flex justify-between text-sm"><span>{a.name}</span><span className="tabular-nums">{a.value}%</span></div>
                <Progress value={a.value} className="mt-1.5 h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <p className="text-xs text-muted-foreground">
        Performance chart and allocation still use demo data — the total/available/trading balance cards above are real, pulled from your account.
      </p>
    </div>
  );
}
