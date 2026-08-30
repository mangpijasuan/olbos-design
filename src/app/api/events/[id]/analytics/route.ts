import { NextResponse, type NextRequest } from "next/server";
import { getEventAnalytics } from "@/server/analytics-service";
import { handleApiError } from "@/lib/api-error";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const analytics = await getEventAnalytics(id);
    return NextResponse.json(analytics);
  } catch (error) {
    return handleApiError(error);
  }
}
