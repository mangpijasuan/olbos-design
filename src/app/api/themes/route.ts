import { NextResponse } from "next/server";
import { listThemes } from "@/server/theme-service";
import { handleApiError } from "@/lib/api-error";

export async function GET() {
  try {
    const themes = await listThemes();
    return NextResponse.json({ themes });
  } catch (error) {
    return handleApiError(error);
  }
}
