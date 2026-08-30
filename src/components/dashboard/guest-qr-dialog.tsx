"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

export function GuestQrDialog({
  eventId,
  guestId,
  guestName,
}: {
  eventId: string;
  guestId: string;
  guestName: string;
}) {
  const [open, setOpen] = useState(false);
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setDataUrl(null);
    fetch(`/api/events/${eventId}/guests/${guestId}/qr`)
      .then((res) => res.json())
      .then((body) => setDataUrl(body.dataUrl));
  }, [open, eventId, guestId]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button type="button" variant="ghost" size="icon" onClick={() => setOpen(true)}>
        <QrCode className="h-4 w-4" />
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Check-in QR — {guestName}</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center py-4">
          {dataUrl ? (
            <Image src={dataUrl} alt="Guest check-in QR" width={240} height={240} unoptimized />
          ) : (
            <Skeleton className="h-60 w-60" />
          )}
        </div>
        <p className="text-center text-xs text-muted-foreground">
          Scan this at the door to check {guestName} in.
        </p>
      </DialogContent>
    </Dialog>
  );
}
