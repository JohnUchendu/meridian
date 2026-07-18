import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

export const metadata = { title: "Dashboard — Meridian Capital" };

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth");

  const initials = `${(user.first_name as string)[0] ?? ""}${(user.last_name as string)[0] ?? ""}`.toUpperCase();

  return <DashboardLayout initials={initials}>{children}</DashboardLayout>;
}
