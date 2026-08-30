import type { InvitationContent } from "@/validations/invitation";
import { cn } from "@/lib/utils";

export function StoryTimeline({
  items,
  className,
  lineClassName,
}: {
  items: InvitationContent["storyTimeline"];
  className?: string;
  lineClassName?: string;
}) {
  if (items.length === 0) return null;

  return (
    <div className={cn("relative", className)}>
      <div className={cn("absolute top-0 bottom-0 left-2 w-px", lineClassName)} aria-hidden />
      <ul className="space-y-8">
        {items.map((item, i) => (
          <li key={i} className="relative pl-8">
            <span
              className="absolute top-1.5 left-0 h-4 w-4 rounded-full border-2 border-current bg-background"
              aria-hidden
            />
            <p className="text-xs font-medium tracking-widest uppercase opacity-70">
              {item.date}
            </p>
            <p className="mt-1 font-display text-lg font-semibold">{item.title}</p>
            {item.description && <p className="mt-1 text-sm opacity-80">{item.description}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
