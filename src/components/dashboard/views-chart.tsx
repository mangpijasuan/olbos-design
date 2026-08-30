"use client";

interface ViewsChartProps {
  series: { date: string; views: number }[];
}

export function ViewsChart({ series }: ViewsChartProps) {
  const max = Math.max(1, ...series.map((d) => d.views));

  return (
    <div>
      <div className="flex h-32 items-end gap-1 border-b border-border/60 pb-0">
        {series.map((d) => {
          const heightPct = Math.max(4, Math.round((d.views / max) * 100));
          const label = new Date(d.date + "T00:00:00").toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
          return (
            <div
              key={d.date}
              className="group flex h-full flex-1 items-end"
              title={`${label}: ${d.views} view${d.views === 1 ? "" : "s"}`}
            >
              <div
                className="mx-auto w-full max-w-6 rounded-t-sm bg-primary/70 transition-colors group-hover:bg-primary"
                style={{ height: `${heightPct}%` }}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-1.5 flex justify-between text-[10px] text-muted-foreground">
        <span>
          {new Date(series[0].date + "T00:00:00").toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </span>
        <span>
          {new Date(series[series.length - 1].date + "T00:00:00").toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>
    </div>
  );
}
