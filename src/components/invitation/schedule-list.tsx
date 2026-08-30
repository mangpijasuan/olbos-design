import type { InvitationContent } from "@/validations/invitation";

export function ScheduleList({
  items,
  className,
}: {
  items: InvitationContent["schedule"];
  className?: string;
}) {
  if (items.length === 0) return null;

  return (
    <ol className={className}>
      {items.map((item, i) => (
        <li key={i} className="flex gap-4 py-3">
          <span className="w-20 shrink-0 text-sm font-semibold tabular-nums opacity-80">
            {item.time}
          </span>
          <div>
            <p className="font-medium">{item.title}</p>
            {item.description && <p className="mt-0.5 text-sm opacity-70">{item.description}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
