"use client";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateProfileAction, type SettingsState } from "@/app/dashboard/settings/actions";

export function ProfileForm({ firstName, lastName, email }: { firstName: string; lastName: string; email: string }) {
  const [state, formAction, pending] = useActionState<SettingsState, FormData>(updateProfileAction, undefined);

  useEffect(() => {
    if (state?.success) toast.success("Profile updated");
    if (state?.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label>First name</Label><Input name="firstName" defaultValue={firstName} required className="mt-2" /></div>
        <div><Label>Last name</Label><Input name="lastName" defaultValue={lastName} required className="mt-2" /></div>
        <div className="sm:col-span-2"><Label>Email</Label><Input name="email" type="email" defaultValue={email} required className="mt-2" /></div>
      </div>
      <Button type="submit" disabled={pending}>{pending ? "Saving..." : "Save changes"}</Button>
    </form>
  );
}
