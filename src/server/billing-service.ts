import "server-only";
import { db } from "@/lib/db";
import { stripe, PLAN_PRICE_IDS, isStripeConfigured } from "@/lib/stripe";
import { requireUser } from "@/server/auth-helpers";
import { slugify, randomSuffix } from "@/lib/slug";
import type { PlanTierKey } from "@/lib/plans";

export class BillingError extends Error {}

async function ensurePersonalOrganization(userId: string, userName: string) {
  const existing = await db.membership.findFirst({
    where: { userId, role: "OWNER" },
    include: { organization: true },
  });
  if (existing) return existing.organization;

  const base = slugify(userName) || "workspace";
  const slug = `${base}-${randomSuffix(6)}`;

  return db.organization.create({
    data: {
      name: `${userName}'s workspace`,
      slug,
      memberships: { create: { userId, role: "OWNER" } },
    },
  });
}

export async function createBillingCheckoutSession(planTier: PlanTierKey, origin: string) {
  const user = await requireUser();

  if (!isStripeConfigured) {
    throw new BillingError("Billing is not configured yet. Set STRIPE_SECRET_KEY in your environment.");
  }

  const priceId = PLAN_PRICE_IDS[planTier];
  if (!priceId) {
    throw new BillingError(
      `Stripe price ID for the ${planTier} plan is not configured. Set STRIPE_PRICE_ID_${planTier} in your environment.`,
    );
  }

  const organization = await ensurePersonalOrganization(user.id, user.name);

  let subscription = await db.subscription.findUnique({ where: { organizationId: organization.id } });

  let customerId = subscription?.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name,
      metadata: { organizationId: organization.id, userId: user.id },
    });
    customerId = customer.id;
  }

  if (!subscription) {
    subscription = await db.subscription.create({
      data: { organizationId: organization.id, stripeCustomerId: customerId },
    });
  } else if (subscription.stripeCustomerId !== customerId) {
    subscription = await db.subscription.update({
      where: { id: subscription.id },
      data: { stripeCustomerId: customerId },
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/dashboard/billing?success=1`,
    cancel_url: `${origin}/dashboard/billing?canceled=1`,
    client_reference_id: organization.id,
    metadata: { organizationId: organization.id, planTier },
    subscription_data: {
      metadata: { organizationId: organization.id, planTier },
    },
  });

  if (!session.url) throw new Error("Stripe did not return a checkout URL");
  return session.url;
}

export async function getBillingSummary() {
  const user = await requireUser();
  const membership = await db.membership.findFirst({
    where: { userId: user.id, role: "OWNER" },
    include: { organization: { include: { subscription: true } } },
  });

  if (!membership) {
    return { planTier: "FREE" as const, status: null, currentPeriodEnd: null };
  }

  const { organization } = membership;
  return {
    planTier: organization.planTier,
    status: organization.subscription?.status ?? null,
    currentPeriodEnd: organization.subscription?.currentPeriodEnd ?? null,
  };
}
