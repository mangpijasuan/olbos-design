"use client";

import { useMemo } from "react";
import type { BackgroundEffect as BackgroundEffectType } from "@/validations/invitation";

interface Particle {
  left: string;
  size: number;
  duration: string;
  delay: string;
  drift: string;
  spin: string;
}

function useParticles(count: number, seedMultiplier: number): Particle[] {
  return useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        left: `${(i * seedMultiplier) % 100}%`,
        size: 10 + (i % 5) * 4,
        duration: `${9 + (i % 6)}s`,
        delay: `${(i % 10) * -1.1}s`,
        drift: `${((i % 7) - 3) * 26}px`,
        spin: `${180 + (i % 4) * 90}deg`,
      })),
    [count, seedMultiplier],
  );
}

function PetalsEffect() {
  const particles = useParticles(16, 37.3);
  return (
    <>
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute top-0 animate-fall select-none"
          style={
            {
              left: p.left,
              fontSize: p.size,
              animationDuration: p.duration,
              animationDelay: p.delay,
              "--drift": p.drift,
              "--spin": p.spin,
            } as React.CSSProperties
          }
        >
          🌸
        </span>
      ))}
    </>
  );
}

function SnowfallEffect() {
  const particles = useParticles(24, 29.7);
  return (
    <>
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute top-0 animate-fall rounded-full bg-white/90 select-none"
          style={
            {
              left: p.left,
              width: p.size * 0.35,
              height: p.size * 0.35,
              animationDuration: p.duration,
              animationDelay: p.delay,
              "--drift": p.drift,
              "--spin": "0deg",
            } as React.CSSProperties
          }
        />
      ))}
    </>
  );
}

function GoldenParticlesEffect() {
  const particles = useParticles(20, 41.1);
  return (
    <>
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute bottom-0 animate-drift-up rounded-full select-none"
          style={
            {
              left: p.left,
              width: p.size * 0.3,
              height: p.size * 0.3,
              background: "radial-gradient(circle, #f3d59a 0%, #c9a66b 70%, transparent 100%)",
              boxShadow: "0 0 6px 1px rgba(201,166,107,0.6)",
              animationDuration: p.duration,
              animationDelay: p.delay,
              "--drift": p.drift,
            } as React.CSSProperties
          }
        />
      ))}
    </>
  );
}

function SparklesEffect() {
  const particles = useParticles(22, 19.5);
  return (
    <>
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute animate-sparkle rounded-full bg-current select-none"
          style={{
            left: p.left,
            top: `${(i * 23.7) % 100}%`,
            width: 2 + (i % 3),
            height: 2 + (i % 3),
            animationDelay: `${(i % 6) * 0.35}s`,
          }}
        />
      ))}
    </>
  );
}

export function BackgroundEffect({ type }: { type: BackgroundEffectType }) {
  if (type === "none") return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {type === "petals" && <PetalsEffect />}
      {type === "snowfall" && <SnowfallEffect />}
      {type === "golden-particles" && <GoldenParticlesEffect />}
      {type === "sparkles" && <SparklesEffect />}
    </div>
  );
}
