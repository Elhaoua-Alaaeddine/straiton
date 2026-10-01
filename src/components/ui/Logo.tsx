import { cn } from "@/lib/cn";
import { WORDMARK_DOT_PATH, WORDMARK_PATH, WORDMARK_VIEWBOX } from "./wordmark-paths";

type Tone = "light" | "dark";

const markColours: Record<Tone, { tile: string; channel: string }> = {
  light: { tile: "var(--color-ink-900)", channel: "var(--color-strait-300)" },
  dark: { tile: "var(--color-strait-300)", channel: "var(--color-ink-900)" },
};

/**
 * The Straiton mark: an S-shaped channel running between two shores.
 * A strait joins two seas, as the product joins the UAE and India.
 * Tile radius 6 keeps the channel ends on the straight edges, so no clip
 * path (and no duplicate SVG ids) is needed.
 */
export function LogoMark({ size = 32, tone = "light", className }: { size?: number; tone?: Tone; className?: string }) {
  const c = markColours[tone];
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      className={cn("shrink-0", className)}
    >
      <rect width="32" height="32" rx="6" fill={c.tile} />
      <path d="M32 8H13A4 4 0 0 0 13 16H19A4 4 0 0 1 19 24H0" fill="none" stroke={c.channel} strokeWidth="4" />
    </svg>
  );
}

export function Wordmark({ height = 20, tone = "light", className }: { height?: number; tone?: Tone; className?: string }) {
  const [, , w, h] = WORDMARK_VIEWBOX.split(" ").map(Number);
  return (
    <svg
      viewBox={WORDMARK_VIEWBOX}
      height={height}
      width={Math.round((height * w) / h)}
      aria-hidden="true"
      focusable="false"
      className={cn("shrink-0", className)}
    >
      <path d={WORDMARK_PATH} fill={tone === "light" ? "var(--color-ink-900)" : "var(--color-foam)"} />
      <path d={WORDMARK_DOT_PATH} fill={tone === "light" ? "var(--color-strait-600)" : "var(--color-strait-300)"} />
    </svg>
  );
}

export function Logo({
  tone = "light",
  size = "md",
  className,
}: {
  tone?: Tone;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const dims = { sm: [26, 16], md: [32, 19], lg: [44, 27] }[size];
  return (
    <span role="img" aria-label="Straiton" className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark size={dims[0]} tone={tone} />
      <Wordmark height={dims[1]} tone={tone} />
    </span>
  );
}
