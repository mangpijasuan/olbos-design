import { NextResponse, type NextRequest } from "next/server";
import { updateGuestSchema } from "@/validations/guest";
import { updateGuest, deleteGuest } from "@/server/guest-service";
import { handleApiError } from "@/lib/api-error";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; guestId: string }> },
) {
  try {
    const { id, guestId } = await params;
    const json = await request.json();
    const input = updateGuestSchema.parse(json);
    const guest = await updateGuest(id, guestId, input);
    return NextResponse.json({ guest });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; guestId: string }> },
) {
  try {
    const { id, guestId } = await params;
    await deleteGuest(id, guestId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
