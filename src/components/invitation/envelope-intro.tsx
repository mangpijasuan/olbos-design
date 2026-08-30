"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FloralFlourish } from "@/components/invitation/floral-flourish";
import { WaxSeal } from "@/components/invitation/wax-seal";

function initialsFrom(text: string) {
  const words = text
    .replace(/&/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) return "";
  if (words.length === 1) return words[0]!.slice(0, 2).toUpperCase();
  return `${words[0]![0]}${words[words.length - 1]![0]}`.toUpperCase();
}

export function EnvelopeIntro({
  eventKey,
  title,
  hostNames,
  greeting,
  children,
}: {
  eventKey: string;
  title: string;
  hostNames: string;
  greeting?: string;
  children: React.ReactNode;
}) {
  const storageKey = `olbos_envelope_opened_${eventKey}`;
  const [phase, setPhase] = useState<"loading" | "closed" | "opening" | "revealed">("loading");

  useEffect(() => {
    const alreadyOpened =
      typeof window !== "undefined" && window.sessionStorage.getItem(storageKey) === "1";
    setPhase(alreadyOpened ? "revealed" : "closed");
  }, [storageKey]);

  function handleOpen() {
    setPhase("opening");
    window.sessionStorage.setItem(storageKey, "1");
    window.setTimeout(() => setPhase("revealed"), 1000);
  }

  const initials = initialsFrom(hostNames || title);
  const isOpening = phase === "opening";

  // Avoid a hydration mismatch: render nothing envelope-specific until we've
  // checked sessionStorage on the client, but still render children so the
  // "revealed" case (repeat visit) doesn't flash.
  if (phase === "loading") return null;

  return (
    <>
      <AnimatePresence>
        {phase !== "revealed" && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#14100a] px-4"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <button
              type="button"
              onClick={handleOpen}
              disabled={isOpening}
              aria-label="Open your invitation"
              className="group relative flex h-64 w-80 flex-col items-center overflow-hidden rounded-sm shadow-2xl transition-transform hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-champagne sm:h-72 sm:w-[26rem]"
              style={{ perspective: 1200 }}
            >
              {/* envelope body */}
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(160deg, #fbf6ea 0%, #f3e9d2 60%, #ecdfbe 100%)",
                }}
              />
              <FloralFlourish
                className="absolute right-2 bottom-2 h-16 w-16 opacity-70 sm:h-20 sm:w-20"
                flip
              />
              <FloralFlourish className="absolute bottom-2 left-2 h-14 w-14 rotate-180 opacity-50 sm:h-16 sm:w-16" />

              {greeting && (
                <p className="relative z-10 mt-auto mb-14 max-w-[85%] px-4 text-center font-script text-lg text-[#6b4a1f] italic sm:text-xl">
                  {greeting}
                </p>
              )}

              <span className="relative z-10 mt-auto mb-6 text-[10px] tracking-[0.3em] text-[#8a6a34]/80 uppercase">
                {isOpening ? "Opening…" : "Tap to open"}
              </span>

              {/* flap */}
              <motion.div
                aria-hidden
                className="absolute inset-x-0 top-0 h-1/2 origin-top"
                style={{
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                  background: "linear-gradient(180deg, #f6efdd 0%, #ecdfbe 100%)",
                  boxShadow: "0 1px 0 rgba(138,106,52,0.25)",
                }}
                animate={isOpening ? { rotateX: 180 } : { rotateX: 0 }}
                transition={{ duration: 0.75, ease: [0.65, 0, 0.35, 1] }}
              >
                <FloralFlourish className="absolute top-3 left-3 h-16 w-16 sm:h-20 sm:w-20" />
                <FloralFlourish
                  className="absolute top-3 right-3 h-16 w-16 sm:h-20 sm:w-20"
                  flip
                />
              </motion.div>

              <WaxSeal
                initials={initials}
                broken={isOpening}
                className="absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
              />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "revealed" ? 1 : 0 }}
        transition={{ duration: 0.6 }}
      >
        {children}
      </motion.div>
    </>
  );
}
