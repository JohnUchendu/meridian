import Link from "next/link";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Ticker } from "@/components/site/Ticker";
import { HeroChart } from "@/components/site/Chart";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Activity, ArrowRight, BarChart3, Bitcoin, Briefcase, Check, ChevronRight,
  CircleDollarSign, Coins, Globe2, GraduationCap, LineChart, ShieldCheck,
  Smartphone, Sparkles, Star, TrendingUp, Users, Zap,
} from "lucide-react";

const markets = [
  { icon: Globe2, name: "Forex", spread: "0.0 pips", leverage: "1:500", hours: "24/5", desc: "70+ major, minor & exotic pairs with deep liquidity." },
  { icon: Coins, name: "Commodities", spread: "0.3 pips", leverage: "1:200", hours: "23/5", desc: "Trade oil, gas, agriculture and soft commodities." },
  { icon: BarChart3, name: "Stocks", spread: "$0.02", leverage: "1:20", hours: "Mkt hours", desc: "3,000+ global equities across NYSE, NASDAQ, LSE." },
  { icon: LineChart, name: "Indices", spread: "0.4 pts", leverage: "1:200", hours: "24/5", desc: "S&P 500, NASDAQ, DAX, FTSE, Nikkei & more." },
  { icon: Briefcase, name: "ETFs", spread: "$0.05", leverage: "1:10", hours: "Mkt hours", desc: "Sector, thematic and global diversified ETFs." },
  { icon: Bitcoin, name: "Crypto CFDs", spread: "8 pips", leverage: "1:20", hours: "24/7", desc: "BTC, ETH, SOL, XRP and more — no wallets required." },
  { icon: Sparkles, name: "Precious Metals", spread: "0.15", leverage: "1:200", hours: "23/5", desc: "Spot gold, silver, platinum and palladium." },
];
const stats = [
  { k: "180+", v: "Countries served" },
  { k: "1.2M+", v: "Active traders" },
  { k: "$14B", v: "Daily volume" },
  { k: "18 yrs", v: "In business" },
  { k: "98.4%", v: "Client satisfaction" },
];
const platforms = [
  { icon: Globe2, name: "Web Trader", desc: "Zero-install browser trading with advanced charting.", tag: "No download" },
  { icon: Smartphone, name: "Mobile App", desc: "iOS & Android with biometric login and price alerts.", tag: "iOS · Android" },
  { icon: Activity, name: "Desktop Platform", desc: "Multi-monitor terminal with DOM and algo tools.", tag: "Win · macOS" },
  { icon: Zap, name: "MetaTrader Integration", desc: "MT4 & MT5 bridges with EAs and copy signals.", tag: "MT4 · MT5" },
];
const investments = [
  { icon: Briefcase, title: "Managed Portfolios", desc: "Professionally managed diversified portfolios tuned to your risk profile." },
  { icon: Users, title: "Copy Trading", desc: "Mirror top-ranked strategy providers with granular allocation controls." },
  { icon: ShieldCheck, title: "Wealth Management", desc: "Bespoke advisory for high-net-worth clients across public and private markets." },
  { icon: GraduationCap, title: "Retirement Plans", desc: "Tax-advantaged retirement accounts with long-horizon strategies." },
  { icon: CircleDollarSign, title: "Fixed Income", desc: "Sovereign and corporate bond ladders with monthly coupons." },
];
const pricing = [
  { name: "Starter", price: "$100", spread: "1.6 pips", commission: "$0", leverage: "1:200", support: "Email", popular: false },
  { name: "Standard", price: "$1,000", spread: "1.0 pips", commission: "$0", leverage: "1:400", support: "24/5 chat", popular: false },
  { name: "Professional", price: "$10,000", spread: "0.2 pips", commission: "$3/lot", leverage: "1:500", support: "24/7 priority", popular: true },
  { name: "VIP", price: "$50,000+", spread: "0.0 pips", commission: "$1.5/lot", leverage: "1:500", support: "Dedicated manager", popular: false },
];
const testimonials = [
  { name: "Sofia Reyes", role: "Portfolio Manager, Madrid", quote: "Execution is genuinely institutional-grade. Slippage on majors is a non-issue for our size." },
  { name: "James Okafor", role: "Prop Trader, London", quote: "The desktop terminal and API are the closest thing to Bloomberg I've used at a retail broker." },
  { name: "Naomi Tanaka", role: "Wealth Advisor, Tokyo", quote: "Managed portfolios have delivered a consistent risk-adjusted return for my HNW clients." },
];
const faqs = [
  ["How do I open an account?", "Complete the 3-minute application, upload a government ID and proof of address, then fund your account. Most accounts are approved within an hour during business days."],
  ["What is the minimum deposit?", "The Starter account opens from $100. Standard, Professional and VIP tiers unlock tighter spreads, priority routing and dedicated support."],
  ["Is Meridian Capital regulated?", "Yes. Meridian entities are licensed in multiple jurisdictions. Client funds are held in segregated tier-1 bank accounts."],
  ["Which platforms are supported?", "Web Trader, native iOS/Android apps, desktop terminal for Windows/macOS, and MetaTrader 4 & 5 bridges."],
  ["How fast are withdrawals?", "Most e-wallet withdrawals are processed within 1 hour. Bank wires typically settle in 1–2 business days."],
];

