import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { requireUser } from "@/server/auth-helpers";
import { createUploadUrl } from "@/lib/s3";
import { handleApiError } from "@/lib/api-error";
import { rateLimit } from "@/lib/rate-limit";

const uploadRequestSchema = z.object({
  folder: z.enum(["events", "guests", "avatars"]),
  contentType: z.enum(["image/jpeg", "image/png", "image/webp", "image/gif"]),
});

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser();
    const { allowed } = await rateLimit({ key: `upload:${user.id}`, limit: 30, windowSeconds: 60 });
    if (!allowed) {
      return NextResponse.json({ error: "Too many uploads. Try again shortly." }, { status: 429 });
    }

    const json = await request.json();
    const { folder, contentType } = uploadRequestSchema.parse(json);
    const result = await createUploadUrl({ folder, contentType });
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
