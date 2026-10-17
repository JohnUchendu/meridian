import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { sql } from "@/db/client";

type Activity = {
  name: string;
  type: "Deposit" | "Withdrawal";
  amount: number;
};

// Shown while the platform is new and there are no completed transactions yet.
const recentActivityFallback: Activity[] = [
  { name: "Michael R.", type: "Deposit", amount: 2500 },
  { name: "Sarah K.", type: "Withdrawal", amount: 800 },
  { name: "David O.", type: "Deposit", amount: 5000 },
  { name: "Amara T.", type: "Deposit", amount: 1200 },
  { name: "James L.", type: "Withdrawal", amount: 350 },
  { name: "Priya S.", type: "Deposit", amount: 15000 },
  { name: "Daniel M.", type: "Withdrawal", amount: 900 },
  { name: "Fatima A.", type: "Deposit", amount: 3000 },
  { name: "Lucas B.", type: "Withdrawal", amount: 750 },
  { name: "Elena V.", type: "Deposit", amount: 2400 },
  { name: "Noah W.", type: "Withdrawal", amount: 1200 },
  { name: "Grace N.", type: "Deposit", amount: 6500 },
];

async function getRecentActivity(): Promise<Activity[]> {
  try {
    const rows = await sql`
      select u.first_name, u.last_name, t.type, t.amount
      from transactions t
      join users u on u.id = t.user_id
      where t.status = 'Successful'
      order by t.created_at desc
      limit 12
    `;
    if (rows.length === 0) return recentActivityFallback;

    return rows.map((row) => {
      const first = String(row.first_name ?? "").trim();
      const last = String(row.last_name ?? "").trim();
      const initial = last ? ` ${last.charAt(0).toUpperCase()}.` : "";
      const type = row.type === "Withdrawal" ? "Withdrawal" : "Deposit";
      return {
        name: `${first}${initial}`.trim() || "A client",
        type,
        amount: Number(row.amount),
      };
    });
  } catch (error) {
    console.error("ticker activity query failed", error);
    return recentActivityFallback;
  }
}

function formatAmount(amount: number) {
  return `$${amount.toLocaleString("en-US", {
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

export async function Ticker() {
  const activity = await getRecentActivity();
  const row = [...activity, ...activity];

  return (
    <div className="relative overflow-hidden border-y border-border/60 bg-background/40 backdrop-blur-sm">
      <div className="absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />
      <div className="flex animate-ticker gap-10 whitespace-nowrap py-3">
        {row.map((item, index) => {
          const isDeposit = item.type === "Deposit";
          return (
            <div key={`${item.name}-${index}`} className="flex items-center gap-2 text-sm">
              <span
                className={`inline-flex h-5 w-5 items-center justify-center rounded-full ${
                  isDeposit ? "bg-success/10 text-success" : "bg-[color:var(--gold)]/10 text-[color:var(--gold)]"
                }`}
              >
                {isDeposit ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownLeft className="h-3 w-3" />}
              </span>
              <span className="font-medium">{item.name}</span>
              <span className="text-muted-foreground">{isDeposit ? "deposited" : "withdrew"}</span>
              <span className={`font-semibold tabular-nums ${isDeposit ? "text-success" : "text-[color:var(--gold)]"}`}>
                {formatAmount(item.amount)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
