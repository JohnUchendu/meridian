import { sql } from "@/db/client";
import { Card, CardContent } from "@/components/ui/card";
import { revenueSeries, allocation } from "@/lib/market-data";
import { AnalyticsCharts } from "@/components/admin/AnalyticsCharts";

export default async function Analytics() {
  const userCountRows = await sql`select count(*)::int as count from users where role = 'client'`;
  const verifiedCountRows = await sql`select count(*)::int as count from users where kyc_status = 'Verified'`;
  const totalUsers = Number(userCountRows[0]?.count ?? 0);
  const verifiedUsers = Number(verifiedCountRows[0]?.count ?? 0);
  const retention = totalUsers > 0 ? ((verifiedUsers / totalUsers) * 100).toFixed(1) : "0.0";

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Analytics</h1><p className="text-sm text-muted-foreground">Revenue, activity and client acquisition insights.</p></div>
      <div className="grid gap-4 md:grid-cols-3">
        {[["Total clients", String(totalUsers)], ["KYC verified", String(verifiedUsers)], ["Verification rate", `${retention}%`]].map(([k, v]) => (
          <Card key={k} className="border-border/60 bg-card/60"><CardContent className="p-5"><div className="text-xs uppercase tracking-wider text-muted-foreground">{k}</div><div className="mt-2 text-2xl font-bold">{v}</div></CardContent></Card>
        ))}
      </div>
      <AnalyticsCharts revenueSeries={revenueSeries} allocation={allocation} />
    </div>
  );
}
