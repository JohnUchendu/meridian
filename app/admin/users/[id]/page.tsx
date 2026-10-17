import { notFound } from "next/navigation";
import { sql } from "@/db/client";
import { Card, CardContent } from "@/components/ui/card";
import { EditUserForm } from "@/components/admin/EditUserForm";
import { ResetPasswordForm } from "@/components/admin/ResetPasswordForm";

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rows = await sql`
    select id, first_name, last_name, email, role, tier, kyc_status,
           balance_available, balance_trading, balance_bonus, created_at
    from users where id = ${id}
  `;
  const user = rows[0];
  if (!user) notFound();

  const txCount = await sql`select count(*)::int as count from transactions where user_id = ${id}`;
  const transactionCount = Number(txCount[0]?.count ?? 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{user.first_name as string} {user.last_name as string}</h1>
        <p className="text-sm text-muted-foreground">
          {user.email as string} · Joined {new Date(user.created_at as string).toLocaleDateString()} · {transactionCount} transactions
        </p>
      </div>
      <Card className="border-border/60 bg-card/60">
        <CardContent className="p-5">
          <EditUserForm
            id={user.id as string}
            firstName={user.first_name as string}
            lastName={user.last_name as string}
            email={user.email as string}
            role={user.role as string}
            tier={user.tier as string}
            kycStatus={user.kyc_status as string}
            balanceAvailable={Number(user.balance_available)}
            balanceTrading={Number(user.balance_trading)}
            balanceBonus={Number(user.balance_bonus)}
          />
        </CardContent>
      </Card>
      <Card className="border-border/60 bg-card/60">
        <CardContent className="p-5">
          <div className="font-semibold">Reset password</div>
          <p className="mt-1 text-xs text-muted-foreground">
            Set a new password for this account. The current password stops working immediately.
          </p>
          <ResetPasswordForm
            userId={user.id as string}
            userName={`${user.first_name as string} ${user.last_name as string}`.trim()}
          />
        </CardContent>
      </Card>
    </div>
  );
}
