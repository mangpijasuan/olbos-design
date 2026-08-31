export function EnvelopeWallpaper({
  className,
  color = "#c9a45f",
  bloomColor = "#d9a0a6",
  leafColor = "#8fa583",
  opacity = 0.22,
}: {
  className?: string;
  color?: string;
  bloomColor?: string;
  leafColor?: string;
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
          width="96"
          height="96"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(12)"
        >
          {/* connecting vine */}
          <path
            d="M8 88c14-6 18-20 14-34c-4-14-16-20-12-34c3-10 12-14 18-18"
            fill="none"
            stroke={color}
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.7"
          />

          {/* rose bloom — layered petals, embroidery-style */}
          <g transform="translate(20 20)">
            <circle r="6.4" fill={bloomColor} opacity="0.55" />
            <circle r="4.2" fill={bloomColor} opacity="0.75" />
            <circle r="2" fill={bloomColor} opacity="0.95" />
            <path
              d="M0 -6.4 C 3 -4 3 4 0 6.4 C -3 4 -3 -4 0 -6.4"
              fill="none"
              stroke={color}
              strokeWidth="0.6"
              opacity="0.5"
            />
          </g>

          {/* leaf sprigs */}
          <g transform="translate(10 42) rotate(-35)">
            <ellipse rx="2.6" ry="5.2" fill={leafColor} opacity="0.55" />
          </g>
          <g transform="translate(16 32) rotate(-65)">
            <ellipse rx="2.2" ry="4.4" fill={leafColor} opacity="0.45" />
          </g>
          <g transform="translate(8 58) rotate(-15)">
            <ellipse rx="2.2" ry="4.4" fill={leafColor} opacity="0.4" />
          </g>

          {/* small secondary bloom */}
          <g transform="translate(58 66)">
            <circle r="3.6" fill={bloomColor} opacity="0.4" />
            <circle r="1.6" fill={bloomColor} opacity="0.7" />
          </g>
          <g transform="translate(54 74) rotate(20)">
            <ellipse rx="1.8" ry="3.4" fill={leafColor} opacity="0.4" />
          </g>

          {/* gold accent dots */}
          <circle cx="44" cy="10" r="1.3" fill={color} opacity="0.5" />
          <circle cx="80" cy="30" r="1" fill={color} opacity="0.4" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#envelope-wallpaper-cell)" />
    </svg>
  );
}
