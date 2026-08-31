// Which theme a template (layout) defaults to when no theme is explicitly
// chosen. Purely an initial suggestion — hosts can pick any theme afterward
// via the theme picker; this just avoids making them choose on event creation.
export const DEFAULT_THEME_BY_TEMPLATE: Record<string, string> = {
  luxury: "luxury-blush",
  modern: "modern-editorial",
  floral: "floral-romance",
  minimal: "minimal-emerald",
  navy: "navy-elegance",
};

export const FALLBACK_THEME_KEY = "luxury-blush";
