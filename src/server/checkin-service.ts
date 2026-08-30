import "server-only";
import { db } from "@/lib/db";
import { requireEventAccess } from "@/server/auth-helpers";
import { decodeGuestCheckInToken } from "@/lib/qr";

export class CheckInError extends Error {}

async function performCheckIn(eventId: string, guestId: string) {
  const guest = await db.guest.findUnique({ where: { id: guestId }, include: { checkIn: true } });
  if (!guest || guest.eventId !== eventId) {
    throw new CheckInError("Guest not found for this event");
  }

  if (guest.checkIn) {
    return { guest, checkIn: guest.checkIn, alreadyCheckedIn: true };
  }

  const checkIn = await db.checkIn.create({
    data: { guestId: guest.id, method: "QR" },
  });

  await db.analyticsEvent.create({
    data: { eventId, type: "QR_SCAN", metadata: { guestId: guest.id } },
  });

  return { guest, checkIn, alreadyCheckedIn: false };
}

export async function checkInByToken(eventId: string, token: string) {
  await requireEventAccess(eventId);

  const decoded = decodeGuestCheckInToken(token);
  if (!decoded) throw new CheckInError("Invalid or tampered QR code");

  const guest = await db.guest.findUnique({ where: { id: decoded.guestId } });
  if (!guest || guest.qrToken !== decoded.qrToken || guest.eventId !== eventId) {
    throw new CheckInError("This QR code does not match this event");
  }

  return performCheckIn(eventId, guest.id);
}

export async function manualCheckIn(eventId: string, guestId: string) {
  await requireEventAccess(eventId);
  const result = await performCheckIn(eventId, guestId);
  if (!result.alreadyCheckedIn) {
    await db.checkIn.update({ where: { guestId }, data: { method: "MANUAL" } });
  }
  return result;
}

export async function getCheckInStats(eventId: string) {
  await requireEventAccess(eventId);
  const [total, checkedIn] = await Promise.all([
    db.guest.count({ where: { eventId } }),
    db.checkIn.count({ where: { guest: { eventId } } }),
  ]);
  return { total, checkedIn };
}
