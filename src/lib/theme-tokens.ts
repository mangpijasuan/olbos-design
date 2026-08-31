import type { CSSProperties } from "react";
import type { ThemeTokens } from "@/validations/theme";

/**
 * Resolves a theme's tokens into a style object for the invitation's root
 * element: sets background/color directly, and exposes --event-* custom
 * properties so descendant elements can reference them via Tailwind
 * arbitrary values (e.g. `text-[var(--event-primary)]/70`).
 */
export function themeStyleVars(tokens: ThemeTokens): CSSProperties {
  return {
    background: tokens.colors.background,
    color: tokens.colors.text,
    "--event-bg": tokens.colors.background,
    "--event-primary": tokens.colors.primary,
    "--event-secondary": tokens.colors.secondary,
    "--event-text": tokens.colors.text,
    "--event-border": tokens.colors.border,
  } as CSSProperties;
}

export function heroFontClass(tokens: ThemeTokens, displayWeight = "font-semibold") {
  return tokens.typography.heroFont === "script" ? "font-script" : `font-display ${displayWeight}`;
}
