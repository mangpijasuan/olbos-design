import "server-only";
import { db } from "@/lib/db";
import { requireAdmin } from "@/server/auth-helpers";

export async function listAllUsersForAdmin() {
  await requireAdmin();
  return db.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { _count: { select: { hostedEvents: true } } },
  });
}

export async function listAllEventsForAdmin() {
  await requireAdmin();
  return db.event.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      host: { select: { name: true, email: true } },
      eventType: true,
      _count: { select: { guests: true } },
    },
  });
}

export async function listAllPaymentsForAdmin() {
  await requireAdmin();
  return db.payment.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { event: { select: { title: true } } },
  });
}

export async function getAdminOverviewStats() {
  await requireAdmin();
  const [users, events, publishedEvents, subscriptions] = await Promise.all([
    db.user.count(),
    db.event.count(),
    db.event.count({ where: { status: "PUBLISHED" } }),
    db.subscription.count({ where: { status: "ACTIVE" } }),
  ]);
  return { users, events, publishedEvents, activeSubscriptions: subscriptions };
}
