"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Check, Search } from "lucide-react";
import { useGuests } from "@/hooks/use-guests";
import { useManualCheckIn } from "@/hooks/use-checkin";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ManualCheckInList({ eventId }: { eventId: string }) {
  const [query, setQuery] = useState("");
  const { data } = useGuests(eventId);
  const manualCheckIn = useManualCheckIn(eventId);

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = query.trim().toLowerCase();
    if (!q) return data.guests;
    return data.guests.filter((g) => g.fullName.toLowerCase().includes(q));
  }, [data, query]);

  return (
    <div>
      <div className="relative">
        <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search guests by name…"
          className="pl-9"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="mt-4 max-h-96 space-y-1 overflow-y-auto">
        {filtered.map((guest) => (
          <div
            key={guest.id}
            className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2"
          >
            <div>
              <p className="text-sm font-medium">{guest.fullName}</p>
              {guest.checkIn && (
                <p className="text-xs text-emerald">
                  Checked in {new Date(guest.checkIn.checkedInAt).toLocaleTimeString()}
                </p>
              )}
            </div>
            {guest.checkIn ? (
              <Badge>
                <Check className="h-3 w-3" /> Checked in
              </Badge>
            ) : (
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={manualCheckIn.isPending}
                onClick={() =>
                  manualCheckIn.mutate(guest.id, {
                    onSuccess: (res) => toast.success(`${res.guestName} checked in`),
                    onError: (e) => toast.error(e.message),
                  })
                }
              >
                Check in
              </Button>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="py-6 text-center text-sm text-muted-foreground">No guests found.</p>
        )}
      </div>
    </div>
  );
}
