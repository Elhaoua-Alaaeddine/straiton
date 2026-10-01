import { Check } from "@phosphor-icons/react/ssr";
import { cn } from "@/lib/cn";
import { FieldError, FieldLabel } from "./Field";

type Option = { value: string; label: string; detail?: string };

/**
 * A radio group styled as a segmented control. Native radios keep arrow-key
 * behaviour; the selected option gets a check icon and weight, not just colour.
 */
export function SegmentedControl({
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
  options: ReadonlyArray<Option>;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  requiredLabel?: string;
  force?: { value: string; state: string };
}) {
  const errorId = error ? `${id}-error` : undefined;
  return (
    <fieldset className="flex min-w-0 flex-col gap-2" aria-describedby={errorId} disabled={disabled}>
      <FieldLabel as="legend" required={required} requiredLabel={requiredLabel}>
        {legend}
      </FieldLabel>
      <div
        className={cn(
          "grid grid-cols-2 gap-1 rounded-control border bg-surface-sunken p-1",
          error ? "border-danger-line" : "border-line-strong",
        )}
      >
        {options.map((option, index) => {
          const checked = value === option.value;
          const optionId = index === 0 ? id : `${id}-${option.value}`;
          return (
            <label key={option.value} className="relative block cursor-pointer has-disabled:cursor-not-allowed">
              <input
                type="radio"
                id={optionId}
                name={name}
                value={option.value}
                checked={checked}
                required={required}
                onChange={() => onChange(option.value)}
                className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
                data-force={force?.value === option.value ? force.state : undefined}
              />
              <span
                className={cn(
                  "flex min-h-11 items-center justify-center gap-2 rounded-sm px-3 text-small transition-[background-color,color,box-shadow] duration-200 ease-out-soft",
                  "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus",
                  "peer-data-[force~=focus]:outline-2 peer-data-[force~=focus]:outline-offset-2 peer-data-[force~=focus]:outline-focus",
                  checked
                    ? "bg-surface font-semibold text-fg shadow-soft ring-1 ring-line"
                    : "font-medium text-fg-muted peer-hover:text-fg",
                )}
              >
                {checked ? <Check size={16} weight="bold" className="text-accent" aria-hidden="true" /> : null}
                <span>{option.label}</span>
                {option.detail ? <span className="sr-only">, {option.detail}</span> : null}
              </span>
            </label>
          );
        })}
      </div>
      {error && errorId ? <FieldError id={errorId}>{error}</FieldError> : null}
    </fieldset>
  );
}
