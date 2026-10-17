import type { Metadata } from "next";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, Globe2, Smartphone } from "lucide-react";

export const metadata: Metadata = {
  title: "Trading Platforms — Web, Mobile & Desktop | Meridian Capital",
  description: "Manage your portfolio on our web platform, mobile apps and desktop terminal.",
  openGraph: { title: "Meridian Capital Platforms", description: "One account, three platforms, zero compromise." },
};

const platforms = [
  { icon: Globe2, name: "Web Trader", desc: "Advanced HTML5 charting, 100+ indicators, and one-click portfolio management — right in your browser.", features: ["No download", "TradingView charts", "Real-time depth of market"] },
  { icon: Smartphone, name: "Mobile App", desc: "Manage your account anywhere with our iOS and Android apps. Biometric login and instant alerts.", features: ["FaceID / TouchID", "Push alerts", "Full account management"] },
  { icon: Activity, name: "Desktop Terminal", desc: "A pro-grade terminal for serious investors. Multi-monitor layouts, hot keys, and DOM.", features: ["Windows & macOS", "Custom workspaces", "API access"] },
];

export default function Page() {
  return (
    <SiteLayout>
      <section className="gradient-navy py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--gold)]">Platforms</div>
          <h1 className="mt-2 text-4xl font-bold sm:text-5xl">Invest the way you want</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">Every platform is engineered for reliability, speed and precision — down to the millisecond.</p>
        </div>
      </section>
      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:px-6 md:grid-cols-3">
          {platforms.map((p) => (
            <Card key={p.name} className="border-border/60 bg-card/60">
              <CardContent className="p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[color:var(--gold)]/10 text-[color:var(--gold)]"><p.icon className="h-5 w-5" /></div>
                <div className="mt-4 text-xl font-semibold">{p.name}</div>
                <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
                <ul className="mt-4 grid grid-cols-1 gap-1.5 text-sm text-foreground/90 sm:grid-cols-3">
                  {p.features.map((f) => <li key={f} className="text-xs text-muted-foreground">• {f}</li>)}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
