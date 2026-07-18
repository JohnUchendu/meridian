import { Card, CardContent } from "@/components/ui/card";
import { Bell, TrendingDown, TrendingUp, Newspaper } from "lucide-react";

const notifications = [
  { icon: TrendingUp, title: "EUR/USD hit your alert 1.0850", time: "2 min ago", tone: "success" },
  { icon: TrendingDown, title: "Margin usage above 60%", time: "1 hour ago", tone: "warn" },
  { icon: Newspaper, title: "FOMC decision at 19:00 UTC", time: "3 hours ago", tone: "info" },
  { icon: Bell, title: "Withdrawal request approved", time: "Yesterday", tone: "success" },
];

export default function Notif() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Notifications</h1><p className="text-sm text-muted-foreground">Price alerts, margin calls, order executions and system messages.</p></div>
      <Card className="border-border/60 bg-card/60">
        <CardContent className="p-0">
          {notifications.map((n, i) => (
            <div key={i} className="flex items-start gap-3 border-b border-border/40 px-5 py-4 last:border-0">
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${n.tone === "success" ? "bg-success/10 text-success" : n.tone === "warn" ? "bg-destructive/10 text-destructive" : "bg-[color:var(--gold)]/10 text-[color:var(--gold)]"}`}>
                <n.icon className="h-4 w-4" />
              </div>
              <div className="flex-1"><div className="text-sm font-medium">{n.title}</div><div className="text-xs text-muted-foreground">{n.time}</div></div>
            </div>
          ))}
        </CardContent>
      </Card>
      <p className="text-xs text-muted-foreground">Demo notifications — wire to a real <code>notifications</code> table when price alerts / order events exist.</p>
    </div>
  );
}
