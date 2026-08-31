"use client";

import { useQuery } from "@tanstack/react-query";

export interface EventTypeOption {
  id: string;
  key: string;
  label: string;
  category: string;
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Request failed");
  return res.json();
}

export function useEventTypes() {
  return useQuery({
    queryKey: ["event-types"],
    queryFn: () => fetchJson<{ eventTypes: EventTypeOption[] }>("/api/event-types"),
    staleTime: 5 * 60 * 1000,
  });
}
