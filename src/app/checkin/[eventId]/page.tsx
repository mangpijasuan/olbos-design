import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { getServerSession } from "@/lib/get-session";
import { CheckInConsole } from "@/components/checkin/checkin-console";

interface PageProps {
  params: Promise<{ eventId: string }>;
}

export const metadata: Metadata = { title: "Check-in" };

export default async function CheckInPage({ params }: PageProps) {
  const { eventId } = await params;

  const session = await getServerSession();
  if (!session?.user) redirect(`/login?redirect=/checkin/${eventId}`);

  const event = await db.event.findUnique({ where: { id: eventId } });
  if (!event) redirect("/dashboard");

  const isAdmin = session.user.platformRole === "ADMIN" || session.user.platformRole === "SUPER_ADMIN";
  if (event.hostId !== session.user.id && !isAdmin) redirect("/dashboard");

  return <CheckInConsole eventId={event.id} eventTitle={event.title} />;
}
