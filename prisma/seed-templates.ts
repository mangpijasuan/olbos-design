import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { TEMPLATE_DEFINITIONS } from "../src/lib/templates";
import { EMPTY_INVITATION_CONTENT, type InvitationContent } from "../src/validations/invitation";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

const DEMO_HOST_EMAIL = "demo@olbosevent.com";

type EventType =
  | "WEDDING"
  | "BIRTHDAY"
  | "CONFERENCE"
  | "CORPORATE"
  | "GRADUATION"
  | "BABY_SHOWER"
  | "CHURCH"
  | "MEMORIAL"
  | "FESTIVAL"
  | "FUNDRAISER"
  | "NETWORKING"
  | "HOLIDAY_PARTY"
  | "COMMUNITY_EVENT"
  | "CUSTOM";

type DemoEvent = {
  templateKey: string;
  slug: string;
  title: string;
  type: EventType;
  startAt: Date;
  venueName: string;
  venueAddress: string;
  content: InvitationContent;
};

function content(overrides: Partial<InvitationContent>): InvitationContent {
  return { ...EMPTY_INVITATION_CONTENT, ...overrides };
}

function gallery(key: string) {
  return [1, 2, 3].map((n) => `/demo-gallery/${key}-${n}.svg`);
}

const DEMOS: DemoEvent[] = [
  {
    templateKey: "luxury",
    slug: "demo-luxury",
    title: "Amara & Julian's Wedding",
    type: "WEDDING",
    startAt: new Date("2026-10-17T22:00:00Z"),
    venueName: "The Wildflower Conservatory",
    venueAddress: "482 Botanical Way, Austin, TX",
    content: content({
      hostNames: "Amara & Julian",
      greeting:
        "With hearts full of joy, we invite you to witness our vows and celebrate the beginning of forever.",
      dressCode: "Black tie optional — rose gold & blush accents welcome",
      accommodation:
        "A block of rooms is held at The Wildflower Hotel through October 15th under 'Amara & Julian'.",
      transportation: "Shuttle service runs every 30 minutes from The Wildflower Hotel starting at 4:30 PM.",
      contactName: "Sophia Reyes (Wedding Coordinator)",
      contactPhone: "+1 (512) 555-0142",
      contactEmail: "sophia@wildflowerevents.com",
      schedule: [
        { time: "5:00 PM", title: "Guests Arrive", description: "Welcome champagne on the conservatory terrace." },
        { time: "5:30 PM", title: "Ceremony", description: "Exchange of vows beneath the glass atrium." },
        { time: "7:00 PM", title: "Reception & Dinner", description: "Dinner, dancing, and toasts under string lights." },
      ],
      storyTimeline: [
        { date: "June 2021", title: "First Met", description: "A chance introduction at a mutual friend's rooftop dinner." },
        { date: "March 2024", title: "The Proposal", description: "Julian proposed at sunrise on the same rooftop, four years later." },
        { date: "October 2026", title: "The Wedding", description: "Surrounded by everyone we love, we say 'I do.'" },
      ],
      galleryUrls: gallery("luxury"),
      showEnvelopeIntro: true,
      backgroundEffect: "golden-particles",
    }),
  },
  {
    templateKey: "modern",
    slug: "demo-modern",
    title: "Meridian Design Summit 2026",
    type: "CONFERENCE",
    startAt: new Date("2026-11-04T17:00:00Z"),
    venueName: "Meridian Convention Hall",
    venueAddress: "1200 Harbor Blvd, San Francisco, CA",
    content: content({
      hostNames: "Meridian Design Summit",
      greeting: "Join 800+ designers and product leaders for two days of talks, workshops, and connection.",
      dressCode: "Business casual",
      accommodation: "Discounted rooms available at The Harbor Hotel — code MERIDIAN26.",
      transportation: "Complimentary shuttle from downtown hotels departs every 20 minutes starting at 8:00 AM.",
      contactName: "Summit Operations Team",
      contactPhone: "+1 (415) 555-0199",
      contactEmail: "hello@meridiandesignsummit.com",
      schedule: [
        { time: "9:00 AM", title: "Doors Open & Registration", description: "Coffee, badge pickup, and networking." },
        { time: "10:00 AM", title: "Opening Keynote", description: "The Future of Product Design, live on the main stage." },
        { time: "1:00 PM", title: "Breakout Workshops", description: "Choose from six hands-on sessions across three tracks." },
      ],
      galleryUrls: gallery("modern"),
      showEnvelopeIntro: true,
      backgroundEffect: "none",
    }),
  },
  {
    templateKey: "floral",
    slug: "demo-floral",
    title: "Priya & Diego's Garden Wedding",
    type: "WEDDING",
    startAt: new Date("2026-09-12T23:00:00Z"),
    venueName: "Rosewood Garden Estate",
    venueAddress: "77 Blossom Hill Road, Portland, OR",
    content: content({
      hostNames: "Priya & Diego",
      greeting: "Together with our families, we invite you to celebrate our wedding day among the roses.",
      dressCode: "Garden formal — florals encouraged",
      accommodation: "A room block is available at the Rosewood Inn through September 10th.",
      transportation: "Parking and a golf-cart shuttle are available on-site.",
      contactName: "Maya Chen (Day-of Coordinator)",
      contactPhone: "+1 (503) 555-0176",
      contactEmail: "maya@rosewoodgardenevents.com",
      schedule: [
        { time: "4:00 PM", title: "Guests Arrive", description: "Lemonade and garden seating on the lawn." },
        { time: "4:30 PM", title: "Ceremony", description: "Vows beneath the rose arbor." },
        { time: "6:00 PM", title: "Cocktail Hour & Reception", description: "Dinner and dancing under the string-lit pergola." },
      ],
      storyTimeline: [
        { date: "May 2022", title: "First Met", description: "Introduced by mutual friends at a garden club plant swap." },
        { date: "February 2025", title: "The Proposal", description: "Diego proposed among the roses on a quiet spring evening." },
        { date: "September 2026", title: "The Wedding", description: "We say 'I do' surrounded by family, friends, and full bloom." },
      ],
      galleryUrls: gallery("floral"),
      showEnvelopeIntro: true,
      backgroundEffect: "petals",
    }),
  },
  {
    templateKey: "minimal",
    slug: "demo-minimal",
    title: "Ella's 30th Birthday",
    type: "BIRTHDAY",
    startAt: new Date("2026-09-26T23:00:00Z"),
    venueName: "The Green Room",
    venueAddress: "515 Pine Street, Seattle, WA",
    content: content({
      hostNames: "Ella Martinez",
      greeting: "Thirty and thriving — come celebrate with cocktails, good music, and better company.",
      dressCode: "Cocktail attire, emerald accents welcome",
      contactName: "Ella Martinez",
      contactEmail: "ella@example.com",
      schedule: [
        { time: "7:00 PM", title: "Doors Open", description: "Welcome drinks and a photo booth." },
        { time: "8:00 PM", title: "Dinner", description: "Small plates and a toast." },
        { time: "9:30 PM", title: "Dancing", description: "DJ set until midnight." },
      ],
      galleryUrls: gallery("minimal"),
      showEnvelopeIntro: true,
      backgroundEffect: "none",
    }),
  },
  {
    templateKey: "navy",
    slug: "demo-navy",
    title: "Sterling Charity Gala",
    type: "FUNDRAISER",
    startAt: new Date("2026-12-06T00:30:00Z"),
    venueName: "The Sterling Ballroom",
    venueAddress: "900 Fifth Avenue, New York, NY",
    content: content({
      hostNames: "The Sterling Foundation",
      greeting: "An evening of elegance in support of children's literacy programs nationwide.",
      dressCode: "Black tie",
      accommodation: "Preferred rates are available at The Sterling Hotel through December 3rd.",
      transportation: "Valet parking is available at the main entrance.",
      contactName: "Gala Committee",
      contactEmail: "gala@sterlingfoundation.org",
      schedule: [
        { time: "6:30 PM", title: "Cocktail Reception", description: "Champagne and live jazz in the Grand Foyer." },
        { time: "7:30 PM", title: "Dinner & Program", description: "Seated dinner followed by the evening's remarks and the live auction." },
        { time: "9:30 PM", title: "Dancing", description: "The orchestra takes the stage in the Sterling Ballroom." },
      ],
      galleryUrls: gallery("navy"),
      showEnvelopeIntro: true,
      backgroundEffect: "sparkles",
    }),
  },
];

