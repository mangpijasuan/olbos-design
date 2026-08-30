"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Copy, ExternalLink, QrCode, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { updateEventSchema, EVENT_TYPES, EVENT_VISIBILITIES, type UpdateEventInput } from "@/validations/event";
import { titleCase } from "@/lib/format";
import { useDeleteEvent, useUpdateEvent, type EventDetail } from "@/hooks/use-events";
import { InviteQr } from "@/components/dashboard/invite-qr";
import { ShareButtons } from "@/components/invitation/share-buttons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export function EventOverview({ event }: { event: EventDetail }) {
  const router = useRouter();
  const updateEvent = useUpdateEvent(event.id);
  const deleteEvent = useDeleteEvent();
  const [copied, setCopied] = useState(false);

  const form = useForm<UpdateEventInput>({
    resolver: zodResolver(updateEventSchema),
    defaultValues: {
      title: event.title,
      type: event.type as UpdateEventInput["type"],
      venueName: event.venueName ?? "",
      venueAddress: event.venueAddress ?? "",
      visibility: event.visibility as UpdateEventInput["visibility"],
    },
  });

  useEffect(() => {
    form.reset({
      title: event.title,
      type: event.type as UpdateEventInput["type"],
      venueName: event.venueName ?? "",
      venueAddress: event.venueAddress ?? "",
      visibility: event.visibility as UpdateEventInput["visibility"],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event.id]);

  const visibility = form.watch("visibility");
  const inviteUrl =
    typeof window !== "undefined" ? `${window.location.origin}/invite/${event.slug}` : "";

  async function onSubmit(values: UpdateEventInput) {
    try {
      await updateEvent.mutateAsync(values);
      toast.success("Event settings saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save changes");
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event title</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event type</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {EVENT_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {titleCase(type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  <FormLabel>Venue name</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
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
                  <FormLabel>Venue address</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="visibility"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Visibility</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {EVENT_VISIBILITIES.map((v) => (
                      <SelectItem key={v} value={v}>
                        {titleCase(v)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {visibility === "PASSWORD_PROTECTED" && (
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Guest password</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Set a password guests will enter" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving…" : "Save changes"}
          </Button>
        </form>
      </Form>

      <div className="space-y-4">
        <div className="rounded-xl border border-border/60 bg-card p-5">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Status
          </p>
          <Badge className="mt-2">{titleCase(event.status)}</Badge>

          <p className="mt-4 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Public invitation link
          </p>
          <div className="mt-2 flex items-center gap-2">
            <Input
              readOnly
              value={inviteUrl}
              className="text-xs"
              aria-label="Public invitation link"
            />
            <Button
              type="button"
              size="icon"
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(inviteUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          {copied && <p className="mt-1 text-xs text-emerald">Copied!</p>}
          <a
            href={`/invite/${event.slug}`}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            Open invitation <ExternalLink className="h-3 w-3" />
          </a>

          {inviteUrl && (
            <>
              <div className="mt-5 flex justify-center">
                <InviteQr url={inviteUrl} />
              </div>
              <ShareButtons
                url={inviteUrl}
                title={event.title}
                className="mt-4 flex flex-wrap justify-center gap-2"
              />
            </>
          )}
        </div>

        <a
          href={`/checkin/${event.id}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl border border-border/60 bg-card p-4 text-sm font-medium text-foreground hover:bg-muted"
        >
          <QrCode className="h-4 w-4" />
          Open check-in scanner
        </a>

        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5">
          <p className="text-sm font-medium text-destructive">Danger zone</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Deleting an event permanently removes its guests, RSVPs, and media.
          </p>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="mt-3"
            onClick={() => {
              if (!confirm(`Delete "${event.title}"? This cannot be undone.`)) return;
              deleteEvent.mutate(event.id, {
                onSuccess: () => {
                  toast.success("Event deleted");
                  router.push("/dashboard");
                },
                onError: (e) => toast.error(e.message),
              });
            }}
          >
            <Trash2 className="h-4 w-4" />
            Delete event
          </Button>
        </div>
      </div>
    </div>
  );
}
