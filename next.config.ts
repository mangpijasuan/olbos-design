import type { NextConfig } from "next";
import path from "path";

// Single source of truth for external image hosts — feeds both next/image's
// remotePatterns and the CSP img-src directive so they can't drift apart.
const REMOTE_IMAGE_HOSTS = [
  { protocol: "http", hostname: "localhost", port: "9000" },
  { protocol: "https", hostname: "*.amazonaws.com", port: "" },
  { protocol: "https", hostname: "lh3.googleusercontent.com", port: "" },
] as const;

const isDev = process.env.NODE_ENV !== "production";

const CSP = [
  "default-src 'self'",
  // Next.js ships small inline bootstrap/hydration scripts; a full nonce-based
  // CSP is real hardening work tracked for a later phase, not this cleanup pass.
  // 'unsafe-eval' is dev-only — Next's webpack HMR runtime uses eval() to
  // rebuild fast; production builds don't need it and don't get it.
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  `img-src 'self' data: blob: ${REMOTE_IMAGE_HOSTS.map((h) => `${h.protocol}://${h.hostname}${h.port ? `:${h.port}` : ""}`).join(" ")}`,
  "connect-src 'self'",
  // The venue map embeds Google Maps in an iframe; nothing else needs framing.
  "frame-src https://www.google.com",
  "frame-ancestors 'none'",
  "form-action 'self' https://accounts.google.com",
  "base-uri 'self'",
  "object-src 'none'",
].join("; ");

const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CSP },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(self), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname),
  images: {
    remotePatterns: REMOTE_IMAGE_HOSTS.map(({ protocol, hostname, port }) => ({
      protocol,
      hostname,
      ...(port ? { port } : {}),
    })),
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: SECURITY_HEADERS,
      },
    ];
  },
};

export default nextConfig;
