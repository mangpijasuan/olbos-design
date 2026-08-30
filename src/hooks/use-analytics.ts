"use client";

import { useQuery } from "@tanstack/react-query";

export interface EventAnalytics {
  views: number;
  qrScans: number;
  shareClicks: number;
  guestsTotal: number;
  rsvp: { accepted: number; declined: number; maybe: number; total: number; rate: number };
  checkedIn: number;
  viewsSeries: { date: string; views: number }[];
}

export function useEventAnalytics(eventId: string) {
  return useQuery({
    queryKey: ["events", eventId, "analytics"],
    queryFn: async () => {
      const res = await fetch(`/api/events/${eventId}/analytics`);
      if (!res.ok) throw new Error("Could not load analytics");
      return (await res.json()) as EventAnalytics;
    },
    refetchInterval: 15000,
  });
}
