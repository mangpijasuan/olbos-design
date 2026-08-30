"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { PLANS } from "@/lib/plans";
import { titleCase } from "@/lib/format";
import { useBillingSummary, useCreateCheckout } from "@/hooks/use-billing";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function BillingPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: summary, isLoading } = useBillingSummary();
  const checkout = useCreateCheckout();

  useEffect(() => {
    if (searchParams.get("success")) {
      toast.success("Subscription updated — thank you!");
      router.replace("/dashboard/billing");
    } else if (searchParams.get("canceled")) {
      toast.info("Checkout canceled — no changes were made.");
      router.replace("/dashboard/billing");
    }
  }, [searchParams, router]);

  async function handleUpgrade(planTier: (typeof PLANS)[number]["tier"]) {
    try {
      const { url } = await checkout.mutateAsync(planTier);
      window.location.href = url;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not start checkout");
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Billing</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage your Olbos Event subscription.</p>

      <div className="mt-6 rounded-xl border border-border/60 bg-card p-5">
        {isLoading ? (
          <Skeleton className="h-6 w-40" />
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Current plan</span>
            <Badge>{titleCase(summary?.planTier ?? "FREE")}</Badge>
            {summary?.status && (
              <span className="text-xs text-muted-foreground">({titleCase(summary.status)})</span>
            )}
          </div>
        )}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {PLANS.map((plan) => {
          const isCurrent = summary?.planTier === plan.tier;
          return (
            <div
              key={plan.tier}
              className={cn(
                "flex flex-col rounded-2xl border p-6",
                plan.featured ? "border-champagne" : "border-border/60",
              )}
            >
              <h3 className="font-display text-lg font-semibold">{plan.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-display text-3xl font-semibold">${plan.priceMonthly}</span>
                <span className="text-sm text-muted-foreground">/ month</span>
              </div>
              <ul className="mt-4 flex-1 space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                className="mt-6"
                variant={isCurrent ? "outline" : "default"}
                disabled={isCurrent || checkout.isPending}
                onClick={() => handleUpgrade(plan.tier)}
              >
                {isCurrent ? "Current plan" : `Choose ${plan.name}`}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
