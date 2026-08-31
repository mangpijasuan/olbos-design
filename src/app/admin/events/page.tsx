"use client";

import { useAdminEvents } from "@/hooks/use-admin";
import { titleCase } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const STATUS_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  DRAFT: "outline",
  PUBLISHED: "default",
  ARCHIVED: "secondary",
};

export default function AdminEventsPage() {
  const { data, isLoading } = useAdminEvents();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Events</h1>
      <div className="mt-6 overflow-x-auto rounded-lg border border-border/60">
        {isLoading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Host</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Guests</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.title}</TableCell>
                  <TableCell>
                    <div>{event.host.name}</div>
                    <div className="text-xs text-muted-foreground">{event.host.email}</div>
                  </TableCell>
                  <TableCell>{event.eventType.label}</TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[event.status]}>{titleCase(event.status)}</Badge>
                  </TableCell>
                  <TableCell>{event._count.guests}</TableCell>
                  <TableCell>{new Date(event.startAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
