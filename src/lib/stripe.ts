import Stripe from "stripe";

const globalForStripe = globalThis as unknown as { stripe: Stripe | undefined };

// The Stripe SDK throws at construction time if given an empty key, so we fall
// back to a placeholder in local/dev environments where billing isn't
// configured yet. Any real API call with this placeholder will fail with a
// clear Stripe auth error, which is the correct behavior until real keys are set.
export const isStripeConfigured = Boolean(process.env.STRIPE_SECRET_KEY);

export const stripe =
  globalForStripe.stripe ??
  new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_not_configured", {
    apiVersion: "2026-07-29.dahlia",
    typescript: true,
  });

if (process.env.NODE_ENV !== "production") {
  globalForStripe.stripe = stripe;
}

export const PLAN_PRICE_IDS = {
  ESSENTIAL: process.env.STRIPE_PRICE_ID_ESSENTIAL,
  PREMIUM: process.env.STRIPE_PRICE_ID_PREMIUM,
  LUXE: process.env.STRIPE_PRICE_ID_LUXE,
} as const;
