import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { resolvePublicEvent, logInviteView } from "@/server/public-invitation-service";
import { PasswordGate } from "@/components/invitation/password-gate";
import { RsvpForm } from "@/components/invitation/rsvp-form";
import { EnvelopeIntro } from "@/components/invitation/envelope-intro";
import { getTemplateComponent } from "@/components/invitation/template-registry";
import { EMPTY_INVITATION_CONTENT } from "@/validations/invitation";
import type { InvitationContent } from "@/validations/invitation";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ src?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await resolvePublicEvent(slug);
  if (result.status !== "ok") return { title: "Invitation" };
  return {
    title: result.event.title,
    description: `You're invited: ${result.event.title}`,
  };
}

export default async function PublicInvitationPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { src } = await searchParams;
  const result = await resolvePublicEvent(slug);

  if (result.status === "not_found") notFound();

  if (result.status === "unpublished") {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 text-center">
        <div>
          <h1 className="font-display text-2xl font-semibold">Invitation not available</h1>
          <p className="mt-2 text-muted-foreground">
            This invitation hasn&apos;t been published yet. Please check back later.
          </p>
        </div>
      </div>
    );
  }

  if (result.status === "password_required") {
    return <PasswordGate slug={slug} eventTitle="This invitation" />;
  }

  const { event, isHostPreview } = result;

  if (!isHostPreview) {
    void logInviteView(event.id, src ?? null);
  }

  const content: InvitationContent = {
    ...EMPTY_INVITATION_CONTENT,
    ...(event.invitation?.content as Partial<InvitationContent> | undefined),
  };
  const TemplateComponent = getTemplateComponent(event.invitation?.template.key ?? "luxury");

  const invitationBody = (
    <div>
      {isHostPreview && event.status !== "PUBLISHED" && (
        <div className="bg-champagne px-4 py-2 text-center text-sm font-medium text-black">
          Preview mode — this invitation is not published yet. Only you can see this.
        </div>
      )}
      <TemplateComponent
        event={{
          title: event.title,
          type: event.eventType.key,
          startAt: event.startAt,
          endAt: event.endAt,
          venueName: event.venueName,
          venueAddress: event.venueAddress,
          venueLat: event.venueLat,
          venueLng: event.venueLng,
          coverImageUrl: event.coverImageUrl,
        }}
        content={content}
        musicUrl={event.invitation?.musicUrl}
        rsvpSlot={<RsvpForm slug={slug} />}
      />
    </div>
  );

  if (!content.showEnvelopeIntro || isHostPreview) {
    return invitationBody;
  }

  return (
    <EnvelopeIntro
      eventKey={event.id}
      title={event.title}
      hostNames={content.hostNames}
      greeting={content.greeting}
    >
      {invitationBody}
    </EnvelopeIntro>
  );
}
