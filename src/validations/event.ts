import { z } from "zod";

export const EVENT_TYPES = [
  "WEDDING",
  "BIRTHDAY",
  "CONFERENCE",
  "CORPORATE",
  "GRADUATION",
  "BABY_SHOWER",
  "CHURCH",
  "MEMORIAL",
  "FESTIVAL",
  "FUNDRAISER",
  "NETWORKING",
  "HOLIDAY_PARTY",
  "COMMUNITY_EVENT",
  "CUSTOM",
] as const;

export const EVENT_VISIBILITIES = ["PUBLIC", "PRIVATE", "PASSWORD_PROTECTED"] as const;

export const createEventSchema = z.object({
  title: z.string().min(3, "Give your event a title").max(160),
  type: z.enum(EVENT_TYPES),
  startAt: z.coerce.date(),
  endAt: z.coerce.date().optional().nullable(),
  timezone: z.string().default("UTC"),
  venueName: z.string().max(200).optional().or(z.literal("")),
  venueAddress: z.string().max(300).optional().or(z.literal("")),
  templateKey: z.string().min(1).default("luxury"),
});

export type CreateEventInput = z.input<typeof createEventSchema>;
export type CreateEventPayload = z.output<typeof createEventSchema>;

export const updateEventSchema = z.object({
  title: z.string().min(3).max(160).optional(),
  type: z.enum(EVENT_TYPES).optional(),
  startAt: z.coerce.date().optional(),
  endAt: z.coerce.date().optional().nullable(),
  timezone: z.string().optional(),
  venueName: z.string().max(200).optional().nullable(),
  venueAddress: z.string().max(300).optional().nullable(),
  venueLat: z.number().optional().nullable(),
  venueLng: z.number().optional().nullable(),
  coverImageUrl: z.string().url().optional().nullable(),
  visibility: z.enum(EVENT_VISIBILITIES).optional(),
  password: z.string().min(4).max(100).optional(),
});

export type UpdateEventInput = z.input<typeof updateEventSchema>;
export type UpdateEventPayload = z.output<typeof updateEventSchema>;
