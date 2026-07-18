import type { Metadata } from "next";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, CircleDollarSign, GraduationCap, ShieldCheck, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Investments — Managed Portfolios & Copy Trading | Meridian Capital",
  description: "Managed portfolios, copy trading, wealth management, retirement plans and fixed income.",
  openGraph: { title: "Meridian Capital Investments", description: "Grow long-term wealth with professionally managed strategies." },
};

const items = [
  { icon: Briefcase, title: "Managed Portfolios", desc: "Professionally managed multi-asset portfolios calibrated to your risk profile — conservative through aggressive.", tag: "From $5,000" },
  { icon: Users, title: "Copy Trading", desc: "Mirror ranked strategy providers. Filter by risk score, drawdown, win rate and asset class.", tag: "From $500" },
  { icon: ShieldCheck, title: "Wealth Management", desc: "Bespoke advisory across public equities, private markets, structured products and alternatives.", tag: "HNW only" },
  { icon: GraduationCap, title: "Retirement Plans", desc: "Tax-advantaged retirement accounts with long-horizon glide-path strategies.", tag: "From $1,000" },
  { icon: CircleDollarSign, title: "Fixed Income", desc: "Sovereign and investment-grade corporate bond ladders with monthly coupons.", tag: "From $10,000" },
];

export default function Page() {
  return (
    <SiteLayout>
      <section className="gradient-navy py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--gold)]">Investments</div>
          <h1 className="mt-2 text-4xl font-bold sm:text-5xl">Grow long-term wealth</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">Diversified investment products designed for every stage of your financial journey.</p>
        </div>
      </section>
      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((i) => (
            <Card key={i.title} className="border-border/60 bg-card/60">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><i.icon className="h-5 w-5" /></div>
                  <span className="rounded-full border border-border/60 px-2.5 py-0.5 text-xs text-muted-foreground">{i.tag}</span>
                </div>
                <div className="mt-4 text-lg font-semibold">{i.title}</div>
                <p className="mt-2 text-sm text-muted-foreground">{i.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
