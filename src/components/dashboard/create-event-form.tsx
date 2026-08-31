"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { createEventSchema, type CreateEventInput } from "@/validations/event";
import { TEMPLATE_DEFINITIONS } from "@/lib/templates";
import { useCreateEvent } from "@/hooks/use-events";
import { EventTypeSelect } from "@/components/dashboard/event-type-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

function toLocalInputValue(date: Date) {
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

export function CreateEventForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const createEvent = useCreateEvent();

  const defaultStart = new Date();
  defaultStart.setDate(defaultStart.getDate() + 30);
  defaultStart.setHours(18, 0, 0, 0);

  const form = useForm<CreateEventInput>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: "",
      eventTypeKey: "WEDDING",
      startAt: defaultStart,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      venueName: "",
      venueAddress: "",
      templateKey: searchParams.get("template") ?? "luxury",
    },
  });

  async function onSubmit(values: CreateEventInput) {
    try {
      const { event } = await createEvent.mutateAsync(values);
      toast.success("Event created");
      router.push(`/dashboard/events/${event.id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not create event");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event title</FormLabel>
              <FormControl>
                <Input placeholder="Amara & Kofi's Wedding" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="eventTypeKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event type</FormLabel>
              <EventTypeSelect value={field.value} onChange={field.onChange} />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startAt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date &amp; time</FormLabel>
              <FormControl>
                <Input
                  type="datetime-local"
                  value={toLocalInputValue(new Date(field.value as string | number | Date))}
                  onChange={(e) => field.onChange(new Date(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="venueName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Venue name (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="The Grand Ballroom" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="venueAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Venue address (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="123 Celebration Ave" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="templateKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Invitation template</FormLabel>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {TEMPLATE_DEFINITIONS.map((tpl) => (
                  <button
                    type="button"
                    key={tpl.key}
                    onClick={() => field.onChange(tpl.key)}
                    className={cn(
                      "overflow-hidden rounded-lg border-2 text-left transition-all",
                      field.value === tpl.key
                        ? "border-primary ring-2 ring-primary/30"
                        : "border-border/60 hover:border-border",
                    )}
                  >
                    <div className="aspect-square w-full" style={{ background: tpl.swatch }} />
                    <div className="p-2">
                      <p className="truncate text-xs font-medium">{tpl.name}</p>
                    </div>
                  </button>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Creating…" : "Create event"}
        </Button>
      </form>
    </Form>
  );
}
