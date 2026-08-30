"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PasswordGate({ slug, eventTitle }: { slug: string; eventTitle: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/invite/${slug}/verify-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body.error ?? "Incorrect password");
        return;
      }
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border/60 bg-card p-8 text-center">
        <Lock className="mx-auto h-8 w-8 text-champagne" />
        <h1 className="mt-4 font-display text-xl font-semibold">{eventTitle}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          This invitation is password protected.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-left">
          <div>
            <Label htmlFor="invite-password">Password</Label>
            <Input
              id="invite-password"
              type="password"
              className="mt-1.5"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Checking…" : "View invitation"}
          </Button>
        </form>
      </div>
    </div>
  );
}