async function main() {
  const host = await db.user.upsert({
    where: { email: DEMO_HOST_EMAIL },
    update: { name: "OLBOS DESIGN Demo" },
    create: {
      email: DEMO_HOST_EMAIL,
      name: "OLBOS DESIGN Demo",
      emailVerified: true,
    },
  });

  for (const demo of DEMOS) {
    const templateDef = TEMPLATE_DEFINITIONS.find((t) => t.key === demo.templateKey);
    if (!templateDef) throw new Error(`Unknown template key: ${demo.templateKey}`);

    const template = await db.template.upsert({
      where: { key: templateDef.key },
      update: {
        name: templateDef.name,
        category: templateDef.category,
        description: templateDef.description,
        previewImage: templateDef.swatch,
      },
      create: {
        key: templateDef.key,
        name: templateDef.name,
        category: templateDef.category,
        description: templateDef.description,
        previewImage: templateDef.swatch,
      },
    });

    const existing = await db.event.findUnique({ where: { slug: demo.slug } });

    const eventId = existing
      ? (
          await db.event.update({
            where: { id: existing.id },
            data: {
              hostId: host.id,
              title: demo.title,
              type: demo.type,
              status: "PUBLISHED",
              visibility: "PUBLIC",
              startAt: demo.startAt,
              timezone: "America/Chicago",
              venueName: demo.venueName,
              venueAddress: demo.venueAddress,
            },
          })
        ).id
      : (
          await db.event.create({
            data: {
              hostId: host.id,
              title: demo.title,
              type: demo.type,
              status: "PUBLISHED",
              visibility: "PUBLIC",
              slug: demo.slug,
              startAt: demo.startAt,
              timezone: "America/Chicago",
              venueName: demo.venueName,
              venueAddress: demo.venueAddress,
            },
          })
        ).id;

    await db.invitation.upsert({
      where: { eventId },
      update: { templateId: template.id, content: demo.content },
      create: { eventId, templateId: template.id, content: demo.content, theme: {} },
    });

    console.log(`${existing ? "Updated" : "Created"} demo event: /invite/${demo.slug}`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
