import { CheckCircle } from "@phosphor-icons/react/ssr";
import { cn } from "@/lib/cn";
import { describedBy, FieldError, FieldLabel } from "./Field";

type ChoiceOption = { value: string; label: string; detail?: string };

/**
 * A radio group shown as stacked, full-width cards. Native radios stay in the
 * DOM, visually hidden (not display:none), so arrow keys, focus and screen
 * readers behave natively. Each card shows its label, a muted detail line and
 * a radio indicator; the selected card gets an accent border, a light accent
 * tint and a filled check icon, so the state never relies on colour alone.
 * Same API style as SegmentedControl.
 */
export function ChoiceCards({
  id,
  name,
  legend,
  options,
  value,
  onChange,
  error,
  disabled,
  required,
  requiredLabel,
  force,
}: {
  id: string;
  name: string;
  legend: string;
  options: ReadonlyArray<ChoiceOption>;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  requiredLabel?: string;
  /** Renders a state statically on one option (hover, focus). Used by /system only. */
  force?: { value: string; state: string };
}) {
  const errorId = error ? `${id}-error` : undefined;
  return (
    <fieldset className="flex min-w-0 flex-col gap-2" disabled={disabled}>
      <FieldLabel as="legend" required={required} requiredLabel={requiredLabel}>
        {legend}
      </FieldLabel>
      <div className="flex flex-col gap-2">
        {options.map((option, index) => {
          const checked = value === option.value;
          // The first radio carries the group id, so error-summary links focus it.
          const optionId = index === 0 ? id : `${id}-${option.value}`;
          const detailId = option.detail ? `${optionId}-detail` : undefined;
          return (
            <label
              key={option.value}
              htmlFor={optionId}
              data-checked={checked || undefined}
              data-force={force?.value === option.value ? force.state : undefined}
              className={cn(
                "relative flex min-h-12 items-center gap-3 rounded-control border px-4 py-3",
                "transition-[border-color,background-color,box-shadow] duration-200 ease-out-soft",
                // Focus ring on the card while its hidden radio has keyboard focus.
                "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus",
                "data-[force~=focus]:outline-2 data-[force~=focus]:outline-offset-2 data-[force~=focus]:outline-focus",
                disabled
                  ? "cursor-not-allowed border-line bg-surface-sunken"
                  : cn(
                      "cursor-pointer",
                      checked
                        ? "border-accent bg-accent-soft shadow-[inset_0_0_0_1px_var(--color-accent)]"
                        : cn("bg-surface is-hover:border-fg", error ? "border-danger-line" : "border-line-strong"),
                    ),
              )}
            >
              <input
                type="radio"
                id={optionId}
                name={name}
                value={option.value}
                checked={checked}
                required={required}
                disabled={disabled}
                aria-describedby={describedBy(detailId, errorId)}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              <span className="min-w-0 flex-1">
                <span className={cn("block text-body font-semibold", disabled ? "text-fg-subtle" : "text-fg")}>
                  {option.label}
                </span>
                {option.detail ? (
                  <span id={detailId} className={cn("mt-0.5 block text-small", disabled ? "text-fg-subtle" : "text-fg-muted")}>
                    {option.detail}
                  </span>
                ) : null}
              </span>
              <span className="flex size-6 shrink-0 items-center justify-center" aria-hidden="true">
                {checked ? (
                  <CheckCircle
                    size={24}
                    weight="fill"
                    className={disabled ? "text-fg-subtle" : "text-accent"}
                    data-indicator="checked"
                  />
                ) : (
                  <span
                    className={cn("size-5 rounded-pill border-2 bg-surface", disabled ? "border-line" : "border-line-strong")}
                    data-indicator="unchecked"
                  />
                )}
              </span>
            </label>
          );
        })}
      </div>
      {error && errorId ? <FieldError id={errorId}>{error}</FieldError> : null}
    </fieldset>
  );
}
