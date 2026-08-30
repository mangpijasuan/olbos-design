import { NextResponse, type NextRequest } from "next/server";
import { contactSchema } from "@/validations/contact";
import { resend, FROM_EMAIL, isEmailConfigured } from "@/lib/resend";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  const { allowed } = await rateLimit({ key: `contact:${ip}`, limit: 5, windowSeconds: 60 });
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests. Try again shortly." }, { status: 429 });
  }

  const json = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const { name, email, message } = parsed.data;

  if (isEmailConfigured) {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: process.env.CONTACT_INBOX_EMAIL ?? FROM_EMAIL,
      replyTo: email,
      subject: `New contact message from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });
  }

  return NextResponse.json({ ok: true });
}
