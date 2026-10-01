"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, CheckCircle } from "@phosphor-icons/react/ssr";
import { assessmentForm as copy, currencies, paymentTypes, validationMessages as m } from "@/content/forms";
import { ctas } from "@/content/site";
import { cn } from "@/lib/cn";
import {
  NOTE_MAX,
  keepFocus,
  formatAmount,
  validateAmount,
  validateEmail,
  validateNote,
  validatePhone,
  validateRequiredText,
  type FieldErrors,
} from "@/lib/validation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ErrorSummary } from "@/components/ui/ErrorSummary";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { SegmentedControl } from "@/components/ui/SegmentedControl";

export type AssessmentValues = {
  currency: string;
  amount: string;
  paymentType: string;
  company: string;
  name: string;
  email: string;
  phone: string;
  note: string;
};
type Key = keyof AssessmentValues;
type Step = 1 | 2;
type Status = "editing" | "submitting" | "success";

const EMPTY: AssessmentValues = {
  currency: "AED",
  amount: "",
  paymentType: "",
  company: "",
  name: "",
  email: "",
  phone: "",
  note: "",
};

const STEP_FIELDS: Record<Step, Key[]> = {
  1: ["currency", "amount", "paymentType"],
  2: ["company", "name", "email", "phone", "note"],
};

function validate(key: Key, v: AssessmentValues): string | undefined {
  switch (key) {
    case "amount":
      return validateAmount(v.amount);
    case "paymentType":
      return v.paymentType ? undefined : m.paymentType.required;
    case "company":
      return validateRequiredText(v.company, m.company);
    case "name":
      return validateRequiredText(v.name, m.name);
    case "email":
      return validateEmail(v.email);
    case "phone":
      return validatePhone(v.phone);
    case "note":
      return validateNote(v.note);
    default:
      return undefined;
  }
}

export type AssessmentFormState = {
  step?: Step;
  status?: Status;
  values?: Partial<AssessmentValues>;
  errors?: FieldErrors<Key>;
  attempted?: boolean;
};

