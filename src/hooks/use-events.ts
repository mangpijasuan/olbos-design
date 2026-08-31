"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateEventInput, UpdateEventInput } from "@/validations/event";
import type { ThemeTokens } from "@/validations/theme";

export interface EventTypeRef {
  id: string;
  key: string;
  label: string;
  category: string;
}

export interface EventSummary {
  id: string;
  slug: string;
  title: string;
  eventType: EventTypeRef;
  status: string;
  visibility: string;
  startAt: string;
  endAt: string | null;
  venueName: string | null;
  venueAddress: string | null;
  _count?: { guests: number; media?: number };
}

export interface EventDetail extends EventSummary {
  invitation: {
    id: string;
    templateId: string;
    themeId: string;
    content: Record<string, unknown>;
    theme: Record<string, unknown>;
    musicUrl: string | null;
    template: { key: string; name: string; category: string };
    selectedTheme: { key: string; name: string; category: string; tokens: ThemeTokens };
  } | null;
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

export function useEvents() {
  return useQuery({
    queryKey: ["events"],
    queryFn: () => fetchJson<{ events: EventSummary[] }>("/api/events"),
  });
}

export function useEvent(id: string | undefined) {
  return useQuery({
    queryKey: ["events", id],
    queryFn: () => fetchJson<{ event: EventDetail }>(`/api/events/${id}`),
    enabled: Boolean(id),
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateEventInput) =>
      fetchJson<{ event: { id: string } }>("/api/events", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events"] }),
  });
}

export function useUpdateEvent(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateEventInput) =>
      fetchJson(`/api/events/${id}`, { method: "PATCH", body: JSON.stringify(input) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["events", id] });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => fetchJson(`/api/events/${id}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events"] }),
  });
}

export function useDuplicateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => fetchJson(`/api/events/${id}/duplicate`, { method: "POST" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events"] }),
  });
}

export function useSetEventPublished() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, publish }: { id: string; publish: boolean }) =>
      fetchJson(`/api/events/${id}/${publish ? "publish" : "unpublish"}`, { method: "POST" }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["events", variables.id] });
    },
  });
}
