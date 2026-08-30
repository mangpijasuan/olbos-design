import {
  CalendarClock,
  QrCode,
  Users,
  BarChart3,
  Mail,
  MapPinned,
} from "lucide-react";

const FEATURES = [
  {
    icon: CalendarClock,
    title: "Elegant digital invitations",
    description:
      "Countdown timers, animated openings, story timelines, dress code, and venue maps — all in one shareable link.",
  },
  {
    icon: Users,
    title: "Effortless guest management",
    description:
      "Organize guests into groups, tag VIPs, and track invitation status at a glance.",
  },
  {
    icon: Mail,
    title: "RSVP that just works",
    description:
      "Accept, decline, or maybe — with plus-ones, meal preferences, dietary needs, and custom questions.",
  },
  {
    icon: QrCode,
    title: "QR check-in at the door",
    description:
      "Every guest gets a signed, unique QR code. Scan on arrival for instant, live attendance tracking.",
  },
  {
    icon: MapPinned,
    title: "Venue & schedule, made clear",
    description: "Embedded maps, multi-part schedules, and accommodation details guests can trust.",
  },
  {
    icon: BarChart3,
    title: "Real analytics",
    description:
      "Track invitation views, RSVP rate, and check-in counts as your event approaches.",
  },
];

export function Features() {
  return (
    <section id="features" className="border-y border-border/60 bg-card/40 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-medium tracking-widest text-champagne uppercase">
            Everything included
          </span>
          <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
            Built for hosts who care about every detail
          </h2>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="rounded-xl border border-border/60 bg-background p-6">
              <feature.icon className="h-6 w-6 text-emerald" />
              <h3 className="mt-4 font-display text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
