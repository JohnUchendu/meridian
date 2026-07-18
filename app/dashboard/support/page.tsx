import { getCurrentUser } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { SupportForm } from "@/components/dashboard/SupportForm";

export default async function SupportPage() {
  const user = await getCurrentUser();

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Support</h1><p className="text-sm text-muted-foreground">Get help from our team, 24/7.</p></div>
      <div className="grid gap-4 sm:grid-cols-3">
        <ContactRow icon={Phone} title="+44 20 7946 0000" sub="24/7 phone support" />
        <ContactRow icon={Mail} title="support@meridiancapital.example" sub="Reply within 1 hour" />
        <ContactRow icon={MessageCircle} title="+44 7700 900123" sub="WhatsApp support" />
      </div>
      <Card className="border-border/60 bg-card/60">
        <CardContent className="p-6">
          <div className="font-semibold">Send a support ticket</div>
          <p className="mt-1 text-sm text-muted-foreground">Signed in as {user?.email as string}. A specialist will reply within 1 business day.</p>
          <div className="mt-4"><SupportForm /></div>
        </CardContent>
      </Card>
    </div>
  );
}

function ContactRow({ icon: Icon, title, sub }: { icon: React.ElementType; title: string; sub: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-card/60 p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[color:var(--gold)]/10 text-[color:var(--gold)]"><Icon className="h-5 w-5" /></div>
      <div>
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-xs text-muted-foreground">{sub}</div>
      </div>
    </div>
  );
}
