import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

type Category = "LIFE_FAMILY" | "CHURCH_FAITH" | "EDUCATION" | "BUSINESS" | "SOCIAL" | "CUSTOM";

type EventTypeSeed = { key: string; label: string; category: Category };

// The full catalog from the OLBOS DESIGN master prompt's §4 event categories.
// A few labels ("Celebration", "Seminar", "Fundraiser") appear in more than
// one of the prompt's example lists — each is kept once, under the category
// that fits best, rather than duplicated across categories.
const CATALOG: EventTypeSeed[] = [
  // Life & Family
  { key: "WEDDING", label: "Wedding", category: "LIFE_FAMILY" },
  { key: "ENGAGEMENT", label: "Engagement", category: "LIFE_FAMILY" },
  { key: "ANNIVERSARY", label: "Anniversary", category: "LIFE_FAMILY" },
  { key: "BIRTHDAY", label: "Birthday", category: "LIFE_FAMILY" },
  { key: "BABY_SHOWER", label: "Baby Shower", category: "LIFE_FAMILY" },
  { key: "BABY_ANNOUNCEMENT", label: "Baby Announcement", category: "LIFE_FAMILY" },
  { key: "BRIDAL_SHOWER", label: "Bridal Shower", category: "LIFE_FAMILY" },
  { key: "QUINCEANERA", label: "Quinceañera", category: "LIFE_FAMILY" },
  { key: "FAMILY_REUNION", label: "Family Reunion", category: "LIFE_FAMILY" },
  { key: "HOUSEWARMING", label: "Housewarming", category: "LIFE_FAMILY" },
  { key: "RETIREMENT", label: "Retirement", category: "LIFE_FAMILY" },
  { key: "CELEBRATION", label: "Celebration", category: "LIFE_FAMILY" },

  // Church & Faith
  { key: "SUNDAY_WORSHIP", label: "Sunday Worship", category: "CHURCH_FAITH" },
  { key: "SUNDAY_SERVICE", label: "Sunday Service", category: "CHURCH_FAITH" },
  { key: "WORSHIP_NIGHT", label: "Worship Night", category: "CHURCH_FAITH" },
  { key: "REVIVAL", label: "Revival", category: "CHURCH_FAITH" },
  { key: "PRAYER_MEETING", label: "Prayer Meeting", category: "CHURCH_FAITH" },
  { key: "BIBLE_STUDY", label: "Bible Study", category: "CHURCH_FAITH" },
  { key: "CHURCH_CONFERENCE", label: "Church Conference", category: "CHURCH_FAITH" },
  { key: "YOUTH_CONFERENCE", label: "Youth Conference", category: "CHURCH_FAITH" },
  { key: "WOMENS_CONFERENCE", label: "Women's Conference", category: "CHURCH_FAITH" },
  { key: "MENS_CONFERENCE", label: "Men's Conference", category: "CHURCH_FAITH" },
  { key: "GOSPEL_CONCERT", label: "Gospel Concert", category: "CHURCH_FAITH" },
  { key: "CHOIR_PROGRAM", label: "Choir Program", category: "CHURCH_FAITH" },
  { key: "CHRISTMAS_SERVICE", label: "Christmas Service", category: "CHURCH_FAITH" },
  { key: "EASTER_SERVICE", label: "Easter Service", category: "CHURCH_FAITH" },
  { key: "BAPTISM", label: "Baptism", category: "CHURCH_FAITH" },
  { key: "COMMUNION", label: "Communion", category: "CHURCH_FAITH" },
  { key: "CHURCH_ANNIVERSARY", label: "Church Anniversary", category: "CHURCH_FAITH" },
  { key: "PASTOR_APPRECIATION", label: "Pastor Appreciation", category: "CHURCH_FAITH" },
  { key: "ORDINATION", label: "Ordination", category: "CHURCH_FAITH" },
  { key: "MISSION_EVENT", label: "Mission Event", category: "CHURCH_FAITH" },
  { key: "CHURCH_FUNDRAISING", label: "Fundraising", category: "CHURCH_FAITH" },
  { key: "CHURCH_RETREAT", label: "Church Retreat", category: "CHURCH_FAITH" },
  { key: "VACATION_BIBLE_SCHOOL", label: "Vacation Bible School", category: "CHURCH_FAITH" },
  { key: "FELLOWSHIP", label: "Fellowship", category: "CHURCH_FAITH" },
  { key: "COMMUNITY_OUTREACH", label: "Community Outreach", category: "CHURCH_FAITH" },
  { key: "LEADERSHIP_CONFERENCE", label: "Leadership Conference", category: "CHURCH_FAITH" },

  // Education
  { key: "GRADUATION", label: "Graduation", category: "EDUCATION" },
  { key: "GRADUATION_PARTY", label: "Graduation Party", category: "EDUCATION" },
  { key: "SCHOOL_EVENT", label: "School Event", category: "EDUCATION" },
  { key: "CLASS_REUNION", label: "Class Reunion", category: "EDUCATION" },
  { key: "AWARD_CEREMONY", label: "Award Ceremony", category: "EDUCATION" },
  { key: "ACADEMIC_CONFERENCE", label: "Academic Conference", category: "EDUCATION" },
  { key: "STUDENT_ORG_EVENT", label: "Student Organization Event", category: "EDUCATION" },

  // Business
  { key: "CORPORATE_EVENT", label: "Corporate Event", category: "BUSINESS" },
  { key: "CONFERENCE", label: "Conference", category: "BUSINESS" },
  { key: "SEMINAR", label: "Seminar", category: "BUSINESS" },
  { key: "WORKSHOP", label: "Workshop", category: "BUSINESS" },
  { key: "NETWORKING", label: "Networking", category: "BUSINESS" },
  { key: "PRODUCT_LAUNCH", label: "Product Launch", category: "BUSINESS" },
  { key: "COMPANY_ANNIVERSARY", label: "Company Anniversary", category: "BUSINESS" },
  { key: "AWARDS_CEREMONY", label: "Awards Ceremony", category: "BUSINESS" },
  { key: "EMPLOYEE_EVENT", label: "Employee Event", category: "BUSINESS" },
  { key: "CLIENT_EVENT", label: "Client Event", category: "BUSINESS" },

  // Social
  { key: "DINNER_PARTY", label: "Dinner Party", category: "SOCIAL" },
  { key: "HOLIDAY_PARTY", label: "Holiday Party", category: "SOCIAL" },
  { key: "REUNION", label: "Reunion", category: "SOCIAL" },
  { key: "COMMUNITY_EVENT", label: "Community Event", category: "SOCIAL" },
  { key: "FUNDRAISER", label: "Fundraiser", category: "SOCIAL" },
  { key: "CULTURAL_EVENT", label: "Cultural Event", category: "SOCIAL" },
  { key: "CONCERT", label: "Concert", category: "SOCIAL" },

  // Custom
  { key: "CUSTOM_EVENT", label: "Custom Event", category: "CUSTOM" },
];

async function main() {
  for (const [index, item] of CATALOG.entries()) {
    await db.eventTypeDefinition.upsert({
      where: { key: item.key },
      update: { label: item.label, category: item.category, sortOrder: index },
      create: { key: item.key, label: item.label, category: item.category, sortOrder: index },
    });
  }
  console.log(`Seeded ${CATALOG.length} event types.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
