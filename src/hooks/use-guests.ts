"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateGuestInput } from "@/validations/guest";

export interface GuestRow {
  id: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  tag: string;
  maxPlusOnes: number;
  qrToken: string;
  invitationStatus: string;
  createdAt: string;
  rsvp: {
    status: string;
    plusOneCount: number;
    mealPreference: string | null;
    dietaryRestrictions: string | null;
  } | null;
  checkIn: { checkedInAt: string } | null;
}

async function fetchJson<T>(input: string, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error ?? "Request failed");
  return body;
}

export function useGuests(eventId: string) {
  return useQuery({
    queryKey: ["events", eventId, "guests"],
    queryFn: () => fetchJson<{ guests: GuestRow[] }>(`/api/events/${eventId}/guests`),
  });
}

export function useCreateGuest(eventId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateGuestInput) =>
      fetchJson(`/api/events/${eventId}/guests`, {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events", eventId, "guests"] }),
  });
}

export function useDeleteGuest(eventId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (guestId: string) =>
      fetchJson(`/api/events/${eventId}/guests/${guestId}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events", eventId, "guests"] }),
  });
}

export function useImportGuests(eventId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (guests: { fullName: string; email?: string; phone?: string }[]) =>
      fetchJson<{ count: number }>(`/api/events/${eventId}/guests/import`, {
        method: "POST",
        body: JSON.stringify({ guests }),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events", eventId, "guests"] }),
  });
}
