import { getCurrentUser } from "@/lib/auth";
import { sql } from "@/db/client";
import { getDepositSettings } from "@/lib/settings";
import { DepositForm } from "@/components/dashboard/DepositForm";
import { DepositQrPanel } from "@/components/dashboard/DepositQrPanel";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

function statusVariant(status: string) {
  return status === "Successful" ? "outline" : "secondary";
}

export default async function DepositPage() {
  const user = await getCurrentUser();
  const [history, settings] = await Promise.all([
    user
      ? sql`select type, amount, method, reference, status, created_at from transactions where user_id = ${user.id} order by created_at desc limit 20`
      : Promise.resolve([]),
    getDepositSettings(),
  ]);

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Deposit & Withdraw</h1><p className="text-sm text-muted-foreground">Fund your account by QR code, or request a withdrawal.</p></div>
      <Card className="border-border/60 bg-card/60">
        <CardContent className="p-5">
          <Tabs defaultValue="dep">
            <TabsList><TabsTrigger value="dep">Deposit</TabsTrigger><TabsTrigger value="wd">Withdraw</TabsTrigger><TabsTrigger value="hist">History</TabsTrigger></TabsList>

            <TabsContent value="dep" className="mt-4">
              <div className="grid gap-6 lg:grid-cols-2">
                <DepositQrPanel qrImage={settings.qrImage} address={settings.address} instructions={settings.instructions} />
                <div>
                  <h3 className="text-base font-semibold">Confirm your deposit</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    After sending the payment, enter the amount and an optional reference so it can be matched to your deposit.
                  </p>
                  <div className="mt-4">
                    <DepositForm type="Deposit" />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="wd" className="mt-4">
              <div className="grid gap-6 lg:grid-cols-2">
                <div>
                  <h3 className="text-base font-semibold">Request a withdrawal</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Choose how you want to be paid and enter the amount.
                  </p>
                  <div className="mt-4">
                    <DepositForm type="Withdrawal" />
                  </div>
                </div>
                <div className="rounded-xl border border-border/60 bg-background/40 p-5">
                  <div className="text-sm font-semibold">Payout details</div>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    <li>• Bank wires typically settle in 1–2 business days.</li>
                    <li>• Crypto payouts are sent to the wallet address on file.</li>
                    <li>• Track every request under History.</li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="hist" className="mt-4">
              <div className="rounded-lg border border-border/60">
                {history.length === 0 && <div className="p-4 text-sm text-muted-foreground">No transactions yet.</div>}
                {history.map((r, i) => {
                  const isDeposit = r.type === "Deposit";
                  return (
                    <div key={i} className="grid grid-cols-12 items-center gap-2 border-b border-border/40 px-4 py-3 text-sm last:border-0">
                      <div className="col-span-3 flex items-center gap-2">
                        {isDeposit ? <ArrowDownLeft className="h-4 w-4 text-success" /> : <ArrowUpRight className="h-4 w-4 text-[color:var(--gold)]" />}
                        {r.type as string}
                      </div>
                      <div className="col-span-3 tabular-nums">{isDeposit ? "+" : "-"}${Number(r.amount).toFixed(2)}</div>
                      <div className="col-span-3 text-muted-foreground">
                        {r.method as string}
                        {r.reference ? <div className="truncate text-[11px] text-muted-foreground/70">{r.reference as string}</div> : null}
                      </div>
                      <div className="col-span-3 text-right"><Badge variant={statusVariant(r.status as string)}>{r.status as string}</Badge></div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
