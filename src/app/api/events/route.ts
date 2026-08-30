import { NextResponse, type NextRequest } from "next/server";
import { createEventSchema } from "@/validations/event";
import { createEvent, listMyEvents } from "@/server/event-service";
import { handleApiError } from "@/lib/api-error";

export async function GET() {
  try {
    const events = await listMyEvents();
    return NextResponse.json({ events });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const input = createEventSchema.parse(json);
    const event = await createEvent(input);
    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
