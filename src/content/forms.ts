/** Copy for the assessment form and the bank-quote dialog, including every
 * label, hint and validation message. */

export const paymentTypes = [
  { value: "supplier", label: "Supplier payment" },
  { value: "invoice", label: "Invoice payment" },
  { value: "other", label: "Other eligible business payment" },
] as const;

export const currencies = [
  { value: "AED", label: "AED", detail: "UAE dirham" },
  { value: "USD", label: "USD", detail: "US dollar" },
] as const;

export const assessmentForm = {
  title: "Request a payment assessment",
  intro: "Two short steps. No account needed.",
  steps: ["The payment", "Your details"],
  stepOf: (step: number, total: number) => `Step ${step} of ${total}`,
  fields: {
    currency: { label: "Funding currency" },
    amount: {
      label: "Payment amount",
      hint: "An estimate is fine. Pilot limits are still being confirmed.",
      placeholder: "e.g. 250,000",
    },
    paymentType: { label: "Payment type", placeholder: "Select a payment type" },
    company: { label: "Company name", hint: "The UAE company making the payment." },
    name: { label: "Your name" },
    email: { label: "Work email", placeholder: "name@company.ae" },
    phone: { label: "Phone", hint: "Include the country code, like +971." },
    note: {
      label: "Anything we should know?",
      hint: "For example, timing, the goods involved or your supplier's location.",
    },
  },
  optional: "optional",
  required: "required",
  continue: "Continue",
  back: "Back",
  submit: "Request an assessment",
  submitting: "Sending request",
  submittingAnnouncement: "Sending your request.",
  talkFirst: "Prefer to talk first?",
  success: {
    badge: "Demo only. No data was sent.",
    title: (name: string) => (name ? `Thanks, ${name}. Here's what happens next.` : "Here's what happens next."),
    summaryLabel: "Your request",
    intro: "In the live service:",
    steps: [
      "An India payments manager reviews your payment details.",
      "They contact you to confirm eligibility and share a document checklist for this payment.",
      "You receive a transaction-specific quote before anything is funded.",
    ],
    contact: (email: string) => `We'd reply to ${email}.`,
    reset: "Start a new request",
  },
} as const;

export const bankQuoteForm = {
  title: "Send us your bank quote",
  intro: "Share the quote your bank gave you. We'll use it to understand the payment and prepare your assessment.",
  demoNote: "Demo: your file stays on your device. Nothing is uploaded.",
  fields: {
    file: {
      label: "Bank quote",
      hint: "PDF, PNG or JPG, up to 10 MB.",
      choose: "Choose a file",
      drop: "or drag it here",
      remove: "Remove file",
      stays: "Stays on your device.",
    },
    company: { label: "Company name" },
    name: { label: "Your name" },
    email: { label: "Work email", placeholder: "name@company.ae" },
    note: { label: "Anything we should know?", hint: "For example, when the payment is due." },
  },
  optional: "optional",
  required: "required",
  submit: "Send quote",
  submitting: "Sending quote",
  submittingAnnouncement: "Sending your quote.",
  close: "Close",
  success: {
    badge: "Demo only. No data was sent.",
    title: (name: string) => (name ? `Thanks, ${name}. Here's what would happen next.` : "Here's what would happen next."),
    body: "In the live service, an India payments manager would review the payment details in your quote and contact you about an assessment.",
    fileLine: (file: string) => `${file} never left your device.`,
    again: "Send another quote",
  },
} as const;

export const errorSummary = {
  title: (count: number) => (count === 1 ? "There's 1 thing to fix" : `There are ${count} things to fix`),
  srPrefix: "Error:",
} as const;

export const validationMessages = {
  amount: {
    required: "Enter the payment amount",
    format: "Enter the amount as a number, like 250,000",
    positive: "The amount must be more than 0",
    tooLong: "Enter an amount with no more than 12 digits",
  },
  paymentType: { required: "Select the type of payment" },
  company: { required: "Enter your company name", short: "Company name must be at least 2 characters" },
  name: { required: "Enter your name", short: "Name must be at least 2 characters" },
  email: { required: "Enter your work email", format: "Enter an email address like name@company.ae" },
  phone: { format: "Enter a phone number with country code, like +971 5X XXX XXXX" },
  note: { tooLong: (max: number) => `Keep this under ${max} characters` },
  file: {
    required: "Choose your bank quote file",
    type: "The file must be a PDF, PNG or JPG",
    size: "The file must be smaller than 10 MB",
  },
} as const;
