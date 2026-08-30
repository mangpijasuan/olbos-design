"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, HeartHandshake } from "lucide-react";
import { rsvpSubmitSchema, type RsvpSubmitInput } from "@/validations/rsvp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS = [
  { value: "ACCEPTED", label: "Joyfully accept" },
  { value: "MAYBE", label: "Maybe" },
  { value: "DECLINED", label: "Regretfully decline" },
] as const;

export function RsvpForm({ slug }: { slug: string }) {
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<RsvpSubmitInput>({
    resolver: zodResolver(rsvpSubmitSchema),
    defaultValues: {
      fullName: "",
      email: "",
      status: "ACCEPTED",
      plusOneCount: 0,
      mealPreference: "",
      dietaryRestrictions: "",
      needsTransportation: false,
      needsHotel: false,
      message: "",
    },
  });

  const status = form.watch("status");

  async function onSubmit(values: RsvpSubmitInput) {
    const res = await fetch(`/api/invite/${slug}/rsvp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      form.setError("root", { message: body.error ?? "Could not submit your RSVP" });
      return;
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-current/20 p-8 text-center">
        <HeartHandshake className="mx-auto h-8 w-8 opacity-80" />
        <p className="mt-4 font-medium">Thank you — your RSVP has been received.</p>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <Label htmlFor="rsvp-name" className="opacity-90">
          Full name
        </Label>
        <Input id="rsvp-name" className="mt-1.5" {...form.register("fullName")} />
        {form.formState.errors.fullName && (
          <p className="mt-1 text-xs text-red-400">{form.formState.errors.fullName.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="rsvp-email" className="opacity-90">
          Email (for confirmation)
        </Label>
        <Input id="rsvp-email" type="email" className="mt-1.5" {...form.register("email")} />
      </div>

      <div>
        <Label className="opacity-90">Will you attend?</Label>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => form.setValue("status", opt.value)}
              className={cn(
                "rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                status === opt.value
                  ? "border-current bg-current/10"
                  : "border-current/20 opacity-70 hover:opacity-100",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {status === "ACCEPTED" && (
        <>
          <div>
            <Label htmlFor="rsvp-plusones" className="opacity-90">
              Additional guests (plus-ones)
            </Label>
            <Input
              id="rsvp-plusones"
              type="number"
              min={0}
              max={10}
              className="mt-1.5 w-24"
              {...form.register("plusOneCount")}
            />
          </div>
          <div>
            <Label htmlFor="rsvp-meal" className="opacity-90">
              Meal preference
            </Label>
            <Input id="rsvp-meal" className="mt-1.5" {...form.register("mealPreference")} />
          </div>
          <div>
            <Label htmlFor="rsvp-dietary" className="opacity-90">
              Dietary restrictions
            </Label>
            <Textarea
              id="rsvp-dietary"
              rows={2}
              className="mt-1.5"
              {...form.register("dietaryRestrictions")}
            />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-8">
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={form.watch("needsTransportation")}
                onCheckedChange={(v) => form.setValue("needsTransportation", v === true)}
              />
              Need transportation
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={form.watch("needsHotel")}
                onCheckedChange={(v) => form.setValue("needsHotel", v === true)}
              />
              Need hotel accommodation
            </label>
          </div>
        </>
      )}

      <div>
        <Label htmlFor="rsvp-message" className="opacity-90">
          Message (optional)
        </Label>
        <Textarea id="rsvp-message" rows={3} className="mt-1.5" {...form.register("message")} />
      </div>

      {form.formState.errors.root && (
        <p className="text-sm text-red-400">{form.formState.errors.root.message}</p>
      )}

      <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? (
          "Sending…"
        ) : (
          <>
            <Check className="h-4 w-4" /> Send RSVP
          </>
        )}
      </Button>
    </form>
  );
}
