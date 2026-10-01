import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type CardVariant = "plain" | "raised" | "tint" | "outline";

const variants: Record<CardVariant, string> = {
  plain: "border border-line bg-surface",
  raised: "border border-line bg-surface shadow-raised",
  tint: "border border-transparent bg-surface-tint",
  outline: "border border-line bg-transparent",
};

const paddings = {
  none: "",
  sm: "p-5",
  md: "p-6 sm:p-7",
  lg: "p-6 sm:p-8 lg:p-10",
} as const;

export function Card({
  as: Tag = "div",
  variant = "plain",
  padding = "md",
  className,
  children,
  ...rest
}: {
  as?: ElementType;
  variant?: CardVariant;
  padding?: keyof typeof paddings;
  className?: string;
  children: ReactNode;
} & Record<string, unknown>) {
  return (
    <Tag className={cn("rounded-card", variants[variant], paddings[padding], className)} {...rest}>
      {children}
    </Tag>
  );
}
