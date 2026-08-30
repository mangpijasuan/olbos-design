"use client";

import { toast } from "sonner";
import { Trash2, Users } from "lucide-react";
import { useGuests, useDeleteGuest } from "@/hooks/use-guests";
import { titleCase } from "@/lib/format";
import { AddGuestDialog } from "@/components/dashboard/add-guest-dialog";
import { ImportGuestsButton } from "@/components/dashboard/import-guests-button";
import { GuestQrDialog } from "@/components/dashboard/guest-qr-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const TAG_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  VIP: "default",
  FAMILY: "secondary",
  FRIEND: "outline",
  COWORKER: "outline",
  OTHER: "outline",
};

const RSVP_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  ACCEPTED: "default",
  DECLINED: "destructive",
  MAYBE: "secondary",
  PENDING: "outline",
};

export function GuestsTab({ eventId }: { eventId: string }) {
  const { data, isLoading } = useGuests(eventId);
  const deleteGuest = useDeleteGuest(eventId);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold">Guests</h3>
          <p className="text-sm text-muted-foreground">
            {data ? `${data.guests.length} guest${data.guests.length === 1 ? "" : "s"}` : "…"}
          </p>
        </div>
        <div className="flex gap-2">
          <ImportGuestsButton eventId={eventId} />
          <AddGuestDialog eventId={eventId} />
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-border/60">
        {isLoading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : data && data.guests.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Group</TableHead>
                <TableHead>Invitation</TableHead>
                <TableHead>RSVP</TableHead>
                <TableHead>Plus-ones</TableHead>
                <TableHead>Checked in</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.guests.map((guest) => (
                <TableRow key={guest.id}>
                  <TableCell>
                    <div className="font-medium">{guest.fullName}</div>
                    <div className="text-xs text-muted-foreground">
                      {[guest.email, guest.phone].filter(Boolean).join(" · ")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={TAG_VARIANT[guest.tag]}>{titleCase(guest.tag)}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{titleCase(guest.invitationStatus)}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={RSVP_VARIANT[guest.rsvp?.status ?? "PENDING"]}>
                      {titleCase(guest.rsvp?.status ?? "PENDING")}
                    </Badge>
                  </TableCell>
                  <TableCell>{guest.rsvp?.plusOneCount ?? 0}</TableCell>
                  <TableCell>
                    {guest.checkIn ? (
                      <span className="text-xs text-emerald">
                        {new Date(guest.checkIn.checkedInAt).toLocaleTimeString()}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <GuestQrDialog eventId={eventId} guestId={guest.id} guestName={guest.fullName} />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (!confirm(`Remove ${guest.fullName}?`)) return;
                          deleteGuest.mutate(guest.id, {
                            onError: (e) => toast.error(e.message),
                          });
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Users className="h-8 w-8 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">
              No guests yet. Add one manually or import a CSV.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
