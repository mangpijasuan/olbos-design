import "server-only";
import { db } from "@/lib/db";
import { requireEventAccess } from "@/server/auth-helpers";

export async function getEventAnalytics(eventId: string) {
  await requireEventAccess(eventId);

  const [
    viewCount,
    qrScanCount,
    shareClickCount,
    guestsTotal,
    rsvpAccepted,
    rsvpDeclined,
    rsvpMaybe,
    rsvpTotal,
    checkedInCount,
    viewEvents,
  ] = await Promise.all([
    db.analyticsEvent.count({ where: { eventId, type: "VIEW" } }),
    db.analyticsEvent.count({ where: { eventId, type: "QR_SCAN" } }),
    db.analyticsEvent.count({ where: { eventId, type: "SHARE_CLICK" } }),
    db.guest.count({ where: { eventId } }),
    db.rsvpResponse.count({ where: { guest: { eventId }, status: "ACCEPTED" } }),
    db.rsvpResponse.count({ where: { guest: { eventId }, status: "DECLINED" } }),
    db.rsvpResponse.count({ where: { guest: { eventId }, status: "MAYBE" } }),
    db.rsvpResponse.count({ where: { guest: { eventId } } }),
    db.checkIn.count({ where: { guest: { eventId } } }),
    db.analyticsEvent.findMany({
      where: { eventId, type: "VIEW" },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const viewsByDay = new Map<string, number>();
  for (const { createdAt } of viewEvents) {
    const key = createdAt.toISOString().slice(0, 10);
    viewsByDay.set(key, (viewsByDay.get(key) ?? 0) + 1);
  }

  const last14Days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    const key = d.toISOString().slice(0, 10);
    return { date: key, views: viewsByDay.get(key) ?? 0 };
  });

  return {
    views: viewCount,
    qrScans: qrScanCount,
    shareClicks: shareClickCount,
    guestsTotal,
    rsvp: {
      accepted: rsvpAccepted,
      declined: rsvpDeclined,
      maybe: rsvpMaybe,
      total: rsvpTotal,
      rate: guestsTotal > 0 ? Math.round((rsvpTotal / guestsTotal) * 100) : 0,
    },
    checkedIn: checkedInCount,
    viewsSeries: last14Days,
  };
}
