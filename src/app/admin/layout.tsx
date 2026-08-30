import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { getServerSession } from "@/lib/get-session";
import { AdminSidebarNav } from "@/components/admin/admin-sidebar-nav";
import { UserMenu } from "@/components/dashboard/user-menu";

export const metadata: Metadata = { title: { default: "Admin", template: "%s · Admin" } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();
  if (!session?.user) redirect("/login");

  const isAdmin =
    session.user.platformRole === "ADMIN" || session.user.platformRole === "SUPER_ADMIN";
  if (!isAdmin) redirect("/dashboard");

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 border-r border-border/60 bg-card/40 lg:flex lg:flex-col">
        <div className="flex items-center gap-2 px-4 py-4">
          <ShieldCheck className="h-5 w-5 text-champagne" />
          <span className="font-display text-lg">Admin</span>
        </div>
        <AdminSidebarNav />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border/60 px-4 sm:px-6">
          <div className="lg:hidden font-display text-lg">Admin</div>
          <div className="hidden lg:block" />
          <UserMenu
            name={session.user.name}
            email={session.user.email}
            image={session.user.image}
          />
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
