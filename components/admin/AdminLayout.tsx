"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3, CheckSquare, LayoutDashboard, LogOut, Menu,
  Settings, ShieldCheck, TrendingUp, Users, Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import type { ReactNode } from "react";
import { logoutAction } from "@/app/auth/actions";

const nav: { section: string; items: { to: string; label: string; icon: LucideIcon }[] }[] = [
  { section: "Overview", items: [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  ]},
  { section: "Operations", items: [
    { to: "/admin/users", label: "Users", icon: Users },
    { to: "/admin/deposits", label: "Deposits & Withdrawals", icon: Wallet },
    { to: "/admin/kyc", label: "KYC Review", icon: ShieldCheck },
  ]},
  { section: "System", items: [
    { to: "/admin/settings", label: "Settings", icon: Settings },
  ]},
];

export function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border/60 bg-sidebar lg:flex">
        <Inner />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border/60 bg-background/70 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-2">
            <Sheet><SheetTrigger asChild><Button size="icon" variant="ghost" className="lg:hidden"><Menu className="h-5 w-5" /></Button></SheetTrigger>
              <SheetContent side="left" className="w-72 p-0 bg-sidebar"><Inner /></SheetContent>
            </Sheet>
            <Badge variant="outline" className="border-[color:var(--gold)]/40 text-[color:var(--gold)]">Admin Console</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" asChild><Link href="/dashboard">Client view</Link></Button>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary">AD</div>
          </div>
        </header>
        <div className="flex-1 p-4 sm:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}

function Inner() {
  const pathname = usePathname();
  return (
    <div className="flex h-full flex-col">
      <Link href="/" className="flex items-center gap-2 border-b border-sidebar-border px-5 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-[oklch(0.86_0.13_88)] to-[oklch(0.62_0.14_82)] text-[oklch(0.16_0.05_265)]"><TrendingUp className="h-4 w-4" strokeWidth={2.75} /></div>
        <span className="font-bold text-sidebar-foreground">Meridian<span className="gold-gradient"> Admin</span></span>
      </Link>
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
        {nav.map((g) => (
          <div key={g.section}>
            <div className="px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{g.section}</div>
            <div className="mt-2 space-y-1">
              {g.items.map((i) => {
                const active = pathname === i.to || (i.to !== "/admin" && pathname.startsWith(i.to));
                return (
                  <Link key={i.to} href={i.to} className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"}`}>
                    <i.icon className={`h-4 w-4 ${active ? "text-[color:var(--gold)]" : ""}`} />{i.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="border-t border-sidebar-border p-3">
        <form action={logoutAction}>
          <button type="submit" className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent/50">
            <LogOut className="h-4 w-4" />Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
