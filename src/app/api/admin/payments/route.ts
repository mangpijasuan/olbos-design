import { NextResponse } from "next/server";
import { listAllPaymentsForAdmin } from "@/server/admin-service";
import { handleApiError } from "@/lib/api-error";

export async function GET() {
  try {
    const payments = await listAllPaymentsForAdmin();
    return NextResponse.json({ payments });
  } catch (error) {
    return handleApiError(error);
  }
}
