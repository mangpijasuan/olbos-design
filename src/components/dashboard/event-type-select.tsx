"use client";

import { useMemo } from "react";
import { useEventTypes } from "@/hooks/use-event-types";
import { EVENT_CATEGORY_LABELS } from "@/lib/event-categories";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export function EventTypeSelect({
  value,
  onChange,
}: {
  value: string | undefined;
  onChange: (key: string) => void;
}) {
  const { data, isLoading } = useEventTypes();

  const groupedByCategory = useMemo(() => {
    const groups = new Map<string, { key: string; label: string }[]>();
    for (const eventType of data?.eventTypes ?? []) {
      const list = groups.get(eventType.category) ?? [];
      list.push({ key: eventType.key, label: eventType.label });
      groups.set(eventType.category, list);
    }
    return groups;
  }, [data]);

  if (isLoading) return <Skeleton className="h-10 w-full" />;

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Choose an event type" />
      </SelectTrigger>
      <SelectContent>
        {[...groupedByCategory.entries()].map(([category, types]) => (
          <SelectGroup key={category}>
            <SelectLabel>{EVENT_CATEGORY_LABELS[category] ?? category}</SelectLabel>
            {types.map((type) => (
              <SelectItem key={type.key} value={type.key}>
                {type.label}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}
