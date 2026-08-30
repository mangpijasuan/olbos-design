import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_PREFIX = "invite_auth_";

function sign(eventId: string, passwordHash: string) {
  const secret = process.env.QR_SIGNING_SECRET ?? "";
  return createHmac("sha256", secret).update(`${eventId}:${passwordHash}`).digest("hex");
}

export function inviteCookieName(eventId: string) {
  return `${COOKIE_PREFIX}${eventId}`;
}

export function signInviteAccessToken(eventId: string, passwordHash: string) {
  return sign(eventId, passwordHash);
}

export function verifyInviteAccessToken(eventId: string, passwordHash: string, token: string | undefined) {
  if (!token) return false;
  const expected = sign(eventId, passwordHash);
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
