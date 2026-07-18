"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Pie, PieChart, Cell, Legend } from "recharts";

const PIE_COLORS = ["oklch(0.78 0.14 85)", "oklch(0.55 0.16 260)", "oklch(0.68 0.17 155)", "oklch(0.62 0.18 30)", "oklch(0.7 0.15 200)"];

export function AnalyticsCharts({
  revenueSeries,
  allocation,
}: {
  revenueSeries: { month: string; revenue: number; volume: number }[];
  allocation: { name: string; value: number }[];
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="border-border/60 bg-card/60 lg:col-span-2"><CardContent className="p-5">
        <div className="font-semibold">Client acquisition</div>
        <div className="mt-4 h-72">
          <ResponsiveContainer>
            <AreaChart data={revenueSeries}>
              <defs><linearGradient id="ac" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="oklch(0.55 0.16 260)" stopOpacity={0.6} /><stop offset="100%" stopColor="oklch(0.55 0.16 260)" stopOpacity={0} /></linearGradient></defs>
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "oklch(0.68 0.03 255)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "oklch(0.68 0.03 255)" }} axisLine={false} tickLine={false} width={60} />
              <Tooltip contentStyle={{ background: "oklch(0.21 0.06 265)", border: "1px solid oklch(1 0 0 / 10%)", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="revenue" stroke="oklch(0.55 0.16 260)" strokeWidth={2} fill="url(#ac)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent></Card>
      <Card className="border-border/60 bg-card/60"><CardContent className="p-5">
        <div className="font-semibold">Volume by asset class</div>
        <div className="mt-3 h-72">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={allocation} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={3}>
                {allocation.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "oklch(0.21 0.06 265)", border: "1px solid oklch(1 0 0 / 10%)", borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent></Card>
    </div>
  );
}
