import { CountdownTimer } from "@/components/invitation/countdown-timer";
import { ScheduleList } from "@/components/invitation/schedule-list";
import { StoryTimeline } from "@/components/invitation/story-timeline";
import { GalleryGrid } from "@/components/invitation/gallery-grid";
import { VenueMap } from "@/components/invitation/venue-map";
import { BackgroundEffect } from "@/components/invitation/background-effect";
import type { InvitationTemplateProps } from "@/components/invitation/types";
import { themeStyleVars, heroFontClass } from "@/lib/theme-tokens";
import { cn } from "@/lib/utils";

export function ModernTemplate({ event, content, theme, rsvpSlot }: InvitationTemplateProps) {
  const startDate = new Date(event.startAt);
  const dateLabel = startDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="relative isolate font-sans" style={themeStyleVars(theme)}>
      <BackgroundEffect type={content.backgroundEffect} />
      <div className="relative z-10">
      <section className="grid min-h-[80vh] grid-cols-1 items-center gap-10 px-6 py-24 sm:px-12 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold tracking-[0.3em] text-[var(--event-primary)] uppercase">
            {dateLabel}
          </p>
          <h1 className={cn("mt-4 text-5xl leading-[1.05] sm:text-6xl", heroFontClass(theme, "font-bold"))}>
            {event.title}
          </h1>
          {content.greeting && (
            <p className="mt-6 max-w-md text-base text-neutral-600">{content.greeting}</p>
          )}
          <CountdownTimer
            target={startDate}
            className="mt-10 grid grid-cols-4 gap-4 border-t border-neutral-200 pt-8 text-[var(--event-text)]"
          />
        </div>
        <div className="h-64 w-full rounded-2xl bg-[linear-gradient(135deg,var(--emerald)_0%,var(--champagne)_100%)] lg:h-96" />
      </section>

      {content.schedule.length > 0 && (
        <section className="border-t border-neutral-200 px-6 py-20 sm:px-12">
          <h2 className="font-display text-3xl font-bold">Schedule</h2>
          <ScheduleList items={content.schedule} className="mt-8 max-w-xl divide-y divide-neutral-200" />
        </section>
      )}

      {content.storyTimeline.length > 0 && (
        <section className="border-t border-neutral-200 px-6 py-20 sm:px-12">
          <h2 className="font-display text-3xl font-bold">Our Story</h2>
          <StoryTimeline
            items={content.storyTimeline}
            className="mt-10 max-w-xl text-neutral-900"
            lineClassName="bg-neutral-200"
          />
        </section>
      )}

      {(event.venueName || event.venueAddress) && (
        <section className="border-t border-neutral-200 px-6 py-20 sm:px-12">
          <h2 className="font-display text-3xl font-bold">Venue</h2>
          <p className="mt-4 text-lg font-medium">{event.venueName}</p>
          <p className="mt-1 text-neutral-600">{event.venueAddress}</p>
          <VenueMap
            venueName={event.venueName}
            venueAddress={event.venueAddress}
            className="mt-8 max-w-2xl overflow-hidden rounded-xl border border-neutral-200"
          />
        </section>
      )}

      {content.dressCode && (
        <section className="border-t border-neutral-200 px-6 py-16 sm:px-12">
          <h2 className="font-display text-2xl font-bold">Dress Code</h2>
          <p className="mt-2 text-neutral-600">{content.dressCode}</p>
        </section>
      )}

      {content.galleryUrls.length > 0 && (
        <section className="border-t border-neutral-200 px-6 py-20 sm:px-12">
          <h2 className="font-display text-3xl font-bold">Gallery</h2>
          <GalleryGrid urls={content.galleryUrls} className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4" />
        </section>
      )}

      {(content.accommodation || content.transportation) && (
        <section className="border-t border-neutral-200 px-6 py-16 sm:px-12">
          <div className="grid gap-8 sm:grid-cols-2">
            {content.accommodation && (
              <div>
                <h3 className="text-sm font-semibold tracking-widest text-[var(--event-primary)] uppercase">
                  Accommodation
                </h3>
                <p className="mt-2 text-neutral-600">{content.accommodation}</p>
              </div>
            )}
            {content.transportation && (
              <div>
                <h3 className="text-sm font-semibold tracking-widest text-[var(--event-primary)] uppercase">
                  Transportation
                </h3>
                <p className="mt-2 text-neutral-600">{content.transportation}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {rsvpSlot && (
        <section className="border-t border-neutral-200 px-6 py-20 sm:px-12">
          <h2 className="font-display text-3xl font-bold">RSVP</h2>
          <div className="mt-8 max-w-lg">{rsvpSlot}</div>
        </section>
      )}

      {(content.contactName || content.contactEmail || content.contactPhone) && (
        <footer className="border-t border-neutral-200 px-6 py-12 text-sm text-neutral-500 sm:px-12">
          <p>Questions? Contact {content.contactName}</p>
          <p>{[content.contactPhone, content.contactEmail].filter(Boolean).join(" · ")}</p>
        </footer>
      )}
      </div>
    </div>
  );
}
