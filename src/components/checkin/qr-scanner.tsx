"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";
import type { IScannerControls } from "@zxing/browser";
import { toast } from "sonner";
import { CameraOff } from "lucide-react";

function extractToken(decodedText: string): string | null {
  try {
    const url = new URL(decodedText);
    return url.searchParams.get("token");
  } catch {
    return null;
  }
}

export function QrScanner({ onScan }: { onScan: (token: string) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const lastScannedRef = useRef<{ token: string; at: number } | null>(null);

  useEffect(() => {
    const reader = new BrowserQRCodeReader();
    let controls: IScannerControls | undefined;
    let cancelled = false;

    reader
      .decodeFromVideoDevice(undefined, videoRef.current ?? undefined, (result) => {
        if (!result || cancelled) return;
        const token = extractToken(result.getText());
        if (!token) return;

        const last = lastScannedRef.current;
        if (last && last.token === token && Date.now() - last.at < 4000) return;
        lastScannedRef.current = { token, at: Date.now() };

        onScan(token);
      })
      .then((c) => {
        controls = c;
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not access camera");
        }
      });

    return () => {
      cancelled = true;
      controls?.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
        <CameraOff className="h-8 w-8 text-muted-foreground" />
        <p className="mt-3 max-w-xs text-sm text-muted-foreground">
          {error}. You can still check guests in manually below.
        </p>
        <button
          type="button"
          className="mt-2 text-xs text-primary underline"
          onClick={() => toast.info("Grant camera permission in your browser, then reload.")}
        >
          Need help?
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-black">
      <video ref={videoRef} className="aspect-square w-full object-cover" muted playsInline />
    </div>
  );
}
