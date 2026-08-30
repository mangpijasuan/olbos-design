"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, CalendarDays, CreditCard, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/dashboard", label: "Events", icon: CalendarDays, exact: true },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/admin", label: "Admin", icon: ShieldCheck, adminOnly: true },
];

export function SidebarNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 p-3">
      {LINKS.filter((l) => !l.adminOnly || isAdmin).map((link) => {
        const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function SidebarBrand() {
  return (
    <div className="flex items-center gap-2 px-4 py-4">
      <LayoutGrid className="h-5 w-5 text-champagne" />
      <span className="font-display text-lg">Dashboard</span>
    </div>
  );
}
