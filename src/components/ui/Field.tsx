import type { InputHTMLAttributes, ReactNode, Ref, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { CaretDown, WarningCircle } from "@phosphor-icons/react/ssr";
import { cn } from "@/lib/cn";

/** Props every control receives from <Field> so label, hint and error are wired up. */
export type ControlA11y = {
  id: string;
  "aria-describedby"?: string;
  "aria-invalid"?: true;
  /** Native required. Forms use noValidate, so this only informs assistive tech. */
  required?: true;
};

export function describedBy(...ids: Array<string | false | null | undefined>) {
  const joined = ids.filter(Boolean).join(" ");
  return joined || undefined;
}

export function FieldError({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="flex items-start gap-1.5 text-small font-medium text-danger-fg">
      <WarningCircle size={18} weight="fill" className="mt-px shrink-0" aria-hidden="true" />
      <span>
        <span className="sr-only">Error: </span>
        {children}
      </span>
    </p>
  );
}

export function FieldLabel({
  htmlFor,
  optional,
  optionalLabel = "optional",
  required,
  requiredLabel = "required",
  as: Tag = "label",
  id,
  children,
}: {
  htmlFor?: string;
  optional?: boolean;
  optionalLabel?: string;
  required?: boolean;
  requiredLabel?: string;
  as?: "label" | "legend" | "span";
  id?: string;
  children: ReactNode;
}) {
  const marker = required ? requiredLabel : optional ? optionalLabel : null;
  return (
    <Tag
      id={id}
      {...(Tag === "label" ? { htmlFor } : {})}
      className="block text-small font-semibold text-fg"
    >
      {children}
      {marker ? <span className="ml-1.5 font-normal text-fg-muted">({marker})</span> : null}
    </Tag>
  );
}

/**
 * Label above, hint below the label, control, then error text with an icon.
 * Errors are announced through aria-describedby and never rely on colour.
 */
export function Field({
  id,
  label,
  hint,
  error,
  optional,
  optionalLabel,
  required,
  requiredLabel,
  className,
  children,
}: {
  id: string;
  label: ReactNode;
  hint?: ReactNode;
  error?: string;
  optional?: boolean;
  optionalLabel?: string;
  /** Marks the label "(required)" and sets native required on the control. */
  required?: boolean;
  requiredLabel?: string;
  className?: string;
  children: (a11y: ControlA11y) => ReactNode;
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div className={cn("flex min-w-0 flex-col gap-2", className)}>
      <div className="flex flex-col gap-1">
        <FieldLabel
          htmlFor={id}
          optional={optional}
          optionalLabel={optionalLabel}
          required={required}
          requiredLabel={requiredLabel}
        >
          {label}
        </FieldLabel>
        {hint ? (
          <p id={hintId} className="text-small text-fg-muted">
            {hint}
          </p>
        ) : null}
      </div>
      {children({
        id,
        "aria-describedby": describedBy(hintId, errorId),
        "aria-invalid": error ? true : undefined,
        required: required ? true : undefined,
      })}
      {error && errorId ? <FieldError id={errorId}>{error}</FieldError> : null}
    </div>
  );
}

export const controlBase =
  "w-full rounded-control border border-line-strong bg-surface text-body text-fg placeholder:text-fg-subtle " +
  "transition-[border-color,box-shadow,background-color] duration-200 ease-out-soft outline-offset-1 " +
  "is-hover:border-fg-muted is-focus:border-focus " +
  "aria-invalid:border-danger-line aria-invalid:shadow-[inset_0_0_0_1px_var(--color-danger-line)] " +
  "disabled:cursor-not-allowed disabled:border-line disabled:bg-surface-sunken disabled:text-fg-subtle";

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "prefix"> & {
  ref?: Ref<HTMLInputElement>;
  prefix?: ReactNode;
  force?: string;
};

export function Input({ className, prefix, force, ref, ...props }: InputProps) {
  if (!prefix) {
    return <input ref={ref} data-force={force} className={cn(controlBase, "h-12 px-3.5", className)} {...props} />;
  }
  return (
    <div className="relative">
      <span
        className="pointer-events-none absolute inset-y-0 left-0 flex w-16 items-center justify-center border-r border-line text-small font-semibold text-fg-muted"
        aria-hidden="true"
      >
        {prefix}
      </span>
      <input ref={ref} data-force={force} className={cn(controlBase, "h-12 pr-3.5 pl-[4.75rem]", className)} {...props} />
    </div>
  );
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & { ref?: Ref<HTMLSelectElement>; force?: string };

export function Select({ className, children, force, ref, ...props }: SelectProps) {
  return (
    <div className="relative">
      <select
        ref={ref}
        data-force={force}
        className={cn(controlBase, "h-12 cursor-pointer appearance-none pr-11 pl-3.5", className)}
        {...props}
      >
        {children}
      </select>
      <CaretDown
        size={18}
        weight="bold"
        className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-fg-muted"
        aria-hidden="true"
      />
    </div>
  );
}

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  ref?: Ref<HTMLTextAreaElement>;
  force?: string;
  /** Shows a live character count under the field. */
  maxChars?: number;
};

export function Textarea({ className, force, ref, maxChars, value, id, ...props }: TextareaProps) {
  const length = typeof value === "string" ? value.length : 0;
  const counterId = maxChars && id ? `${id}-count` : undefined;
  const describedby = describedBy(props["aria-describedby"], counterId);
  return (
    <div className="flex flex-col gap-1.5">
      <textarea
        ref={ref}
        id={id}
        value={value}
        data-force={force}
        className={cn(controlBase, "min-h-28 resize-y px-3.5 py-3", className)}
        {...props}
        aria-describedby={describedby}
      />
      {maxChars && counterId ? (
        <p
          id={counterId}
          className={cn("text-right text-micro tabular-nums", length > maxChars ? "text-danger-fg" : "text-fg-muted")}
        >
          {length} / {maxChars} characters
        </p>
      ) : null}
    </div>
  );
}
