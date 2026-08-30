import "server-only";
import { db } from "@/lib/db";
import { resend, FROM_EMAIL, isEmailConfigured } from "@/lib/resend";
import { titleCase, formatDateRange } from "@/lib/format";
import type { RsvpSubmitPayload } from "@/validations/rsvp";

export async function submitRsvp(eventSlug: string, input: RsvpSubmitPayload) {
  const event = await db.event.findUnique({ where: { slug: eventSlug } });
  if (!event) throw new Error("Event not found");

  const email = input.email || null;

  let guest = email
    ? await db.guest.findFirst({ where: { eventId: event.id, email } })
    : await db.guest.findFirst({
        where: { eventId: event.id, fullName: { equals: input.fullName, mode: "insensitive" } },
      });

  if (!guest) {
    guest = await db.guest.create({
      data: {
        eventId: event.id,
        fullName: input.fullName,
        email,
        invitationStatus: "OPENED",
      },
    });
  } else if (guest.invitationStatus === "NOT_SENT" || guest.invitationStatus === "SENT") {
    guest = await db.guest.update({
      where: { id: guest.id },
      data: { invitationStatus: "OPENED", invitationOpenedAt: guest.invitationOpenedAt ?? new Date() },
    });
  }

  const rsvp = await db.rsvpResponse.upsert({
    where: { guestId: guest.id },
    create: {
      guestId: guest.id,
      status: input.status,
      plusOneCount: input.plusOneCount,
      mealPreference: input.mealPreference || null,
      dietaryRestrictions: input.dietaryRestrictions || null,
      needsTransportation: input.needsTransportation,
      needsHotel: input.needsHotel,
      message: input.message || null,
    },
    update: {
      status: input.status,
      plusOneCount: input.plusOneCount,
      mealPreference: input.mealPreference || null,
      dietaryRestrictions: input.dietaryRestrictions || null,
      needsTransportation: input.needsTransportation,
      needsHotel: input.needsHotel,
      message: input.message || null,
      respondedAt: new Date(),
    },
  });

  await db.analyticsEvent.create({
    data: { eventId: event.id, type: "RSVP_SUBMITTED", metadata: { status: input.status } },
  });

  if (email && isEmailConfigured) {
    await sendRsvpConfirmationEmail({ to: email, guestName: input.fullName, event, status: input.status });
  }

  return rsvp;
}

async function sendRsvpConfirmationEmail(params: {
  to: string;
  guestName: string;
  event: { title: string; startAt: Date; venueName: string | null };
  status: string;
}) {
  const { to, guestName, event, status } = params;
  const statusLabel = titleCase(status);

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `RSVP confirmed: ${event.title}`,
    text: [
      `Hi ${guestName},`,
      "",
      `Thanks for responding to ${event.title}. Your RSVP status: ${statusLabel}.`,
      "",
      `When: ${formatDateRange(event.startAt)}`,
      event.venueName ? `Where: ${event.venueName}` : null,
      "",
      "We look forward to celebrating with you!",
    ]
      .filter(Boolean)
      .join("\n"),
  });
}
