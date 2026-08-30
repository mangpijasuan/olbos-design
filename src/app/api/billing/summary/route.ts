import { NextResponse } from "next/server";
import { getBillingSummary } from "@/server/billing-service";
import { handleApiError } from "@/lib/api-error";

export async function GET() {
  try {
    const summary = await getBillingSummary();
    return NextResponse.json(summary);
  } catch (error) {
    return handleApiError(error);
  }
}
