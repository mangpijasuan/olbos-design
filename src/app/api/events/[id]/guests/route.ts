import { NextResponse, type NextRequest } from "next/server";
import { createGuestSchema } from "@/validations/guest";
import { listGuests, createGuest } from "@/server/guest-service";
import { handleApiError } from "@/lib/api-error";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const guests = await listGuests(id);
    return NextResponse.json({ guests });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const json = await request.json();
    const input = createGuestSchema.parse(json);
    const guest = await createGuest(id, input);
    return NextResponse.json({ guest }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
