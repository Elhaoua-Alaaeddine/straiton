import { Check } from "@phosphor-icons/react/ssr";
import { ctas, quote } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { QuotePreview } from "@/components/product/QuotePreview";
import { BankQuoteButton } from "@/components/actions";

/** What a quote contains, shown as an illustrative quote, plus the bank-quote CTA. */
export function Quote() {
  return (
    <section id={quote.id} aria-labelledby="quote-title" className="bg-surface-tint py-section">
      <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5" data-reveal>
          <SectionHeader id="quote-title" title={quote.title} lead={quote.lead} />
          <ul className="mt-8 flex flex-col gap-3">
            {quote.points.map((point) => (
              <li key={point} className="flex items-center gap-3 text-body font-medium text-fg">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-pill bg-surface text-accent shadow-soft">
                  <Check size={14} weight="bold" aria-hidden="true" />
                </span>
                {point}
              </li>
            ))}
          </ul>
          <div className="mt-10 rounded-card border border-line bg-surface p-5 sm:p-6">
            <p id="quote-bank-question" className="font-semibold text-fg">
              {ctas.bankQuote.question}
            </p>
            <p className="mt-1 text-small text-fg-muted">{quote.bankQuoteBody}</p>
            <BankQuoteButton short describedBy="quote-bank-question" className="mt-4 w-full sm:w-auto" />
          </div>
        </div>
        <div className="lg:col-span-7" data-reveal>
          <QuotePreview className="mx-auto w-full max-w-xl lg:mr-0" />
        </div>
      </Container>
    </section>
  );
}
