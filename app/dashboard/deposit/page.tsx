import { getCurrentUser } from "@/lib/auth";
import { sql } from "@/db/client";
import { DepositForm } from "@/components/dashboard/DepositForm";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default async function DepositPage() {
  const user = await getCurrentUser();
  const history = user
    ? await sql`select type, amount, method, status, created_at from transactions where user_id = ${user.id} order by created_at desc limit 20`
    : [];

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Deposit & Withdraw</h1><p className="text-sm text-muted-foreground">Fund your account or request a withdrawal.</p></div>
      <Card className="border-border/60 bg-card/60">
        <CardContent className="p-5">
          <Tabs defaultValue="dep">
            <TabsList><TabsTrigger value="dep">Deposit</TabsTrigger><TabsTrigger value="wd">Withdraw</TabsTrigger><TabsTrigger value="hist">History</TabsTrigger></TabsList>
            <TabsContent value="dep" className="mt-4"><DepositForm type="Deposit" /></TabsContent>
            <TabsContent value="wd" className="mt-4"><DepositForm type="Withdrawal" /></TabsContent>
            <TabsContent value="hist" className="mt-4">
              <div className="rounded-lg border border-border/60">
                {history.length === 0 && <div className="p-4 text-sm text-muted-foreground">No transactions yet.</div>}
                {history.map((r, i) => (
                  <div key={i} className="grid grid-cols-4 items-center border-b border-border/40 px-4 py-3 text-sm last:border-0">
                    <div>{r.type as string}</div>
                    <div className="tabular-nums">{r.type === "Deposit" ? "+" : "-"}${Number(r.amount).toFixed(2)}</div>
                    <div className="text-muted-foreground">{r.method as string}</div>
                    <div><Badge variant={r.status === "Completed" ? "outline" : "secondary"}>{r.status as string}</Badge></div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
