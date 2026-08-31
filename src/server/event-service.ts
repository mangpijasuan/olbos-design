import "server-only";
import { db } from "@/lib/db";
import { slugify, randomSuffix } from "@/lib/slug";
import { hashPassword } from "@/lib/password";
import { requireUser, requireEventAccess } from "@/server/auth-helpers";
import type { CreateEventPayload, UpdateEventPayload } from "@/validations/event";
import { getTemplateDefinition } from "@/lib/templates";
import { EMPTY_INVITATION_CONTENT } from "@/validations/invitation";
import { resolveTheme } from "@/server/theme-service";
import { DEFAULT_THEME_BY_TEMPLATE, FALLBACK_THEME_KEY } from "@/lib/theme-defaults";

export class EventTypeError extends Error {
  constructor(message = "Unknown event type") {
    super(message);
    this.name = "EventTypeError";
  }
}

async function ensureTemplate(key: string) {
  const def = getTemplateDefinition(key);
  return db.template.upsert({
    where: { key: def.key },
    update: {},
    create: {
      key: def.key,
      name: def.name,
      category: def.category,
      description: def.description,
      previewImage: def.swatch,
    },
  });
}

// Unlike ensureTemplate, event types are pure reference data (seeded via
// prisma/seed-event-types.ts) — an unknown key is a real validation error,
// not something to silently create.
async function resolveEventType(key: string) {
  const eventType = await db.eventTypeDefinition.findUnique({ where: { key } });
  if (!eventType) throw new EventTypeError(`Unknown event type: ${key}`);
  return eventType;
}

async function generateUniqueSlug(title: string) {
  const base = slugify(title) || "event";
  for (let attempt = 0; attempt < 5; attempt++) {
    const candidate = attempt === 0 ? base : `${base}-${randomSuffix(4)}`;
    const existing = await db.event.findUnique({ where: { slug: candidate } });
    if (!existing) return candidate;
  }
  return `${base}-${randomSuffix(8)}`;
}

export async function listMyEvents() {
  const user = await requireUser();
  return db.event.findMany({
    where: { hostId: user.id },
    orderBy: { startAt: "desc" },
    include: {
      eventType: true,
      _count: { select: { guests: true } },
    },
  });
}

export async function createEvent(input: CreateEventPayload) {
  const user = await requireUser();
  const slug = await generateUniqueSlug(input.title);
  const [template, eventType] = await Promise.all([
    ensureTemplate(input.templateKey),
    resolveEventType(input.eventTypeKey),
  ]);
  const theme = await resolveTheme(
    DEFAULT_THEME_BY_TEMPLATE[input.templateKey] ?? FALLBACK_THEME_KEY,
  );

  return db.event.create({
    data: {
      hostId: user.id,
      title: input.title,
      eventTypeId: eventType.id,
      slug,
      startAt: input.startAt,
      endAt: input.endAt ?? null,
      timezone: input.timezone,
      venueName: input.venueName || null,
      venueAddress: input.venueAddress || null,
      invitation: {
        create: {
          templateId: template.id,
          themeId: theme.id,
          theme: theme.tokens as object,
          content: EMPTY_INVITATION_CONTENT,
        },
      },
    },
    include: { invitation: true, eventType: true },
  });
}

export async function getEventForOwner(eventId: string) {
  const { event } = await requireEventAccess(eventId);
  return db.event.findUniqueOrThrow({
    where: { id: event.id },
    include: {
      eventType: true,
      invitation: { include: { template: true, selectedTheme: true } },
      _count: { select: { guests: true, media: true } },
    },
  });
}

export async function updateEvent(eventId: string, input: UpdateEventPayload) {
  const { event } = await requireEventAccess(eventId);

  const passwordHash =
    input.visibility === "PASSWORD_PROTECTED" && input.password
      ? hashPassword(input.password)
      : undefined;
  const eventTypeId = input.eventTypeKey
    ? (await resolveEventType(input.eventTypeKey)).id
    : undefined;

  return db.event.update({
    where: { id: event.id },
    data: {
      title: input.title,
      eventTypeId,
      startAt: input.startAt,
      endAt: input.endAt,
      timezone: input.timezone,
      venueName: input.venueName,
      venueAddress: input.venueAddress,
      venueLat: input.venueLat,
      venueLng: input.venueLng,
      coverImageUrl: input.coverImageUrl,
      visibility: input.visibility,
      ...(passwordHash ? { passwordHash } : {}),
    },
    include: { eventType: true },
  });
}

export async function deleteEvent(eventId: string) {
  const { event } = await requireEventAccess(eventId);
  await db.event.delete({ where: { id: event.id } });
}

export async function publishEvent(eventId: string) {
  const { event } = await requireEventAccess(eventId);
  return db.event.update({ where: { id: event.id }, data: { status: "PUBLISHED" } });
}

export async function unpublishEvent(eventId: string) {
  const { event } = await requireEventAccess(eventId);
  return db.event.update({ where: { id: event.id }, data: { status: "DRAFT" } });
}

export async function duplicateEvent(eventId: string) {
  const { event } = await requireEventAccess(eventId);
  const original = await db.event.findUniqueOrThrow({
    where: { id: event.id },
    include: { invitation: true },
  });

  const slug = await generateUniqueSlug(`${original.title}-copy`);

  return db.event.create({
    data: {
      hostId: original.hostId,
      organizationId: original.organizationId,
      title: `${original.title} (Copy)`,
      eventTypeId: original.eventTypeId,
      slug,
      startAt: original.startAt,
      endAt: original.endAt,
      timezone: original.timezone,
      venueName: original.venueName,
      venueAddress: original.venueAddress,
      venueLat: original.venueLat,
      venueLng: original.venueLng,
      coverImageUrl: original.coverImageUrl,
      status: "DRAFT",
      ...(original.invitation
        ? {
            invitation: {
              create: {
                templateId: original.invitation.templateId,
                themeId: original.invitation.themeId,
                content: original.invitation.content as object,
                theme: original.invitation.theme as object,
                musicUrl: original.invitation.musicUrl,
              },
            },
          }
        : {}),
    },
  });
}
