# Straiton landing page: submission notes

- **Preview:** https://straiton-seven.vercel.app
- **Source:** _add repository link_
- **Time spent:** _add approximate hours_

A responsive landing page for UAE businesses paying suppliers in India, built in Next.js (App Router), TypeScript and Tailwind v4. Its single job is to turn interest into a **payment assessment request**. Everything is self-contained: forms end in a labelled demo confirmation and nothing is sent anywhere. The `/system` route shows the tokens and every component state.

## Design decisions

- **Identity from the name.** A strait is a narrow channel joining two seas, which is what the product does between the UAE and India. The mark is an S-shaped channel running between two shores. The wordmark is set in Instrument Sans with the dot of the "i" in the accent teal. Both are drawn as SVG paths, and the channel shape returns as a faint motif and as the line in the quote panel.
- **One accent, used with intent.** The palette is deep navy with a single teal. Amber and red appear only for status and errors. Navy fills two full sections: readiness, where Straiton does work on the customer's behalf, and the closing CTA. Everywhere else the page stays light and calm.
- **Type that feels precise, not loud.** Instrument Sans is one variable font. Headlines use its width axis (88 to 96) for a composed, slightly condensed voice, and body text runs at full width. Money uses tabular figures.
- **"Dashed means not real."** Every Demo and Illustrative marker uses a dashed outline, from badges to the quote footnote and the demo note in the bank-quote dialog. The reader learns the rule once and can trust everything else on the page.
- **No stock photography.** Photos of people would imply customers or testimonials the brief rules out. The imagery is the product itself, as static, labelled HTML/CSS UI: a quote breakdown and a payment workspace that changes with each stage.
- **Restrained motion.** Sections fade and rise once on entry, the accordion eases open, and the dialog settles in. It is CSS only, with no animation library, and everything turns off under `prefers-reduced-motion`.
- **A real system, not a page of one-offs.** Tokens are defined once in the Tailwind v4 `@theme` block. Tailwind's defaults are reset so only Straiton tokens exist. Semantic tokens (`fg`, `surface`, `action`...) remap inside dark sections, so components need no "dark" props. Copy lives in two content files.

## Messaging and tone

The voice is a payments specialist who reduces uncertainty: plain sentences, no hype verbs, conditional wording wherever the facts are conditional.

- **Lead with the customer's problem.** The headline "Pay suppliers in India without the usual surprises." names the pain, and a three-row section spells out the surprises: an unreadable bank quote, late document requests, and silence after sending. Each row pairs the pain with what Straiton does instead.
- **One promise, three proofs, one qualifier.** The promise: fewer surprises. The proofs: a quote before funding, a checklist for this payment, and one India payments manager throughout. The qualifier: pilot preparation, eligibility subject to compliance review, and timing never guaranteed.
- **Honesty as a feature.** Unconfirmed details (payout method, cut-offs, limits) get their own "Still being confirmed" list with amber badges. The same-day FAQ opens by default and answers "No." first. The readiness section states that preparation does not guarantee approval or timing. For this audience, candour is the trust signal.
- **One label per intent.** The primary CTA is "Request an assessment" everywhere. The secondary is "Already have a bank quote? Send it to us" at every width; on phones it breaks after the question mark. Where the question already sits on screen, the button just says "Send it to us" and points to that question for screen readers. The third is "Talk to the India payments manager".
- **Stablecoins appear once,** in the FAQ answer about crypto, because the audience cares about the payment, not the rails.

## Section by section

| Section | Job | Why it sits here |
| --- | --- | --- |
| Hero and form | State the promise and let visitors start at once | The form is step one of the conversion, so it lives above the fold. It asks only about the payment first (amount, AED or USD, type) to keep the first commitment small |
| Pilot criteria | Say who the pilot is for | Setting expectations before anyone fills in the form saves both sides time |
| The problem | Name three pains, pair each with the answer | Recognition first; it earns the right to explain the product |
| The quote | Show what a quote contains, before funding | Answers the first pain directly, and hosts the bank-quote CTA where it is most relevant |
| Corridor facts | Confirmed facts lead; unconfirmed ones are listed and flagged | A finance team scans for specifics; honesty about gaps builds more trust than hiding them |
| Readiness (navy) | What is checked upfront and what that helps avoid | Answers the second pain; the dark treatment marks it as Straiton's work |
| How it works | Share, Assess, Complete, Track, with the workspace changing per stage | Answers the third pain and makes the process tangible without inventing features |
| Support | The India payments manager, by role | The human answer to "who do I call?", placed after the process it supports |
| FAQ | Honest answers to the objections left | Catches remaining doubts just before the close |
| Final CTA (navy) and footer | All three CTAs once more; regulatory placeholder | A clear last prompt, then the neutral legal placeholder the brief asked for |

## Assumptions

- The product facts in the brief are the full set. No rates, fees, limits, cut-offs, licences, customers or statistics are shown or implied.
- "Same-day where supported" is presented as possible, never promised.
- The India payments manager is described by role only. No name or photo is invented.
- The example amount (AED 250,000.00) and the workspace states are illustrative and labelled as such.
- The page is not meant to be indexed, so it is marked `noindex`.
- The footer lists UAE to India as "Pilot preparation" and EU corridors as "Later". The prototype's Philippines and China corridors are left out, because the brief does not support them.

## Demo-only features

- **Assessment form:** two steps, required fields marked on their labels, inline validation, an error summary that takes focus, a loading state, then a "Demo only. No data was sent." confirmation with next steps and a reset.
- **Bank-quote dialog:** file picker with type and size checks. The file never leaves the device. It uses the same validation and confirmation pattern.
- **Demo-only controls:** WhatsApp, phone, email, sign in, guides, privacy and terms are marked Demo and show a toast. Where a group heading carries the visible tag, each control still says "Demo" to screen readers. No link leaves the page.
- **Phone sticky CTA:** appears once the hero form scrolls out of view, and hides when the form, the dialog or the menu is on screen.

## Not included, and what I would do next

- **Arabic and right-to-left.** This is the most important gap for a UAE audience, and the next thing I would build.
- **Dark mode.** Out of scope by agreement; the semantic tokens make it a contained change.
- **Real integrations.** Form submission, file upload, analytics events and consent handling are not wired up.
- **Supporting pages.** Guides, sign in and legal pages do not exist; they are marked Demo.
- **Social sharing image.** No Open Graph image yet.
- **Copy review.** The copy would need a compliance review before any public use.

## Quality checks

| Check | Result |
| --- | --- |
| Colour contrast (`npm run check:contrast`) | 63 of 63 pairings meet WCAG AA, light and navy surfaces |
| axe-core, WCAG 2.2 AA (`npm run test:a11y`) | 0 violations across 7 states: page, form errors, dialog and mobile menu at 1440 and 390px |
| Interaction tests (`npm run test:states`) | 132 of 132 checks pass at 1440, 390 and 320px: every form state, dialog, menu focus trap and Esc, keyboard tabs and accordion, sticky CTA, no dead links, single-label CTAs and Demo-marked controls |
| Horizontal overflow | None at 320, 390, 768, 1024 or 1440px |
| Lighthouse, mobile preset | Accessibility 100, Performance 92, Best Practices 100 |
| Lighthouse, desktop preset | Accessibility 100, Performance 100, Best Practices 100 |
| Lighthouse SEO | 60, solely because the page is deliberately `noindex` |
| Lint, typecheck, build | ESLint clean, TypeScript clean, production build passes with every route static |
