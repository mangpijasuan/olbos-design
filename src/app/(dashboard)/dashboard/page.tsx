"use client";

import Link from "next/link";
import { Plus, CalendarX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useEvents } from "@/hooks/use-events";
import { EventCard } from "@/components/dashboard/event-card";

export default function DashboardPage() {
  const { data, isLoading, isError } = useEvents();

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold">Your events</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create, edit, and publish your events from here.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/events/new">
            <Plus className="h-4 w-4" />
            New event
          </Link>
        </Button>
      </div>

      <div className="mt-8">
        {isLoading && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        )}

        {isError && (
          <p className="text-sm text-destructive">Could not load your events. Try refreshing.</p>
        )}

        {data && data.events.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20 text-center">
            <CalendarX className="h-10 w-10 text-muted-foreground" />
            <h3 className="mt-4 font-display text-lg font-semibold">No events yet</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Create your first event to start building a beautiful digital invitation.
            </p>
            <Button asChild className="mt-6">
              <Link href="/dashboard/events/new">
                <Plus className="h-4 w-4" />
                Create your first event
              </Link>
            </Button>
          </div>
        )}

        {data && data.events.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
