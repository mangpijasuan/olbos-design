"use client";

import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEvent } from "@/hooks/use-events";
import { EventOverview } from "@/components/dashboard/event-overview";
import { InvitationBuilder } from "@/components/dashboard/invitation-builder";
import { GuestsTab } from "@/components/dashboard/guests-tab";
import { AnalyticsTab } from "@/components/dashboard/analytics-tab";

export default function EventDetailPage() {
  const params = useParams<{ id: string }>();
  const { data, isLoading, isError } = useEvent(params.id);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !data) {
    return <p className="text-sm text-destructive">Could not load this event.</p>;
  }

  const { event } = data;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">{event.title}</h1>

      <Tabs defaultValue="overview" className="mt-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="invitation">Invitation</TabsTrigger>
          <TabsTrigger value="guests">Guests</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-6">
          <EventOverview event={event} />
        </TabsContent>
        <TabsContent value="invitation" className="mt-6">
          <InvitationBuilder event={event} />
        </TabsContent>
        <TabsContent value="guests" className="mt-6">
          <GuestsTab eventId={event.id} />
        </TabsContent>
        <TabsContent value="analytics" className="mt-6">
          <AnalyticsTab eventId={event.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
