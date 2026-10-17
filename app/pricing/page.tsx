import type { Metadata } from "next";
import Link from "next/link";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing — Investment Plans | Meridian Capital",
  description: "Starter, Standard and Professional plans with 35% monthly or 60% quarterly return on investment.",
  openGraph: { title: "Meridian Capital Pricing", description: "Transparent investment tiers with predictable returns." },
};

const tiers = [
  {
    name: "Starter",
    range: "$50 – $300",
    desc: "For first-time investors.",
    monthly: "35%",
    quarterly: "60%",
    support: "Email support",
    popular: false,
  },
  {
    name: "Standard",
    range: "$500 – $2,000",
    desc: "For growing portfolios.",
    monthly: "35%",
    quarterly: "60%",
    support: "24/5 chat support",
    popular: true,
  },
  {
    name: "Professional",
    range: "$5,000+",
    desc: "For high-capital investors.",
    monthly: "35%",
    quarterly: "60%",
    support: "24/7 priority support",
    popular: false,
  },
];

export default function Page() {
  return (
    <SiteLayout>
      <section className="gradient-navy py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--gold)]">Pricing</div>
          <h1 className="mt-2 text-4xl font-bold sm:text-5xl">Investment plans built for growth</h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Pick the plan that matches your capital. Every plan earns the same return on investment, paid monthly or quarterly.
          </p>
        </div>
      </section>
      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:px-6 md:grid-cols-3">
          {tiers.map((t) => (
            <Card key={t.name} className={`relative border-border/60 bg-card/60 ${t.popular ? "ring-gold" : ""}`}>
              {t.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[color:var(--gold)] px-3 py-1 text-xs font-semibold text-[oklch(0.16_0.05_265)]">Most Popular</div>}
              <CardContent className="p-6">
                <div className="text-sm font-medium text-muted-foreground">{t.name}</div>
                <div className="mt-1 text-3xl font-bold">{t.range}</div>
                <div className="text-xs text-muted-foreground">investment range</div>
                <p className="mt-3 text-sm text-muted-foreground">{t.desc}</p>
                <ul className="mt-5 space-y-2 text-sm">
                  <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--gold)]" /><span>Return on investment: <b>{t.monthly} monthly</b></span></li>
                  <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--gold)]" /><span>Return on investment: <b>{t.quarterly} quarterly</b></span></li>
                  <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--gold)]" /><span>{t.support}</span></li>
                </ul>
                <Button asChild className="mt-6 w-full" variant={t.popular ? "default" : "outline"}><Link href="/auth">Open account</Link></Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="mx-auto mt-10 max-w-3xl px-4 text-center text-xs text-muted-foreground sm:px-6">
          Returns are paid on the schedule you choose at funding. Investment values can fluctuate and past performance is not a guarantee of future results.
        </p>
      </section>
    </SiteLayout>
  );
}
