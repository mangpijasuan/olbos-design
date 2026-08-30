import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PLANS } from "@/lib/plans";

export function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-medium tracking-widest text-champagne uppercase">
          Pricing
        </span>
        <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
          Simple pricing, no surprises
        </h2>
        <p className="mt-4 text-muted-foreground">
          Start free while you plan. Upgrade whenever you&apos;re ready to publish.
        </p>
      </div>

      <div className="mt-14 grid gap-8 lg:grid-cols-3">
        {PLANS.map((plan) => (
          <div
            key={plan.tier}
            className={cn(
              "relative flex flex-col rounded-2xl border p-8",
              plan.featured
                ? "border-champagne bg-gradient-to-b from-champagne/10 to-transparent shadow-lg shadow-champagne/10"
                : "border-border/60 bg-card",
            )}
          >
            {plan.featured && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                Most popular
              </span>
            )}
            <h3 className="font-display text-xl font-semibold">{plan.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
            <div className="mt-6 flex items-baseline gap-1">
              <span className="font-display text-4xl font-semibold">${plan.priceMonthly}</span>
              <span className="text-sm text-muted-foreground">/ month</span>
            </div>
            <ul className="mt-6 flex-1 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              asChild
              className="mt-8"
              variant={plan.featured ? "default" : "outline"}
            >
              <Link href={`/signup?plan=${plan.tier.toLowerCase()}`}>Choose {plan.name}</Link>
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
