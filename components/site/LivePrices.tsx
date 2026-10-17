"use client";
import { useEffect, useState } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { LivePrice } from "@/lib/live-prices";

function formatPrice(price: LivePrice) {
  const value = price.price.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return price.key === "spx" ? value : `$${value}`;
}

export function LivePrices({
  initialPrices,
  initialUpdatedAt,
}: {
  initialPrices: LivePrice[];
  initialUpdatedAt: string;
}) {
  const [prices, setPrices] = useState(initialPrices);
  const [updatedAt, setUpdatedAt] = useState(initialUpdatedAt);
  const [live, setLive] = useState(initialPrices.some((price) => price.live));

  useEffect(() => {
    let active = true;

    async function refresh() {
      try {
        const response = await fetch("/api/market-prices", { cache: "no-store" });
        if (!response.ok) return;
        const snapshot = (await response.json()) as {
          prices: LivePrice[];
          updatedAt: string;
          live: boolean;
        };
        if (!active || !Array.isArray(snapshot.prices)) return;
        setPrices(snapshot.prices);
        setUpdatedAt(snapshot.updatedAt);
        setLive(Boolean(snapshot.live));
      } catch {
        // Keep the previous quotes on a transient network error.
      }
    }

    const interval = window.setInterval(refresh, 30_000);
    refresh();

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  const updatedLabel = (() => {
    const date = new Date(updatedAt);
    return Number.isNaN(date.getTime()) ? "" : `${date.toISOString().slice(11, 19)} UTC`;
  })();

  return (
    <div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center sm:gap-3">
        {prices.map((price) => {
          const up = price.changePercent >= 0;
          return (
            <div key={price.key} className="min-w-0 rounded-lg border border-border/60 bg-background/40 p-2.5 sm:p-3">
              <div className="truncate text-[10px] uppercase tracking-wide text-muted-foreground sm:text-xs">{price.label}</div>
              <div className="mt-0.5 truncate text-sm font-semibold tabular-nums sm:text-base">{formatPrice(price)}</div>
              <div className={`inline-flex items-center gap-0.5 text-[11px] tabular-nums sm:text-xs ${up ? "text-success" : "text-destructive"}`}>
                {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {up ? "+" : ""}{price.changePercent.toFixed(2)}%
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground">
        <span className={`h-1.5 w-1.5 rounded-full ${live ? "bg-success animate-pulse-dot" : "bg-muted-foreground"}`} />
        {live ? `Live market data · ${updatedLabel}` : "Market data temporarily unavailable"}
      </div>
    </div>
  );
}
