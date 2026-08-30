export function FloralFlourish({
  className,
  flip = false,
  color = "#8a6a34",
}: {
  className?: string;
  flip?: boolean;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 140 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
      aria-hidden
    >
      <path
        d="M8 8C28 20 40 34 48 52C56 70 62 84 82 96"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="1"
      />
      {[
        { cx: 20, cy: 16, r: 5, rot: -35 },
        { cx: 30, cy: 26, r: 5.5, rot: -15 },
        { cx: 40, cy: 40, r: 4.5, rot: 10 },
        { cx: 50, cy: 56, r: 5, rot: 30 },
        { cx: 62, cy: 70, r: 4, rot: 55 },
        { cx: 74, cy: 86, r: 4.5, rot: 75 },
      ].map((leaf, i) => (
        <ellipse
          key={i}
          cx={leaf.cx}
          cy={leaf.cy}
          rx={leaf.r}
          ry={leaf.r * 2.1}
          fill={color}
          opacity={0.85 - i * 0.05}
          transform={`rotate(${leaf.rot} ${leaf.cx} ${leaf.cy})`}
        />
      ))}
      <circle cx="14" cy="10" r="7" fill={color} opacity="1" />
      <circle cx="14" cy="10" r="3.2" fill="#fbf6ea" opacity="0.6" />
      <circle cx="88" cy="100" r="3" fill={color} opacity="0.9" />
      <circle cx="96" cy="106" r="2.2" fill={color} opacity="0.8" />
    </svg>
  );
}
