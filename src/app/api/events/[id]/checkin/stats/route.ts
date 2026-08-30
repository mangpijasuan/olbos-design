import { NextResponse, type NextRequest } from "next/server";
import { getCheckInStats } from "@/server/checkin-service";
import { handleApiError } from "@/lib/api-error";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const stats = await getCheckInStats(id);
    return NextResponse.json(stats);
  } catch (error) {
    return handleApiError(error);
  }
}
