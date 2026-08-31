import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const SIZES = {
  md: { box: "h-14 w-14 sm:h-16 sm:w-16", text: "text-lg sm:text-xl" },
  lg: { box: "h-24 w-24 sm:h-28 sm:w-28", text: "text-3xl sm:text-4xl" },
};

export function WaxSeal({
  initials,
  broken = false,
  size = "md",
  className,
}: {
  initials: string;
  broken?: boolean;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const dims = SIZES[size];

  return (
    <motion.div
      className={className}
      animate={
        broken
          ? { scale: 0.4, rotate: 18, opacity: 0, y: 6 }
          : { scale: 1, rotate: 0, opacity: 1, y: 0 }
      }
      transition={{ duration: 0.5, delay: broken ? 0.15 : 0, ease: "easeIn" }}
    >
      <div
        className={cn("relative flex items-center justify-center rounded-full", dims.box)}
        style={{
          background:
            "radial-gradient(circle at 35% 30%, #f0d896 0%, #c9a45f 45%, #8a6420 90%)",
          boxShadow:
            "inset 0 2px 3px rgba(255,255,255,0.4), inset 0 -3px 5px rgba(0,0,0,0.35), 0 3px 8px rgba(0,0,0,0.45)",
        }}
      >
        <div
          className="absolute inset-[3px] rounded-full"
          style={{ border: "1px solid rgba(255,255,255,0.25)" }}
          aria-hidden
        />
        <span
          className={cn("font-script text-[#3c2a0e]", dims.text)}
          style={{ textShadow: "0 1px 0 rgba(255,255,255,0.3)" }}
        >
          {initials || "✳"}
        </span>
      </div>
    </motion.div>
  );
}
