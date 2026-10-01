import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Headline, optional eyebrow and lead, stacked vertically. Eyebrows are
 * rationed on purpose: most sections let the headline stand alone.
 */
export function SectionHeader({
  id,
  eyebrow,
  title,
  lead,
  as: Heading = "h2",
  align = "start",
  className,
  children,
}: {
  id?: string;
  eyebrow?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  as?: "h2" | "h3";
  align?: "start" | "center";
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow ? <p className="mb-4 text-small font-semibold text-accent">{eyebrow}</p> : null}
      <Heading id={id} className={cn(Heading === "h2" ? "heading-2" : "heading-3", "text-fg")}>
        {title}
      </Heading>
      {lead ? (
        <p className={cn("mt-5 max-w-copy text-lead text-fg-muted", align === "center" && "mx-auto")}>{lead}</p>
      ) : null}
      {children}
    </div>
  );
}
