import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Centres content at the 1240px content width with fluid side gutters. */
export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-content px-gutter", className)}>{children}</div>;
}
