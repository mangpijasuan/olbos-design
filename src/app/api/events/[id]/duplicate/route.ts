import { NextResponse, type NextRequest } from "next/server";
import { duplicateEvent } from "@/server/event-service";
import { handleApiError } from "@/lib/api-error";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const event = await duplicateEvent(id);
    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
