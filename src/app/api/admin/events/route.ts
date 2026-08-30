import { NextResponse } from "next/server";
import { listAllEventsForAdmin } from "@/server/admin-service";
import { handleApiError } from "@/lib/api-error";

export async function GET() {
  try {
    const events = await listAllEventsForAdmin();
    return NextResponse.json({ events });
  } catch (error) {
    return handleApiError(error);
  }
}
