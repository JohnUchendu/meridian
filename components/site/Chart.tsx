"use client";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { equityCurve } from "@/lib/market-data";
export function HeroChart({ data = equityCurve, height = 260 }: { data?: typeof equityCurve; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="goldFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.86 0.13 88)" stopOpacity={0.6} />
            <stop offset="100%" stopColor="oklch(0.86 0.13 88)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="day" hide />
        <YAxis hide domain={["dataMin - 500", "dataMax + 500"]} />
        <Tooltip contentStyle={{ background: "oklch(0.21 0.06 265)", border: "1px solid oklch(1 0 0 / 10%)", borderRadius: 8, fontSize: 12 }} labelStyle={{ color: "oklch(0.7 0.03 260)" }} />
        <Area type="monotone" dataKey="value" stroke="oklch(0.86 0.13 88)" strokeWidth={2} fill="url(#goldFill)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
