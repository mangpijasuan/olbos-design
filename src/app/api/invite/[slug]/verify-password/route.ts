import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { signInviteAccessToken, inviteCookieName } from "@/lib/invite-access";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const schema = z.object({ password: z.string().min(1) });

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  const ip = getClientIp(request.headers);
  const { allowed } = await rateLimit({ key: `invite-pw:${ip}:${slug}`, limit: 10, windowSeconds: 60 });
  if (!allowed) {
    return NextResponse.json({ error: "Too many attempts. Try again shortly." }, { status: 429 });
  }

  const json = await request.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Password is required" }, { status: 400 });
  }

  const event = await db.event.findUnique({ where: { slug } });
  if (!event || !event.passwordHash) {
    return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
  }

  if (!verifyPassword(parsed.data.password, event.passwordHash)) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  const token = signInviteAccessToken(event.id, event.passwordHash);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(inviteCookieName(event.id), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
  return response;
}
