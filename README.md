# Straiton landing page

A responsive marketing landing page for **Straiton**, a cross-border B2B payments product, focused on one scenario: UAE businesses paying suppliers in India. The single conversion goal is a **payment assessment request**.

Built as a take-home design assignment. Everything runs locally in the browser: there is no backend, no external service and no real submission. Forms end in a clearly labelled demo confirmation.

- `/` is the landing page.
- `/system` shows the design tokens and every component state (hover, focus, pressed, error, loading, success) for review.

## Setup

Requires Node.js 20.9 or later.

```bash
npm i
npm run dev
```

Open http://localhost:3000.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (Next.js core web vitals and TypeScript rules) |
| `npm run typecheck` | TypeScript, no emit |
| `npm run check:contrast` | Checks every colour pairing in the token file against WCAG AA |
| `npm run test:a11y` | axe-core audit of the page, form errors, dialog and mobile menu |
| `npm run test:states` | Drives every interaction, asserts behaviour and saves screenshots |
| `npm run screenshots` | Full-page captures at 1440, 390 and 320px with an overflow check |

The three browser scripts need the app running and Playwright's Chromium installed:

```bash
npx playwright install chromium
npm run dev
# in a second terminal; BASE_URL defaults to http://localhost:3000
npm run test:states
```

## Deploy to Vercel

The project needs no configuration on Vercel.

**From Git (recommended):**

1. Push this repository to GitHub, GitLab or Bitbucket.
2. In Vercel, choose **Add New > Project** and import the repository.
3. Keep the detected defaults (framework: Next.js, build: `next build`) and deploy.

Every push to a branch other than the production branch gets its own Preview URL.

**From the command line:**

```bash
npx vercel        # first run links the project, then deploys a Preview
```

No environment variables are needed.

## Design tokens

Tokens live in one place: the **CSS `@theme` block in `src/app/globals.css`** (Tailwind v4 has no separate `tailwind.config` file). Each token becomes both a CSS variable and a utility class:

- Colour: `--color-ink-900` becomes `bg-ink-900` and `text-ink-900`.
- Semantic colour: `--color-fg` becomes `text-fg`.
- Type: `--text-h2` becomes `text-h2`. The `heading-*` utilities add weight and the width axis.
- Radius: `--radius-card` becomes `rounded-card`.
- Shadow: `--shadow-float` becomes `shadow-float`.
- Space: `--spacing-section` becomes `py-section`.

Tailwind's default palette, type scale, radii and shadows are reset, so only Straiton tokens exist.

Components use **semantic** tokens (`canvas`, `surface`, `fg`, `fg-muted`, `accent`, `action`...). The `surface-navy` utility remaps them, so the same component works on the deep-navy sections without extra props.

## Project structure

```
src/
  app/
    globals.css          Design tokens (@theme), base styles, state variants
    layout.tsx           Font, metadata, skip link, providers
    page.tsx             Landing page: sections in narrative order
    system/              /system: tokens and component states
    fonts/               Instrument Sans variable font (OFL)
    icon.svg             Favicon (the Straiton mark)
  content/
    site.ts              All landing-page copy and illustrative data
    forms.ts             Form labels, hints and validation messages
  components/
    ui/                  Design-system primitives
                         Button, Badge, Card, Container, SectionHeader,
                         Field / Input / Select / Textarea, SegmentedControl,
                         FileInput, ErrorSummary, Accordion, Tabs, Dialog,
                         Toast, Logo, ChannelMotif
    forms/               AssessmentForm (two steps), BankQuoteForm
    product/             Illustrative UI: QuotePreview, WorkspacePreview
    sections/            Hero, Problem, Quote, Corridor, Readiness,
                         HowItWorks, Support, Faq, FinalCta
    layout/              Header, MobileMenu, Footer, MobileCtaBar
    actions.tsx          CTA buttons and demo-only controls
    UiProvider.tsx       Dialog, menu and toast state
    RevealObserver.tsx   Scroll reveal (off under reduced motion)
  lib/
    a11y.ts              Focus trap, scroll lock, scroll-and-focus helper
    validation.ts        Field validators and formatting
scripts/                 Contrast check, axe audit, interaction tests, screenshots
docs/                    The brief (kept out of git)
```

## Editing copy

All visible text lives in `src/content/site.ts` and `src/content/forms.ts`. Sections read from these files, so copy changes never touch layout code.

## Demo-only behaviour

- The assessment form and the bank-quote form validate, show a loading state and end in a "Demo only. No data was sent." confirmation. Nothing leaves the browser.
- The bank-quote file is read for its name, size and type only. It is never uploaded.
- Sign in, guides, WhatsApp, phone, email and legal links show a "Demo" tag and a toast instead of navigating.
- Contact details (`+971 00 000 0000`, `india@straiton.example`) are placeholders.
- The quote and payment workspace are static, illustrative UI. They show no real rates or fees.

## Licences

Instrument Sans is licensed under the SIL Open Font License; see `src/app/fonts/OFL-LICENSE.txt`. Icons are from Phosphor (MIT).
