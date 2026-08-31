export function EnvelopeWallpaper({
  className,
  color = "#c9a45f",
  opacity = 0.14,
}: {
  className?: string;
  color?: string;
  opacity?: number;
}) {
  return (
    <svg
      className={className}
      aria-hidden
      preserveAspectRatio="xMidYMid slice"
      style={{ opacity }}
    >
      <defs>
        <pattern
          id="envelope-wallpaper-cell"
          width="72"
          height="72"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(14)"
        >
          <path
            d="M6 62c10-4 14-14 12-24c-2-10-10-16-8-26"
            fill="none"
            stroke={color}
            strokeWidth="1"
            strokeLinecap="round"
          />
          <ellipse
            cx="10"
            cy="40"
            rx="2.4"
            ry="4.4"
            fill={color}
            opacity="0.55"
            transform="rotate(-45 10 40)"
          />
          <ellipse
            cx="16"
            cy="24"
            rx="2.1"
            ry="3.8"
            fill={color}
            opacity="0.4"
            transform="rotate(-70 16 24)"
          />
          <ellipse
            cx="8"
            cy="14"
            rx="1.9"
            ry="3.4"
            fill={color}
            opacity="0.32"
            transform="rotate(-20 8 14)"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#envelope-wallpaper-cell)" />
    </svg>
  );
}
