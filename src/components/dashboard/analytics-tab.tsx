"use client";

import { Eye, QrCode, Users, CheckCircle2 } from "lucide-react";
import { useEventAnalytics } from "@/hooks/use-analytics";
import { StatTile } from "@/components/dashboard/stat-tile";
import { ViewsChart } from "@/components/dashboard/views-chart";
import { Skeleton } from "@/components/ui/skeleton";

export function AnalyticsTab({ eventId }: { eventId: string }) {
  const { data, isLoading } = useEventAnalytics(eventId);

  if (isLoading || !data) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile icon={Eye} label="Invitation views" value={data.views} accentClassName="text-primary" />
        <StatTile
          icon={Users}
          label="RSVP rate"
          value={`${data.rsvp.rate}%`}
          accentClassName="text-emerald"
        />
        <StatTile icon={QrCode} label="QR scans" value={data.qrScans} accentClassName="text-champagne" />
        <StatTile
          icon={CheckCircle2}
          label="Checked in"
          value={`${data.checkedIn} / ${data.guestsTotal}`}
          accentClassName="text-emerald"
        />
      </div>

      <div className="rounded-xl border border-border/60 bg-card p-5">
        <h3 className="font-display text-sm font-semibold">Views, last 14 days</h3>
        <div className="mt-4">
          <ViewsChart series={data.viewsSeries} />
        </div>
      </div>

      <div className="rounded-xl border border-border/60 bg-card p-5">
        <h3 className="font-display text-sm font-semibold">RSVP breakdown</h3>
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="font-display text-2xl font-semibold text-emerald">{data.rsvp.accepted}</p>
            <p className="text-xs text-muted-foreground">Accepted</p>
          </div>
          <div>
            <p className="font-display text-2xl font-semibold text-muted-foreground">{data.rsvp.maybe}</p>
            <p className="text-xs text-muted-foreground">Maybe</p>
          </div>
          <div>
            <p className="font-display text-2xl font-semibold text-destructive">{data.rsvp.declined}</p>
            <p className="text-xs text-muted-foreground">Declined</p>
          </div>
        </div>
      </div>
    </div>
  );
}
