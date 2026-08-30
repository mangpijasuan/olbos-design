"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Wand2, Eye } from "lucide-react";
import { TEMPLATE_DEFINITIONS } from "@/lib/templates";
import { titleCase } from "@/lib/format";
import { TemplateGalleryCard } from "@/components/marketing/template-gallery-card";
import { cn } from "@/lib/utils";

const CATEGORIES = Array.from(new Set(TEMPLATE_DEFINITIONS.map((t) => t.category)));

type FilterValue = "all" | "popular" | "new" | (typeof CATEGORIES)[number];
type SortValue = "popular" | "az";

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: "all", label: "All" },
  { value: "popular", label: "Popular" },
  { value: "new", label: "New" },
  ...CATEGORIES.map((c) => ({ value: c, label: titleCase(c) })),
];

const FEATURE_BADGES = [
  { icon: Palette, label: "Custom colors & background effects" },
  { icon: Wand2, label: "Edit every word and detail" },
  { icon: Eye, label: "Live preview as you build" },
];

export function TemplateGallery() {
  const [filter, setFilter] = useState<FilterValue>("all");
  const [sort, setSort] = useState<SortValue>("popular");

  const templates = useMemo(() => {
    let list = [...TEMPLATE_DEFINITIONS];

    if (filter === "popular") list = list.filter((t) => t.isPopular);
    else if (filter === "new") list = list.filter((t) => t.isNew);
    else if (filter !== "all") list = list.filter((t) => t.category === filter);

    if (sort === "az") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      list.sort((a, b) => Number(b.isPopular) - Number(a.isPopular));
    }

    return list;
  }, [filter, sort]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-champagne/40 bg-champagne/10 px-4 py-1.5 text-xs font-medium tracking-wide text-champagne uppercase">
          {TEMPLATE_DEFINITIONS.length} designer templates
        </span>
        <h1 className="mt-6 font-display text-4xl font-semibold sm:text-5xl">
          Find your perfect <span className="font-script text-gradient-gold text-5xl sm:text-6xl">theme</span>
        </h1>
        <p className="mt-5 text-muted-foreground">
          Every template ships with live animated background effects, full color and text
          customization, and an envelope-opening reveal your guests will remember. Pick a look,
          then make it yours in the builder.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {FEATURE_BADGES.map((f) => (
            <span
              key={f.label}
              className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card px-4 py-1.5 text-xs font-medium"
            >
              <f.icon className="h-3.5 w-3.5 text-emerald" />
              {f.label}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                filter === f.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border/60 text-muted-foreground hover:border-border hover:text-foreground",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          {(
            [
              { value: "popular" as const, label: "Sort: Most popular" },
              { value: "az" as const, label: "Sort: A–Z" },
            ]
          ).map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setSort(s.value)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-xs font-medium transition-colors",
                sort === s.value
                  ? "border-champagne bg-champagne/10 text-champagne"
                  : "border-border/60 text-muted-foreground hover:border-border",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <motion.div layout className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {templates.map((template, i) => (
            <TemplateGalleryCard key={template.key} template={template} index={i} />
          ))}
        </AnimatePresence>
      </motion.div>

      {templates.length === 0 && (
        <p className="mt-16 text-center text-sm text-muted-foreground">
          No templates match that filter yet — more designs ship every month.
        </p>
      )}
    </div>
  );
}
