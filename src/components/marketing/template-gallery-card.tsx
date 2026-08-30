"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { BackgroundEffect } from "@/components/invitation/background-effect";
import { Badge } from "@/components/ui/badge";
import type { TEMPLATE_DEFINITIONS } from "@/lib/templates";

type TemplateDefinition = (typeof TEMPLATE_DEFINITIONS)[number];

export function TemplateGalleryCard({
  template,
  index,
}: {
  template: TemplateDefinition;
  index: number;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4, delay: (index % 6) * 0.05 }}
      className="group overflow-hidden rounded-2xl border border-border/60 bg-card transition-shadow hover:shadow-xl hover:shadow-champagne/10"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden" style={{ background: template.swatch }}>
        <BackgroundEffect type={template.previewEffect} />
        <div className="absolute top-3 left-3 flex gap-1.5">
          {template.isPopular && (
            <Badge className="bg-champagne text-black hover:bg-champagne">Popular</Badge>
          )}
          {template.isNew && (
            <Badge className="bg-emerald text-white hover:bg-emerald">New</Badge>
          )}
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-display text-lg font-semibold">{template.name}</h3>
          <Badge variant="outline" className="shrink-0 text-[10px]">
            {template.category}
          </Badge>
        </div>
        <p className="mt-1.5 text-sm text-muted-foreground">{template.description}</p>
        <Link
          href={`/signup?template=${template.key}`}
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors group-hover:gap-2"
        >
          Use this template
          <ArrowRight className="h-3.5 w-3.5 transition-all" />
        </Link>
      </div>
    </motion.div>
  );
}
