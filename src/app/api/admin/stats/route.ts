import { NextResponse } from "next/server";
import { getAdminOverviewStats } from "@/server/admin-service";
import { handleApiError } from "@/lib/api-error";

export async function GET() {
  try {
    const stats = await getAdminOverviewStats();
    return NextResponse.json(stats);
  } catch (error) {
    return handleApiError(error);
  }
}
