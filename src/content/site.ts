/**
 * All landing-page copy lives here so it can be edited without touching
 * layout code. Product facts are deliberately conservative: no rates, prices,
 * guarantees, licences, logos, testimonials or statistics. Example figures and
 * UI are labelled Illustrative wherever they render.
 */

export const brand = {
  name: "Straiton",
  tagline: "Cross-border business payments, starting with the UAE to India.",
} as const;

export const meta = {
  title: "Straiton | Pay suppliers in India from the UAE",
  description:
    "UAE businesses paying suppliers in India: a transaction-specific quote before you fund, a document checklist for your payment and one India payments manager throughout. India corridor in pilot preparation.",
} as const;

export const nav = [
  { label: "Quote", href: "#quote" },
  { label: "Readiness", href: "#readiness" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Support", href: "#support" },
  { label: "FAQ", href: "#faq" },
] as const;

export const ctas = {
  assessment: { label: "Request an assessment", href: "#assessment" },
  bankQuote: {
    lead: "Already have a bank quote?",
    action: "Send it to us",
    full: "Already have a bank quote? Send it to us",
    mobile: "Send us your bank quote",
  },
  manager: { label: "Talk to the India payments manager", href: "#support" },
} as const;

/** Messages shown in a toast when a demo-only control is used. */
export const demo = {
  label: "Demo",
  signIn: { title: "Sign in isn't part of this demo", body: "The payment workspace is shown as an illustration only." },
  guide: { title: "Guides aren't part of this demo", body: "In the live site this would open the full guide." },
  whatsapp: { title: "WhatsApp isn't connected in this demo", body: "The contact details on this page are placeholders." },
  phone: { title: "Demo phone number", body: "+971 00 000 0000 is a placeholder. Nothing will be dialled." },
  email: { title: "Demo email address", body: "india@straiton.example is a placeholder. No email will be sent." },
  legal: { title: "Legal pages aren't part of this demo", body: "Approved legal documents will be supplied separately." },
} as const;

export const hero = {
  corridor: "UAE to India business payments",
  status: "Pilot preparation",
  title: "Pay suppliers in India without the usual surprises.",
  lead: "A transaction-specific quote before you fund, a document checklist for your payment, and one India payments manager throughout.",
} as const;

export const eligibility = {
  title: "The India pilot is designed for",
  items: ["UAE companies", "Genuine B2B payments", "Indian business beneficiaries", "Documented commercial purpose"],
  note: "Final eligibility is subject to compliance review.",
} as const;

export const problem = {
  id: "why",
  title: "Most payment problems start before the money moves.",
  columns: { problem: "What often happens", answer: "What Straiton does instead" },
  rows: [
    {
      topic: "The quote",
      problem: "A bank quote that leaves you working out what your supplier will actually receive.",
      answer: "A transaction-specific quote before you fund: what you send, the FX, fees where applicable and the INR amount.",
    },
    {
      topic: "The paperwork",
      problem: "Document requests that arrive after the payment is already moving.",
      answer: "A checklist for this specific payment, shared before anything is funded.",
    },
    {
      topic: "The wait",
      problem: "No clear view of where the money is, or whether your supplier has it.",
      answer: "Status tracking through to confirmation, and a manager you can message at any stage.",
    },
  ],
} as const;

export const quote = {
  id: "quote",
  title: "See the whole payment before you commit.",
  lead: "Every payment gets its own quote, shown before you fund. It sets out what you send, the exchange rate, any applicable fees and what your supplier receives.",
  points: ["Shown before you fund", "Specific to your transaction", "Fees shown where applicable"],
  bankQuoteBody:
    "Send us the quote your bank gave you. We'll use it to understand the payment and prepare your assessment.",
  panel: {
    title: "Payment quote",
    subtitle: "Supplier payment, UAE to India",
    rows: [
      { key: "send", label: "You send", value: "AED 250,000.00", note: "The amount in your request" },
      { key: "fx", label: "Exchange rate", value: "Transaction-specific", note: "Quoted for this payment" },
      { key: "fees", label: "Fees", value: "Shown where applicable", note: "Set out before you fund" },
      { key: "receive", label: "Supplier receives", value: "INR amount in your quote", note: "Confirmed before funding" },
    ],
    timing: { label: "Expected timing", value: "Same-day where supported" },
    footnote: "Illustrative example. No live rates or fees are shown. Pricing and timing are transaction-specific.",
  },
} as const;

export const corridor = {
  id: "corridor",
  title: "The corridor, in plain terms.",
  lead: "What's set for the India pilot, and what we're still confirming.",
  setTitle: "Set for the pilot",
  route: {
    fromLabel: "From",
    from: "United Arab Emirates",
    toLabel: "To",
    to: "India",
    fundLabel: "You fund in",
    fund: "AED or USD",
    receiveLabel: "Your supplier receives",
    receive: "INR",
  },
  facts: [
    { icon: "speed", label: "Speed", value: "Same-day where supported" },
    { icon: "types", label: "Payment types", value: "Supplier, invoice and other eligible business payments" },
    { icon: "beneficiary", label: "Beneficiaries", value: "Eligible Indian businesses" },
    { icon: "fx", label: "FX", value: "Transaction-specific quote before funding" },
    { icon: "documents", label: "Documents", value: "A checklist specific to each payment" },
    { icon: "tracking", label: "Tracking", value: "Status tracking and confirmation" },
    { icon: "support", label: "Support", value: "A dedicated India payments manager" },
  ],
  pending: {
    title: "Still being confirmed",
    note: "Your India payments manager can share the latest position.",
    badge: "To be confirmed",
    items: ["Payout method", "Cut-off times", "Minimum and maximum amounts"],
  },
} as const;

export const readiness = {
  id: "readiness",
  title: "Catch the issues while they're still easy to fix.",
  lead: "Before a payment is funded, we look at the details that can hold it up later.",
  checks: {
    title: "What we check upfront",
    items: [
      "Company information",
      "Invoice or contract context",
      "Beneficiary details",
      "Payment purpose",
      "Supporting documents, where required",
    ],
  },
  avoids: {
    title: "What that helps you avoid",
    items: [
      "Payments returned for missing or inconsistent information",
      "Extra document requests after you've submitted",
      "Beneficiary mismatches",
      "Compliance back-and-forth",
      "Missed cut-offs",
    ],
  },
  caveat:
    "Preparation reduces avoidable friction. It doesn't guarantee approval or timing, and the documents needed can vary by transaction.",
} as const;

export type StageId = "share" | "assess" | "complete" | "track";

export const howItWorks = {
  id: "how-it-works",
  title: "From request to confirmation, in four stages.",
  lead: "Your India payments manager is with you at each one.",
  tabsLabel: "Payment stages",
  stages: [
    {
      id: "share",
      label: "Share",
      title: "Tell us about the payment",
      body: "Share the amount, funding currency, payment type and who you're paying. Two short steps, no account needed.",
      output: "Assessment request",
    },
    {
      id: "assess",
      label: "Assess",
      title: "Get the quote structure and your checklist",
      body: "We review the payment and come back with the quote structure and a document checklist for this specific payment.",
      output: "Quote structure and checklist",
    },
    {
      id: "complete",
      label: "Complete",
      title: "Onboard and fund",
      body: "Complete onboarding, review your transaction-specific quote, then fund the approved payment in AED or USD.",
      output: "Funded payment",
    },
    {
      id: "track",
      label: "Track",
      title: "Follow it to confirmation",
      body: "Track the payment's status through to confirmation, with your manager on hand if anything needs attention.",
      output: "Status and confirmation",
    },
  ] as ReadonlyArray<{ id: StageId; label: string; title: string; body: string; output: string }>,
  managerNote: "Manager support at every stage",
} as const;

/** Illustrative payment workspace states, one per stage. */
export const workspace = {
  breadcrumb: ["Payments", "Supplier payment"],
  corridor: "UAE to India",
  title: "Supplier payment",
  sidebar: ["Payments", "Beneficiaries", "Documents", "Support"],
  track: ["Request", "Assessment", "Funding", "Confirmation"],
  manager: { label: "Your India payments manager", action: "Message" },
  caption: "Illustrative payment workspace. Not a live account.",
  stages: {
    share: {
      status: { label: "Request received", tone: "neutral" },
      heading: "Payment details",
      rows: [
        { label: "Amount", value: "AED 250,000.00" },
        { label: "Payment type", value: "Supplier payment" },
        { label: "Beneficiary", value: "Indian business" },
        { label: "Purpose", value: "Goods invoice" },
      ],
    },
    assess: {
      status: { label: "Checklist shared", tone: "accent" },
      heading: "Quote structure and checklist",
      rows: [
        { label: "Exchange rate", value: "Transaction-specific" },
        { label: "Fees", value: "Shown where applicable" },
        { label: "Supplier receives", value: "INR, shown before funding" },
      ],
      checklist: [
        { label: "Company information", state: "done", note: "Received" },
        { label: "Invoice", state: "done", note: "Received" },
        { label: "Beneficiary details", state: "pending", note: "Requested" },
        { label: "Payment purpose", state: "done", note: "Received" },
      ],
    },
    complete: {
      status: { label: "Awaiting funding", tone: "pending" },
      heading: "Onboarding and funding",
      checklist: [
        { label: "Onboarding", state: "done", note: "Complete" },
        { label: "Quote", state: "done", note: "Accepted" },
        { label: "Funding", state: "pending", note: "Awaiting AED transfer" },
      ],
    },
    track: {
      status: { label: "Confirmation available", tone: "success" },
      heading: "Payment status",
      checklist: [
        { label: "Funds received", state: "done", note: "Done" },
        { label: "Payment sent", state: "done", note: "Done" },
        { label: "Confirmation", state: "done", note: "Available" },
      ],
    },
  },
} as const;

export const support = {
  id: "support",
  title: "Talk to someone who knows this corridor.",
  lead: "One India payments manager, from your first question to confirmation. Reach them the way your team already works.",
  helpsWithTitle: "They can help with",
  helpsWith: ["Your quote", "Document checklist", "Onboarding and funding", "Payment status"],
  card: {
    role: "India payments manager",
    team: "Straiton, UAE to India corridor",
    stages: "Available at every stage: Share, Assess, Complete and Track.",
    channels: [
      { kind: "whatsapp", label: "Talk to the India payments manager", detail: "WhatsApp" },
      { kind: "phone", label: "+971 00 000 0000", detail: "Phone" },
      { kind: "email", label: "india@straiton.example", detail: "Email" },
    ],
    demoNote: "Demo contact details. Nothing is connected in this preview.",
  },
} as const;

export const faq = {
  id: "faq",
  title: "Straight answers.",
  lead: "Including the ones we can't give a simple yes to.",
  items: [
    {
      id: "who",
      question: "Who can use the India pilot?",
      answer:
        "The pilot is designed for UAE companies making genuine B2B payments to Indian business beneficiaries, with a documented commercial purpose. Final eligibility is subject to compliance review.",
    },
    {
      id: "same-day",
      question: "Do you guarantee same-day execution?",
      answer:
        "No. Same-day execution may be available where supported, but actual timing depends on eligibility, payment details, documentation, cut-off times and compliance review. We'd rather say that plainly than promise a time we can't control.",
    },
    {
      id: "currencies",
      question: "Which currencies can I fund in, and what does my supplier receive?",
      answer: "You fund in AED or USD. Your supplier in India receives INR.",
    },
    {
      id: "fx",
      question: "How is the exchange rate set? Are there fees?",
      answer:
        "Each payment gets a transaction-specific quote before you fund, covering the exchange rate and what your supplier receives. Fees are shown where applicable. There are no live rates on this page because pricing depends on the transaction.",
    },
    {
      id: "types",
      question: "What kinds of payments are supported?",
      answer: "Supplier payments, invoice payments and other eligible business payments.",
    },
    {
      id: "documents",
      question: "What documents will I need?",
      answer:
        "It depends on the payment. We look at company information, invoice or contract context, beneficiary details and payment purpose, plus supporting documents where required. You get a checklist specific to your payment before anything is funded.",
    },
    {
      id: "crypto",
      question: "Do I need to hold or manage crypto?",
      answer:
        "No. You fund in AED or USD and your supplier receives INR. Stablecoins may be used as an internal settlement layer, but you never hold or manage them.",
    },
    {
      id: "talk",
      question: "Can I speak to someone before onboarding?",
      answer:
        "Yes. Your India payments manager is available on WhatsApp, phone or email at every stage, including before you onboard.",
    },
    {
      id: "limits",
      question: "What are the payout method, cut-off times and limits?",
      answer:
        "These are still being confirmed for the pilot. Your India payments manager can tell you the latest position when you request an assessment.",
    },
  ],
  guides: {
    title: "Guides",
    items: [
      "How to pay a supplier in India from the UAE",
      "Documents for UAE to India business payments",
      "How long UAE to India business payments take",
      "Understanding FX and the total cost of a payment",
    ],
  },
} as const;

export const finalCta = {
  id: "start",
  title: "Let's look at your next India payment.",
  lead: "Request an assessment, send us a bank quote you already have, or talk to the India payments manager.",
} as const;

export const footer = {
  pageLinksTitle: "On this page",
  corridorsTitle: "Corridors",
  corridors: [
    { label: "UAE to India", status: "Pilot preparation" },
    { label: "EU corridors", status: "Later" },
  ],
  contactTitle: "Contact",
  regulatory: {
    title: "Regulatory information",
    body: "Design placeholder. Approved legal entity and regulatory disclosures will be supplied separately.",
  },
  prototypeNote: "This page is a design prototype. Figures, contact details and product screens are illustrative.",
  legal: ["Privacy", "Terms"],
  copyright: "© 2026 Straiton",
} as const;
