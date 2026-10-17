"use client";
import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { sendNotificationAction, type NotificationState } from "@/app/admin/notifications/actions";

export function NotificationComposer({
  clients,
}: {
  clients: { id: string; name: string; email: string }[];
}) {
  const [state, formAction, pending] = useActionState<NotificationState, FormData>(
    sendNotificationAction,
    undefined,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      toast.success("Notification sent");
      formRef.current?.reset();
    }
    if (state?.error) toast.error(state.error);
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="grid gap-3">
      <div>
        <Label htmlFor="audience">Recipients</Label>
        <select
          id="audience"
          name="audience"
          defaultValue="all"
          className="mt-2 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
        >
          <option value="all">All clients</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name} — {client.email}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" maxLength={120} required placeholder="e.g. Withdrawal window update" className="mt-2" />
      </div>
      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" maxLength={2000} required rows={4} placeholder="Write the message clients will see in their portal." className="mt-2" />
      </div>
      <div>
        <Button type="submit" disabled={pending}>
          {pending ? "Sending..." : "Send notification"}
        </Button>
      </div>
    </form>
  );
}
