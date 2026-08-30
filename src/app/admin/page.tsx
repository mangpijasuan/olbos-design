"use client";

import { Users, CalendarDays, Sparkles, CreditCard } from "lucide-react";
import { useAdminStats } from "@/hooks/use-admin";
import { StatTile } from "@/components/dashboard/stat-tile";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminOverviewPage() {
  const { data, isLoading } = useAdminStats();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Admin overview</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Platform-wide stats across all users and events.
      </p>

      {isLoading || !data ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatTile icon={Users} label="Users" value={data.users} accentClassName="text-primary" />
          <StatTile
            icon={CalendarDays}
            label="Events"
            value={data.events}
            accentClassName="text-champagne"
          />
          <StatTile
            icon={Sparkles}
            label="Published events"
            value={data.publishedEvents}
            accentClassName="text-emerald"
          />
          <StatTile
            icon={CreditCard}
            label="Active subscriptions"
            value={data.activeSubscriptions}
            accentClassName="text-emerald"
          />
        </div>
      )}
    </div>
  );
}
