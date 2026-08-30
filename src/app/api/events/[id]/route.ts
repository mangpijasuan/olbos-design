import { NextResponse, type NextRequest } from "next/server";
import { updateEventSchema } from "@/validations/event";
import { getEventForOwner, updateEvent, deleteEvent } from "@/server/event-service";
import { handleApiError } from "@/lib/api-error";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const event = await getEventForOwner(id);
    return NextResponse.json({ event });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const json = await request.json();
    const input = updateEventSchema.parse(json);
    const event = await updateEvent(id, input);
    return NextResponse.json({ event });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await deleteEvent(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
