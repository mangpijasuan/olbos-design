import "server-only";
import { db } from "@/lib/db";
import { getServerSession } from "@/lib/get-session";
import { verifyInviteAccessToken, inviteCookieName } from "@/lib/invite-access";
import { cookies } from "next/headers";

export type PublicEventAccessResult =
  | { status: "not_found" }
  | { status: "unpublished" }
  | { status: "password_required"; eventId: string }
  | { status: "ok"; event: NonNullable<Awaited<ReturnType<typeof loadEvent>>>; isHostPreview: boolean };

async function loadEvent(slug: string) {
  return db.event.findUnique({
    where: { slug },
    include: {
      invitation: { include: { template: true } },
      media: { orderBy: { sortOrder: "asc" } },
    },
  });
}

export async function resolvePublicEvent(slug: string): Promise<PublicEventAccessResult> {
  const event = await loadEvent(slug);
  if (!event) return { status: "not_found" };

  const session = await getServerSession();
  const isHostPreview = session?.user?.id === event.hostId;

  if (event.status !== "PUBLISHED" && !isHostPreview) {
    return { status: "unpublished" };
  }

  if (event.visibility === "PASSWORD_PROTECTED" && !isHostPreview) {
    const jar = await cookies();
    const token = jar.get(inviteCookieName(event.id))?.value;
    const verified = event.passwordHash
      ? verifyInviteAccessToken(event.id, event.passwordHash, token)
      : false;
    if (!verified) return { status: "password_required", eventId: event.id };
  }

  return { status: "ok", event, isHostPreview };
}

export async function logInviteView(eventId: string, source: string | null) {
  try {
    await db.analyticsEvent.create({
      data: { eventId, type: "VIEW", source: source ?? undefined },
    });
  } catch {
    // analytics is best-effort — never block the page on a logging failure
  }
}
