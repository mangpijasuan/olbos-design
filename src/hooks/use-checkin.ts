"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

async function fetchJson<T>(input: string, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error ?? "Request failed");
  return body;
}

export function useCheckInStats(eventId: string) {
  return useQuery({
    queryKey: ["events", eventId, "checkin-stats"],
    queryFn: () => fetchJson<{ total: number; checkedIn: number }>(`/api/events/${eventId}/checkin/stats`),
    refetchInterval: 4000,
  });
}

export function useScanCheckIn(eventId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (token: string) =>
      fetchJson<{ guestName: string; alreadyCheckedIn: boolean }>(
        `/api/events/${eventId}/checkin/scan`,
        { method: "POST", body: JSON.stringify({ token }) },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events", eventId, "checkin-stats"] });
      queryClient.invalidateQueries({ queryKey: ["events", eventId, "guests"] });
    },
  });
}

export function useManualCheckIn(eventId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (guestId: string) =>
      fetchJson<{ guestName: string; alreadyCheckedIn: boolean }>(
        `/api/events/${eventId}/checkin/manual`,
        { method: "POST", body: JSON.stringify({ guestId }) },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events", eventId, "checkin-stats"] });
      queryClient.invalidateQueries({ queryKey: ["events", eventId, "guests"] });
    },
  });
}
