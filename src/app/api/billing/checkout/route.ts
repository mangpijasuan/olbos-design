import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createBillingCheckoutSession } from "@/server/billing-service";
import { handleApiError } from "@/lib/api-error";

const schema = z.object({ planTier: z.enum(["ESSENTIAL", "PREMIUM", "LUXE"]) });

export async function POST(request: NextRequest) {
  try {
    const { planTier } = schema.parse(await request.json());
    const origin = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;
    const url = await createBillingCheckoutSession(planTier, origin);
    return NextResponse.json({ url });
  } catch (error) {
    return handleApiError(error);
  }
}
