"use client";

import { useEffect, useState } from "react";

function getTimeLeft(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function CountdownTimer({
  target,
  className,
  unitClassName,
}: {
  target: Date;
  className?: string;
  unitClassName?: string;
}) {
  // Start `null` so the server-rendered markup and the client's first render
  // match exactly (both render nothing). Computing Date.now() during a
  // render that gets SSR'd would make the server and client values diverge
  // by however long hydration takes, which React flags as a hydration error.
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeLeft> | null>(null);

  useEffect(() => {
    setTimeLeft(getTimeLeft(target));
    const interval = setInterval(() => setTimeLeft(getTimeLeft(target)), 1000);
    return () => clearInterval(interval);
  }, [target]);

  const units: Array<[string, number]> = [
    ["Days", timeLeft?.days ?? 0],
    ["Hours", timeLeft?.hours ?? 0],
    ["Minutes", timeLeft?.minutes ?? 0],
    ["Seconds", timeLeft?.seconds ?? 0],
  ];

  return (
    <div className={className} suppressHydrationWarning>
      {units.map(([label, value]) => (
        <div key={label} className={unitClassName}>
          <span className="block text-3xl font-semibold tabular-nums sm:text-4xl">
            {timeLeft ? String(value).padStart(2, "0") : "00"}
          </span>
          <span className="mt-1 block text-[10px] tracking-widest uppercase opacity-70">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
