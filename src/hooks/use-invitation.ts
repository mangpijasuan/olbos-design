"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateInvitationInput } from "@/validations/invitation";

async function fetchJson<T>(input: string, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error ?? "Request failed");
  return body;
}

export function useUpdateInvitation(eventId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateInvitationInput) =>
      fetchJson(`/api/events/${eventId}/invitation`, {
        method: "PATCH",
        body: JSON.stringify(input),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events", eventId] });
    },
  });
}
