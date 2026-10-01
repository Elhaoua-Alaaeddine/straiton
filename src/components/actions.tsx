"use client";

import type { ReactNode } from "react";
import { ArrowRight, FileText } from "@phosphor-icons/react/ssr";
import { ctas, demo } from "@/content/site";
import { scrollToAndFocus } from "@/lib/a11y";
import { cn } from "@/lib/cn";
import { Button, type ButtonSize, type ButtonVariant } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { useUi } from "@/components/UiProvider";

/** Primary CTA. Scrolls to the assessment form and moves focus to its heading. */
export function AssessmentButton({
  size = "md",
  variant = "primary",
  fullWidth,
  className,
  withIcon = true,
  onNavigate,
}: {
  size?: ButtonSize;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  className?: string;
  withIcon?: boolean;
  onNavigate?: () => void;
}) {
  const { setMenuOpen } = useUi();
  return (
    <Button
      href={ctas.assessment.href}
      size={size}
      variant={variant}
      fullWidth={fullWidth}
      className={className}
      iconRight={withIcon ? <ArrowRight size={size === "sm" ? 16 : 18} weight="bold" aria-hidden="true" /> : undefined}
      onClick={(event) => {
        event.preventDefault();
        setMenuOpen(false);
        onNavigate?.();
        // Wait a frame so a closing menu releases the scroll lock first.
        requestAnimationFrame(() => scrollToAndFocus("assessment", "assessment-title"));
      }}
    >
      {ctas.assessment.label}
    </Button>
  );
}

/** Secondary CTA. Opens the "Send us your bank quote" dialog. */
export function BankQuoteButton({
  size = "md",
  variant = "secondary",
  fullWidth,
  className,
  short,
  describedBy,
}: {
  size?: ButtonSize;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  className?: string;
  /** Uses "Send it to us" when the question is already on screen next to the button. */
  short?: boolean;
  /** Id of the visible question, so the short label keeps its context for screen readers. */
  describedBy?: string;
}) {
  const { openBankQuote } = useUi();
  return (
    <Button
      size={size}
      variant={variant}
      fullWidth={fullWidth}
      className={className}
      aria-haspopup="dialog"
      aria-describedby={describedBy}
      iconLeft={
        <FileText
          size={size === "sm" ? 16 : 18}
          aria-hidden="true"
          className={short ? "shrink-0" : "hidden shrink-0 sm:block"}
        />
      }
      onClick={openBankQuote}
    >
      {short ? (
        ctas.bankQuote.action
      ) : (
        // One label at every width. On phones it breaks at the question mark.
        <>
          <span className="whitespace-nowrap">{ctas.bankQuote.question}</span>{" "}
          <span className="whitespace-nowrap">{ctas.bankQuote.action}</span>
        </>
      )}
    </Button>
  );
}

type DemoKey = keyof Omit<typeof demo, "label">;

/**
 * A control for something that does not exist in this prototype (sign in,
 * guides, WhatsApp). It says so with a dashed "Demo" tag and a toast,
 * so there are no dead links.
 */
export function DemoAction({
  message,
  children,
  icon,
  variant = "link",
  className,
  showTag = true,
  onBeforeToast,
}: {
  message: DemoKey;
  children: ReactNode;
  icon?: ReactNode;
  variant?: "link" | "row" | "plain";
  className?: string;
  showTag?: boolean;
  onBeforeToast?: () => void;
}) {
  const toast = useToast();
  return (
    <button
      type="button"
      onClick={() => {
        onBeforeToast?.();
        toast(demo[message]);
      }}
      className={cn(
        "group inline-flex min-h-11 items-center gap-2 text-left transition-colors duration-200",
        variant === "link" && "font-semibold text-fg is-hover:text-accent",
        variant === "plain" && "text-fg-muted is-hover:text-fg",
        className,
      )}
    >
      {icon}
      <span className="min-w-0 flex-1">{children}</span>
      {showTag ? (
        <Badge variant="demo" size="sm" className="ml-0.5">
          {demo.label}
        </Badge>
      ) : (
        // The group heading carries the visible Demo tag; keep it in the accessible name too.
        <span className="sr-only"> ({demo.label})</span>
      )}
    </button>
  );
}

/**
 * A full button for a demo-only contact channel. From 640px it shows a dashed
 * Demo tag. On phones the tag would squeeze the label (an email address would
 * have to break mid-word), so the surrounding card carries the visible Demo
 * pill and the button keeps "(Demo)" in its accessible name.
 */
export function DemoButton({
  message,
  children,
  icon,
  variant = "secondary",
  size = "lg",
  className,
}: {
  message: DemoKey;
  children: ReactNode;
  icon?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) {
  const toast = useToast();
  return (
    <Button
      variant={variant}
      size={size}
      fullWidth
      className={className}
      onClick={() => toast(demo[message])}
      iconRight={
        <span className="hidden shrink-0 rounded-pill border border-dashed border-current px-2 py-0.5 text-micro font-semibold sm:inline-flex">
          {demo.label}
        </span>
      }
    >
      <span className="flex min-w-0 items-center gap-2.5">
        {icon}
        <span className="min-w-0">
          {children}
          <span className="sr-only sm:hidden"> ({demo.label})</span>
        </span>
      </span>
    </Button>
  );
}
