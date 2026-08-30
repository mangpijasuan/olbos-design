import { z } from "zod";

export const GUEST_TAGS = ["VIP", "FAMILY", "FRIEND", "COWORKER", "OTHER"] as const;

export const createGuestSchema = z.object({
  fullName: z.string().min(2, "Enter a name").max(160),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  phone: z.string().max(40).optional().or(z.literal("")),
  tag: z.enum(GUEST_TAGS).default("OTHER"),
  maxPlusOnes: z.coerce.number().int().min(0).max(10).default(0),
});

export type CreateGuestInput = z.input<typeof createGuestSchema>;
export type CreateGuestPayload = z.output<typeof createGuestSchema>;

export const updateGuestSchema = createGuestSchema.partial();
export type UpdateGuestInput = z.input<typeof updateGuestSchema>;
export type UpdateGuestPayload = z.output<typeof updateGuestSchema>;

export const importGuestsSchema = z.object({
  guests: z
    .array(
      z.object({
        fullName: z.string().min(1),
        email: z.string().optional(),
        phone: z.string().optional(),
        tag: z.enum(GUEST_TAGS).optional(),
      }),
    )
    .min(1)
    .max(2000),
});
