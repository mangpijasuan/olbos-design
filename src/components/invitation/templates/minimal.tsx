import { CountdownTimer } from "@/components/invitation/countdown-timer";
import { ScheduleList } from "@/components/invitation/schedule-list";
import { StoryTimeline } from "@/components/invitation/story-timeline";
import { GalleryGrid } from "@/components/invitation/gallery-grid";
import { VenueMap } from "@/components/invitation/venue-map";
import { BackgroundEffect } from "@/components/invitation/background-effect";
import type { InvitationTemplateProps } from "@/components/invitation/types";

export function MinimalTemplate({ event, content, rsvpSlot }: InvitationTemplateProps) {
  const startDate = new Date(event.startAt);
  const dateLabel = startDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="relative isolate bg-[#f7f8f4] font-sans text-[#1c231e]">
      <BackgroundEffect type={content.backgroundEffect} />
      <div className="relative z-10">
      <section className="mx-auto flex max-w-xl flex-col items-center px-6 py-28 text-center">
        <p className="text-[11px] tracking-[0.4em] text-emerald uppercase">{dateLabel}</p>
        <h1 className="mt-8 font-display text-4xl font-medium sm:text-5xl">{event.title}</h1>
        {content.greeting && (
          <p className="mt-6 text-sm leading-relaxed text-[#1c231e]/70">{content.greeting}</p>
        )}

        <div className="mt-12 h-px w-16 bg-emerald/40" />

        <CountdownTimer target={startDate} className="mt-12 grid grid-cols-4 gap-8 text-emerald" />
      </section>

      {content.schedule.length > 0 && (
        <section className="border-t border-[#1c231e]/10 px-6 py-16">
          <div className="mx-auto max-w-md">
            <h2 className="text-xs tracking-[0.3em] text-emerald uppercase">Schedule</h2>
            <ScheduleList items={content.schedule} className="mt-6 divide-y divide-[#1c231e]/10" />
          </div>
        </section>
      )}

      {content.storyTimeline.length > 0 && (
        <section className="border-t border-[#1c231e]/10 px-6 py-16">
          <div className="mx-auto max-w-md">
            <h2 className="text-xs tracking-[0.3em] text-emerald uppercase">Our Story</h2>
            <StoryTimeline
              items={content.storyTimeline}
              className="mt-8"
              lineClassName="bg-[#1c231e]/15"
            />
          </div>
        </section>
      )}

      {(event.venueName || event.venueAddress) && (
        <section className="border-t border-[#1c231e]/10 px-6 py-16">
          <div className="mx-auto max-w-md text-center">
            <h2 className="text-xs tracking-[0.3em] text-emerald uppercase">Venue</h2>
            <p className="mt-4 font-medium">{event.venueName}</p>
            <p className="mt-1 text-sm text-[#1c231e]/60">{event.venueAddress}</p>
            <VenueMap
              venueName={event.venueName}
              venueAddress={event.venueAddress}
              className="mt-8 overflow-hidden rounded-md border border-[#1c231e]/10"
            />
          </div>
        </section>
      )}

      {content.dressCode && (
        <section className="border-t border-[#1c231e]/10 px-6 py-14 text-center">
          <h2 className="text-xs tracking-[0.3em] text-emerald uppercase">Dress Code</h2>
          <p className="mt-3 text-sm text-[#1c231e]/70">{content.dressCode}</p>
        </section>
      )}

      {content.galleryUrls.length > 0 && (
        <section className="border-t border-[#1c231e]/10 px-6 py-16">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-center text-xs tracking-[0.3em] text-emerald uppercase">
              Gallery
            </h2>
            <GalleryGrid urls={content.galleryUrls} className="mt-8 grid grid-cols-3 gap-2" />
          </div>
        </section>
      )}

      {(content.accommodation || content.transportation) && (
        <section className="border-t border-[#1c231e]/10 px-6 py-14">
          <div className="mx-auto grid max-w-md gap-8 sm:grid-cols-2">
            {content.accommodation && (
              <div>
                <h3 className="text-xs tracking-[0.3em] text-emerald uppercase">Accommodation</h3>
                <p className="mt-2 text-sm text-[#1c231e]/70">{content.accommodation}</p>
              </div>
            )}
            {content.transportation && (
              <div>
                <h3 className="text-xs tracking-[0.3em] text-emerald uppercase">Transportation</h3>
                <p className="mt-2 text-sm text-[#1c231e]/70">{content.transportation}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {rsvpSlot && (
        <section className="border-t border-[#1c231e]/10 px-6 py-20">
          <div className="mx-auto max-w-md">
            <h2 className="text-center text-xs tracking-[0.3em] text-emerald uppercase">RSVP</h2>
            <div className="mt-8">{rsvpSlot}</div>
          </div>
        </section>
      )}

      {(content.contactName || content.contactEmail || content.contactPhone) && (
        <footer className="border-t border-[#1c231e]/10 px-6 py-12 text-center text-xs text-[#1c231e]/50">
          <p>Questions? Contact {content.contactName}</p>
          <p>{[content.contactPhone, content.contactEmail].filter(Boolean).join(" · ")}</p>
        </footer>
      )}
      </div>
    </div>
  );
}
