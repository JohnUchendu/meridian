import Link from "next/link";
import { TrendingUp } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-[oklch(0.86_0.13_88)] to-[oklch(0.62_0.14_82)] text-[oklch(0.16_0.05_265)]">
                <TrendingUp className="h-4 w-4" strokeWidth={2.75} />
              </div>
              <span className="font-bold">Meridian<span className="gold-gradient"> Capital</span></span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              A premium investment platform offering global markets and professionally managed portfolios with institutional-grade execution.
            </p>
            <p className="mt-4 text-xs text-muted-foreground/70">
              Investing involves risk, including the possible loss of principal. Past performance is not indicative of future results.
            </p>
          </div>
          <FooterCol title="Markets" links={[["/markets","Forex"],["/markets","Commodities"],["/markets","Stocks"],["/markets","Crypto CFDs"],["/markets","Indices"]]} />
          <FooterCol title="Company" links={[["/about","About"],["/investments","Investments"],["/pricing","Pricing"],["/contact","Contact"]]} />
          <FooterCol title="Legal" links={[["/","Terms"],["/","Privacy"],["/","Risk Disclosure"],["/","Regulation"]]} />
        </div>
        <div className="mt-10 border-t border-border/60 pt-6 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} Meridian Capital Ltd. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}
function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</div>
      <ul className="mt-4 space-y-2 text-sm">
        {links.map(([href, label], i) => (
          <li key={i}><Link href={href} className="text-foreground/80 hover:text-foreground">{label}</Link></li>
        ))}
      </ul>
    </div>
  );
}
