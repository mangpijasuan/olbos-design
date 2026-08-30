import { ContactForm } from "@/components/marketing/contact-form";

export function ContactSection() {
  return (
    <section id="contact" className="border-t border-border/60 bg-card/40 py-24">
      <div className="mx-auto grid max-w-5xl gap-12 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
        <div>
          <span className="text-xs font-medium tracking-widest text-champagne uppercase">
            Contact
          </span>
          <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
            Let&apos;s plan something beautiful
          </h2>
          <p className="mt-4 text-muted-foreground">
            Questions about a wedding, conference, or a custom plan for your organization? Send us
            a note and our team will follow up within one business day.
          </p>
        </div>
        <div className="rounded-2xl border border-border/60 bg-background p-6 sm:p-8">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