export function AssessmentForm({
  idPrefix = "af",
  anchorId = "assessment",
  titleId = "assessment-title",
  initialState,
  className,
}: {
  idPrefix?: string;
  anchorId?: string;
  titleId?: string;
  /** Lets /system render any state statically. */
  initialState?: AssessmentFormState;
  className?: string;
}) {
  const id = (key: string) => `${idPrefix}-${key}`;
  const [step, setStep] = useState<Step>(initialState?.step ?? 1);
  const [status, setStatus] = useState<Status>(initialState?.status ?? "editing");
  const [values, setValues] = useState<AssessmentValues>({ ...EMPTY, ...initialState?.values });
  const [errors, setErrors] = useState<FieldErrors<Key>>(initialState?.errors ?? {});
  const [attempted, setAttempted] = useState<Record<Step, boolean>>({
    1: Boolean(initialState?.attempted && (initialState?.step ?? 1) === 1),
    2: Boolean(initialState?.attempted && initialState?.step === 2),
  });
  const [focusTick, setFocusTick] = useState(0);
  const focusTarget = useRef<"summary" | "step" | "success" | "title" | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  useEffect(() => {
    const target = focusTarget.current;
    focusTarget.current = null;
    if (target === "summary") summaryRef.current?.focus();
    if (target === "step") stepHeadingRef.current?.focus();
    if (target === "success") successRef.current?.focus();
    if (target === "title") document.getElementById(titleId)?.focus();
  }, [focusTick, titleId]);

  function requestFocus(target: NonNullable<typeof focusTarget.current>) {
    focusTarget.current = target;
    setFocusTick((tick) => tick + 1);
  }

  function update(key: Key, value: string) {
    const next = { ...values, [key]: value };
    setValues(next);
    if (attempted[step] || errors[key]) {
      setErrors((current) => ({ ...current, [key]: validate(key, next) }));
    }
  }

  function blur(key: Key) {
    let next = values;
    if (key === "amount" && !validateAmount(values.amount)) {
      next = { ...values, amount: formatAmount(values.amount) };
      setValues(next);
    }
    // Only flag an empty required field once the user has tried to continue.
    if (next[key].trim() !== "" || attempted[step]) {
      setErrors((current) => ({ ...current, [key]: validate(key, next) }));
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status !== "editing") return;
    const found: FieldErrors<Key> = {};
    for (const key of STEP_FIELDS[step]) {
      const error = validate(key, values);
      if (error) found[key] = error;
    }
    setAttempted((current) => ({ ...current, [step]: true }));
    setErrors((current) => {
      const merged = { ...current };
      for (const key of STEP_FIELDS[step]) merged[key] = found[key];
      return merged;
    });
    if (Object.keys(found).length > 0) {
      requestFocus("summary");
      return;
    }
    if (step === 1) {
      setStep(2);
      requestFocus("step");
      return;
    }
    setStatus("submitting");
    timer.current = setTimeout(() => {
      setStatus("success");
      requestFocus("success");
    }, 1400);
  }

  function back() {
    setStep(1);
    requestFocus("step");
  }

  function reset() {
    setValues(EMPTY);
    setErrors({});
    setAttempted({ 1: false, 2: false });
    setStep(1);
    setStatus("editing");
    requestFocus("title");
  }

  const summaryItems = attempted[step]
    ? STEP_FIELDS[step]
        .filter((key) => errors[key])
        .map((key) => ({ id: id(key), message: errors[key] as string }))
    : [];

  const busy = status === "submitting";
  const firstName = values.name.trim().split(/\s+/)[0] ?? "";
  const typeLabel = paymentTypes.find((t) => t.value === values.paymentType)?.label;

  return (
    <div
      id={anchorId}
      className={cn(
        // A card, not a full-bleed section: land 1rem below the header rather than flush.
        "relative scroll-mt-[calc(var(--header-total)+1rem)] rounded-frame border border-line bg-surface p-5 shadow-float sm:p-8",
        className,
      )}
    >
      <div className="mb-6">
        <h2 id={titleId} tabIndex={-1} className="heading-3 text-fg">
          {copy.title}
        </h2>
        {status !== "success" ? <p className="mt-1.5 text-small text-fg-muted">{copy.intro}</p> : null}
      </div>

      {status === "success" ? (
        <div>
          <Badge variant="demo">{copy.success.badge}</Badge>
          <div className="mt-5 flex items-start gap-3">
            <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-pill bg-success-bg text-success-fg">
              <CheckCircle size={22} weight="fill" aria-hidden="true" />
            </span>
            <h3 ref={successRef} tabIndex={-1} className="text-lead font-semibold text-fg">
              {copy.success.title(firstName)}
            </h3>
          </div>

          {/* Phones: each label sits above its value, so nothing truncates. */}
          <dl className="mt-5 grid grid-cols-1 gap-y-1 rounded-card bg-surface-sunken p-4 text-small sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-x-4 sm:gap-y-1.5">
            <dt className="text-fg-muted">{copy.success.summaryLabel}</dt>
            <dd className="mb-2 font-semibold break-words text-fg tabular-nums sm:mb-0">
              {values.currency} {values.amount}
              {typeLabel ? <span className="font-normal text-fg-muted">, {typeLabel.toLowerCase()}</span> : null}
            </dd>
            <dt className="text-fg-muted">{copy.fields.company.label}</dt>
            <dd className="font-semibold break-words text-fg">{values.company}</dd>
          </dl>

          <p className="mt-5 text-small font-semibold text-fg">{copy.success.intro}</p>
          <ol className="mt-3 flex flex-col gap-3">
            {copy.success.steps.map((text, index) => (
              <li key={text} className="flex gap-3 text-small text-fg-muted">
                <span
                  className="flex size-6 shrink-0 items-center justify-center rounded-pill border border-line text-micro font-semibold text-fg tabular-nums"
                  aria-hidden="true"
                >
                  {index + 1}
                </span>
                <span className="pt-0.5">{text}</span>
              </li>
            ))}
          </ol>
          {values.email ? (
            <p className="mt-4 text-small break-words text-fg-muted">{copy.success.contact(values.email)}</p>
          ) : null}

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            <Button variant="secondary" onClick={reset}>
              {copy.success.reset}
            </Button>
            <Button variant="tertiary" href={ctas.manager.href}>
              {ctas.manager.label}
            </Button>
          </div>
        </div>
      ) : (
        <form noValidate onSubmit={onSubmit} aria-labelledby={titleId}>
          <div className="mb-5">
            <div className="flex min-h-11 items-center justify-between gap-3">
              {/* Visual indicator only; the step heading below announces it once to screen readers. */}
              <p className="text-micro font-semibold text-fg-muted" aria-hidden="true">
                {copy.stepOf(step, 2)}
              </p>
              {step === 2 ? (
                <Button
                  variant="tertiary"
                  size="sm"
                  onClick={back}
                  disabled={busy}
                  iconLeft={<ArrowLeft size={16} weight="bold" aria-hidden="true" />}
                  className="-mr-1"
                >
                  {copy.back}
                </Button>
              ) : null}
            </div>
            <div className="mt-1 flex gap-1.5" aria-hidden="true">
              {[1, 2].map((n) => (
                <span
                  key={n}
                  className={cn(
                    "h-1 flex-1 rounded-pill transition-colors duration-300",
                    n <= step ? "bg-action" : "bg-line",
                  )}
                />
              ))}
            </div>
            <h3 ref={stepHeadingRef} tabIndex={-1} className="mt-4 text-body font-semibold text-fg">
              <span className="sr-only">{copy.stepOf(step, 2)}: </span>
              {copy.steps[step - 1]}
            </h3>
          </div>

          {summaryItems.length > 0 ? (
            <div className="mb-5">
              <ErrorSummary ref={summaryRef} items={summaryItems} />
            </div>
          ) : null}

          {step === 1 ? (
            <div className="flex flex-col gap-5">
              <SegmentedControl
                required
                requiredLabel={copy.required}
                id={id("currency")}
                name={id("currency")}
                legend={copy.fields.currency.label}
                options={currencies}
                value={values.currency}
                onChange={(value) => update("currency", value)}
              />
              <Field required requiredLabel={copy.required} id={id("amount")} label={copy.fields.amount.label} hint={copy.fields.amount.hint} error={errors.amount}>
                {(a11y) => (
                  <Input
                    {...a11y}
                    name="amount"
                    prefix={values.currency}
                    inputMode="decimal"
                    autoComplete="off"
                    placeholder={copy.fields.amount.placeholder}
                    value={values.amount}
                    onChange={(event) => update("amount", event.target.value)}
                    onBlur={() => blur("amount")}
                    className="tabular-nums"
                  />
                )}
              </Field>
              <Field required requiredLabel={copy.required} id={id("paymentType")} label={copy.fields.paymentType.label} error={errors.paymentType}>
                {(a11y) => (
                  <Select
                    {...a11y}
                    name="paymentType"
                    value={values.paymentType}
                    onChange={(event) => update("paymentType", event.target.value)}
                    onBlur={() => blur("paymentType")}
                    className={values.paymentType ? undefined : "text-fg-subtle"}
                  >
                    <option value="" disabled>
                      {copy.fields.paymentType.placeholder}
                    </option>
                    {paymentTypes.map((type) => (
                      <option key={type.value} value={type.value} className="text-ink-900">
                        {type.label}
                      </option>
                    ))}
                  </Select>
                )}
              </Field>
              <Button
                type="submit"
                size="lg"
                fullWidth
                onMouseDown={keepFocus}
                iconRight={<ArrowRight size={18} weight="bold" aria-hidden="true" />}
              >
                {copy.continue}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              <fieldset disabled={busy} className="flex min-w-0 flex-col gap-5">
                <legend className="sr-only">{copy.steps[1]}</legend>
                <Field required requiredLabel={copy.required} id={id("company")} label={copy.fields.company.label} hint={copy.fields.company.hint} error={errors.company}>
                  {(a11y) => (
                    <Input
                      {...a11y}
                      name="company"
                      autoComplete="organization"
                      value={values.company}
                      onChange={(event) => update("company", event.target.value)}
                      onBlur={() => blur("company")}
                    />
                  )}
                </Field>
                <Field required requiredLabel={copy.required} id={id("name")} label={copy.fields.name.label} error={errors.name}>
                  {(a11y) => (
                    <Input
                      {...a11y}
                      name="name"
                      autoComplete="name"
                      value={values.name}
                      onChange={(event) => update("name", event.target.value)}
                      onBlur={() => blur("name")}
                    />
                  )}
                </Field>
                <Field required requiredLabel={copy.required} id={id("email")} label={copy.fields.email.label} error={errors.email}>
                  {(a11y) => (
                    <Input
                      {...a11y}
                      name="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      spellCheck={false}
                      placeholder={copy.fields.email.placeholder}
                      value={values.email}
                      onChange={(event) => update("email", event.target.value)}
                      onBlur={() => blur("email")}
                    />
                  )}
                </Field>
                <Field
                  id={id("phone")}
                  label={copy.fields.phone.label}
                  hint={copy.fields.phone.hint}
                  optional
                  optionalLabel={copy.optional}
                  error={errors.phone}
                >
                  {(a11y) => (
                    <Input
                      {...a11y}
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      value={values.phone}
                      onChange={(event) => update("phone", event.target.value)}
                      onBlur={() => blur("phone")}
                    />
                  )}
                </Field>
                <Field
                  id={id("note")}
                  label={copy.fields.note.label}
                  hint={copy.fields.note.hint}
                  optional
                  optionalLabel={copy.optional}
                  error={errors.note}
                >
                  {(a11y) => (
                    <Textarea
                      {...a11y}
                      name="note"
                      rows={3}
                      maxChars={NOTE_MAX}
                      value={values.note}
                      onChange={(event) => update("note", event.target.value)}
                      onBlur={() => blur("note")}
                    />
                  )}
                </Field>
              </fieldset>
              <Button
                type="submit"
                size="lg"
                fullWidth
                loading={busy}
                loadingLabel={copy.submitting}
                onMouseDown={keepFocus}
              >
                {copy.submit}
              </Button>
            </div>
          )}
          <p className="sr-only" role="status">
            {busy ? copy.submittingAnnouncement : ""}
          </p>
        </form>
      )}

      {status !== "success" ? (
        <p className="mt-6 flex flex-wrap items-center gap-x-1 border-t border-line pt-4 text-small text-fg-muted">
          <span>{copy.talkFirst}</span>
          <a
            href={ctas.manager.href}
            className="inline-flex min-h-11 items-center font-semibold text-accent underline decoration-transparent decoration-2 underline-offset-4 transition-colors hover:decoration-current"
          >
            {ctas.manager.label}
          </a>
        </p>
      ) : null}
    </div>
  );
}
