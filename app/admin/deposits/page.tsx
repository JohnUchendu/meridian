import { sql } from "@/db/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TransactionRowActions } from "@/components/admin/TransactionRowActions";

export default async function DW() {
  const rows = await sql`
    select t.id, u.first_name, u.last_name, t.type, t.amount, t.method, t.status, t.created_at
    from transactions t
    join users u on u.id = t.user_id
    order by t.created_at desc
    limit 100
  `;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Deposits & Withdrawals</h1><p className="text-sm text-muted-foreground">Approve, reject or reconcile client transactions.</p></div>
      <Card className="border-border/60 bg-card/60"><CardContent className="p-0">
        <div className="grid grid-cols-12 border-b border-border/60 px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          <div className="col-span-3">Client</div><div className="col-span-2">Type</div><div className="col-span-2">Amount</div><div className="col-span-2">Method</div><div className="col-span-1">Status</div><div className="col-span-2 text-right">Action</div>
        </div>
        {rows.length === 0 && <div className="px-5 py-8 text-center text-sm text-muted-foreground">No transactions yet.</div>}
        {rows.map((r) => {
          const isDeposit = r.type === "Deposit";
          return (
            <div key={r.id as string} className="grid grid-cols-12 items-center border-b border-border/40 px-5 py-3 text-sm last:border-0">
              <div className="col-span-3">{r.first_name as string} {r.last_name as string}</div>
              <div className="col-span-2">{r.type as string}</div>
              <div className={`col-span-2 tabular-nums ${isDeposit ? "text-success" : "text-destructive"}`}>{isDeposit ? "+" : "-"}${Number(r.amount).toFixed(2)}</div>
              <div className="col-span-2 text-muted-foreground">{r.method as string}</div>
              <div className="col-span-1"><Badge variant={r.status === "Completed" ? "outline" : "secondary"} className={r.status === "Completed" ? "border-success/40 text-success" : ""}>{r.status as string}</Badge></div>
              <div className="col-span-2 flex justify-end gap-2">
                {r.status === "Pending" ? <TransactionRowActions txId={r.id as string} /> : <span className="text-xs text-muted-foreground">—</span>}
              </div>
            </div>
          );
        })}
      </CardContent></Card>
    </div>
  );
}
