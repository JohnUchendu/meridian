import type { Metadata } from "next";
import Link from "next/link";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing — Account Types | Meridian Capital",
  description: "Starter, Standard, Professional and VIP accounts with transparent spreads and commissions.",
  openGraph: { title: "Meridian Capital Pricing", description: "Transparent, competitive pricing." },
};

const tiers = [
  { name: "Starter", price: "$100", desc: "Great for beginners.", features: ["Spreads from 1.6 pips", "No commission", "Leverage up to 1:200", "Email support"], popular: false },
  { name: "Standard", price: "$1,000", desc: "For active traders.", features: ["Spreads from 1.0 pips", "No commission", "Leverage up to 1:400", "24/5 chat support", "Free VPS"], popular: false },
  { name: "Professional", price: "$10,000", desc: "For serious traders.", features: ["Spreads from 0.2 pips", "$3/lot commission", "Leverage up to 1:500", "24/7 priority support", "Dedicated analyst"], popular: true },
  { name: "VIP", price: "$50,000+", desc: "Institutional-grade.", features: ["Spreads from 0.0 pips", "$1.5/lot commission", "Leverage up to 1:500", "Dedicated account manager", "Custom liquidity"], popular: false },
];

export default function Page() {
  return (
    <SiteLayout>
      <section className="gradient-navy py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--gold)]">Pricing</div>
          <h1 className="mt-2 text-4xl font-bold sm:text-5xl">Transparent account tiers</h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">Pick the account that matches your capital and ambition. Upgrade anytime with no penalty.</p>
        </div>
      </section>
      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
          {tiers.map((t) => (
            <Card key={t.name} className={`relative border-border/60 bg-card/60 ${t.popular ? "ring-gold" : ""}`}>
              {t.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[color:var(--gold)] px-3 py-1 text-xs font-semibold text-[oklch(0.16_0.05_265)]">Most Popular</div>}
              <CardContent className="p-6">
                <div className="text-sm font-medium text-muted-foreground">{t.name}</div>
                <div className="mt-1 text-3xl font-bold">{t.price}</div>
                <div className="text-xs text-muted-foreground">minimum deposit</div>
                <p className="mt-3 text-sm text-muted-foreground">{t.desc}</p>
                <ul className="mt-5 space-y-2 text-sm">
                  {t.features.map((f) => (<li key={f} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--gold)]" /><span>{f}</span></li>))}
                </ul>
                <Button asChild className="mt-6 w-full" variant={t.popular ? "default" : "outline"}><Link href="/auth">Open account</Link></Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