export default function LandingPage() {
  return (
    <SiteLayout>
      <section className="relative overflow-hidden gradient-navy">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(oklch(1 0 0 / 5%) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 5%) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 pt-14 pb-20 sm:px-6 lg:pt-24">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <Badge variant="outline" className="border-[color:var(--gold)]/40 bg-[color:var(--gold)]/10 text-[color:var(--gold)]">
                <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--gold)] animate-pulse-dot" />
                Markets are live · New York open
              </Badge>
              <h1 className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                Trade global markets <span className="gold-gradient">with confidence</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg text-muted-foreground">
                Access Forex, Commodities, Indices, Stocks, Crypto CFDs and managed investment portfolios through one secure, institutional-grade platform.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button size="lg" asChild className="bg-primary text-primary-foreground hover:opacity-90">
                  <Link href="/auth">Open Live Account <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-foreground/20">
                  <Link href="/auth">Open Demo Account</Link>
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[color:var(--gold)]" /> Segregated client funds</div>
                <div className="flex items-center gap-2"><Zap className="h-4 w-4 text-[color:var(--gold)]" /> 12ms avg execution</div>
                <div className="flex items-center gap-2"><Globe2 className="h-4 w-4 text-[color:var(--gold)]" /> 180+ countries</div>
              </div>
            </div>
            <div className="relative">
              <div className="glass relative overflow-hidden rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">Portfolio</div>
                    <div className="mt-1 text-3xl font-bold tabular-nums">$128,421.60</div>
                    <div className="text-sm text-success">+$4,231.20 (3.41%) today</div>
                  </div>
                  <Badge className="bg-[color:var(--gold)]/15 text-[color:var(--gold)] hover:bg-[color:var(--gold)]/15">Live</Badge>
                </div>
                <div className="mt-4"><HeroChart /></div>
                <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                  {[["EUR/USD","1.0864","+0.24%"],["Gold","2384.12","+0.72%"],["BTC","68,421","+2.14%"]].map((r, i) => (
                    <div key={i} className="rounded-lg border border-border/60 bg-background/40 p-3">
                      <div className="text-xs text-muted-foreground">{r[0]}</div>
                      <div className="mt-0.5 font-semibold tabular-nums">{r[1]}</div>
                      <div className="text-xs text-success">{r[2]}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -right-6 -top-6 hidden h-32 w-32 rounded-full bg-[color:var(--gold)]/20 blur-3xl lg:block animate-float" />
            </div>
          </div>
        </div>
        <Ticker />
      </section>

      <section className="border-b border-border/60 bg-background py-12">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 sm:px-6 md:grid-cols-5">
          {stats.map((s) => (
            <div key={s.v} className="text-center">
              <div className="text-3xl font-bold gold-gradient">{s.k}</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{s.v}</div>
            </div>
          ))}
        </div>
      </section>

      <Section title="Trade every major asset class" kicker="Markets" desc="From majors to exotics — one account, thousands of instruments, tight institutional spreads.">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {markets.map((m) => (
            <Card key={m.name} className="group relative overflow-hidden border-border/60 bg-card/60 transition-all hover:-translate-y-0.5 hover:border-[color:var(--gold)]/40">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[color:var(--gold)]/10 text-[color:var(--gold)]"><m.icon className="h-5 w-5" /></div>
                  <div className="text-lg font-semibold">{m.name}</div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{m.desc}</p>
                <div className="mt-5 grid grid-cols-3 gap-2 border-t border-border/60 pt-4 text-xs">
                  <Meta k="Spread" v={m.spread} />
                  <Meta k="Leverage" v={m.leverage} />
                  <Meta k="Hours" v={m.hours} />
                </div>
                <Link href="/markets" className="mt-5 inline-flex items-center text-sm font-medium text-[color:var(--gold)] hover:underline">
                  Learn more <ChevronRight className="ml-0.5 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Choose your platform" kicker="Platforms" desc="Trade the way you want — browser, mobile, desktop or MetaTrader." dark>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {platforms.map((p) => (
            <Card key={p.name} className="border-border/60 bg-background/40 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[color:var(--gold)]/10 text-[color:var(--gold)]"><p.icon className="h-5 w-5" /></div>
                <div className="mt-4 text-base font-semibold">{p.name}</div>
                <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
                <Badge variant="outline" className="mt-4 border-border/60 text-xs">{p.tag}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Beyond trading — grow long-term wealth" kicker="Investments" desc="Managed portfolios, copy trading and advisory services for every stage of your journey.">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {investments.map((i) => (
            <Card key={i.title} className="border-border/60 bg-card/60">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><i.icon className="h-5 w-5" /></div>
                  <div className="text-lg font-semibold">{i.title}</div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{i.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Transparent account tiers" kicker="Pricing" desc="Choose the account that matches your ambition. Upgrade at any time." dark>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {pricing.map((p) => (
            <Card key={p.name} className={`relative border-border/60 bg-background/50 ${p.popular ? "ring-gold" : ""}`}>
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[color:var(--gold)] px-3 py-1 text-xs font-semibold text-[oklch(0.16_0.05_265)]">Most Popular</div>
              )}
              <CardContent className="p-6">
                <div className="text-sm font-medium text-muted-foreground">{p.name}</div>
                <div className="mt-2 text-3xl font-bold">{p.price}<span className="ml-1 text-sm font-normal text-muted-foreground">min</span></div>
                <ul className="mt-5 space-y-2.5 text-sm">
                  <Li>Spread from <b>{p.spread}</b></Li>
                  <Li>Commission <b>{p.commission}</b></Li>
                  <Li>Leverage up to <b>{p.leverage}</b></Li>
                  <Li>{p.support}</Li>
                </ul>
                <Button asChild className="mt-6 w-full" variant={p.popular ? "default" : "outline"}>
                  <Link href="/auth">Open account</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Trusted by professionals" kicker="Testimonials">
        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.name} className="border-border/60 bg-card/60">
              <CardContent className="p-6">
                <div className="flex gap-0.5 text-[color:var(--gold)]">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-foreground/90">&quot;{t.quote}&quot;</p>
                <div className="mt-5">
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Frequently asked questions" kicker="FAQ" dark>
        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map(([q, a], i) => (
              <AccordionItem key={i} value={`q-${i}`} className="border-border/60">
                <AccordionTrigger className="text-left">{q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Section>

      <section className="relative overflow-hidden py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <TrendingUp className="mx-auto h-10 w-10 text-[color:var(--gold)]" />
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Ready to trade the world&apos;s markets?</h2>
          <p className="mt-3 text-muted-foreground">Open a free demo in seconds or fund a live account and start trading in under 5 minutes.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button size="lg" asChild><Link href="/auth">Open Live Account</Link></Button>
            <Button size="lg" variant="outline" asChild><Link href="/auth">Try Demo</Link></Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function Section({ title, kicker, desc, children, dark }: { title: string; kicker: string; desc?: string; children: React.ReactNode; dark?: boolean }) {
  return (
    <section className={`${dark ? "gradient-navy" : "bg-background"} border-b border-border/60 py-16 sm:py-20`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-10 max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--gold)]">{kicker}</div>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
          {desc && <p className="mt-3 text-muted-foreground">{desc}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}
function Meta({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</div>
      <div className="mt-0.5 font-semibold">{v}</div>
    </div>
  );
}
function Li({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--gold)]" />
      <span className="text-foreground/90">{children}</span>
    </li>
  );
}
