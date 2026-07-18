"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function PortfolioChart({ data }: { data: { day: string; value: number }[] }) {
  return (
    <Card className="border-border/60 bg-card/60">
      <CardContent className="p-5">
        <div className="font-semibold">Performance</div>
        <div className="mt-3 h-72">
          <ResponsiveContainer>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="pp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.78 0.14 85)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="oklch(0.78 0.14 85)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "oklch(0.68 0.03 255)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "oklch(0.68 0.03 255)" }} axisLine={false} tickLine={false} width={50} />
              <Tooltip contentStyle={{ background: "oklch(0.21 0.06 265)", border: "1px solid oklch(1 0 0 / 10%)", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="value" stroke="oklch(0.78 0.14 85)" strokeWidth={2} fill="url(#pp)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
