import "server-only";
import { redis } from "@/lib/redis";

/**
 * Fixed-window rate limiter backed by Redis. Returns whether the request
 * is allowed and how many requests remain in the current window.
 */
export async function rateLimit(params: {
  key: string;
  limit: number;
  windowSeconds: number;
}) {
  const redisKey = `ratelimit:${params.key}`;
  const count = await redis.incr(redisKey);
  if (count === 1) {
    await redis.expire(redisKey, params.windowSeconds);
  }

  return {
    allowed: count <= params.limit,
    remaining: Math.max(0, params.limit - count),
  };
}

export function getClientIp(headers: Headers) {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]!.trim();
  return headers.get("x-real-ip") ?? "unknown";
}
