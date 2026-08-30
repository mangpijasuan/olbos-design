import { CountdownTimer } from "@/components/invitation/countdown-timer";
import { ScheduleList } from "@/components/invitation/schedule-list";
import { StoryTimeline } from "@/components/invitation/story-timeline";
import { GalleryGrid } from "@/components/invitation/gallery-grid";
import { VenueMap } from "@/components/invitation/venue-map";
import { BackgroundEffect } from "@/components/invitation/background-effect";
import type { InvitationTemplateProps } from "@/components/invitation/types";

export function LuxuryTemplate({ event, content, rsvpSlot }: InvitationTemplateProps) {
  const startDate = new Date(event.startAt);
  const dateLabel = startDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className="relative isolate font-sans text-[#3d2b28]"
      style={{ background: "linear-gradient(180deg, #fdf6f1 0%, #f9e9e2 55%, #f2d9d2 100%)" }}
    >
      <BackgroundEffect type={content.backgroundEffect} />
      <div className="relative z-10">
      <section className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-6 py-24 text-center">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_20%,color-mix(in_oklch,var(--rose-gold)_16%,transparent),transparent)]"
        />
        <p className="relative text-xs tracking-[0.3em] text-rose-gold uppercase">
          {content.hostNames || event.title}
        </p>
        <h1 className="relative mt-6 font-script text-6xl text-rose-gold sm:text-7xl">
          {event.title}
        </h1>
        <p className="relative mt-6 max-w-md text-sm leading-relaxed text-[#3d2b28]/80">
          {content.greeting || "We joyfully invite you to celebrate with us."}
        </p>
        <p className="relative mt-8 text-sm tracking-widest text-[#3d2b28]/70 uppercase">
          {dateLabel}
        </p>

        <CountdownTimer
          target={startDate}
          className="relative mt-10 grid grid-cols-4 gap-6 text-rose-gold"
        />
      </section>

      {content.storyTimeline.length > 0 && (
        <section className="mx-auto max-w-2xl px-6 py-20">
          <h2 className="text-center font-script text-4xl text-rose-gold">Our Story</h2>
          <StoryTimeline items={content.storyTimeline} className="mt-12" lineClassName="bg-rose-gold/30" />
        </section>
      )}

      {content.schedule.length > 0 && (
        <section className="border-t border-rose-gold/20 px-6 py-20">
          <div className="mx-auto max-w-xl">
            <h2 className="text-center font-script text-4xl text-rose-gold">Schedule</h2>
            <ScheduleList items={content.schedule} className="mt-10 divide-y divide-rose-gold/15" />
          </div>
        </section>
      )}

      {(event.venueName || event.venueAddress) && (
        <section className="border-t border-rose-gold/20 px-6 py-20">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="font-script text-4xl text-rose-gold">Venue</h2>
            <p className="mt-4 font-display text-lg">{event.venueName}</p>
            <p className="mt-1 text-sm text-[#3d2b28]/70">{event.venueAddress}</p>
            <VenueMap
              venueName={event.venueName}
              venueAddress={event.venueAddress}
              className="mt-8 overflow-hidden rounded-lg border border-rose-gold/25"
            />
          </div>
        </section>
      )}

      {content.dressCode && (
        <section className="border-t border-rose-gold/20 px-6 py-16 text-center">
          <h2 className="font-script text-3xl text-rose-gold">Dress Code</h2>
          <p className="mt-3 text-[#3d2b28]/80">{content.dressCode}</p>
        </section>
      )}

      {content.galleryUrls.length > 0 && (
        <section className="border-t border-rose-gold/20 px-6 py-20">
          <h2 className="text-center font-script text-4xl text-rose-gold">Gallery</h2>
          <GalleryGrid urls={content.galleryUrls} className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3" />
        </section>
      )}

      {(content.accommodation || content.transportation) && (
        <section className="border-t border-rose-gold/20 px-6 py-16">
          <div className="mx-auto grid max-w-2xl gap-8 sm:grid-cols-2">
            {content.accommodation && (
              <div>
                <h3 className="font-display text-sm tracking-widest text-rose-gold uppercase">
                  Accommodation
                </h3>
                <p className="mt-2 text-sm text-[#3d2b28]/80">{content.accommodation}</p>
              </div>
            )}
            {content.transportation && (
              <div>
                <h3 className="font-display text-sm tracking-widest text-rose-gold uppercase">
                  Transportation
                </h3>
                <p className="mt-2 text-sm text-[#3d2b28]/80">{content.transportation}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {rsvpSlot && (
        <section className="border-t border-rose-gold/20 px-6 py-20">
          <div className="mx-auto max-w-lg">
            <h2 className="text-center font-script text-4xl text-rose-gold">RSVP</h2>
            <div className="mt-8">{rsvpSlot}</div>
          </div>
        </section>
      )}

      {(content.contactName || content.contactEmail || content.contactPhone) && (
        <footer className="border-t border-rose-gold/20 px-6 py-12 text-center text-sm text-[#3d2b28]/60">
          <p>Questions? Contact {content.contactName}</p>
          <p>{[content.contactPhone, content.contactEmail].filter(Boolean).join(" · ")}</p>
        </footer>
      )}
      </div>
    </div>
  );
}
