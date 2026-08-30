"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FloralFlourish } from "@/components/invitation/floral-flourish";
import { WaxSeal } from "@/components/invitation/wax-seal";

export function HeroPreviewCard() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setIsOpen((v) => !v), 2600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative mx-auto w-[240px] sm:w-[280px]">
      <div className="relative aspect-[9/18.5] rounded-[2.5rem] border-[10px] border-[#171310] bg-[#171310] shadow-2xl">
        <div
          aria-hidden
          className="absolute top-0 left-1/2 z-30 h-5 w-24 -translate-x-1/2 rounded-b-xl bg-[#171310]"
        />
        <div
          className="relative h-full w-full overflow-hidden rounded-[1.75rem]"
          style={{
            background: "linear-gradient(160deg, #fbf6ea 0%, #f3e9d2 60%, #ecdfbe 100%)",
          }}
        >
          <FloralFlourish
            className="absolute right-3 bottom-3 h-16 w-16 opacity-70"
            flip
          />
          <FloralFlourish className="absolute bottom-3 left-3 h-14 w-14 rotate-180 opacity-50" />

          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <p className="font-script text-xl text-[#6b4a1f]">Grace &amp; Daniel</p>
            <p className="mt-2 text-[10px] tracking-[0.3em] text-[#8a6a34]/80 uppercase">
              {isOpen ? "You're invited" : "Tap to open"}
            </p>
          </div>

          <motion.div
            aria-hidden
            className="absolute inset-x-0 top-0 h-1/2 origin-top"
            style={{
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              background: "linear-gradient(180deg, #f6efdd 0%, #ecdfbe 100%)",
              boxShadow: "0 1px 0 rgba(138,106,52,0.25)",
            }}
            animate={isOpen ? { rotateX: 180 } : { rotateX: 0 }}
            transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
          >
            <FloralFlourish className="absolute top-3 left-3 h-14 w-14" />
            <FloralFlourish className="absolute top-3 right-3 h-14 w-14" flip />
          </motion.div>

          <WaxSeal
            initials="G&D"
            broken={isOpen}
            className="absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
          />
        </div>
      </div>
    </div>
  );
}
