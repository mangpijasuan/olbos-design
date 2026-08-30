import { CountdownTimer } from "@/components/invitation/countdown-timer";
import { ScheduleList } from "@/components/invitation/schedule-list";
import { StoryTimeline } from "@/components/invitation/story-timeline";
import { GalleryGrid } from "@/components/invitation/gallery-grid";
import { VenueMap } from "@/components/invitation/venue-map";
import { BackgroundEffect } from "@/components/invitation/background-effect";
import type { InvitationTemplateProps } from "@/components/invitation/types";

const SILVER = "#a9bfdf";
const GOLD = "#c9a66b";

export function NavyTemplate({ event, content, rsvpSlot }: InvitationTemplateProps) {
  const startDate = new Date(event.startAt);
  const dateLabel = startDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className="relative isolate font-sans text-[#dbe4f2]"
      style={{ background: "linear-gradient(180deg, #0a1428 0%, #0e1c36 55%, #0a1428 100%)" }}
    >
      <BackgroundEffect type={content.backgroundEffect} />
      <div className="relative z-10">
      <section className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-6 py-24 text-center">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 20%, color-mix(in oklch, #6b86ad 22%, transparent), transparent)",
          }}
        />
        <p
          className="relative text-xs tracking-[0.3em] uppercase"
          style={{ color: GOLD }}
        >
          {content.hostNames || event.title}
        </p>
        <h1
          className="relative mt-6 font-display text-6xl font-semibold sm:text-7xl"
          style={{ color: SILVER }}
        >
          {event.title}
        </h1>
        <div
          className="relative mt-6 h-px w-20"
          style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }}
        />
        <p className="relative mt-6 max-w-md text-sm leading-relaxed text-[#dbe4f2]/80">
          {content.greeting || "We joyfully invite you to celebrate with us."}
        </p>
        <p className="relative mt-8 text-sm tracking-widest text-[#dbe4f2]/70 uppercase">
          {dateLabel}
        </p>

        <CountdownTimer
          target={startDate}
          className="relative mt-10 grid grid-cols-4 gap-6 text-[#a9bfdf]"
        />
      </section>

      {content.storyTimeline.length > 0 && (
        <section className="mx-auto max-w-2xl px-6 py-20">
          <h2 className="text-center font-display text-3xl font-semibold" style={{ color: SILVER }}>
            Our Story
          </h2>
          <StoryTimeline
            items={content.storyTimeline}
            className="mt-12"
            lineClassName="bg-[#6b86ad]/30"
          />
        </section>
      )}

      {content.schedule.length > 0 && (
        <section className="border-t border-[#6b86ad]/20 px-6 py-20">
          <div className="mx-auto max-w-xl">
            <h2 className="text-center font-display text-3xl font-semibold" style={{ color: SILVER }}>
              Schedule
            </h2>
            <ScheduleList
              items={content.schedule}
              className="mt-10 divide-y divide-[#6b86ad]/15"
            />
          </div>
        </section>
      )}

      {(event.venueName || event.venueAddress) && (
        <section className="border-t border-[#6b86ad]/20 px-6 py-20">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="font-display text-3xl font-semibold" style={{ color: SILVER }}>
              Venue
            </h2>
            <p className="mt-4 font-display text-lg">{event.venueName}</p>
            <p className="mt-1 text-sm text-[#dbe4f2]/70">{event.venueAddress}</p>
            <VenueMap
              venueName={event.venueName}
              venueAddress={event.venueAddress}
              className="mt-8 overflow-hidden rounded-lg border border-[#6b86ad]/25"
            />
          </div>
        </section>
      )}

      {content.dressCode && (
        <section className="border-t border-[#6b86ad]/20 px-6 py-16 text-center">
          <h2 className="font-display text-2xl font-semibold" style={{ color: SILVER }}>
            Dress Code
          </h2>
          <p className="mt-3 text-[#dbe4f2]/80">{content.dressCode}</p>
        </section>
      )}

      {content.galleryUrls.length > 0 && (
        <section className="border-t border-[#6b86ad]/20 px-6 py-20">
          <h2 className="text-center font-display text-3xl font-semibold" style={{ color: SILVER }}>
            Gallery
          </h2>
          <GalleryGrid
            urls={content.galleryUrls}
            className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3"
          />
        </section>
      )}

      {(content.accommodation || content.transportation) && (
        <section className="border-t border-[#6b86ad]/20 px-6 py-16">
          <div className="mx-auto grid max-w-2xl gap-8 sm:grid-cols-2">
            {content.accommodation && (
              <div>
                <h3
                  className="font-display text-sm tracking-widest uppercase"
                  style={{ color: GOLD }}
                >
                  Accommodation
                </h3>
                <p className="mt-2 text-sm text-[#dbe4f2]/80">{content.accommodation}</p>
              </div>
            )}
            {content.transportation && (
              <div>
                <h3
                  className="font-display text-sm tracking-widest uppercase"
                  style={{ color: GOLD }}
                >
                  Transportation
                </h3>
                <p className="mt-2 text-sm text-[#dbe4f2]/80">{content.transportation}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {rsvpSlot && (
        <section className="border-t border-[#6b86ad]/20 px-6 py-20">
          <div className="mx-auto max-w-lg">
            <h2 className="text-center font-display text-3xl font-semibold" style={{ color: SILVER }}>
              RSVP
            </h2>
            <div className="mt-8">{rsvpSlot}</div>
          </div>
        </section>
      )}

      {(content.contactName || content.contactEmail || content.contactPhone) && (
        <footer className="border-t border-[#6b86ad]/20 px-6 py-12 text-center text-sm text-[#dbe4f2]/60">
          <p>Questions? Contact {content.contactName}</p>
          <p>{[content.contactPhone, content.contactEmail].filter(Boolean).join(" · ")}</p>
        </footer>
      )}
      </div>
    </div>
  );
}
