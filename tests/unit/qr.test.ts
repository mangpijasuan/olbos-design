import { describe, it, expect, beforeAll } from "vitest";
import { encodeGuestCheckInToken, decodeGuestCheckInToken, buildCheckInUrl } from "@/lib/qr";

beforeAll(() => {
  process.env.QR_SIGNING_SECRET = "test-secret-do-not-use-in-prod";
  process.env.NEXT_PUBLIC_APP_URL = "https://olbosevent.test";
});

describe("guest check-in token", () => {
  it("round-trips guestId and qrToken through encode/decode", () => {
    const token = encodeGuestCheckInToken("guest_123", "qr_abc");
    const decoded = decodeGuestCheckInToken(token);
    expect(decoded).toEqual({ guestId: "guest_123", qrToken: "qr_abc" });
  });

  it("rejects a token with a tampered guestId", () => {
    const token = encodeGuestCheckInToken("guest_123", "qr_abc");
    const [, qrToken, signature] = token.split(".");
    const tampered = `guest_999.${qrToken}.${signature}`;
    expect(decodeGuestCheckInToken(tampered)).toBeNull();
  });

  it("rejects a token with a tampered signature", () => {
    const token = encodeGuestCheckInToken("guest_123", "qr_abc");
    const tampered = token.slice(0, -1) + (token.endsWith("0") ? "1" : "0");
    expect(decodeGuestCheckInToken(tampered)).toBeNull();
  });

  it("rejects malformed tokens", () => {
    expect(decodeGuestCheckInToken("not-a-token")).toBeNull();
    expect(decodeGuestCheckInToken("a.b")).toBeNull();
    expect(decodeGuestCheckInToken("")).toBeNull();
  });

  it("builds a check-in URL containing the signed token", () => {
    const url = buildCheckInUrl("event_1", "guest_123", "qr_abc");
    expect(url).toContain("https://olbosevent.test/checkin/event_1?token=");
    const token = decodeURIComponent(url.split("token=")[1]);
    expect(decodeGuestCheckInToken(token)).toEqual({ guestId: "guest_123", qrToken: "qr_abc" });
  });
});
