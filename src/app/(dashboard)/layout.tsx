import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/get-session";
import { Logo } from "@/components/logo";
import { SidebarBrand, SidebarNav } from "@/components/dashboard/sidebar-nav";
import { UserMenu } from "@/components/dashboard/user-menu";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();
  if (!session?.user) redirect("/login");

  const isAdmin =
    session.user.platformRole === "ADMIN" || session.user.platformRole === "SUPER_ADMIN";

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 border-r border-border/60 bg-card/40 lg:flex lg:flex-col">
        <SidebarBrand />
        <SidebarNav isAdmin={isAdmin} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border/60 px-4 sm:px-6">
          <div className="lg:hidden">
            <Logo />
          </div>
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
