"use client";

import { Share2, MessageCircle, Mail, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function ShareButtons({ url, title, className }: { url: string; title: string; className?: string }) {
  async function handleNativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({ url, title });
      } catch {
        // user cancelled — no-op
      }
      return;
    }
    await navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  }

  return (
    <div className={className}>
      <Button type="button" variant="outline" size="sm" onClick={handleNativeShare}>
        <Share2 className="h-4 w-4" />
        Share
      </Button>
      <Button type="button" variant="outline" size="sm" asChild>
        <a
          href={`https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`}
          target="_blank"
          rel="noreferrer"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </a>
      </Button>
      <Button type="button" variant="outline" size="sm" asChild>
        <a
          href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`}
        >
          <Mail className="h-4 w-4" />
          Email
        </a>
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => {
          navigator.clipboard.writeText(url);
          toast.success("Link copied");
        }}
      >
        <LinkIcon className="h-4 w-4" />
        Copy link
      </Button>
    </div>
  );
}
