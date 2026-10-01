import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { CircleNotch } from "@phosphor-icons/react/ssr";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "tertiary";
export type ButtonSize = "sm" | "md" | "lg";

type BaseProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
  /** Shows a spinner and the loading label; the button stays focusable but inert. */
  loading?: boolean;
  loadingLabel?: string;
  /** Renders a state statically (hover, focus, active). Used by /system only. */
  force?: string;
  className?: string;
  children: ReactNode;
};

type AsButton = BaseProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & { href?: undefined };
type AsLink = BaseProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> & { href: string };
export type ButtonProps = AsButton | AsLink;

const base =
  "relative inline-flex max-w-full items-center justify-center gap-2 rounded-control text-center font-semibold leading-snug " +
  "transition-[background-color,border-color,color,box-shadow,transform,text-decoration-color] duration-200 ease-out-soft " +
  "is-active:translate-y-px disabled:cursor-not-allowed aria-disabled:cursor-progress";

const sizes: Record<ButtonSize, string> = {
  sm: "min-h-11 px-4 py-2 text-small",
  md: "min-h-12 px-5 py-2.5 text-body",
  lg: "min-h-14 px-6 py-3 text-body",
};

const tertiarySizes: Record<ButtonSize, string> = {
  sm: "min-h-11 px-1 text-small",
  md: "min-h-11 px-1 text-body",
  lg: "min-h-12 px-1 text-body",
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-action text-action-fg shadow-soft is-hover:bg-action-hover is-active:bg-action-active " +
    "disabled:bg-surface-tint disabled:text-fg-subtle disabled:shadow-none",
  secondary:
    "border border-line-strong bg-transparent text-fg is-hover:border-fg is-hover:bg-fg/5 is-active:bg-fg/10 " +
    "disabled:border-line disabled:text-fg-subtle",
  tertiary:
    "text-accent underline decoration-transparent decoration-2 underline-offset-[5px] is-hover:decoration-current " +
    "disabled:text-fg-subtle",
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  fullWidth,
  className,
}: Pick<BaseProps, "variant" | "size" | "fullWidth" | "className">) {
  return cn(
    base,
    variant === "tertiary" ? tertiarySizes[size] : sizes[size],
    variants[variant],
    fullWidth && "w-full",
    className,
  );
}

export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    iconLeft,
    iconRight,
    fullWidth,
    loading,
    loadingLabel,
    force,
    className,
    children,
    ...rest
  } = props;

  const classes = buttonClasses({ variant, size, fullWidth, className });
  const iconSize = size === "sm" ? 16 : 18;
  const content = loading ? (
    <>
      <CircleNotch size={iconSize} weight="bold" className="animate-spin" aria-hidden="true" />
      <span>{loadingLabel ?? children}</span>
    </>
  ) : (
    <>
      {iconLeft}
      <span className="text-balance">{children}</span>
      {iconRight}
    </>
  );

  if ("href" in rest && rest.href !== undefined) {
    const { href, ...anchorRest } = rest as AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
    return (
      <a href={href} className={classes} data-force={force} {...anchorRest}>
        {content}
      </a>
    );
  }

  const { type = "button", onClick, ...buttonRest } = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button
      type={type}
      className={classes}
      data-force={force}
      aria-disabled={loading || undefined}
      aria-busy={loading || undefined}
      onClick={(event) => {
        if (loading) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
      }}
      {...buttonRest}
    >
      {content}
    </button>
  );
}
