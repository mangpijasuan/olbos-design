import { NextResponse, type NextRequest } from "next/server";
import { unpublishEvent } from "@/server/event-service";
import { handleApiError } from "@/lib/api-error";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const event = await unpublishEvent(id);
    return NextResponse.json({ event });
  } catch (error) {
    return handleApiError(error);
  }
}
