import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { AdminLayout } from "@/components/admin/AdminLayout";

export const metadata = { title: "Admin — Meridian Capital" };

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth");
  if (user.role !== "admin") redirect("/dashboard");

  return <AdminLayout>{children}</AdminLayout>;
}
