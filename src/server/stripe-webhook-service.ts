import "server-only";
import type Stripe from "stripe";
import { db } from "@/lib/db";
import type { PlanTierKey } from "@/lib/plans";

const STATUS_MAP: Record<string, "ACTIVE" | "TRIALING" | "PAST_DUE" | "CANCELED" | "INCOMPLETE"> = {
  active: "ACTIVE",
  trialing: "TRIALING",
  past_due: "PAST_DUE",
  canceled: "CANCELED",
  incomplete: "INCOMPLETE",
  incomplete_expired: "CANCELED",
  unpaid: "PAST_DUE",
  paused: "CANCELED",
};

function isPlanTier(value: string | undefined): value is PlanTierKey {
  return value === "ESSENTIAL" || value === "PREMIUM" || value === "LUXE";
}

export async function handleStripeWebhookEvent(event: Stripe.Event) {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const organizationId = session.metadata?.organizationId ?? session.client_reference_id;
      const planTier = session.metadata?.planTier;
      if (!organizationId || !isPlanTier(planTier)) return;

      const subscriptionId =
        typeof session.subscription === "string" ? session.subscription : session.subscription?.id;

      await db.$transaction([
        db.subscription.update({
          where: { organizationId },
          data: {
            stripeSubscriptionId: subscriptionId ?? undefined,
            planTier,
            status: "ACTIVE",
          },
        }),
        db.organization.update({ where: { id: organizationId }, data: { planTier } }),
      ]);
      return;
    }

    case "customer.subscription.updated":
    case "customer.subscription.created": {
      const sub = event.data.object as Stripe.Subscription;
      const organizationId = sub.metadata?.organizationId;
      const planTier = sub.metadata?.planTier;
      const status = STATUS_MAP[sub.status] ?? "INCOMPLETE";
      const currentPeriodEnd = sub.items.data[0]?.current_period_end
        ? new Date(sub.items.data[0].current_period_end * 1000)
        : null;

      if (organizationId) {
        await db.subscription.updateMany({
          where: { organizationId },
          data: { status, currentPeriodEnd, stripeSubscriptionId: sub.id },
        });
        if (isPlanTier(planTier)) {
          await db.organization.update({ where: { id: organizationId }, data: { planTier } });
        }
      } else {
        await db.subscription.updateMany({
          where: { stripeSubscriptionId: sub.id },
          data: { status, currentPeriodEnd },
        });
      }
      return;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const subscription = await db.subscription.findFirst({
        where: { stripeSubscriptionId: sub.id },
      });
      if (!subscription) return;

      await db.$transaction([
        db.subscription.update({
          where: { id: subscription.id },
          data: { status: "CANCELED", planTier: "FREE" },
        }),
        db.organization.update({
          where: { id: subscription.organizationId },
          data: { planTier: "FREE" },
        }),
      ]);
      return;
    }

    default:
      return;
  }
}
