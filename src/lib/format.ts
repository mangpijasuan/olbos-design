export function titleCase(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(" ");
}

export function formatDateRange(startAt: string | Date, endAt?: string | Date | null) {
  const start = new Date(startAt);
  const opts: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  };
  const startLabel = start.toLocaleString("en-US", opts);
  if (!endAt) return startLabel;
  const end = new Date(endAt);
  return `${startLabel} – ${end.toLocaleString("en-US", opts)}`;
}
