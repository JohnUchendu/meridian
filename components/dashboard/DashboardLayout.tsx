"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  Bell, CreditCard, LayoutDashboard, LineChart,
  LogOut, PieChart, Settings, ShieldCheck, TrendingUp, Wallet, Menu,
  FileText, HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import type { ReactNode } from "react";
import { logoutAction } from "@/app/auth/actions";

const nav: { section: string; items: { to: string; label: string; icon: LucideIcon }[] }[] = [
  { section: "Overview", items: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/dashboard/trading", label: "Trading", icon: LineChart },
    { to: "/dashboard/portfolio", label: "Portfolio", icon: PieChart },
  ]},
  { section: "Finances", items: [
    { to: "/dashboard/wallet", label: "Wallet", icon: Wallet },
    { to: "/dashboard/deposit", label: "Deposit & Withdraw", icon: CreditCard },
  ]},
  { section: "Account", items: [
    { to: "/dashboard/kyc", label: "KYC Verification", icon: ShieldCheck },
    { to: "/dashboard/documents", label: "Documents", icon: FileText },
    { to: "/dashboard/notifications", label: "Notifications", icon: Bell },
    { to: "/dashboard/support", label: "Support", icon: HelpCircle },
    { to: "/dashboard/settings", label: "Settings", icon: Settings },
  ]},
];

export function DashboardLayout({ children, initials }: { children: ReactNode; initials: string }) {
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border/60 bg-sidebar lg:flex">
        <SidebarInner />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border/60 bg-background/70 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild><Button size="icon" variant="ghost" className="lg:hidden" aria-label="Open menu"><Menu className="h-5 w-5" /></Button></SheetTrigger>
              <SheetContent side="left" className="w-72 p-0 bg-sidebar"><SidebarInner /></SheetContent>
            </Sheet>
            <div className="text-sm text-muted-foreground">Client Portal</div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" asChild><Link href="/">Back to site</Link></Button>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary">{initials}</div>
          </div>
        </header>
        <div className="flex-1 p-4 sm:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}

function SidebarInner() {
  const pathname = usePathname();
  return (
    <div className="flex h-full flex-col">
      <Link href="/" className="flex items-center gap-2 border-b border-sidebar-border px-5 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-[oklch(0.86_0.13_88)] to-[oklch(0.62_0.14_82)] text-[oklch(0.16_0.05_265)]"><TrendingUp className="h-4 w-4" strokeWidth={2.75} /></div>
        <span className="font-bold text-sidebar-foreground">Meridian<span className="gold-gradient"> Capital</span></span>
      </Link>
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
        {nav.map((g) => (
          <div key={g.section}>
            <div className="px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{g.section}</div>
            <div className="mt-2 space-y-1">
              {g.items.map((i) => {
                const active = pathname === i.to || (i.to !== "/dashboard" && pathname.startsWith(i.to));
                return (
                  <Link key={i.to} href={i.to} className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"}`}>
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
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
