"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SparkleField } from "@/components/marketing/sparkle-field";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,color-mix(in_oklch,var(--champagne)_25%,transparent),transparent)]"
      />
      <SparkleField
        count={22}
        className="pointer-events-none absolute inset-0 hidden md:block"
      />

      <div className="relative mx-auto max-w-5xl px-4 pt-24 pb-20 text-center sm:px-6 sm:pt-32 sm:pb-28 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-champagne/40 bg-champagne/10 px-4 py-1.5 text-xs font-medium tracking-wide text-champagne uppercase"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Premium event management, reimagined
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-4xl leading-tight font-semibold sm:text-6xl"
        >
          Every celebration deserves an
          <br className="hidden sm:block" />{" "}
          <span className="font-script text-gradient-gold text-5xl sm:text-7xl">
            unforgettable
          </span>{" "}
          invitation
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg"
        >
          Weddings, birthdays, conferences, graduations, and everything in between — Olbos Event
          gives you luxury digital invitations, effortless RSVPs, guest management, and QR
          check-in in one elegant platform.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Button size="lg" className="group gap-2" asChild>
            <Link href="/signup">
              Start your event
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/templates">Browse templates</Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mx-auto mt-16 flex max-w-3xl flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs tracking-wide text-muted-foreground uppercase"
        >
          {["Weddings", "Birthdays", "Conferences", "Churches", "Graduations", "Fundraisers"].map(
            (tag) => (
              <span key={tag}>{tag}</span>
            ),
          )}
        </motion.div>
      </div>
    </section>
  );
}
