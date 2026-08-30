import { NextResponse, type NextRequest } from "next/server";
import { importGuestsSchema } from "@/validations/guest";
import { importGuests } from "@/server/guest-service";
import { handleApiError } from "@/lib/api-error";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const json = await request.json();
    const input = importGuestsSchema.parse(json);
    const count = await importGuests(id, input);
    return NextResponse.json({ count });
  } catch (error) {
    return handleApiError(error);
  }
}
