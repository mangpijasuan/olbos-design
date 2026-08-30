import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TEMPLATE_DEFINITIONS } from "@/lib/templates";
import { Badge } from "@/components/ui/badge";

export function TemplatesShowcase() {
  return (
    <section id="templates" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-medium tracking-widest text-champagne uppercase">
          Invitation Builder
        </span>
        <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
          Beautiful templates for every occasion
        </h2>
        <p className="mt-4 text-muted-foreground">
          Start from a designer template and personalize every detail — colors, typography,
          schedule, gallery, and more — with a live preview as you edit.
        </p>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {TEMPLATE_DEFINITIONS.map((template) => (
          <Link
            key={template.key}
            href={`/signup?template=${template.key}`}
            className="group overflow-hidden rounded-xl border border-border/60 bg-card transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-champagne/10"
          >
            <div
              className="aspect-[3/4] w-full"
              style={{ background: template.swatch }}
              aria-hidden
            />
            <div className="p-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-display text-base font-semibold">{template.name}</h3>
                <Badge variant="secondary" className="shrink-0 text-[10px]">
                  {template.category}
                </Badge>
              </div>
              <p className="mt-1.5 text-sm text-muted-foreground">{template.description}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 flex flex-col items-center gap-3">
        <Link
          href="/templates"
          className="group inline-flex items-center gap-1.5 text-sm font-medium text-primary"
        >
          Browse all {TEMPLATE_DEFINITIONS.length} templates
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
        <p className="text-center text-sm text-muted-foreground">
          {TEMPLATE_DEFINITIONS.length} templates available today &mdash; more design collections
          ship every month.
        </p>
      </div>
    </section>
  );
}
