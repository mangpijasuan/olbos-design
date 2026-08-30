"use client";

import { useMemo } from "react";

interface Sparkle {
  left: string;
  top: string;
  delay: string;
  size: number;
}

export function SparkleField({ count = 18, className }: { count?: number; className?: string }) {
  const sparkles = useMemo<Sparkle[]>(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        left: `${(i * 53.7) % 100}%`,
        top: `${(i * 31.3) % 100}%`,
        delay: `${(i % 6) * 0.35}s`,
        size: 2 + (i % 3),
      })),
    [count],
  );

  return (
    <div className={className} aria-hidden>
      {sparkles.map((s, i) => (
        <span
          key={i}
          className="absolute animate-sparkle rounded-full bg-champagne"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            animationDelay: s.delay,
          }}
        />
      ))}
    </div>
  );
}
