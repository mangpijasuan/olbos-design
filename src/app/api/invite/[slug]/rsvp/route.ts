import { NextResponse, type NextRequest } from "next/server";
import { rsvpSubmitSchema } from "@/validations/rsvp";
import { submitRsvp } from "@/server/rsvp-service";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { handleApiError } from "@/lib/api-error";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    const ip = getClientIp(request.headers);
    const { allowed } = await rateLimit({ key: `rsvp:${ip}:${slug}`, limit: 10, windowSeconds: 60 });
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests. Try again shortly." }, { status: 429 });
    }

    const json = await request.json();
    const input = rsvpSubmitSchema.parse(json);
    const rsvp = await submitRsvp(slug, input);
    return NextResponse.json({ rsvp });
  } catch (error) {
    return handleApiError(error);
  }
}
