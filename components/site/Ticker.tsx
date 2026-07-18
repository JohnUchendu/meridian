import { ticker } from "@/lib/market-data";
import { ArrowDown, ArrowUp } from "lucide-react";
export function Ticker() {
  const row = [...ticker, ...ticker];
  return (
    <div className="relative overflow-hidden border-y border-border/60 bg-background/40 backdrop-blur-sm">
      <div className="absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />
      <div className="flex animate-ticker gap-10 whitespace-nowrap py-3">
        {row.map((t, i) => {
          const up = t.change >= 0;
          return (
            <div key={i} className="flex items-center gap-3 text-sm">
              <span className="font-semibold tracking-wide">{t.symbol}</span>
              <span className="tabular-nums text-muted-foreground">
                {t.price.toLocaleString(undefined, { minimumFractionDigits: t.price < 10 ? 4 : 2 })}
              </span>
              <span className={`inline-flex items-center gap-1 tabular-nums ${up ? "text-success" : "text-destructive"}`}>
                {up ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                {up ? "+" : ""}{t.change.toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
