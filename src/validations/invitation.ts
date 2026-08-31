import { z } from "zod";

export const scheduleItemSchema = z.object({
  time: z.string().min(1, "Add a time"),
  title: z.string().min(1, "Add a title"),
  description: z.string().optional(),
});

export const storyItemSchema = z.object({
  date: z.string().min(1, "Add a date"),
  title: z.string().min(1, "Add a title"),
  description: z.string().optional(),
});

export const BACKGROUND_EFFECTS = [
  "none",
  "sparkles",
  "petals",
  "snowfall",
  "golden-particles",
] as const;

export const invitationContentSchema = z.object({
  hostNames: z.string().max(160).optional().default(""),
  greeting: z.string().max(600).optional().default(""),
  dressCode: z.string().max(200).optional().default(""),
  accommodation: z.string().max(600).optional().default(""),
  transportation: z.string().max(600).optional().default(""),
  contactName: z.string().max(120).optional().default(""),
  contactPhone: z.string().max(40).optional().default(""),
  contactEmail: z.string().max(160).optional().default(""),
  registryUrl: z.string().url().optional().or(z.literal("")).default(""),
  schedule: z.array(scheduleItemSchema).default([]),
  storyTimeline: z.array(storyItemSchema).default([]),
  galleryUrls: z.array(z.string().url()).default([]),
  showEnvelopeIntro: z.boolean().default(true),
  backgroundEffect: z.enum(BACKGROUND_EFFECTS).default("none"),
});

export type InvitationContentInput = z.input<typeof invitationContentSchema>;
export type InvitationContent = z.output<typeof invitationContentSchema>;
export type BackgroundEffect = (typeof BACKGROUND_EFFECTS)[number];

export const updateInvitationSchema = z.object({
  templateKey: z.string().min(1).optional(),
  themeKey: z.string().min(1).optional(),
  content: invitationContentSchema.optional(),
  musicUrl: z.string().url().optional().or(z.literal("")).optional(),
});

export type UpdateInvitationInput = z.input<typeof updateInvitationSchema>;
export type UpdateInvitationPayload = z.output<typeof updateInvitationSchema>;

export const EMPTY_INVITATION_CONTENT: InvitationContent = {
  hostNames: "",
  greeting: "",
  dressCode: "",
  accommodation: "",
  transportation: "",
  contactName: "",
  contactPhone: "",
  contactEmail: "",
  registryUrl: "",
  schedule: [],
  storyTimeline: [],
  galleryUrls: [],
  showEnvelopeIntro: true,
  backgroundEffect: "none",
};
