import { CountdownTimer } from "@/components/invitation/countdown-timer";
import { ScheduleList } from "@/components/invitation/schedule-list";
import { StoryTimeline } from "@/components/invitation/story-timeline";
import { GalleryGrid } from "@/components/invitation/gallery-grid";
import { VenueMap } from "@/components/invitation/venue-map";
import { BackgroundEffect } from "@/components/invitation/background-effect";
import type { InvitationTemplateProps } from "@/components/invitation/types";

export function FloralTemplate({ event, content, rsvpSlot }: InvitationTemplateProps) {
  const startDate = new Date(event.startAt);
  const dateLabel = startDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="relative isolate bg-[linear-gradient(180deg,#fdf3f4_0%,#fbeef0_100%)] font-sans text-[#4a2a30]">
      <BackgroundEffect type={content.backgroundEffect} />
      <div className="relative z-10">
      <section className="flex flex-col items-center px-6 py-24 text-center">
        <p className="text-xs tracking-[0.3em] text-rose-gold uppercase">Together with family</p>
        <h1 className="mt-6 font-script text-6xl text-rose-gold sm:text-7xl">{event.title}</h1>
        {content.greeting && (
          <p className="mt-6 max-w-md text-sm leading-relaxed text-[#6b4149]">
            {content.greeting}
          </p>
        )}
        <p className="mt-8 rounded-full border border-rose-gold/40 px-5 py-1.5 text-xs tracking-widest text-rose-gold uppercase">
          {dateLabel}
        </p>

        <CountdownTimer
          target={startDate}
          className="mt-10 grid grid-cols-4 gap-6 text-rose-gold"
        />
      </section>

      {content.storyTimeline.length > 0 && (
        <section className="mx-auto max-w-2xl px-6 py-16">
          <h2 className="text-center font-script text-4xl text-rose-gold">Our Story</h2>
          <StoryTimeline
            items={content.storyTimeline}
            className="mt-10"
            lineClassName="bg-rose-gold/30"
          />
        </section>
      )}

      {content.schedule.length > 0 && (
        <section className="px-6 py-16">
          <div className="mx-auto max-w-xl rounded-3xl bg-white/60 p-8 backdrop-blur">
            <h2 className="text-center font-script text-4xl text-rose-gold">Schedule</h2>
            <ScheduleList items={content.schedule} className="mt-8 divide-y divide-rose-gold/15" />
          </div>
        </section>
      )}

      {(event.venueName || event.venueAddress) && (
        <section className="px-6 py-16 text-center">
          <h2 className="font-script text-4xl text-rose-gold">Venue</h2>
          <p className="mt-4 font-display text-lg">{event.venueName}</p>
          <p className="mt-1 text-sm text-[#6b4149]">{event.venueAddress}</p>
          <VenueMap
            venueName={event.venueName}
            venueAddress={event.venueAddress}
            className="mx-auto mt-8 max-w-2xl overflow-hidden rounded-3xl border border-rose-gold/20"
          />
        </section>
      )}

      {content.dressCode && (
        <section className="px-6 py-14 text-center">
          <h2 className="font-script text-3xl text-rose-gold">Dress Code</h2>
          <p className="mt-3 text-[#6b4149]">{content.dressCode}</p>
        </section>
      )}

      {content.galleryUrls.length > 0 && (
        <section className="px-6 py-16">
          <h2 className="text-center font-script text-4xl text-rose-gold">Gallery</h2>
          <GalleryGrid
            urls={content.galleryUrls}
            className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-3"
          />
        </section>
      )}

      {(content.accommodation || content.transportation) && (
        <section className="px-6 py-14">
          <div className="mx-auto grid max-w-2xl gap-8 sm:grid-cols-2">
            {content.accommodation && (
              <div className="text-center">
                <h3 className="font-script text-2xl text-rose-gold">Accommodation</h3>
                <p className="mt-2 text-sm text-[#6b4149]">{content.accommodation}</p>
              </div>
            )}
            {content.transportation && (
              <div className="text-center">
                <h3 className="font-script text-2xl text-rose-gold">Transportation</h3>
                <p className="mt-2 text-sm text-[#6b4149]">{content.transportation}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {rsvpSlot && (
        <section className="px-6 py-20">
          <div className="mx-auto max-w-lg rounded-3xl bg-white/60 p-8 backdrop-blur">
            <h2 className="text-center font-script text-4xl text-rose-gold">RSVP</h2>
            <div className="mt-8">{rsvpSlot}</div>
          </div>
        </section>
      )}

      {(content.contactName || content.contactEmail || content.contactPhone) && (
        <footer className="px-6 py-12 text-center text-sm text-[#6b4149]/80">
          <p>Questions? Contact {content.contactName}</p>
          <p>{[content.contactPhone, content.contactEmail].filter(Boolean).join(" · ")}</p>
        </footer>
      )}
      </div>
    </div>
  );
}
