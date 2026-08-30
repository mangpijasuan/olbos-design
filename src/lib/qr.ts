import QRCode from "qrcode";
import { createHmac, timingSafeEqual } from "crypto";

function getSecret() {
  const secret = process.env.QR_SIGNING_SECRET;
  if (!secret) throw new Error("QR_SIGNING_SECRET is not configured");
  return secret;
}

function sign(payload: string) {
  return createHmac("sha256", getSecret()).update(payload).digest("hex").slice(0, 32);
}

/** Encodes a tamper-evident check-in token: `guestId.qrToken.signature` */
export function encodeGuestCheckInToken(guestId: string, qrToken: string) {
  const payload = `${guestId}.${qrToken}`;
  return `${payload}.${sign(payload)}`;
}

export function decodeGuestCheckInToken(
  token: string,
): { guestId: string; qrToken: string } | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [guestId, qrToken, signature] = parts;
  const expected = sign(`${guestId}.${qrToken}`);

  const a = Buffer.from(signature, "hex");
  const b = Buffer.from(expected, "hex");
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  return { guestId, qrToken };
}

export function buildCheckInUrl(eventId: string, guestId: string, qrToken: string) {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const token = encodeGuestCheckInToken(guestId, qrToken);
  return `${base}/checkin/${eventId}?token=${encodeURIComponent(token)}`;
}

export async function generateQrCodeDataUrl(text: string) {
  return QRCode.toDataURL(text, {
    errorCorrectionLevel: "M",
    margin: 2,
    width: 480,
    color: { dark: "#16130f", light: "#00000000" },
  });
}
