import { Clock } from "@phosphor-icons/react/ssr";
import { quote } from "@/content/site";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/Badge";

/**
 * Illustrative quote anatomy. The vertical line is the "strait": money goes in
 * at the top as AED and arrives at the bottom as INR, with the FX and fees in
 * between. No live numbers; only the example send amount is a figure.
 */
export function QuotePreview({ className }: { className?: string }) {
  const { panel } = quote;
  return (
    <figure className={cn("overflow-hidden rounded-frame border border-line bg-surface shadow-float", className)}>
      <div className="flex items-start justify-between gap-3 border-b border-line bg-surface-sunken px-5 py-4 sm:px-6">
        <div className="min-w-0">
          <p className="font-semibold text-fg">{panel.title}</p>
          <p className="text-small text-fg-muted">{panel.subtitle}</p>
        </div>
        <Badge variant="illustrative" size="sm">
          Illustrative
        </Badge>
      </div>

      <ol className="px-2 py-4 sm:px-3">
        {panel.rows.map((row, index) => {
          const isEnd = row.key === "send" || row.key === "receive";
          const isReceive = row.key === "receive";
          const isFirst = index === 0;
          const isLast = index === panel.rows.length - 1;
          return (
            <li
              key={row.key}
              className={cn(
                "relative grid grid-cols-[1.5rem_minmax(0,1fr)] gap-x-4 px-3",
                isReceive ? "rounded-card bg-accent-soft py-4" : "py-3",
              )}
            >
              {/* One segment per row; together they draw the channel from AED to INR. */}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute left-[calc(1.5rem-1px)] w-0.5",
                  isFirst ? "top-[1.6rem] bottom-0 bg-linear-to-b from-ink-900 to-line-strong" : "top-0",
                  isLast ? "h-[1.85rem] bg-linear-to-b from-line-strong to-strait-300" : "bottom-0",
                  !isFirst && !isLast && "bg-line-strong",
                )}
              />
              <span className="flex justify-center pt-1.5" aria-hidden="true">
                <span
                  className={cn(
                    "relative z-10 size-3.5 rounded-pill",
                    row.key === "send" && "bg-ink-900 ring-4 ring-surface",
                    isReceive && "bg-strait-300 ring-4 ring-accent-soft",
                    !isEnd && "border-2 border-line-strong bg-surface ring-4 ring-surface",
                  )}
                />
              </span>
              <div className="min-w-0">
                <p className="text-small text-fg-muted">{row.label}</p>
                <p
                  className={cn(
                    "font-semibold text-fg",
                    row.key === "send" ? "mt-0.5 text-h3 tracking-tight tabular-nums" : "text-body",
                  )}
                >
                  {row.value}
                </p>
                <p className="text-micro text-fg-subtle">{row.note}</p>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-5 py-4 sm:px-6">
        <span className="flex items-center gap-2 text-small text-fg-muted">
          <Clock size={16} aria-hidden="true" />
          {panel.timing.label}
        </span>
        <span className="text-small font-semibold text-fg">{panel.timing.value}</span>
      </div>
      <figcaption className="border-t border-dashed border-line-strong bg-surface-sunken px-5 py-3 text-micro text-fg-muted sm:px-6">
        {panel.footnote}
      </figcaption>
    </figure>
  );
}
