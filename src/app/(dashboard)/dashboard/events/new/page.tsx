import { Suspense } from "react";
import type { Metadata } from "next";
import { CreateEventForm } from "@/components/dashboard/create-event-form";

export const metadata: Metadata = { title: "New event" };

export default function NewEventPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl font-semibold">Create a new event</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        You can change any of these details later.
      </p>
      <div className="mt-8">
        <Suspense>
          <CreateEventForm />
        </Suspense>
      </div>
    </div>
  );
}
