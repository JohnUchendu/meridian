"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, TrendingUp } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const nav = [
  { href: "/markets", label: "Markets" },
  { href: "/platforms", label: "Platforms" },
  { href: "/investments", label: "Investments" },
  { href: "/education", label: "Education" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-[oklch(0.86_0.13_88)] to-[oklch(0.62_0.14_82)] text-[oklch(0.16_0.05_265)]">
            <TrendingUp className="h-4 w-4" strokeWidth={2.75} />
          </div>
          <span className="text-base font-bold tracking-tight">
            Meridian<span className="gold-gradient"> Capital</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <Button variant="ghost" size="sm" asChild><Link href="/auth">Sign in</Link></Button>
          <Button size="sm" asChild className="bg-primary text-primary-foreground hover:opacity-90"><Link href="/auth">Open Account</Link></Button>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu"><Menu className="h-5 w-5" /></Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <div className="mt-8 flex flex-col gap-1">
              {nav.map((n) => (
                <Link key={n.href} href={n.href} className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">{n.label}</Link>
              ))}
              <div className="mt-4 flex flex-col gap-2">
                <Button variant="outline" asChild><Link href="/auth">Sign in</Link></Button>
                <Button asChild><Link href="/auth">Open Account</Link></Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
