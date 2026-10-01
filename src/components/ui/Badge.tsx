import type { ReactNode } from "react";
import { CheckCircle, Clock, Flask, Info, WarningCircle } from "@phosphor-icons/react/ssr";
import { cn } from "@/lib/cn";

export type BadgeVariant = "neutral" | "accent" | "pending" | "success" | "danger" | "demo" | "illustrative";

const styles: Record<BadgeVariant, string> = {
  neutral: "border border-line bg-surface-tint text-fg-muted",
  accent: "border border-transparent bg-accent-soft text-accent",
  pending: "border border-pending-line bg-pending-bg text-pending-fg",
  success: "border border-transparent bg-success-bg text-success-fg",
  danger: "border border-danger-line bg-danger-bg text-danger-fg",
  // A dashed outline always means "not real": demo controls and illustrative UI.
  demo: "border border-dashed border-line-strong bg-transparent text-fg-muted",
  illustrative: "border border-dashed border-line-strong bg-transparent text-fg-muted",
};

const defaultIcons: Partial<Record<BadgeVariant, (size: number) => ReactNode>> = {
  pending: (s) => <Clock size={s} weight="bold" aria-hidden="true" />,
  success: (s) => <CheckCircle size={s} weight="bold" aria-hidden="true" />,
  danger: (s) => <WarningCircle size={s} weight="bold" aria-hidden="true" />,
  demo: (s) => <Flask size={s} weight="bold" aria-hidden="true" />,
  illustrative: (s) => <Info size={s} weight="bold" aria-hidden="true" />,
};

export function Badge({
  variant = "neutral",
  size = "md",
  icon,
  className,
  children,
}: {
  variant?: BadgeVariant;
  size?: "sm" | "md";
  /** Pass null to hide the default icon. */
  icon?: ReactNode | null;
  className?: string;
  children: ReactNode;
}) {
  const iconSize = size === "sm" ? 12 : 14;
  const resolvedIcon = icon === undefined ? defaultIcons[variant]?.(iconSize) : icon;
  return (
    <span
      className={cn(
        "inline-flex max-w-full shrink-0 items-center gap-1.5 rounded-pill font-semibold whitespace-nowrap",
        size === "sm" ? "h-6 px-2 text-micro" : "h-7 px-2.5 text-micro",
        styles[variant],
        className,
      )}
    >
      {resolvedIcon}
      <span className="truncate">{children}</span>
    </span>
  );
}
