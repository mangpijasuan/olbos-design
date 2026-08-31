import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import type { ThemeTokens } from "../src/validations/theme";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

type Category =
  | "LUXURY"
  | "ROYAL"
  | "MINIMAL"
  | "MODERN"
  | "FLORAL"
  | "VINTAGE"
  | "GLASSMORPHISM"
  | "ELEGANT"
  | "TRADITIONAL"
  | "CORPORATE";

type ThemeSeed = {
  key: string;
  name: string;
  description: string;
  category: Category;
  tokens: ThemeTokens;
  swatch: string;
};

// The 5 palettes that already existed as fused template colors (extracted
// faithfully, not redesigned), plus one new theme ("Midnight Luxe") that
// proves a theme is independently selectable from layout — it currently
// pairs with the "luxury" template's layout in DEFAULT_THEME_BY_TEMPLATE
// below, but any script-capable layout could offer it as an alternate.
export const THEMES: ThemeSeed[] = [
  {
    key: "luxury-blush",
    name: "Luxury Blush",
    description: "Romantic cream and rose-gold elegance with refined serif typography.",
    category: "LUXURY",
    tokens: {
      colors: {
        background: "linear-gradient(180deg, #fdf6f1 0%, #f9e9e2 55%, #f2d9d2 100%)",
        primary: "oklch(0.73 0.075 18)",
        secondary: "oklch(0.73 0.075 18)",
        text: "#3d2b28",
        border: "oklch(0.73 0.075 18)",
      },
      typography: { heroFont: "script" },
    },
    swatch: "linear-gradient(135deg, #fdf6f1 0%, #f2d9d2 55%, #b76e79 100%)",
  },
  {
    key: "modern-editorial",
    name: "Modern Editorial",
    description: "Clean modern layout with bold type and generous white space.",
    category: "MODERN",
    tokens: {
      colors: {
        background: "#ffffff",
        primary: "oklch(0.42 0.09 155)",
        secondary: "oklch(0.42 0.09 155)",
        text: "#171717",
        border: "#e5e5e5",
      },
      typography: { heroFont: "display" },
    },
    swatch: "linear-gradient(135deg, #ffffff 0%, #f4f1ea 55%, #cbb98f 100%)",
  },
  {
    key: "floral-romance",
    name: "Floral Romance",
    description: "Soft rose-gold palette with a hand-drawn floral motif.",
    category: "FLORAL",
    tokens: {
      colors: {
        background: "linear-gradient(180deg, #fdf3f4 0%, #fbeef0 100%)",
        primary: "oklch(0.73 0.075 18)",
        secondary: "oklch(0.73 0.075 18)",
        text: "#4a2a30",
        border: "oklch(0.73 0.075 18)",
      },
      typography: { heroFont: "script" },
    },
    swatch: "linear-gradient(135deg, #fbeef0 0%, #f3c9cf 50%, #b76e79 100%)",
  },
  {
    key: "minimal-emerald",
    name: "Minimal Emerald",
    description: "Understated minimalism with a deep emerald signature color.",
    category: "MINIMAL",
    tokens: {
      colors: {
        background: "#f7f8f4",
        primary: "oklch(0.42 0.09 155)",
        secondary: "oklch(0.42 0.09 155)",
        text: "#1c231e",
        border: "#1c231e",
      },
      typography: { heroFont: "display" },
    },
    swatch: "linear-gradient(135deg, #f7f8f4 0%, #cfe3d4 55%, #0b6e4f 100%)",
  },
  {
    key: "navy-elegance",
    name: "Navy Elegance",
    description: "Deep navy blue with silver and gold accents for a refined, formal occasion.",
    category: "ELEGANT",
    tokens: {
      colors: {
        background: "linear-gradient(180deg, #0a1428 0%, #0e1c36 55%, #0a1428 100%)",
        primary: "#c9a66b",
        secondary: "#a9bfdf",
        text: "#dbe4f2",
        border: "#6b86ad",
      },
      typography: { heroFont: "display" },
    },
    swatch: "linear-gradient(135deg, #0a1428 0%, #16294a 50%, #6b86ad 100%)",
  },
  {
    key: "midnight-luxe",
    name: "Midnight Luxe",
    description: "Moody black-tie luxury with warm champagne-gold accents.",
    category: "LUXURY",
    tokens: {
      colors: {
        background: "linear-gradient(180deg, #14100a 0%, #201a12 55%, #14100a 100%)",
        primary: "oklch(0.63 0.11 78)",
        secondary: "oklch(0.63 0.11 78)",
        text: "#ede4d3",
        border: "oklch(0.63 0.11 78)",
      },
      typography: { heroFont: "script" },
    },
    swatch: "linear-gradient(135deg, #14100a 0%, #2a2015 50%, #b8934a 100%)",
  },
];

async function main() {
  for (const [index, item] of THEMES.entries()) {
    await db.theme.upsert({
      where: { key: item.key },
      update: {
        name: item.name,
        description: item.description,
        category: item.category,
        tokens: item.tokens,
        swatch: item.swatch,
        sortOrder: index,
      },
      create: {
        key: item.key,
        name: item.name,
        description: item.description,
        category: item.category,
        tokens: item.tokens,
        swatch: item.swatch,
        sortOrder: index,
      },
    });
  }
  console.log(`Seeded ${THEMES.length} themes.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
