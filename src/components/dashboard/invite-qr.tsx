"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

export function InviteQr({ url, size = 180 }: { url: string; size?: number }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(url, {
      errorCorrectionLevel: "M",
      margin: 2,
      width: size * 2,
      color: { dark: "#16130f", light: "#ffffffff" },
    }).then((result) => {
      if (!cancelled) setDataUrl(result);
    });
    return () => {
      cancelled = true;
    };
  }, [url, size]);

  if (!dataUrl) return <Skeleton style={{ width: size, height: size }} />;

  return (
    <Image
      src={dataUrl}
      alt="Invitation QR code"
      width={size}
      height={size}
      className="rounded-lg border border-border/60"
      unoptimized
    />
  );
}
