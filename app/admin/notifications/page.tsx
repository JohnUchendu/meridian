import { sql } from "@/db/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NotificationComposer } from "@/components/admin/NotificationComposer";
import { Bell } from "lucide-react";

function formatDate(value: unknown) {
  const date = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleString();
}

export default async function AdminNotifications() {
  const [notifications, clients] = await Promise.all([
    sql`
      select n.id, n.title, n.message, n.created_at, u.first_name, u.last_name, u.email
      from notifications n
      left join users u on u.id = n.user_id
      order by n.created_at desc
      limit 50
    `,
    sql`select id, first_name, last_name, email from users where role = 'client' order by first_name asc limit 200`,
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Notifications</h1>
        <p className="text-sm text-muted-foreground">Send a message to every client or a single account. Clients see it in their portal.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,420px)_1fr]">
        <Card className="border-border/60 bg-card/60">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Bell className="h-4 w-4 text-[color:var(--gold)]" /> New notification
            </div>
            <div className="mt-4">
              <NotificationComposer
                clients={clients.map((client) => ({
                  id: String(client.id),
                  name: `${String(client.first_name)} ${String(client.last_name)}`,
                  email: String(client.email),
                }))}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60">
          <CardContent className="p-0">
            <div className="border-b border-border/60 px-5 py-4 text-sm font-semibold">Sent notifications</div>
            {notifications.length === 0 && (
              <div className="px-5 py-8 text-center text-sm text-muted-foreground">Nothing sent yet.</div>
            )}
            {notifications.map((n) => {
              const recipient = n.first_name
                ? `${String(n.first_name)} ${String(n.last_name)}`
                : "All clients";
              return (
                <div key={String(n.id)} className="border-b border-border/40 px-5 py-4 last:border-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-sm font-medium">{String(n.title)}</div>
                    <Badge variant="outline" className="border-border/60 text-[11px]">{recipient}</Badge>
                  </div>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">{String(n.message)}</p>
                  <div className="mt-1 text-[11px] text-muted-foreground/70">{formatDate(n.created_at)}</div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
