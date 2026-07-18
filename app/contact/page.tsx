"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { submitContactAction, type ContactState } from "./actions";

const branches = [
  { city: "London", addr: "12 Threadneedle St, EC2R 8AY" },
  { city: "New York", addr: "500 5th Avenue, NY 10110" },
  { city: "Singapore", addr: "10 Marina Boulevard, 018983" },
  { city: "Dubai", addr: "DIFC Gate Village 4, 507" },
];

export default function ContactPage() {
  const [state, formAction, pending] = useActionState<ContactState, FormData>(submitContactAction, undefined);

  useEffect(() => {
    if (state?.success) toast.success("Message received", { description: "A support specialist will reply within 1 business day." });
    if (state?.error) toast.error(state.error);
  }, [state]);

  return (
    <SiteLayout>
      <section className="gradient-navy py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--gold)]">Contact</div>
          <h1 className="mt-2 text-4xl font-bold sm:text-5xl">Talk to our team</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">Multilingual support 24/7. Reach us by chat, phone, WhatsApp or the form below.</p>
        </div>
      </section>
      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-1">
            <ContactRow icon={Phone} title="+44 20 7946 0000" sub="24/7 phone support" />
            <ContactRow icon={Mail} title="support@meridiancapital.example" sub="Reply within 1 hour" />
            <ContactRow icon={MessageCircle} title="+44 7700 900123" sub="WhatsApp support" />
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {branches.map((b) => (
                <Card key={b.city} className="border-border/60 bg-card/60">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold"><MapPin className="h-4 w-4 text-[color:var(--gold)]" />{b.city}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{b.addr}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <Card className="border-border/60 bg-card/60 lg:col-span-2">
            <CardContent className="p-6">
              <form className="grid gap-4 sm:grid-cols-2" action={formAction}>
                <div><Label htmlFor="firstName">First name</Label><Input id="firstName" name="firstName" required className="mt-2" /></div>
                <div><Label htmlFor="lastName">Last name</Label><Input id="lastName" name="lastName" required className="mt-2" /></div>
                <div className="sm:col-span-2"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required className="mt-2" /></div>
                <div className="sm:col-span-2"><Label htmlFor="subject">Subject</Label><Input id="subject" name="subject" required className="mt-2" /></div>
                <div className="sm:col-span-2"><Label htmlFor="message">Message</Label><Textarea id="message" name="message" required className="mt-2" rows={5} /></div>
                <div className="sm:col-span-2"><Button type="submit" disabled={pending} className="w-full sm:w-auto">{pending ? "Sending..." : "Send message"}</Button></div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </SiteLayout>
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
