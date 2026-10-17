"use client";
import { useActionState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { updateUserAction, deleteUserAction, type EditUserState } from "@/app/admin/users/[id]/actions";

export function EditUserForm(props: {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  tier: string;
  kycStatus: string;
  balanceAvailable: number;
  balanceTrading: number;
  balanceBonus: number;
}) {
  const [state, formAction, pending] = useActionState<EditUserState, FormData>(updateUserAction, undefined);
  const [deletePending, startDelete] = useTransition();
  const router = useRouter();

  useEffect(() => {
    if (state?.success) toast.success("User updated");
    if (state?.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="userId" value={props.id} />

      <div>
        <div className="font-semibold">Profile</div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div><Label>First name</Label><Input name="firstName" defaultValue={props.firstName} required className="mt-2" /></div>
          <div><Label>Last name</Label><Input name="lastName" defaultValue={props.lastName} required className="mt-2" /></div>
          <div className="sm:col-span-2"><Label>Email</Label><Input name="email" type="email" defaultValue={props.email} required className="mt-2" /></div>
        </div>
      </div>

      <Separator />

      <div>
        <div className="font-semibold">Account status</div>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <div>
            <Label>Role</Label>
            <Select name="role" defaultValue={props.role}>
              <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="client">Client</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Tier</Label>
            <Select name="tier" defaultValue={props.tier}>
              <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Starter">Starter</SelectItem>
                <SelectItem value="Standard">Standard</SelectItem>
                <SelectItem value="Professional">Professional</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>KYC status</Label>
            <Select name="kycStatus" defaultValue={props.kycStatus}>
              <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Not Started">Not Started</SelectItem>
                <SelectItem value="In Review">In Review</SelectItem>
                <SelectItem value="Verified">Verified</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <div className="font-semibold">Balances</div>
        <p className="mt-1 text-xs text-muted-foreground">Directly edits the client&apos;s figures. Use carefully — this bypasses the deposit/withdrawal flow.</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <div><Label>Available</Label><Input name="balanceAvailable" type="number" step="0.01" defaultValue={props.balanceAvailable} required className="mt-2" /></div>
          <div><Label>Trading</Label><Input name="balanceTrading" type="number" step="0.01" defaultValue={props.balanceTrading} required className="mt-2" /></div>
          <div><Label>Bonus</Label><Input name="balanceBonus" type="number" step="0.01" defaultValue={props.balanceBonus} required className="mt-2" /></div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <Button
          type="button"
          variant="destructive"
          disabled={deletePending}
          onClick={() => {
            if (!confirm(`Delete ${props.firstName} ${props.lastName}? This cannot be undone.`)) return;
            startDelete(async () => {
              await deleteUserAction(props.id);
              toast.success("User deleted");
              router.push("/admin/users");
            });
          }}
        >
          {deletePending ? "Deleting..." : "Delete user"}
        </Button>
        <Button type="submit" disabled={pending}>{pending ? "Saving..." : "Save changes"}</Button>
      </div>
    </form>
  );
}
