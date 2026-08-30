import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    question: "What kinds of events can I create?",
    answer:
      "Weddings, birthdays, conferences, corporate events, graduations, baby showers, church events, memorials, festivals, fundraisers, networking events, holiday parties, community events, and fully custom events.",
  },
  {
    question: "Can guests RSVP without creating an account?",
    answer:
      "Yes. Guests open your invitation link, respond with accept/decline/maybe, plus-ones, meal preference, and any custom questions you add — no account required.",
  },
  {
    question: "How does QR check-in work?",
    answer:
      "Each guest receives a unique, cryptographically signed QR code. At the door, scan it from the check-in page to instantly mark them present and update your live guest count.",
  },
  {
    question: "Can I make my event private or password-protected?",
    answer:
      "Yes — every event can be public, private (link-only), or password-protected, and you control this per event.",
  },
  {
    question: "Do you support payments for paid events or gifts?",
    answer:
      "Stripe is fully integrated for subscription billing today. Gift registry and PayPal support are on our near-term roadmap.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-medium tracking-widest text-champagne uppercase">FAQ</span>
        <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
          Frequently asked questions
        </h2>
      </div>

      <Accordion type="single" collapsible className="mt-12">
        {FAQS.map((faq, i) => (
          <AccordionItem key={faq.question} value={`item-${i}`}>
            <AccordionTrigger className="text-left font-display text-base">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
