import "server-only";
import { db } from "@/lib/db";
import { requireEventAccess } from "@/server/auth-helpers";
import type { CreateGuestPayload, UpdateGuestPayload } from "@/validations/guest";
import type { z } from "zod";
import type { importGuestsSchema } from "@/validations/guest";

export async function listGuests(eventId: string) {
  await requireEventAccess(eventId);
  return db.guest.findMany({
    where: { eventId },
    include: { rsvp: true, checkIn: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function createGuest(eventId: string, input: CreateGuestPayload) {
  await requireEventAccess(eventId);
  return db.guest.create({
    data: {
      eventId,
      fullName: input.fullName,
      email: input.email || null,
      phone: input.phone || null,
      tag: input.tag,
      maxPlusOnes: input.maxPlusOnes,
      invitationStatus: "NOT_SENT",
    },
  });
}

export async function updateGuest(eventId: string, guestId: string, input: UpdateGuestPayload) {
  await requireEventAccess(eventId);
  return db.guest.update({
    where: { id: guestId, eventId },
    data: {
      fullName: input.fullName,
      email: input.email || null,
      phone: input.phone || null,
      tag: input.tag,
      maxPlusOnes: input.maxPlusOnes,
    },
  });
}

export async function deleteGuest(eventId: string, guestId: string) {
  await requireEventAccess(eventId);
  await db.guest.delete({ where: { id: guestId, eventId } });
}

export async function importGuests(eventId: string, input: z.infer<typeof importGuestsSchema>) {
  await requireEventAccess(eventId);
  const result = await db.guest.createMany({
    data: input.guests.map((g) => ({
      eventId,
      fullName: g.fullName,
      email: g.email || null,
      phone: g.phone || null,
      tag: g.tag ?? "OTHER",
      invitationStatus: "NOT_SENT" as const,
    })),
  });
  return result.count;
}

export async function getGuestForQr(eventId: string, guestId: string) {
  await requireEventAccess(eventId);
  return db.guest.findUniqueOrThrow({ where: { id: guestId, eventId } });
}
