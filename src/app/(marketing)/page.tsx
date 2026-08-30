import { Hero } from "@/components/marketing/hero";
import { TemplatesShowcase } from "@/components/marketing/templates-showcase";
import { Features } from "@/components/marketing/features";
import { Pricing } from "@/components/marketing/pricing";
import { Testimonials } from "@/components/marketing/testimonials";
import { FAQ } from "@/components/marketing/faq";
import { ContactSection } from "@/components/marketing/contact-section";

export default function Home() {
  return (
    <>
      <Hero />
      <TemplatesShowcase />
      <Features />
      <Pricing />
      <Testimonials />
      <FAQ />
      <ContactSection />
    </>
  );
}
