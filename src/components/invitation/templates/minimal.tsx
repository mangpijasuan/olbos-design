import { CountdownTimer } from "@/components/invitation/countdown-timer";
import { ScheduleList } from "@/components/invitation/schedule-list";
import { StoryTimeline } from "@/components/invitation/story-timeline";
import { GalleryGrid } from "@/components/invitation/gallery-grid";
import { VenueMap } from "@/components/invitation/venue-map";
import { BackgroundEffect } from "@/components/invitation/background-effect";
import type { InvitationTemplateProps } from "@/components/invitation/types";
import { themeStyleVars, heroFontClass } from "@/lib/theme-tokens";
import { cn } from "@/lib/utils";

export function MinimalTemplate({ event, content, theme, rsvpSlot }: InvitationTemplateProps) {
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
      <section className="mx-auto flex max-w-xl flex-col items-center px-6 py-28 text-center">
        <p className="text-[11px] tracking-[0.4em] text-[var(--event-primary)] uppercase">{dateLabel}</p>
        <h1 className={cn("mt-8 text-4xl sm:text-5xl", heroFontClass(theme, "font-medium"))}>
          {event.title}
        </h1>
        {content.greeting && (
          <p className="mt-6 text-sm leading-relaxed text-[var(--event-text)]/70">{content.greeting}</p>
        )}

        <div className="mt-12 h-px w-16 bg-[var(--event-primary)]/40" />

        <CountdownTimer target={startDate} className="mt-12 grid grid-cols-4 gap-8 text-[var(--event-primary)]" />
      </section>

      {content.schedule.length > 0 && (
        <section className="border-t border-[var(--event-text)]/10 px-6 py-16">
          <div className="mx-auto max-w-md">
            <h2 className="text-xs tracking-[0.3em] text-[var(--event-primary)] uppercase">Schedule</h2>
            <ScheduleList items={content.schedule} className="mt-6 divide-y divide-[var(--event-text)]/10" />
          </div>
        </section>
      )}

      {content.storyTimeline.length > 0 && (
        <section className="border-t border-[var(--event-text)]/10 px-6 py-16">
          <div className="mx-auto max-w-md">
            <h2 className="text-xs tracking-[0.3em] text-[var(--event-primary)] uppercase">Our Story</h2>
            <StoryTimeline
              items={content.storyTimeline}
              className="mt-8"
              lineClassName="bg-[var(--event-text)]/15"
            />
          </div>
        </section>
      )}

      {(event.venueName || event.venueAddress) && (
        <section className="border-t border-[var(--event-text)]/10 px-6 py-16">
          <div className="mx-auto max-w-md text-center">
            <h2 className="text-xs tracking-[0.3em] text-[var(--event-primary)] uppercase">Venue</h2>
            <p className="mt-4 font-medium">{event.venueName}</p>
            <p className="mt-1 text-sm text-[var(--event-text)]/60">{event.venueAddress}</p>
            <VenueMap
              venueName={event.venueName}
              venueAddress={event.venueAddress}
              className="mt-8 overflow-hidden rounded-md border border-[var(--event-text)]/10"
            />
          </div>
        </section>
      )}

      {content.dressCode && (
        <section className="border-t border-[var(--event-text)]/10 px-6 py-14 text-center">
          <h2 className="text-xs tracking-[0.3em] text-[var(--event-primary)] uppercase">Dress Code</h2>
          <p className="mt-3 text-sm text-[var(--event-text)]/70">{content.dressCode}</p>
        </section>
      )}

      {content.galleryUrls.length > 0 && (
        <section className="border-t border-[var(--event-text)]/10 px-6 py-16">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-center text-xs tracking-[0.3em] text-[var(--event-primary)] uppercase">
              Gallery
            </h2>
            <GalleryGrid urls={content.galleryUrls} className="mt-8 grid grid-cols-3 gap-2" />
          </div>
        </section>
      )}

      {(content.accommodation || content.transportation) && (
        <section className="border-t border-[var(--event-text)]/10 px-6 py-14">
          <div className="mx-auto grid max-w-md gap-8 sm:grid-cols-2">
            {content.accommodation && (
              <div>
                <h3 className="text-xs tracking-[0.3em] text-[var(--event-primary)] uppercase">Accommodation</h3>
                <p className="mt-2 text-sm text-[var(--event-text)]/70">{content.accommodation}</p>
              </div>
            )}
            {content.transportation && (
              <div>
                <h3 className="text-xs tracking-[0.3em] text-[var(--event-primary)] uppercase">Transportation</h3>
                <p className="mt-2 text-sm text-[var(--event-text)]/70">{content.transportation}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {rsvpSlot && (
        <section className="border-t border-[var(--event-text)]/10 px-6 py-20">
          <div className="mx-auto max-w-md">
            <h2 className="text-center text-xs tracking-[0.3em] text-[var(--event-primary)] uppercase">RSVP</h2>
            <div className="mt-8">{rsvpSlot}</div>
          </div>
        </section>
      )}

      {(content.contactName || content.contactEmail || content.contactPhone) && (
        <footer className="border-t border-[var(--event-text)]/10 px-6 py-12 text-center text-xs text-[var(--event-text)]/50">
          <p>Questions? Contact {content.contactName}</p>
          <p>{[content.contactPhone, content.contactEmail].filter(Boolean).join(" · ")}</p>
        </footer>
      )}
      </div>
    </div>
  );
}
