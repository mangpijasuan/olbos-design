import { describe, it, expect } from "vitest";
import { rsvpSubmitSchema } from "@/validations/rsvp";
import { createEventSchema } from "@/validations/event";
import { invitationContentSchema } from "@/validations/invitation";

describe("rsvpSubmitSchema", () => {
  const base = {
    fullName: "Amara Boateng",
    status: "ACCEPTED" as const,
  };

  it("accepts a minimal valid RSVP", () => {
    const result = rsvpSubmitSchema.safeParse(base);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.plusOneCount).toBe(0);
      expect(result.data.needsTransportation).toBe(false);
    }
  });

  it("rejects a name that is too short", () => {
    const result = rsvpSubmitSchema.safeParse({ ...base, fullName: "A" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid status", () => {
    const result = rsvpSubmitSchema.safeParse({ ...base, status: "MAYBE_LATER" });
    expect(result.success).toBe(false);
  });

  it("rejects a negative plus-one count", () => {
    const result = rsvpSubmitSchema.safeParse({ ...base, plusOneCount: -1 });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email but allows an empty string", () => {
    expect(rsvpSubmitSchema.safeParse({ ...base, email: "not-an-email" }).success).toBe(false);
    expect(rsvpSubmitSchema.safeParse({ ...base, email: "" }).success).toBe(true);
  });
});

describe("createEventSchema", () => {
  it("accepts a valid event", () => {
    const result = createEventSchema.safeParse({
      title: "Amara & Kofi's Wedding",
      eventTypeKey: "WEDDING",
      startAt: new Date().toISOString(),
    });
    expect(result.success).toBe(true);
  });

  it("rejects a title that is too short", () => {
    const result = createEventSchema.safeParse({
      title: "Hi",
      eventTypeKey: "WEDDING",
      startAt: new Date().toISOString(),
    });
    expect(result.success).toBe(false);
  });

  it("rejects an empty event type key", () => {
    // The registry itself (not Zod) is the source of truth for which keys
    // are real — resolveEventType() in event-service.ts rejects unknown
    // keys against the database. This schema only enforces non-empty.
    const result = createEventSchema.safeParse({
      title: "Valid Title",
      eventTypeKey: "",
      startAt: new Date().toISOString(),
    });
    expect(result.success).toBe(false);
  });

  it("defaults the template key to luxury when omitted", () => {
    const result = createEventSchema.safeParse({
      title: "Valid Title",
      eventTypeKey: "BIRTHDAY",
      startAt: new Date().toISOString(),
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.templateKey).toBe("luxury");
  });
});

describe("invitationContentSchema", () => {
  it("defaults every field so a partial payload still parses", () => {
    const result = invitationContentSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.schedule).toEqual([]);
      expect(result.data.galleryUrls).toEqual([]);
    }
  });

  it("rejects a schedule item missing a title", () => {
    const result = invitationContentSchema.safeParse({
      schedule: [{ time: "6:00 PM" }],
    });
    expect(result.success).toBe(false);
  });

  it("rejects a non-URL gallery entry", () => {
    const result = invitationContentSchema.safeParse({ galleryUrls: ["not-a-url"] });
    expect(result.success).toBe(false);
  });
});
