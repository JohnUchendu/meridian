"use client";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { submitSupportTicketAction, type SupportState } from "@/app/dashboard/support/actions";

export function SupportForm() {
  const [state, formAction, pending] = useActionState<SupportState, FormData>(submitSupportTicketAction, undefined);

  useEffect(() => {
    if (state?.success) toast.success("Ticket submitted", { description: "We'll reply within 1 business day." });
    if (state?.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction} className="space-y-4">
      <div><Label htmlFor="subject">Subject</Label><Input id="subject" name="subject" required className="mt-2" /></div>
      <div><Label htmlFor="message">Message</Label><Textarea id="message" name="message" required rows={5} className="mt-2" /></div>
      <Button type="submit" disabled={pending}>{pending ? "Sending..." : "Submit ticket"}</Button>
    </form>
  );
}
