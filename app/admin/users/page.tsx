import { sql } from "@/db/client";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function AdminUsers() {
  const users = await sql`
    select id, first_name, last_name, email, tier, kyc_status, balance_available, balance_trading, created_at
    from users where role = 'client'
    order by created_at desc
    limit 100
  `;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Users</h1>
        <p className="text-sm text-muted-foreground">Manage clients, verification and account status. {users.length} total. Click a row to edit.</p>
      </div>
      <Card className="border-border/60 bg-card/60"><CardContent className="p-0">
        <div className="grid grid-cols-12 border-b border-border/60 px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          <div className="col-span-4">Client</div>
          <div className="col-span-2">Tier</div>
          <div className="col-span-2">KYC</div>
          <div className="col-span-4 text-right">Balance</div>
        </div>
        {users.length === 0 && <div className="px-5 py-8 text-center text-sm text-muted-foreground">No users yet.</div>}
        {users.map((u) => (
          <Link
            key={u.id as string}
            href={`/admin/users/${u.id}`}
            className="grid grid-cols-12 items-center border-b border-border/40 px-5 py-3 text-sm last:border-0 hover:bg-muted/40"
          >
            <div className="col-span-4">
              <div className="font-medium">{u.first_name as string} {u.last_name as string}</div>
              <div className="text-xs text-muted-foreground">{u.email as string}</div>
            </div>
            <div className="col-span-2">
              <Badge variant="outline" className="border-border/60">{u.tier as string}</Badge>
            </div>
            <div className="col-span-2">
              <Badge variant={u.kyc_status === "Verified" ? "outline" : "secondary"} className={u.kyc_status === "Verified" ? "border-success/40 text-success" : ""}>{u.kyc_status as string}</Badge>
            </div>
            <div className="col-span-4 text-right tabular-nums">
              ${(Number(u.balance_available) + Number(u.balance_trading)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          </Link>
        ))}
      </CardContent></Card>
    </div>
  );
}
