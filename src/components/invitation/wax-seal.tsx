import { motion } from "framer-motion";

export function WaxSeal({
  initials,
  broken = false,
  className,
}: {
  initials: string;
  broken?: boolean;
  className?: string;
}) {
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
        className="relative flex h-14 w-14 items-center justify-center rounded-full sm:h-16 sm:w-16"
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
          className="font-script text-lg text-[#3c2a0e] sm:text-xl"
          style={{ textShadow: "0 1px 0 rgba(255,255,255,0.3)" }}
        >
          {initials || "✳"}
        </span>
      </div>
    </motion.div>
  );
}
