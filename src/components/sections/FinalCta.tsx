import { ctas, finalCta } from "@/content/site";
import { ChannelMotif } from "@/components/ui/ChannelMotif";
import { Container } from "@/components/ui/Container";
import { AssessmentButton, BankQuoteButton } from "@/components/actions";

/** Second navy section: all three CTAs, once more, then straight into the footer. */
export function FinalCta() {
  return (
    <section
      id={finalCta.id}
      aria-labelledby="start-title"
      className="surface-navy navy-glow relative isolate overflow-hidden py-section"
    >
      <ChannelMotif className="absolute top-1/2 -right-72 -z-10 hidden w-[48rem] -translate-y-1/2 text-strait-300 opacity-50 lg:block" />
      <Container>
        <div className="max-w-3xl" data-reveal>
          <h2 id="start-title" className="heading-display text-fg">
            {finalCta.title}
          </h2>
          <p className="mt-6 max-w-copy text-lead text-fg-muted">{finalCta.lead}</p>
        </div>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center" data-reveal>
          <AssessmentButton size="lg" className="w-full sm:w-auto" />
          <BankQuoteButton size="lg" className="w-full sm:w-auto" />
          <a
            href={ctas.manager.href}
            className="flex min-h-12 items-center justify-center px-1 font-semibold text-accent underline decoration-transparent decoration-2 underline-offset-4 transition-colors hover:decoration-current sm:justify-start"
          >
            {ctas.manager.label}
          </a>
        </div>
      </Container>
    </section>
  );
}
