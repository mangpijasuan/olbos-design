import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { manualCheckIn } from "@/server/checkin-service";
import { handleApiError } from "@/lib/api-error";

const schema = z.object({ guestId: z.string().min(1) });

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { guestId } = schema.parse(await request.json());
    const result = await manualCheckIn(id, guestId);
    return NextResponse.json({
      guestName: result.guest.fullName,
      alreadyCheckedIn: result.alreadyCheckedIn,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
