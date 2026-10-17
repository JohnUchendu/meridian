import { getCurrentUser } from "@/lib/auth";
import { sql } from "@/db/client";
import { Card, CardContent } from "@/components/ui/card";
import { Bell } from "lucide-react";

function formatDate(value: unknown) {
  const date = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleString();
}

export default async function NotificationsPage() {
  const user = await getCurrentUser();
  const notifications = user
    ? await sql`
        select title, message, created_at from notifications
        where user_id = ${user.id} or user_id is null
        order by created_at desc
        limit 50
      `
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Notifications</h1>
        <p className="text-sm text-muted-foreground">Messages from the Meridian Capital team.</p>
      </div>
      <Card className="border-border/60 bg-card/60">
        <CardContent className="p-0">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-5 py-12 text-center">
              <Bell className="h-6 w-6 text-muted-foreground" />
              <div className="text-sm font-medium">No notifications yet</div>
              <p className="text-xs text-muted-foreground">Updates from our team will appear here.</p>
            </div>
          ) : (
            notifications.map((n, i) => (
              <div key={i} className="flex items-start gap-3 border-b border-border/40 px-5 py-4 last:border-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[color:var(--gold)]/10 text-[color:var(--gold)]">
                  <Bell className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">{String(n.title)}</div>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">{String(n.message)}</p>
                  <div className="mt-1 text-xs text-muted-foreground/70">{formatDate(n.created_at)}</div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
