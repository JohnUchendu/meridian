import type { Metadata } from "next";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Building2, Globe2, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "About — Meridian Capital",
  description: "Meridian Capital is a globally regulated brokerage serving retail and institutional clients across 180+ countries.",
  openGraph: { title: "About Meridian Capital", description: "Institutional heritage. Retail access." },
};

const values = [
  { icon: Shield, title: "Client-first", desc: "Segregated funds, negative balance protection, transparent execution." },
  { icon: Globe2, title: "Global reach", desc: "Regulated entities across three continents serving 180+ countries." },
  { icon: Building2, title: "Institutional heritage", desc: "Built by former Tier-1 bank traders and prime brokerage veterans." },
  { icon: Award, title: "Award-winning", desc: "Recognized for best execution, best mobile app, and best CFD broker 2024." },
];

export default function Page() {
  return (
    <SiteLayout>
      <section className="gradient-navy py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--gold)]">About</div>
          <h1 className="mt-2 text-4xl font-bold sm:text-5xl">Institutional heritage. <span className="gold-gradient">Retail access.</span></h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Founded in 2008 by veteran traders and prime-brokerage engineers, Meridian Capital has grown into a global broker serving over 1.2 million clients across 180+ countries.
          </p>
        </div>
      </section>
      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <Card key={v.title} className="border-border/60 bg-card/60">
              <CardContent className="p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[color:var(--gold)]/10 text-[color:var(--gold)]"><v.icon className="h-5 w-5" /></div>
                <div className="mt-4 text-lg font-semibold">{v.title}</div>
                <p className="mt-2 text-sm text-muted-foreground">{v.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
