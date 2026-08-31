"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MoreVertical, Users, Calendar, Copy, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { titleCase, formatDateRange } from "@/lib/format";
import {
  useDeleteEvent,
  useDuplicateEvent,
  useSetEventPublished,
  type EventSummary,
} from "@/hooks/use-events";

interface EventCardProps {
  event: EventSummary;
}

const STATUS_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  DRAFT: "outline",
  PUBLISHED: "default",
  ARCHIVED: "secondary",
};

export function EventCard({ event }: EventCardProps) {
  const router = useRouter();
  const deleteEvent = useDeleteEvent();
  const duplicateEvent = useDuplicateEvent();
  const setPublished = useSetEventPublished();

  return (
    <div className="group flex flex-col rounded-xl border border-border/60 bg-card p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <div>
          <Badge variant={STATUS_VARIANT[event.status]} className="mb-2 text-[10px]">
            {titleCase(event.status)}
          </Badge>
          <Link href={`/dashboard/events/${event.id}`} className="block">
            <h3 className="font-display text-lg font-semibold hover:underline">{event.title}</h3>
          </Link>
          <p className="mt-1 text-xs tracking-wide text-muted-foreground uppercase">
            {event.eventType.label}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              aria-label={`Actions for ${event.title}`}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() =>
                setPublished.mutate(
                  { id: event.id, publish: event.status !== "PUBLISHED" },
                  {
                    onError: (e) => toast.error(e.message),
                    onSuccess: () =>
                      toast.success(event.status === "PUBLISHED" ? "Unpublished" : "Published"),
                  },
                )
              }
            >
              {event.status === "PUBLISHED" ? (
                <>
                  <EyeOff className="h-4 w-4" /> Unpublish
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" /> Publish
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                duplicateEvent.mutate(event.id, {
                  onSuccess: () => toast.success("Event duplicated"),
                  onError: (e) => toast.error(e.message),
                })
              }
            >
              <Copy className="h-4 w-4" /> Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => {
                if (!confirm(`Delete "${event.title}"? This cannot be undone.`)) return;
                deleteEvent.mutate(event.id, {
                  onSuccess: () => {
                    toast.success("Event deleted");
                    router.refresh();
                  },
                  onError: (e) => toast.error(e.message),
                });
              }}
            >
              <Trash2 className="h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-4 space-y-1.5 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5" />
          {formatDateRange(event.startAt, event.endAt)}
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-3.5 w-3.5" />
          {event._count?.guests ?? 0} guests
        </div>
      </div>

      <Link
        href={`/dashboard/events/${event.id}`}
        className="mt-4 text-sm font-medium text-primary hover:underline"
      >
        Manage event →
      </Link>
    </div>
  );
}
