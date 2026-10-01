import { cn } from "@/lib/cn";

/**
 * Decorative echo of the logo: the S-shaped channel, drawn large and faint.
 * Purely visual, hidden from assistive technology.
 */
export function ChannelMotif({ className, strokeWidth = 1.2 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={cn("pointer-events-none select-none", className)}
    >
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d="M40 8H13A4 4 0 0 0 13 16H19A4 4 0 0 1 19 24H-8"
          stroke="currentColor"
          strokeWidth={strokeWidth + i * 1.6}
          strokeOpacity={0.5 - i * 0.16}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}
