import { z } from "zod";

export const RSVP_STATUSES = ["ACCEPTED", "DECLINED", "MAYBE"] as const;

export const rsvpSubmitSchema = z.object({
  fullName: z.string().min(2, "Enter your full name").max(160),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  status: z.enum(RSVP_STATUSES),
  plusOneCount: z.coerce.number().int().min(0).max(10).default(0),
  mealPreference: z.string().max(120).optional().or(z.literal("")),
  dietaryRestrictions: z.string().max(300).optional().or(z.literal("")),
  needsTransportation: z.boolean().default(false),
  needsHotel: z.boolean().default(false),
  message: z.string().max(1000).optional().or(z.literal("")),
});

export type RsvpSubmitInput = z.input<typeof rsvpSubmitSchema>;
export type RsvpSubmitPayload = z.output<typeof rsvpSubmitSchema>;
