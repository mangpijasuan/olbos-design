"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Trash2, X } from "lucide-react";
import {
  invitationContentSchema,
  BACKGROUND_EFFECTS,
  type InvitationContentInput,
  type InvitationContent,
} from "@/validations/invitation";
import { TEMPLATE_DEFINITIONS } from "@/lib/templates";
import { getTemplateComponent } from "@/components/invitation/template-registry";
import { useUpdateInvitation } from "@/hooks/use-invitation";
import { useThemes } from "@/hooks/use-themes";
import { DEFAULT_THEME_TOKENS } from "@/validations/theme";
import type { EventDetail } from "@/hooks/use-events";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUploader } from "@/components/dashboard/image-uploader";
import { cn } from "@/lib/utils";

const BACKGROUND_EFFECT_LABELS: Record<(typeof BACKGROUND_EFFECTS)[number], string> = {
  none: "None",
  sparkles: "Sparkles",
  petals: "Floating petals",
  snowfall: "Snowfall",
  "golden-particles": "Golden particles",
};

function withDefaults(content: Partial<InvitationContentInput> | undefined): InvitationContentInput {
  return {
    hostNames: content?.hostNames ?? "",
    greeting: content?.greeting ?? "",
    dressCode: content?.dressCode ?? "",
    accommodation: content?.accommodation ?? "",
    transportation: content?.transportation ?? "",
    contactName: content?.contactName ?? "",
    contactPhone: content?.contactPhone ?? "",
    contactEmail: content?.contactEmail ?? "",
    registryUrl: content?.registryUrl ?? "",
    schedule: content?.schedule ?? [],
    storyTimeline: content?.storyTimeline ?? [],
    galleryUrls: content?.galleryUrls ?? [],
    showEnvelopeIntro: content?.showEnvelopeIntro ?? true,
    backgroundEffect: content?.backgroundEffect ?? "none",
  };
}

