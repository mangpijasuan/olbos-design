import "server-only";
import { db } from "@/lib/db";
import { getServerSession } from "@/lib/get-session";

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  constructor(message = "Forbidden") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export async function requireUser() {
  const session = await getServerSession();
  if (!session?.user) throw new UnauthorizedError();
  return session.user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.platformRole !== "ADMIN" && user.platformRole !== "SUPER_ADMIN") {
    throw new ForbiddenError("Admin access required");
  }
  return user;
}

/** Confirms the current user may manage the given event (host or org member). */
export async function requireEventAccess(eventId: string) {
  const user = await requireUser();
  if (user.platformRole === "ADMIN" || user.platformRole === "SUPER_ADMIN") {
    const event = await db.event.findUniqueOrThrow({ where: { id: eventId } });
    return { user, event };
  }

  const event = await db.event.findUnique({ where: { id: eventId } });
  if (!event) throw new ForbiddenError("Event not found");

  if (event.hostId === user.id) return { user, event };

  if (event.organizationId) {
    const membership = await db.membership.findUnique({
      where: { organizationId_userId: { organizationId: event.organizationId, userId: user.id } },
    });
    if (membership) return { user, event };
  }

  throw new ForbiddenError("You do not have access to this event");
}
