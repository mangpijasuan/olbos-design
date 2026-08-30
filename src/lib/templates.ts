import type { BackgroundEffect } from "@/validations/invitation";

export const TEMPLATE_DEFINITIONS = [
  {
    key: "luxury",
    name: "Luxury Blush",
    category: "LUXURY" as const,
    description: "Romantic cream and rose-gold elegance with refined serif typography.",
    swatch: "linear-gradient(135deg, #fdf6f1 0%, #f2d9d2 55%, #b76e79 100%)",
    previewEffect: "golden-particles" as BackgroundEffect,
    isPopular: true,
    isNew: false,
  },
  {
    key: "modern",
    name: "Modern Editorial",
    category: "MODERN" as const,
    description: "Clean modern layout with bold type and generous white space.",
    swatch: "linear-gradient(135deg, #ffffff 0%, #f4f1ea 55%, #cbb98f 100%)",
    previewEffect: "none" as BackgroundEffect,
    isPopular: true,
    isNew: false,
  },
  {
    key: "floral",
    name: "Floral Romance",
    category: "FLORAL" as const,
    description: "Soft rose-gold palette with a hand-drawn floral motif.",
    swatch: "linear-gradient(135deg, #fbeef0 0%, #f3c9cf 50%, #b76e79 100%)",
    previewEffect: "petals" as BackgroundEffect,
    isPopular: true,
    isNew: false,
  },
  {
    key: "minimal",
    name: "Minimal Emerald",
    category: "MINIMAL" as const,
    description: "Understated minimalism with a deep emerald signature color.",
    swatch: "linear-gradient(135deg, #f7f8f4 0%, #cfe3d4 55%, #0b6e4f 100%)",
    previewEffect: "none" as BackgroundEffect,
    isPopular: false,
    isNew: false,
  },
  {
    key: "navy",
    name: "Navy Elegance",
    category: "ELEGANT" as const,
    description: "Deep navy blue with silver and gold accents for a refined, formal occasion.",
    swatch: "linear-gradient(135deg, #0a1428 0%, #16294a 50%, #6b86ad 100%)",
    previewEffect: "sparkles" as BackgroundEffect,
    isPopular: false,
    isNew: true,
  },
] satisfies ReadonlyArray<{
  key: string;
  name: string;
  category:
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
  description: string;
  swatch: string;
  previewEffect: BackgroundEffect;
  isPopular: boolean;
  isNew: boolean;
}>;

export type TemplateKey = (typeof TEMPLATE_DEFINITIONS)[number]["key"];

export function getTemplateDefinition(key: string) {
  return TEMPLATE_DEFINITIONS.find((t) => t.key === key) ?? TEMPLATE_DEFINITIONS[0];
}
