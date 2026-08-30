import { cn } from "@/lib/utils";
import Link from "next/link";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("group flex items-center gap-2 font-display text-xl", className)}
    >
      <span
        aria-hidden
        className="flex h-8 w-8 items-center justify-center rounded-full border border-champagne/60 bg-gradient-to-br from-champagne/20 to-rose-gold/20 font-script text-lg text-champagne transition-transform group-hover:scale-105"
      >
        O
      </span>
      <span className="tracking-wide">
        Olbos <span className="text-gradient-gold">Event</span>
      </span>
    </Link>
  );
}
