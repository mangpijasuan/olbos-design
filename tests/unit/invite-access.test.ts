import { describe, it, expect, beforeAll } from "vitest";
import { signInviteAccessToken, verifyInviteAccessToken, inviteCookieName } from "@/lib/invite-access";

beforeAll(() => {
  process.env.QR_SIGNING_SECRET = "test-secret-do-not-use-in-prod";
});

describe("invite access token", () => {
  it("verifies a token signed for the same event and password hash", () => {
    const token = signInviteAccessToken("event_1", "hash_abc");
    expect(verifyInviteAccessToken("event_1", "hash_abc", token)).toBe(true);
  });

  it("rejects a token if the password hash changed (password was updated)", () => {
    const token = signInviteAccessToken("event_1", "hash_abc");
    expect(verifyInviteAccessToken("event_1", "hash_xyz", token)).toBe(false);
  });

  it("rejects a token signed for a different event", () => {
    const token = signInviteAccessToken("event_1", "hash_abc");
    expect(verifyInviteAccessToken("event_2", "hash_abc", token)).toBe(false);
  });

  it("rejects an undefined token", () => {
    expect(verifyInviteAccessToken("event_1", "hash_abc", undefined)).toBe(false);
  });

  it("scopes the cookie name per event", () => {
    expect(inviteCookieName("event_1")).toBe("invite_auth_event_1");
    expect(inviteCookieName("event_1")).not.toBe(inviteCookieName("event_2"));
  });
});
