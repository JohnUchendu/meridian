"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ticker } from "@/lib/market-data";
import { HeroChart } from "@/components/site/Chart";
import { toast } from "sonner";

export default function Trading() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Trading</h1>
        <p className="text-sm text-muted-foreground">Manage live trades, pending orders and watchlists.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr,340px]">
        <Card className="border-border/60 bg-card/60">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">EUR/USD</div>
                <div className="text-2xl font-bold tabular-nums">1.0864 <span className="text-sm text-success">+0.24%</span></div>
              </div>
              <Badge variant="outline" className="border-[color:var(--gold)]/40 text-[color:var(--gold)]">Live</Badge>
            </div>
            <div className="mt-4"><HeroChart height={300} /></div>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/60 h-fit">
          <CardContent className="p-5">
            <Tabs defaultValue="buy">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="buy" className="data-[state=active]:bg-success data-[state=active]:text-success-foreground">Buy</TabsTrigger>
                <TabsTrigger value="sell" className="data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground">Sell</TabsTrigger>
              </TabsList>
              {["buy", "sell"].map((k) => (
                <TabsContent key={k} value={k} className="mt-4 space-y-3">
                  <div><Label>Volume (lots)</Label><Input defaultValue="0.10" className="mt-2" /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label>Stop loss</Label><Input placeholder="1.0800" className="mt-2" /></div>
                    <div><Label>Take profit</Label><Input placeholder="1.0950" className="mt-2" /></div>
                  </div>
                  <Button
                    onClick={() => toast.success(`${k === "buy" ? "Buy" : "Sell"} order placed`, { description: "EUR/USD · 0.10 lots" })}
                    className={`w-full ${k === "buy" ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"} hover:opacity-90`}
                  >
                    {k === "buy" ? "Buy" : "Sell"} EUR/USD
                  </Button>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
      <Card className="border-border/60 bg-card/60">
        <CardContent className="p-0">
          <div className="border-b border-border/60 px-5 py-4 font-semibold">Watchlist</div>
          <div className="grid grid-cols-12 px-5 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border/60">
            <div className="col-span-4">Symbol</div><div className="col-span-3 text-right">Bid</div><div className="col-span-3 text-right">Ask</div><div className="col-span-2 text-right">Change</div>
          </div>
          {ticker.map((t, i) => {
            const up = t.change >= 0;
            return (
              <div key={i} className="grid grid-cols-12 items-center border-b border-border/40 px-5 py-3 text-sm last:border-0 hover:bg-muted/40">
                <div className="col-span-4"><div className="font-medium">{t.symbol}</div><div className="text-xs text-muted-foreground">{t.name}</div></div>
                <div className="col-span-3 text-right tabular-nums">{(t.price * 0.9999).toFixed(t.price < 10 ? 4 : 2)}</div>
                <div className="col-span-3 text-right tabular-nums">{(t.price * 1.0001).toFixed(t.price < 10 ? 4 : 2)}</div>
                <div className={`col-span-2 text-right tabular-nums ${up ? "text-success" : "text-destructive"}`}>{up ? "+" : ""}{t.change.toFixed(2)}%</div>
              </div>
            );
          })}
        </CardContent>
      </Card>
      <p className="text-xs text-muted-foreground">
        Order placement is UI-only demo (no real trading engine/broker connection). Wire the Buy/Sell handlers to a real order-matching or broker API to make this functional.
      </p>
    </div>
  );
}
