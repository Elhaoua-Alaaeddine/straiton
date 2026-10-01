"use client";

import { useState, useSyncExternalStore, type ReactNode } from "react";
import { ArrowRight, FileText, WhatsappLogo } from "@phosphor-icons/react/ssr";
import { validationMessages as m, currencies, paymentTypes, bankQuoteForm } from "@/content/forms";
import { faq, howItWorks, type StageId } from "@/content/site";
import { cn } from "@/lib/cn";
import { Accordion } from "@/components/ui/Accordion";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { Button, type ButtonVariant } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { ErrorSummary } from "@/components/ui/ErrorSummary";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { FileInput } from "@/components/ui/FileInput";
import { Logo, LogoMark } from "@/components/ui/Logo";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Tabs } from "@/components/ui/Tabs";
import { ToastView } from "@/components/ui/Toast";
import { AssessmentForm } from "@/components/forms/AssessmentForm";
import { BankQuoteForm } from "@/components/forms/BankQuoteForm";
import { QuotePreview } from "@/components/product/QuotePreview";
import { WorkspacePreview } from "@/components/product/WorkspacePreview";
import { DemoAction } from "@/components/actions";

const PALETTE = [
  ["ink-950", "ink-900", "ink-800", "ink-700", "ink-600"],
  ["slate-600", "slate-500", "slate-400", "mist-400", "mist-300"],
  ["mist-200", "mist-100", "mist-50", "paper", "white"],
  ["strait-900", "strait-700", "strait-600", "strait-300", "strait-50"],
  ["amber-700", "amber-300", "amber-50", "red-700", "red-50"],
];
const SEMANTIC = [
  "canvas",
  "surface",
  "surface-tint",
  "fg",
  "fg-muted",
  "fg-subtle",
  "line",
  "line-strong",
  "accent",
  "action",
  "focus",
  "pending-fg",
  "danger-fg",
];

const noSubscribe = () => () => {};

/** Reads a colour token's live value from CSS. Empty on the server, filled after hydration. */
function TokenValue({ name }: { name: string }) {
  const value = useSyncExternalStore(
    noSubscribe,
    () => {
      const root = getComputedStyle(document.documentElement);
      const raw = root.getPropertyValue(`--color-${name}`).trim();
      // Semantic tokens point at palette tokens; follow the reference.
      const ref = raw.match(/^var\(--color-([a-z0-9-]+)\)$/);
      return ref ? root.getPropertyValue(`--color-${ref[1]}`).trim() : raw;
    },
    () => "",
  );
  return <>{value}</>;
}

