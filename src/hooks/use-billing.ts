"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import type { PlanTierKey } from "@/lib/plans";

interface BillingSummary {
  planTier: "FREE" | PlanTierKey;
  status: string | null;
  currentPeriodEnd: string | null;
}

export function useBillingSummary() {
  return useQuery({
    queryKey: ["billing", "summary"],
    queryFn: async () => {
      const res = await fetch("/api/billing/summary");
      if (!res.ok) throw new Error("Could not load billing info");
      return (await res.json()) as BillingSummary;
    },
  });
}

export function useCreateCheckout() {
  return useMutation({
    mutationFn: async (planTier: PlanTierKey) => {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planTier }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Could not start checkout");
      return body as { url: string };
    },
  });
}
