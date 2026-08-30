import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { checkInByToken } from "@/server/checkin-service";
import { handleApiError } from "@/lib/api-error";

const schema = z.object({ token: z.string().min(1) });

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { token } = schema.parse(await request.json());
    const result = await checkInByToken(id, token);
    return NextResponse.json({
      guestName: result.guest.fullName,
      alreadyCheckedIn: result.alreadyCheckedIn,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