export function InvitationBuilder({ event }: { event: EventDetail }) {
  const updateInvitation = useUpdateInvitation(event.id);
  const { data: themesData } = useThemes();
  const [templateKey, setTemplateKey] = useState(event.invitation?.template.key ?? "luxury");
  const [themeKey, setThemeKey] = useState(event.invitation?.selectedTheme.key ?? "luxury-blush");

  const form = useForm<InvitationContentInput>({
    resolver: zodResolver(invitationContentSchema),
    defaultValues: withDefaults(event.invitation?.content as Partial<InvitationContentInput>),
  });

  useEffect(() => {
    form.reset(withDefaults(event.invitation?.content as Partial<InvitationContentInput>));
    setTemplateKey(event.invitation?.template.key ?? "luxury");
    setThemeKey(event.invitation?.selectedTheme.key ?? "luxury-blush");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event.id]);

  const scheduleArray = useFieldArray({ control: form.control, name: "schedule" });
  const storyArray = useFieldArray({ control: form.control, name: "storyTimeline" });

  const liveContent = form.watch();
  const galleryUrls = form.watch("galleryUrls") ?? [];

  const PreviewComponent = getTemplateComponent(templateKey);
  const selectedThemeOption = themesData?.themes.find((t) => t.key === themeKey);
  const themeTokens = selectedThemeOption?.tokens ?? DEFAULT_THEME_TOKENS;

  async function onSubmit(values: InvitationContentInput) {
    try {
      await updateInvitation.mutateAsync({ templateKey, themeKey, content: values });
      toast.success("Invitation saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save invitation");
    }
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_480px]">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
        <section>
          <h3 className="font-display text-lg font-semibold">Template</h3>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {TEMPLATE_DEFINITIONS.map((tpl) => (
              <button
                type="button"
                key={tpl.key}
                onClick={() => setTemplateKey(tpl.key)}
                className={cn(
                  "overflow-hidden rounded-lg border-2 text-left transition-all",
                  templateKey === tpl.key
                    ? "border-primary ring-2 ring-primary/30"
                    : "border-border/60 hover:border-border",
                )}
              >
                <div className="aspect-video w-full" style={{ background: tpl.swatch }} />
                <div className="p-2">
                  <p className="truncate text-xs font-medium">{tpl.name}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="font-display text-lg font-semibold">Theme</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Colors and typography — independent of your chosen template layout.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {(themesData?.themes ?? []).map((th) => (
              <button
                type="button"
                key={th.key}
                onClick={() => setThemeKey(th.key)}
                className={cn(
                  "overflow-hidden rounded-lg border-2 text-left transition-all",
                  themeKey === th.key
                    ? "border-primary ring-2 ring-primary/30"
                    : "border-border/60 hover:border-border",
                )}
              >
                <div className="aspect-video w-full" style={{ background: th.swatch }} />
                <div className="p-2">
                  <p className="truncate text-xs font-medium">{th.name}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="font-display text-lg font-semibold">Presentation</h3>
          <div className="flex items-center justify-between rounded-lg border border-border/60 p-4">
            <div>
              <Label htmlFor="showEnvelopeIntro">Envelope opening animation</Label>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Guests see a closed envelope and tap to reveal your invitation.
              </p>
            </div>
            <Switch
              id="showEnvelopeIntro"
              checked={form.watch("showEnvelopeIntro")}
              onCheckedChange={(v) => form.setValue("showEnvelopeIntro", v === true)}
            />
          </div>
          <div>
            <Label htmlFor="backgroundEffect">Animated background effect</Label>
            <Select
              value={form.watch("backgroundEffect")}
              onValueChange={(v) =>
                form.setValue("backgroundEffect", v as InvitationContentInput["backgroundEffect"])
              }
            >
              <SelectTrigger id="backgroundEffect" className="mt-1.5 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BACKGROUND_EFFECTS.map((effect) => (
                  <SelectItem key={effect} value={effect}>
                    {BACKGROUND_EFFECT_LABELS[effect]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="font-display text-lg font-semibold">Greeting</h3>
          <div>
            <Label htmlFor="hostNames">Host names (shown as a subtitle)</Label>
            <Input id="hostNames" className="mt-1.5" {...form.register("hostNames")} />
          </div>
          <div>
            <Label htmlFor="greeting">Personalized message</Label>
            <Textarea id="greeting" rows={4} className="mt-1.5" {...form.register("greeting")} />
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold">Schedule</h3>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => scheduleArray.append({ time: "", title: "", description: "" })}
            >
              <Plus className="h-4 w-4" /> Add item
            </Button>
          </div>
          <div className="mt-4 space-y-4">
            {scheduleArray.fields.map((field, index) => (
              <div key={field.id} className="flex gap-3 rounded-lg border border-border/60 p-4">
                <div className="grid flex-1 gap-3 sm:grid-cols-3">
                  <Input
                    placeholder="6:00 PM"
                    {...form.register(`schedule.${index}.time` as const)}
                  />
                  <Input
                    placeholder="Ceremony"
                    className="sm:col-span-2"
                    {...form.register(`schedule.${index}.title` as const)}
                  />
                  <Textarea
                    placeholder="Details (optional)"
                    className="sm:col-span-3"
                    rows={2}
                    {...form.register(`schedule.${index}.description` as const)}
                  />
                </div>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => scheduleArray.remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {scheduleArray.fields.length === 0 && (
              <p className="text-sm text-muted-foreground">No schedule items yet.</p>
            )}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold">Our story</h3>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => storyArray.append({ date: "", title: "", description: "" })}
            >
              <Plus className="h-4 w-4" /> Add moment
            </Button>
          </div>
          <div className="mt-4 space-y-4">
            {storyArray.fields.map((field, index) => (
              <div key={field.id} className="flex gap-3 rounded-lg border border-border/60 p-4">
                <div className="grid flex-1 gap-3 sm:grid-cols-3">
                  <Input
                    placeholder="Spring 2021"
                    {...form.register(`storyTimeline.${index}.date` as const)}
                  />
                  <Input
                    placeholder="How we met"
                    className="sm:col-span-2"
                    {...form.register(`storyTimeline.${index}.title` as const)}
                  />
                  <Textarea
                    placeholder="Details (optional)"
                    className="sm:col-span-3"
                    rows={2}
                    {...form.register(`storyTimeline.${index}.description` as const)}
                  />
                </div>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => storyArray.remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {storyArray.fields.length === 0 && (
              <p className="text-sm text-muted-foreground">No story moments yet.</p>
            )}
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="font-display text-lg font-semibold">Details</h3>
          <div>
            <Label htmlFor="dressCode">Dress code</Label>
            <Input id="dressCode" className="mt-1.5" {...form.register("dressCode")} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="accommodation">Accommodation</Label>
              <Textarea
                id="accommodation"
                rows={3}
                className="mt-1.5"
                {...form.register("accommodation")}
              />
            </div>
            <div>
              <Label htmlFor="transportation">Transportation</Label>
              <Textarea
                id="transportation"
                rows={3}
                className="mt-1.5"
                {...form.register("transportation")}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="registryUrl">Gift registry link (optional)</Label>
            <Input
              id="registryUrl"
              className="mt-1.5"
              placeholder="https://…"
              {...form.register("registryUrl")}
            />
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold">Gallery</h3>
            <ImageUploader
              folder="events"
              label="Add photo"
              onUploaded={(url) => form.setValue("galleryUrls", [...galleryUrls, url])}
            />
          </div>
          {galleryUrls.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {galleryUrls.map((url, i) => (
                <div key={url + i} className="group relative aspect-square overflow-hidden rounded-lg">
                  <Image src={url} alt="" fill sizes="200px" className="object-cover" />
                  <button
                    type="button"
                    onClick={() =>
                      form.setValue(
                        "galleryUrls",
                        galleryUrls.filter((_, idx) => idx !== i),
                      )
                    }
                    className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-4">
          <h3 className="font-display text-lg font-semibold">Contact</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="contactName">Name</Label>
              <Input id="contactName" className="mt-1.5" {...form.register("contactName")} />
            </div>
            <div>
              <Label htmlFor="contactPhone">Phone</Label>
              <Input id="contactPhone" className="mt-1.5" {...form.register("contactPhone")} />
            </div>
            <div>
              <Label htmlFor="contactEmail">Email</Label>
              <Input id="contactEmail" className="mt-1.5" {...form.register("contactEmail")} />
            </div>
          </div>
        </section>

        <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving…" : "Save invitation"}
        </Button>
      </form>

      <div className="xl:sticky xl:top-6 xl:self-start">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Live preview
          </p>
          {form.watch("showEnvelopeIntro") && (
            <span className="text-xs text-muted-foreground">
              Envelope intro shown on guests&apos; first visit
            </span>
          )}
        </div>
        <div className="h-[720px] overflow-y-auto rounded-xl border border-border/60 shadow-sm">
          <PreviewComponent
            event={{
              title: event.title,
              type: event.eventType.key,
              startAt: event.startAt,
              endAt: event.endAt,
              venueName: event.venueName,
              venueAddress: event.venueAddress,
            }}
            content={liveContent as InvitationContent}
            theme={themeTokens}
            musicUrl={event.invitation?.musicUrl}
          />
        </div>
      </div>
    </div>
  );
}
