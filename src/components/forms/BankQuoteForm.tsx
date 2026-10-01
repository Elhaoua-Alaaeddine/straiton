"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { CheckCircle, LockSimple } from "@phosphor-icons/react/ssr";
import { bankQuoteForm as copy, validationMessages as m } from "@/content/forms";
import {
  NOTE_MAX,
  keepFocus,
  validateEmail,
  validateFile,
  validateNote,
  validateRequiredText,
  type FieldErrors,
  type FileInfo,
} from "@/lib/validation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ErrorSummary } from "@/components/ui/ErrorSummary";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { FileInput } from "@/components/ui/FileInput";

type Values = { company: string; name: string; email: string; note: string };
type Key = keyof Values | "file";
type Status = "editing" | "submitting" | "success";
const EMPTY: Values = { company: "", name: "", email: "", note: "" };
const ORDER: Key[] = ["file", "company", "name", "email", "note"];

export type BankQuoteFormState = {
  status?: Status;
  values?: Partial<Values>;
  file?: FileInfo | null;
  errors?: FieldErrors<Key>;
  attempted?: boolean;
};

export function BankQuoteForm({
  idPrefix = "bq",
  onClose,
  onSubmitted,
  initialState,
}: {
  idPrefix?: string;
  onClose?: () => void;
  onSubmitted?: () => void;
  initialState?: BankQuoteFormState;
}) {
  const id = (key: string) => `${idPrefix}-${key}`;
  const [values, setValues] = useState<Values>({ ...EMPTY, ...initialState?.values });
  const [file, setFile] = useState<FileInfo | null>(initialState?.file ?? null);
  const [errors, setErrors] = useState<FieldErrors<Key>>(initialState?.errors ?? {});
  const [attempted, setAttempted] = useState(Boolean(initialState?.attempted));
  const [status, setStatus] = useState<Status>(initialState?.status ?? "editing");
  const [focusTick, setFocusTick] = useState(0);
  const focusTarget = useRef<"summary" | "success" | "file" | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  useEffect(() => {
    const target = focusTarget.current;
    focusTarget.current = null;
    if (target === "summary") summaryRef.current?.focus();
    if (target === "success") successRef.current?.focus();
    if (target === "file") document.getElementById(`${idPrefix}-file`)?.focus();
  }, [focusTick, idPrefix]);

  function requestFocus(target: NonNullable<typeof focusTarget.current>) {
    focusTarget.current = target;
    setFocusTick((tick) => tick + 1);
  }

  function validate(key: Key, v: Values, f: FileInfo | null): string | undefined {
    switch (key) {
      case "file":
        return validateFile(f);
      case "company":
        return validateRequiredText(v.company, m.company);
      case "name":
        return validateRequiredText(v.name, m.name);
      case "email":
        return validateEmail(v.email);
      case "note":
        return validateNote(v.note);
    }
  }

  function update(key: keyof Values, value: string) {
    const next = { ...values, [key]: value };
    setValues(next);
    if (attempted || errors[key]) setErrors((current) => ({ ...current, [key]: validate(key, next, file) }));
  }

  function blur(key: keyof Values) {
    if (values[key].trim() !== "" || attempted) {
      setErrors((current) => ({ ...current, [key]: validate(key, values, file) }));
    }
  }

  function changeFile(next: FileInfo | null) {
    setFile(next);
    // A wrong type or size is flagged straight away; a missing file waits for submit.
    if (next || attempted) setErrors((current) => ({ ...current, file: validate("file", values, next) }));
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status !== "editing") return;
    const found: FieldErrors<Key> = {};
    for (const key of ORDER) {
      const error = validate(key, values, file);
      if (error) found[key] = error;
    }
    setAttempted(true);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      requestFocus("summary");
      return;
    }
    setStatus("submitting");
    timer.current = setTimeout(() => {
      setStatus("success");
      onSubmitted?.();
      requestFocus("success");
    }, 1400);
  }

  function reset() {
    setValues(EMPTY);
    setFile(null);
    setErrors({});
    setAttempted(false);
    setStatus("editing");
    requestFocus("file");
  }

  const busy = status === "submitting";
  const summaryItems = attempted
    ? ORDER.filter((key) => errors[key]).map((key) => ({ id: id(key), message: errors[key] as string }))
    : [];
  const firstName = values.name.trim().split(/\s+/)[0] ?? "";

  if (status === "success") {
    return (
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
        <p className="mt-4 text-body text-fg-muted">{copy.success.body}</p>
        {file ? (
          <p className="mt-3 flex items-start gap-2 text-small break-words text-fg-muted">
            <LockSimple size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
            <span>{copy.success.fileLine(file.name)}</span>
          </p>
        ) : null}
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Button variant="secondary" onClick={reset}>
            {copy.success.again}
          </Button>
          {onClose ? <Button onClick={onClose}>{copy.close}</Button> : null}
        </div>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} aria-label={copy.title}>
      <p className="mb-5 flex items-start gap-2 rounded-card border border-dashed border-line-strong px-3.5 py-3 text-small text-fg-muted">
        <LockSimple size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
        <span>{copy.demoNote}</span>
      </p>

      {summaryItems.length > 0 ? (
        <div className="mb-5">
          <ErrorSummary ref={summaryRef} items={summaryItems} />
        </div>
      ) : null}

      <fieldset disabled={busy} className="flex min-w-0 flex-col gap-5">
        <legend className="sr-only">{copy.title}</legend>
        <Field id={id("file")} label={copy.fields.file.label} error={errors.file}>
          {(a11y) => (
            <FileInput
              a11y={a11y}
              file={file}
              onFileChange={changeFile}
              disabled={busy}
              labels={{
                choose: copy.fields.file.choose,
                drop: copy.fields.file.drop,
                remove: copy.fields.file.remove,
                hint: copy.fields.file.hint,
                stays: copy.fields.file.stays,
              }}
            />
          )}
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id={id("name")} label={copy.fields.name.label} error={errors.name}>
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
          <Field id={id("company")} label={copy.fields.company.label} error={errors.company}>
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
        </div>
        <Field id={id("email")} label={copy.fields.email.label} error={errors.email}>
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

      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {onClose ? (
          <Button variant="secondary" onClick={onClose} disabled={busy}>
            {copy.close}
          </Button>
        ) : null}
        <Button type="submit" loading={busy} loadingLabel={copy.submitting} onMouseDown={keepFocus}>
          {copy.submit}
        </Button>
      </div>
      <p className="sr-only" role="status">
        {busy ? copy.submittingAnnouncement : ""}
      </p>
    </form>
  );
}
