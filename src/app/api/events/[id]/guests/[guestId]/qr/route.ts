import { NextResponse, type NextRequest } from "next/server";
import { getGuestForQr } from "@/server/guest-service";
import { buildCheckInUrl, generateQrCodeDataUrl } from "@/lib/qr";
import { handleApiError } from "@/lib/api-error";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; guestId: string }> },
) {
  try {
    const { id, guestId } = await params;
    const guest = await getGuestForQr(id, guestId);
    const url = buildCheckInUrl(id, guest.id, guest.qrToken);
    const dataUrl = await generateQrCodeDataUrl(url);
    return NextResponse.json({ dataUrl, url });
  } catch (error) {
    return handleApiError(error);
  }
}
