export const PLANS = [
  {
    tier: "ESSENTIAL" as const,
    name: "Essential",
    priceMonthly: 19,
    description: "For a single beautifully hosted event.",
    features: [
      "1 active event",
      "4 luxury invitation templates",
      "Unlimited RSVPs",
      "QR check-in",
      "Email confirmations",
    ],
  },
  {
    tier: "PREMIUM" as const,
    name: "Premium",
    priceMonthly: 49,
    description: "For hosts and planners running multiple events.",
    featured: true,
    features: [
      "Up to 10 active events",
      "All templates",
      "Guest groups & VIP tagging",
      "Advanced analytics",
      "Custom domain (coming soon)",
      "Priority support",
    ],
  },
  {
    tier: "LUXE" as const,
    name: "Luxe",
    priceMonthly: 149,
    description: "For organizations, agencies, and venues.",
    features: [
      "Unlimited events",
      "Team seats & roles",
      "White-label invitations (coming soon)",
      "Vendor marketplace access",
      "Dedicated success manager",
    ],
  },
];

export type PlanTierKey = (typeof PLANS)[number]["tier"];
