import { NextResponse } from "next/server";
import { listAllUsersForAdmin } from "@/server/admin-service";
import { handleApiError } from "@/lib/api-error";

export async function GET() {
  try {
    const users = await listAllUsersForAdmin();
    return NextResponse.json({ users });
  } catch (error) {
    return handleApiError(error);
  }
}
