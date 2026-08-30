import { Suspense } from "react";
import type { Metadata } from "next";
import { BillingPageContent } from "@/components/dashboard/billing-page-content";

export const metadata: Metadata = { title: "Billing" };

export default function BillingPage() {
  return (
    <Suspense>
      <BillingPageContent />
    </Suspense>
  );
}
