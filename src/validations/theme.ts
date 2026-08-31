import { z } from "zod";

export const HERO_FONTS = ["script", "display"] as const;

export const themeTokensSchema = z.object({
  colors: z.object({
    background: z.string().min(1),
    primary: z.string().min(1),
    secondary: z.string().min(1),
    text: z.string().min(1),
    border: z.string().min(1),
  }),
  typography: z.object({
    heroFont: z.enum(HERO_FONTS),
  }),
});

export type ThemeTokens = z.infer<typeof themeTokensSchema>;
export type HeroFont = (typeof HERO_FONTS)[number];

// Fallback used only if an invitation's theme relation is somehow missing —
// should never happen in practice since Invitation.themeId is required, but
// keeps template rendering defensive rather than crashing.
export const DEFAULT_THEME_TOKENS: ThemeTokens = {
  colors: {
    background: "linear-gradient(180deg, #fdf6f1 0%, #f9e9e2 55%, #f2d9d2 100%)",
    primary: "oklch(0.73 0.075 18)",
    secondary: "oklch(0.73 0.075 18)",
    text: "#3d2b28",
    border: "oklch(0.73 0.075 18)",
  },
  typography: { heroFont: "script" },
};
