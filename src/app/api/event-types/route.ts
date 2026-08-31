import { NextResponse } from "next/server";
import { listEventTypes } from "@/server/event-type-service";
import { handleApiError } from "@/lib/api-error";

export async function GET() {
  try {
    const eventTypes = await listEventTypes();
    return NextResponse.json({ eventTypes });
  } catch (error) {
    return handleApiError(error);
  }
}
