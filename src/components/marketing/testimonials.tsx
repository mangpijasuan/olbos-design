import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    quote:
      "Our wedding invitation looked like it belonged in a magazine. Guests kept asking where we had it made.",
    name: "Amara & Kofi",
    role: "Wedding, Accra",
  },
  {
    quote:
      "QR check-in saved our team hours at the door. Live headcount on a conference of 800 people, zero chaos.",
    name: "Priya Nandan",
    role: "Conference Organizer",
  },
  {
    quote:
      "The RSVP dashboard made it easy to plan catering down to the dietary restriction. Genuinely stress-free.",
    name: "Daniel Osei",
    role: "60th Birthday Host",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="border-y border-border/60 bg-card/40 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-medium tracking-widest text-champagne uppercase">
            Loved by hosts
          </span>
          <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
            Trusted for life&apos;s most important moments
          </h2>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="rounded-xl border border-border/60 bg-background p-6">
              <div className="flex gap-0.5 text-champagne">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-4 text-sm leading-relaxed text-foreground">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-4 text-sm">
                <span className="font-semibold">{t.name}</span>
                <span className="text-muted-foreground"> &middot; {t.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
