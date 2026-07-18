import type { Metadata } from "next";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, CalendarDays, GraduationCap, Newspaper, PlayCircle, Radio } from "lucide-react";

export const metadata: Metadata = {
  title: "Education — Trading Academy & Market Analysis | Meridian Capital",
  description: "Learn to trade with our Academy, webinars, market analysis and economic calendar.",
  openGraph: { title: "Meridian Capital Education", description: "From beginner guides to professional strategies." },
};

const items = [
  { icon: GraduationCap, title: "Trading Academy", desc: "Structured lessons from beginner to advanced across every asset class." },
  { icon: Radio, title: "Live Webinars", desc: "Weekly sessions with senior analysts covering strategy and market outlook." },
  { icon: Newspaper, title: "Market Analysis", desc: "Daily technical and fundamental analysis from our research desk." },
  { icon: CalendarDays, title: "Economic Calendar", desc: "Track high-impact releases, central-bank decisions and earnings globally." },
  { icon: BookOpen, title: "Beginner Guides", desc: "Learn the fundamentals of Forex, CFDs, risk management and psychology." },
  { icon: PlayCircle, title: "Video Tutorials", desc: "On-demand videos walking through every feature of our platform." },
];

export default function Page() {
  return (
    <SiteLayout>
      <section className="gradient-navy py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--gold)]">Education</div>
          <h1 className="mt-2 text-4xl font-bold sm:text-5xl">Sharpen your edge</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">Free education from working traders, analysts and portfolio managers.</p>
        </div>
      </section>
      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((i) => (
            <Card key={i.title} className="border-border/60 bg-card/60 transition hover:-translate-y-0.5 hover:border-[color:var(--gold)]/40">
              <CardContent className="p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[color:var(--gold)]/10 text-[color:var(--gold)]"><i.icon className="h-5 w-5" /></div>
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
