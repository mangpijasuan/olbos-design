"use client";

import { toast } from "sonner";
import { Users } from "lucide-react";
import { QrScanner } from "@/components/checkin/qr-scanner";
import { ManualCheckInList } from "@/components/checkin/manual-checkin-list";
import { useCheckInStats, useScanCheckIn } from "@/hooks/use-checkin";
import { Progress } from "@/components/ui/progress";

export function CheckInConsole({ eventId, eventTitle }: { eventId: string; eventTitle: string }) {
  const { data: stats } = useCheckInStats(eventId);
  const scanCheckIn = useScanCheckIn(eventId);

  function handleScan(token: string) {
    scanCheckIn.mutate(token, {
      onSuccess: (res) => {
        if (res.alreadyCheckedIn) {
          toast.info(`${res.guestName} was already checked in`);
        } else {
          toast.success(`${res.guestName} checked in!`);
        }
      },
      onError: (e) => toast.error(e.message),
    });
  }

  const total = stats?.total ?? 0;
  const checkedIn = stats?.checkedIn ?? 0;
  const pct = total > 0 ? Math.round((checkedIn / total) * 100) : 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="font-display text-2xl font-semibold">{eventTitle} — Check-in</h1>

      <div className="mt-4 flex items-center gap-3 rounded-xl border border-border/60 bg-card p-4">
        <Users className="h-5 w-5 text-emerald" />
        <div className="flex-1">
          <div className="flex items-baseline justify-between text-sm">
            <span className="font-semibold">
              {checkedIn} / {total} checked in
            </span>
            <span className="text-muted-foreground">{pct}%</span>
          </div>
          <Progress value={pct} className="mt-1.5" />
        </div>
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="mb-3 font-display text-lg font-semibold">Scan QR code</h2>
          <QrScanner onScan={handleScan} />
        </div>
        <div>
          <h2 className="mb-3 font-display text-lg font-semibold">Manual check-in</h2>
          <ManualCheckInList eventId={eventId} />
        </div>
      </div>
    </div>
  );
}