function Block({ title, note, children, navy }: { title: string; note?: string; children: ReactNode; navy?: boolean }) {
  return (
    <section className={cn("border-t border-line py-12", navy && "surface-navy -mx-gutter rounded-frame px-gutter")}>
      <h2 className="heading-3 text-fg">{title}</h2>
      {note ? <p className="mt-1 max-w-copy text-small text-fg-muted">{note}</p> : null}
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Label({ children }: { children: ReactNode }) {
  return <p className="mb-2 text-micro font-semibold text-fg-subtle">{children}</p>;
}

const STATES = [
  { label: "Default" },
  { label: "Hover", force: "hover" },
  { label: "Focus", force: "focus" },
  { label: "Pressed", force: "active" },
  { label: "Disabled", disabled: true },
  { label: "Loading", loading: true },
];

function ButtonMatrix() {
  const variants: ButtonVariant[] = ["primary", "secondary", "tertiary"];
  return (
    <div className="-m-2 overflow-x-auto p-2">
      <div className="grid min-w-[52rem] grid-cols-[6rem_repeat(6,minmax(0,1fr))] items-center gap-3">
        <span />
        {STATES.map((s) => (
          <span key={s.label} className="text-micro font-semibold text-fg-subtle">
            {s.label}
          </span>
        ))}
        {variants.map((variant) => (
          <div key={variant} className="contents">
            <span className="text-small font-semibold text-fg capitalize">{variant}</span>
            {STATES.map((s) => (
              <div key={s.label}>
                <Button
                  variant={variant}
                  size="sm"
                  force={s.force}
                  disabled={s.disabled}
                  loading={s.loading}
                  loadingLabel="Sending"
                >
                  {variant === "tertiary" ? "Talk to us" : "Request"}
                </Button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

const BADGES: Array<[BadgeVariant, string]> = [
  ["neutral", "Request received"],
  ["accent", "Checklist shared"],
  ["pending", "To be confirmed"],
  ["success", "Confirmed"],
  ["danger", "Action needed"],
  ["demo", "Demo"],
  ["illustrative", "Illustrative"],
];

const noop = () => {};

export function Showcase() {
  const [stage, setStage] = useState<StageId>("assess");
  const [currency, setCurrency] = useState("AED");

  return (
    <main id="main" className="pb-24">
      <Container>
        <header className="flex flex-wrap items-center justify-between gap-6 py-10">
          <div>
            <Logo />
            <h1 className="mt-6 heading-2 text-fg">Design system</h1>
            <p className="mt-3 max-w-copy text-lead text-fg-muted">
              Tokens and component states behind the Straiton landing page. Hover, focus and pressed states are
              forced for review.
            </p>
          </div>
          <Button href="/" variant="secondary" iconRight={<ArrowRight size={18} weight="bold" aria-hidden="true" />}>
            View the landing page
          </Button>
        </header>

        <Block title="Logo" note="The mark is an S-shaped channel between two shores. A strait joins two seas.">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="flex min-h-32 items-center justify-center">
              <Logo size="lg" />
            </Card>
            <div className="surface-navy flex min-h-32 items-center justify-center rounded-card">
              <Logo size="lg" tone="dark" />
            </div>
            <Card className="flex min-h-32 items-center justify-center gap-5">
              {[16, 24, 32, 48].map((s) => (
                <LogoMark key={s} size={s} />
              ))}
            </Card>
          </div>
        </Block>

        <Block title="Colour" note="Palette tokens, then the semantic tokens components use. Values read live from CSS.">
          <div className="grid gap-3">
            {PALETTE.map((row, i) => (
              <div key={i} className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                {row.map((name) => (
                  <div key={name} className="overflow-hidden rounded-card border border-line bg-surface">
                    <div className="h-14" style={{ background: `var(--color-${name})` }} />
                    <div className="px-3 py-2">
                      <p className="text-small font-semibold text-fg">{name}</p>
                      <p className="text-micro text-fg-muted uppercase tabular-nums"><TokenValue name={name} /></p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
            {SEMANTIC.map((name) => (
              <div key={name} className="flex items-center gap-2 rounded-control border border-line bg-surface p-2">
                <span className="size-7 shrink-0 rounded-sm border border-line" style={{ background: `var(--color-${name})` }} />
                <span className="min-w-0">
                  <span className="block truncate text-micro font-semibold text-fg">{name}</span>
                  <span className="block text-micro text-fg-muted uppercase"><TokenValue name={name} /></span>
                </span>
              </div>
            ))}
          </div>
        </Block>

        <Block title="Type" note="Instrument Sans. Headlines use the width axis at 88 to 96; body text runs at full width.">
          <div className="flex flex-col gap-6">
            {[
              ["display", <p key="d" className="heading-display text-fg">Pay suppliers in India</p>],
              ["h2", <p key="2" className="heading-2 text-fg">See the whole payment before you commit.</p>],
              ["h3", <p key="3" className="heading-3 text-fg">Talk to someone who knows this corridor</p>],
              ["lead", <p key="l" className="max-w-copy text-lead text-fg-muted">Every payment gets its own quote, shown before you fund.</p>],
              ["body", <p key="b" className="max-w-copy text-body text-fg">Supplier payments, invoice payments and other eligible business payments.</p>],
              ["small", <p key="s" className="text-small text-fg-muted">An estimate is fine. Pilot limits are still being confirmed.</p>],
              ["micro", <p key="m" className="text-micro font-semibold text-fg-subtle">Illustrative example</p>],
            ].map(([token, sample]) => (
              <div key={token as string} className="grid gap-2 md:grid-cols-[6rem_minmax(0,1fr)] md:items-baseline">
                <span className="text-micro font-semibold text-fg-subtle">{token as string}</span>
                {sample}
              </div>
            ))}
          </div>
        </Block>

        <Block title="Buttons" note="Three variants, three sizes (44, 48 and 56px tall). Tertiary keeps a 44px hit area.">
          <ButtonMatrix />
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button size="sm" iconRight={<ArrowRight size={16} weight="bold" aria-hidden="true" />}>
              Small
            </Button>
            <Button size="md" iconRight={<ArrowRight size={18} weight="bold" aria-hidden="true" />}>
              Medium
            </Button>
            <Button size="lg" iconRight={<ArrowRight size={18} weight="bold" aria-hidden="true" />}>
              Large
            </Button>
            <Button variant="secondary" iconLeft={<FileText size={18} aria-hidden="true" />}>
              Already have a bank quote? Send it to us
            </Button>
          </div>
        </Block>

        <Block title="Buttons on navy" note="The same components; semantic tokens remap inside surface-navy." navy>
          <ButtonMatrix />
        </Block>

        <Block title="Badges" note="Status pills carry an icon and text. A dashed outline always means demo or illustrative.">
          <div className="flex flex-wrap gap-2">
            {BADGES.map(([variant, text]) => (
              <Badge key={variant} variant={variant}>
                {text}
              </Badge>
            ))}
          </div>
          <div className="surface-navy mt-4 flex flex-wrap gap-2 rounded-card p-4">
            {BADGES.map(([variant, text]) => (
              <Badge key={variant} variant={variant}>
                {text}
              </Badge>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <DemoAction message="signIn">Sign in</DemoAction>
            <DemoAction message="whatsapp" icon={<WhatsappLogo size={18} aria-hidden="true" />}>
              WhatsApp
            </DemoAction>
          </div>
        </Block>

        <Block title="Fields" note="Label above, hint under the label, error under the control with an icon and text.">
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
            <Field id="f-default" label="Company name">
              {(a) => <Input {...a} placeholder="Placeholder text" />}
            </Field>
            <Field id="f-hint" label="Company name" hint="The UAE company making the payment.">
              {(a) => <Input {...a} defaultValue="Al Noor Trading LLC" />}
            </Field>
            <Field id="f-focus" label="Work email">
              {(a) => <Input {...a} force="focus" defaultValue="finance@alnoor.ae" />}
            </Field>
            <Field id="f-error" label="Work email" error={m.email.format}>
              {(a) => <Input {...a} defaultValue="finance@alnoor" />}
            </Field>
            <Field id="f-disabled" label="Company name">
              {(a) => <Input {...a} disabled defaultValue="Disabled while sending" />}
            </Field>
            <Field id="f-prefix" label="Payment amount" hint="An estimate is fine.">
              {(a) => <Input {...a} prefix="AED" defaultValue="250,000" className="tabular-nums" />}
            </Field>
            <Field id="f-select" label="Payment type">
              {(a) => (
                <Select {...a} defaultValue="" className="text-fg-subtle">
                  <option value="" disabled>
                    Select a payment type
                  </option>
                  {paymentTypes.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
            <Field id="f-select-error" label="Payment type" error={m.paymentType.required}>
              {(a) => (
                <Select {...a} defaultValue="" className="text-fg-subtle">
                  <option value="" disabled>
                    Select a payment type
                  </option>
                </Select>
              )}
            </Field>
            <Field id="f-textarea" label="Anything we should know?" optional hint="For example, timing or the goods involved.">
              {(a) => <Textarea {...a} maxChars={500} value="Paying for textile stock ahead of the season." onChange={noop} />}
            </Field>
            <SegmentedControl id="f-seg" name="f-seg" legend="Funding currency" options={currencies} value={currency} onChange={setCurrency} />
            <SegmentedControl
              id="f-seg-focus"
              name="f-seg-focus"
              legend="Funding currency (focus)"
              options={currencies}
              value="USD"
              onChange={noop}
              force={{ value: "USD", state: "focus" }}
            />
            <SegmentedControl
              id="f-seg-error"
              name="f-seg-error"
              legend="Funding currency (error)"
              options={currencies}
              value=""
              onChange={noop}
              error="Choose a funding currency"
            />
          </div>
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Field id="f-file" label="Bank quote" hint={bankQuoteForm.fields.file.hint}>
              {(a) => (
                <FileInput
                  a11y={a}
                  file={null}
                  onFileChange={noop}
                  labels={{ ...bankQuoteForm.fields.file, hint: undefined }}
                />
              )}
            </Field>
            <Field id="f-file-selected" label="Bank quote (selected)">
              {(a) => (
                <FileInput
                  a11y={a}
                  file={{ name: "bank-quote-march.pdf", size: 248_000, type: "application/pdf" }}
                  onFileChange={noop}
                  labels={bankQuoteForm.fields.file}
                />
              )}
            </Field>
            <Field id="f-file-error" label="Bank quote (error)" error={m.file.type}>
              {(a) => <FileInput a11y={a} file={null} onFileChange={noop} labels={bankQuoteForm.fields.file} />}
            </Field>
          </div>
          <div className="mt-8 max-w-md">
            <Label>Error summary</Label>
            <ErrorSummary
              items={[
                { id: "f-error", message: m.email.format },
                { id: "f-select-error", message: m.paymentType.required },
              ]}
            />
          </div>
        </Block>

        <Block title="Assessment form" note="Two steps. Validation runs on submit, then live as fields are fixed. Demo confirmation at the end.">
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
            <div>
              <Label>Step 1, default</Label>
              <AssessmentForm idPrefix="s1" anchorId="s1-card" titleId="s1-title" />
            </div>
            <div>
              <Label>Step 1, submitted with errors</Label>
              <AssessmentForm
                idPrefix="s2"
                anchorId="s2-card"
                titleId="s2-title"
                initialState={{
                  step: 1,
                  attempted: true,
                  values: { amount: "" },
                  errors: { amount: m.amount.required, paymentType: m.paymentType.required },
                }}
              />
            </div>
            <div>
              <Label>Step 2, inline error</Label>
              <AssessmentForm
                idPrefix="s3"
                anchorId="s3-card"
                titleId="s3-title"
                initialState={{
                  step: 2,
                  attempted: true,
                  values: { amount: "250,000", paymentType: "supplier", company: "Al Noor Trading LLC", name: "Mariam Haddad", email: "mariam@alnoor" },
                  errors: { email: m.email.format },
                }}
              />
            </div>
            <div>
              <Label>Step 2, sending</Label>
              <AssessmentForm
                idPrefix="s4"
                anchorId="s4-card"
                titleId="s4-title"
                initialState={{
                  step: 2,
                  status: "submitting",
                  values: {
                    amount: "250,000",
                    paymentType: "supplier",
                    company: "Al Noor Trading LLC",
                    name: "Mariam Haddad",
                    email: "mariam@alnoor.ae",
                    phone: "+971 50 000 0000",
                  },
                }}
              />
            </div>
            <div className="lg:col-span-2">
              <Label>Demo confirmation</Label>
              <AssessmentForm
                idPrefix="s5"
                anchorId="s5-card"
                titleId="s5-title"
                className="max-w-xl"
                initialState={{
                  status: "success",
                  values: {
                    amount: "250,000",
                    paymentType: "supplier",
                    company: "Al Noor Trading LLC",
                    name: "Mariam Haddad",
                    email: "mariam@alnoor.ae",
                  },
                }}
              />
            </div>
          </div>
        </Block>

        <Block title="Bank quote dialog content" note="Rendered inside the modal dialog on the page. Shown inline here.">
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
            {[
              { label: "Default", state: undefined },
              {
                label: "Submitted with errors",
                state: {
                  attempted: true,
                  errors: { file: m.file.required, name: m.name.required, company: m.company.required, email: m.email.required },
                },
              },
              {
                label: "Demo confirmation",
                state: {
                  status: "success" as const,
                  values: { name: "Mariam Haddad" },
                  file: { name: "bank-quote-march.pdf", size: 248_000, type: "application/pdf" },
                },
              },
            ].map((variant, i) => (
              <div key={variant.label}>
                <Label>{variant.label}</Label>
                <div className="overflow-hidden rounded-frame border border-line bg-surface shadow-float">
                  <div className="border-b border-line px-5 pt-5 pb-4">
                    <p className="heading-3 text-fg">{bankQuoteForm.title}</p>
                    <p className="mt-1.5 text-small text-fg-muted">{bankQuoteForm.intro}</p>
                  </div>
                  <div className="px-5 py-5">
                    <BankQuoteForm idPrefix={`bqs${i}`} initialState={variant.state} onClose={noop} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Block>

        <Block title="Accordion">
          <div className="max-w-3xl">
            <Accordion items={faq.items.slice(0, 3)} defaultOpen={["same-day"]} />
          </div>
        </Block>

        <Block title="Tabs and payment workspace" note="Stage tabs drive the illustrative workspace. Arrow keys, Home and End move between tabs.">
          <Tabs
            label={howItWorks.tabsLabel}
            items={howItWorks.stages}
            value={stage}
            onValueChange={(v) => setStage(v as StageId)}
            listClassName="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4"
            renderTab={(item, selected) => (
              <span
                className={cn(
                  "flex min-h-12 items-center justify-center rounded-control border px-3 text-small font-semibold transition-colors",
                  selected ? "border-action bg-accent-soft text-accent" : "border-line text-fg-muted group-hover:text-fg",
                )}
              >
                {item.label}
              </span>
            )}
          >
            {(active) => <WorkspacePreview stage={active as StageId} className="max-w-3xl" />}
          </Tabs>
        </Block>

        <Block title="Cards, section header, toast and quote">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(["plain", "raised", "tint", "outline"] as const).map((variant) => (
              <Card key={variant} variant={variant}>
                <p className="font-semibold text-fg capitalize">{variant}</p>
                <p className="mt-1 text-small text-fg-muted">Card variant</p>
              </Card>
            ))}
          </div>
          <div className="mt-10 grid items-start gap-10 lg:grid-cols-2">
            <div className="flex flex-col gap-10">
              <SectionHeader
                eyebrow="Section header"
                title="From request to confirmation, in four stages."
                lead="Your India payments manager is with you at each one."
              />
              <ToastView title="Sign in isn't part of this demo" body="The payment workspace is shown as an illustration only." />
            </div>
            <QuotePreview />
          </div>
        </Block>
      </Container>
    </main>
  );
}
