import "server-only";
import { db } from "@/lib/db";
import { slugify, randomSuffix } from "@/lib/slug";
import { hashPassword } from "@/lib/password";
import { requireUser, requireEventAccess } from "@/server/auth-helpers";
import type { CreateEventPayload, UpdateEventPayload } from "@/validations/event";
import { getTemplateDefinition } from "@/lib/templates";
import { EMPTY_INVITATION_CONTENT } from "@/validations/invitation";

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
      _count: { select: { guests: true } },
    },
  });
}

export async function createEvent(input: CreateEventPayload) {
  const user = await requireUser();
  const slug = await generateUniqueSlug(input.title);
  const template = await ensureTemplate(input.templateKey);

  return db.event.create({
    data: {
      hostId: user.id,
      title: input.title,
      type: input.type,
      slug,
      startAt: input.startAt,
      endAt: input.endAt ?? null,
      timezone: input.timezone,
      venueName: input.venueName || null,
      venueAddress: input.venueAddress || null,
      invitation: {
        create: {
          templateId: template.id,
          content: EMPTY_INVITATION_CONTENT,
          theme: {},
        },
      },
    },
    include: { invitation: true },
  });
}

export async function getEventForOwner(eventId: string) {
  const { event } = await requireEventAccess(eventId);
  return db.event.findUniqueOrThrow({
    where: { id: event.id },
    include: {
      invitation: { include: { template: true } },
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

  return db.event.update({
    where: { id: event.id },
    data: {
      title: input.title,
      type: input.type,
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
      type: original.type,
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
