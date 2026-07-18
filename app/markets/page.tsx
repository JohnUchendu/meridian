import type { Metadata } from "next";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, ArrowUp } from "lucide-react";
import { ticker } from "@/lib/market-data";

export const metadata: Metadata = {
  title: "Markets — Forex, CFDs & Crypto | Meridian Capital",
  description: "Trade Forex, commodities, stocks, indices and crypto CFDs with tight institutional spreads.",
  openGraph: { title: "Meridian Capital Markets", description: "Live spreads across every major asset class." },
};

function classify(s: string) {
  if (s.includes("BTC") || s.includes("ETH")) return "Crypto";
  if (s.includes("XAU") || s.includes("XAG") || s === "WTI") return "Commodities";
  if (s.startsWith("NAS") || s.startsWith("SPX") || s.startsWith("US30")) return "Indices";
  return "Forex";
}

export default function MarketsPage() {
  return (
    <SiteLayout>
      <section className="gradient-navy py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--gold)]">Markets</div>
          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">Live markets & instruments</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">Real-time pricing across 2,000+ instruments. Spreads shown are indicative and subject to market conditions.</p>
        </div>
      </section>
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Card className="border-border/60 bg-card/60">
            <CardContent className="p-0">
              <div className="grid grid-cols-12 border-b border-border/60 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <div className="col-span-4">Symbol</div>
                <div className="col-span-3 text-right">Price</div>
                <div className="col-span-2 text-right">Change</div>
                <div className="col-span-3 text-right">Class</div>
              </div>
              {ticker.map((t, i) => {
                const up = t.change >= 0;
                return (
                  <div key={i} className="grid grid-cols-12 items-center border-b border-border/40 px-6 py-3 text-sm last:border-0 hover:bg-muted/40">
                    <div className="col-span-4">
                      <div className="font-semibold">{t.symbol}</div>
                      <div className="text-xs text-muted-foreground">{t.name}</div>
                    </div>
                    <div className="col-span-3 text-right font-medium tabular-nums">{t.price.toLocaleString(undefined, { minimumFractionDigits: t.price < 10 ? 4 : 2 })}</div>
                    <div className={`col-span-2 text-right tabular-nums ${up ? "text-success" : "text-destructive"}`}>
                      <span className="inline-flex items-center gap-1">{up ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}{up ? "+" : ""}{t.change.toFixed(2)}%</span>
                    </div>
                    <div className="col-span-3 text-right"><Badge variant="outline" className="border-border/60">{classify(t.symbol)}</Badge></div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </section>
    </SiteLayout>
  );
}
