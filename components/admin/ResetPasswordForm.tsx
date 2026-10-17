"use client";
import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetUserPasswordAction, type ResetPasswordState } from "@/app/admin/users/[id]/actions";

export function ResetPasswordForm({ userId, userName }: { userId: string; userName: string }) {
  const [state, formAction, pending] = useActionState<ResetPasswordState, FormData>(
    resetUserPasswordAction,
    undefined,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      toast.success(`Password reset for ${userName}`);
      formRef.current?.reset();
    }
    if (state?.error) toast.error(state.error);
  }, [state, userName]);

  return (
    <form ref={formRef} action={formAction} className="mt-4 grid gap-3 sm:max-w-md">
      <input type="hidden" name="userId" value={userId} />
      <div>
        <Label htmlFor="new-password">New password</Label>
        <Input
          id="new-password"
          name="password"
          type="password"
          minLength={8}
          maxLength={72}
          autoComplete="new-password"
          required
          className="mt-2"
        />
      </div>
      <div>
        <Label htmlFor="confirm-password">Confirm new password</Label>
        <Input
          id="confirm-password"
          name="confirm"
          type="password"
          minLength={8}
          maxLength={72}
          autoComplete="new-password"
          required
          className="mt-2"
        />
      </div>
      <div>
        <Button type="submit" disabled={pending}>{pending ? "Resetting..." : "Reset password"}</Button>
      </div>
      <p className="text-[11px] text-muted-foreground">
        Works for client and admin accounts. Share the new password with {userName} through a secure channel.
      </p>
    </form>
  );
}
