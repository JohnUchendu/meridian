"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PieChart as PieIcon } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Pie, PieChart, Cell, Legend } from "recharts";

const PIE_COLORS = ["oklch(0.78 0.14 85)", "oklch(0.55 0.16 260)", "oklch(0.68 0.17 155)", "oklch(0.62 0.18 30)", "oklch(0.7 0.15 200)"];

export function OverviewCharts({
  equityCurve,
  allocation,
}: {
  equityCurve: { day: string; value: number }[];
  allocation: { name: string; value: number }[];
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="border-border/60 bg-card/60 lg:col-span-2">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div><div className="font-semibold">Portfolio growth</div><div className="text-xs text-muted-foreground">Last 40 sessions</div></div>
            <Badge variant="outline" className="border-border/60">USD</Badge>
          </div>
          <div className="mt-4 h-64">
            <ResponsiveContainer>
              <AreaChart data={equityCurve} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <defs><linearGradient id="p1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="oklch(0.78 0.14 85)" stopOpacity={0.5} /><stop offset="100%" stopColor="oklch(0.78 0.14 85)" stopOpacity={0} /></linearGradient></defs>
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "oklch(0.68 0.03 255)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "oklch(0.68 0.03 255)" }} axisLine={false} tickLine={false} width={50} />
                <Tooltip contentStyle={{ background: "oklch(0.21 0.06 265)", border: "1px solid oklch(1 0 0 / 10%)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="value" stroke="oklch(0.78 0.14 85)" strokeWidth={2} fill="url(#p1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <Card className="border-border/60 bg-card/60">
        <CardContent className="p-5">
          <div className="flex items-center gap-2"><PieIcon className="h-4 w-4 text-[color:var(--gold)]" /><div className="font-semibold">Asset allocation</div></div>
          <div className="mt-2 h-64">
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
        </CardContent>
      </Card>
    </div>
  );
}
